import Stripe from 'stripe';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function requireEnvAny(names: string[]): string {
  for (const name of names) {
    const v = process.env[name];
    if (v) return v;
  }
  throw new Error(`Missing env var: ${names[0]}`);
}

const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'));

const resend = new Resend(requireEnv('RESEND_API_KEY'));

const supabaseAdmin = createClient(
  requireEnvAny(['SUPABASE_URL', 'VITE_SUPABASE_URL']),
  requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  }
);

function slugify(input: string) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function readRawBody(req: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    res.status(400).send('Missing Stripe-Signature');
    return;
  }

  const endpointSecret = requireEnv('STRIPE_WEBHOOK_SECRET');

  let event: Stripe.Event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err?.message ?? 'Invalid signature'}`);
    return;
  }

  try {
    const adminEmail = requireEnv('ADMIN_NOTIFY_EMAIL');

    const upsertSubscription = async (args: {
      userId: string;
      plan?: string | null;
      status: string;
      stripeCustomerId?: string | null;
      stripeSubscriptionId?: string | null;
      currentPeriodEnd?: number | null;
    }) => {
      const row = {
        user_id: args.userId,
        plan: (args.plan ?? 'standard').toLowerCase(),
        status: args.status,
        stripe_customer_id: args.stripeCustomerId ?? null,
        stripe_subscription_id: args.stripeSubscriptionId ?? null,
        current_period_end: args.currentPeriodEnd ? new Date(args.currentPeriodEnd * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert(row, { onConflict: 'stripe_subscription_id' });
      if (error) throw error;
    };

    const upsertPartnerProfile = async (args: {
      userId: string;
      plan?: string | null;
      status: string;
      stripeCustomerId?: string | null;
      stripeSubscriptionId?: string | null;
      fields?: Record<string, string | undefined | null>;
    }) => {
      const name = args.fields?.conciergerieName ?? args.fields?.name ?? undefined;
      const cities = args.fields?.cities ?? args.fields?.city ?? undefined;
      const description = args.fields?.description ?? undefined;

      const row: any = {
        user_id: args.userId,
        plan: (args.plan ?? 'standard').toLowerCase(),
        subscription_status: args.status,
        stripe_customer_id: args.stripeCustomerId ?? null,
        stripe_subscription_id: args.stripeSubscriptionId ?? null,
        updated_at: new Date().toISOString(),
      };

      if (name) row.name = name;
      if (cities) row.city = cities;
      if (description) row.description = description;

      if (args.fields?.website) row.website = args.fields.website;
      if (args.fields?.phone) row.phone = args.fields.phone;
      if (args.fields?.email) row.email = args.fields.email;
      if (args.fields?.address) row.address = args.fields.address;
      if (args.fields?.logoUrl) row.logo_url = args.fields.logoUrl;

      // ensure slug exists
      const baseSlug = slugify(name ?? 'conciergerie');
      row.slug = baseSlug || `conciergerie-${args.userId.slice(0, 8)}`;

      const { error } = await supabaseAdmin.from('partner_profiles').upsert(row, { onConflict: 'user_id' });
      if (error) throw error;
    };

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

      const metadata = session.metadata ?? {};
      const plan = metadata.plan ?? 'standard';
      const userId = metadata.userId ?? session.client_reference_id;

      if (subscriptionId && userId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const listingStatus = (sub as any)?.cancel_at_period_end ? 'canceled' : sub.status;
        const currentPeriodEnd = (sub as any)?.current_period_end ?? null;
        await upsertSubscription({
          userId,
          plan: (sub.metadata?.plan as string | undefined) ?? plan,
          status: listingStatus,
          stripeCustomerId: customerId ?? (typeof sub.customer === 'string' ? sub.customer : sub.customer?.id ?? null),
          stripeSubscriptionId: sub.id,
          currentPeriodEnd,
        });

        await upsertPartnerProfile({
          userId,
          plan: (sub.metadata?.plan as string | undefined) ?? plan,
          status: listingStatus,
          stripeCustomerId: customerId ?? (typeof sub.customer === 'string' ? sub.customer : sub.customer?.id ?? null),
          stripeSubscriptionId: sub.id,
          fields: metadata as any,
        });
      }

      await resend.emails.send({
        from: 'Conciergeries France <onboarding@resend.dev>',
        to: adminEmail,
        subject: `Nouvelle inscription (${plan.toUpperCase()}) — ${metadata.conciergerieName ?? 'Conciergerie'}`,
        html: `
          <h2>Nouvelle inscription conciergerie</h2>
          <p><strong>Plan</strong>: ${escapeHtml(plan)}</p>
          <p><strong>Nom</strong>: ${escapeHtml(metadata.conciergerieName ?? '')}</p>
          <p><strong>Contact</strong>: ${escapeHtml(metadata.contactName ?? '')}</p>
          <p><strong>Email</strong>: ${escapeHtml(metadata.email ?? session.customer_email ?? '')}</p>
          <p><strong>Téléphone</strong>: ${escapeHtml(metadata.phone ?? '')}</p>
          <p><strong>Site</strong>: ${escapeHtml(metadata.website ?? '')}</p>
          <p><strong>Logo (URL)</strong>: ${escapeHtml(metadata.logoUrl ?? '')}</p>
          <p><strong>Villes</strong>: ${escapeHtml(metadata.cities ?? '')}</p>
          <p><strong>Adresse</strong>: ${escapeHtml(metadata.address ?? '')}</p>
          <p><strong>SIRET</strong>: ${escapeHtml(metadata.siret ?? '')}</p>
          <p><strong>Description</strong>:</p>
          <pre style="white-space:pre-wrap">${escapeHtml(metadata.description ?? '')}</pre>
          <p><strong>Notes</strong>:</p>
          <pre style="white-space:pre-wrap">${escapeHtml(metadata.notes ?? '')}</pre>
          <hr/>
          <p><strong>Stripe sessionId</strong>: ${escapeHtml(session.id)}</p>
          <p><strong>subscriptionId</strong>: ${escapeHtml(subscriptionId ?? '')}</p>
          <p><strong>customerId</strong>: ${escapeHtml(customerId ?? '')}</p>
        `,
      });
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      const userId = (sub.metadata?.userId as string | undefined) ?? null;
      const plan = (sub.metadata?.plan as string | undefined) ?? null;
      if (userId) {
        const listingStatus = (sub as any)?.cancel_at_period_end ? 'canceled' : sub.status;
        const currentPeriodEnd = (sub as any)?.current_period_end ?? null;
        await upsertSubscription({
          userId,
          plan,
          status: listingStatus,
          stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer?.id ?? null,
          stripeSubscriptionId: sub.id,
          currentPeriodEnd,
        });

        await upsertPartnerProfile({
          userId,
          plan,
          status: listingStatus,
          stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer?.id ?? null,
          stripeSubscriptionId: sub.id,
        });
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      await resend.emails.send({
        from: 'Conciergeries France <onboarding@resend.dev>',
        to: adminEmail,
        subject: `Abonnement annulé — ${sub.id}`,
        html: `
          <h2>Abonnement annulé</h2>
          <p><strong>subscriptionId</strong>: ${escapeHtml(sub.id)}</p>
          <p><strong>customerId</strong>: ${escapeHtml(String(sub.customer ?? ''))}</p>
          <p><strong>status</strong>: ${escapeHtml(sub.status)}</p>
        `,
      });
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    res.status(500).send(err?.message ?? 'Webhook handler failed');
  }
}

function escapeHtml(v: string) {
  return String(v)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

