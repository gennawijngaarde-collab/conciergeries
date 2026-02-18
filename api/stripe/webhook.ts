import Stripe from 'stripe';
import { Resend } from 'resend';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
  apiVersion: '2025-01-27.acacia',
});

const resend = new Resend(requireEnv('RESEND_API_KEY'));

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

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

      const metadata = session.metadata ?? {};
      const plan = metadata.plan ?? 'standard';

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

