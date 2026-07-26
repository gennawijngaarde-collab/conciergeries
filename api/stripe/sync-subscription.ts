import Stripe from 'stripe';
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

const supabaseAdmin = createClient(
  requireEnvAny(['SUPABASE_URL', 'VITE_SUPABASE_URL']),
  requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const authHeader = (req.headers?.authorization ?? req.headers?.Authorization) as string | undefined;
    const token =
      typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')
        ? authHeader.slice(7).trim()
        : null;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as any;
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.trim() : '';
    if (!sessionId) {
      res.status(400).json({ error: 'Missing sessionId' });
      return;
    }

    // Verify Supabase user from token (anon key is enough for auth.getUser)
    const supabaseUrl = requireEnvAny(['SUPABASE_URL', 'VITE_SUPABASE_URL']);
    const supabaseAnonKey = requireEnvAny(['SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY']);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = userData.user.id;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscriptionId =
      typeof session.subscription === 'string' ? session.subscription : (session.subscription as any)?.id;

    if (!subscriptionId) {
      res.status(400).json({ error: 'Checkout session has no subscription' });
      return;
    }

    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    const plan =
      ((sub.metadata as any)?.plan as string | undefined) ??
      ((session.metadata as any)?.plan as string | undefined) ??
      'standard';

    const stripeCustomerId =
      (typeof sub.customer === 'string' ? sub.customer : (sub.customer as any)?.id) ?? null;

    const listingStatus = (sub as any)?.cancel_at_period_end ? 'canceled' : sub.status;
    const currentPeriodEnd = (sub as any)?.current_period_end ?? null;
    const trialEnd = (sub as any)?.trial_end ?? null;
    const planNormalized = String(plan).toLowerCase();
    const includesPms = planNormalized === 'premium' || planNormalized === 'pms';
    const includesDirectory = planNormalized === 'standard' || planNormalized === 'premium';

    const { error: upsertError } = await supabaseAdmin.from('subscriptions').upsert(
      {
        user_id: userId,
        plan: planNormalized,
        status: listingStatus,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: sub.id,
        current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
        includes_pms: includesPms,
        includes_directory: includesDirectory,
        trial_ends_at: trialEnd ? new Date(trialEnd * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'stripe_subscription_id' }
    );
    if (upsertError) throw upsertError;

    // Best-effort: fiche annuaire pour standard/premium uniquement
    if (includesDirectory) {
    const profilePayload: any = {
      user_id: userId,
      plan: planNormalized,
      subscription_status: listingStatus,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: sub.id,
      updated_at: new Date().toISOString(),
    };

    const md = (session.metadata ?? {}) as Record<string, string>;
    if (md.conciergerieName) profilePayload.name = md.conciergerieName;
    if (md.cities) profilePayload.city = md.cities;
    if (md.description) profilePayload.description = md.description;
    if (md.website) profilePayload.website = md.website;
    if (md.phone) profilePayload.phone = md.phone;
    if (md.email) profilePayload.email = md.email;
    if (md.address) profilePayload.address = md.address;
    if (md.logoUrl) profilePayload.logo_url = md.logoUrl;

    if (profilePayload.name && typeof profilePayload.slug !== 'string') {
      profilePayload.slug = String(profilePayload.name)
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
    }

    if (profilePayload.slug) {
      try {
        await supabaseAdmin.from('partner_profiles').upsert(profilePayload, { onConflict: 'user_id' });
      } catch {
        // ignore (table might not exist yet)
      }
    }
    }

    res.status(200).json({
      ok: true,
      status: listingStatus,
      plan: planNormalized,
      includes_pms: includesPms,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Sync failed' });
  }
}

