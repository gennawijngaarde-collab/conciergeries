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

    // Verify user from token
    const supabaseUrl = requireEnvAny(['SUPABASE_URL', 'VITE_SUPABASE_URL']);
    const supabaseAnonKey = requireEnvAny(['SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY']);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = userData.user.id;

    const { data: sub, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (subError) throw subError;

    const stripeSubscriptionId = (sub as any)?.stripe_subscription_id as string | null | undefined;
    let stripeCustomerId = (sub as any)?.stripe_customer_id as string | null | undefined;

    if (!stripeCustomerId && stripeSubscriptionId) {
      const s = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      stripeCustomerId = (typeof s.customer === 'string' ? s.customer : (s.customer as any)?.id) ?? null;
    }

    if (!stripeCustomerId) {
      res.status(400).json({ error: 'Stripe customer not found for this account' });
      return;
    }

    const baseUrl = requireEnv('PUBLIC_BASE_URL').replace(/\\/+$/, '');

    const portal = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/espace-partenaire`,
    });

    res.status(200).json({ url: portal.url });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Portal session failed' });
  }
}

