import Stripe from 'stripe';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const TRIAL_DAYS = 30;

const schema = z.object({
  plan: z.enum(['standard', 'premium', 'pms']),
  conciergerieName: z.string().min(2).max(80),
  contactName: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().max(40).optional().or(z.literal('')),
  website: z.string().url().max(200).optional().or(z.literal('')),
  cities: z.string().min(2).max(200),
  address: z.string().max(200).optional().or(z.literal('')),
  description: z.string().min(30).max(450),
  logoUrl: z.string().url().max(250).optional().or(z.literal('')),
  siret: z.string().max(40).optional().or(z.literal('')),
  notes: z.string().max(450).optional().or(z.literal('')),
});

type ReqBody = z.infer<typeof schema>;

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

function resolvePriceId(plan: 'standard' | 'premium' | 'pms'): string {
  if (plan === 'premium') {
    return requireEnvAny(['STRIPE_PREMIUM_PRICE', 'STRIPE_PRICE_PREMIUM']);
  }
  if (plan === 'pms') {
    return requireEnvAny(['STRIPE_PMS_PRICE', 'STRIPE_PRICE_PMS']);
  }
  return requireEnvAny(['STRIPE_STANDARD_PRICE', 'STRIPE_PRICE_STANDARD']);
}

const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'));

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

    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as unknown;
    const values: FormBody = schema.parse(body);

    const baseUrl = requireEnv('PUBLIC_BASE_URL').replace(/\/+$/, '');
    const price = resolvePriceId(values.plan);
    const includesPms = values.plan === 'premium' || values.plan === 'pms';
    const includesDirectory = values.plan === 'standard' || values.plan === 'premium';

    const supabaseUrl = requireEnvAny(['SUPABASE_URL', 'VITE_SUPABASE_URL']);
    const supabaseAnonKey = requireEnvAny(['SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY']);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = userData.user.id;

    const successPath =
      values.plan === 'pms'
        ? `/pms?trial=1&session_id={CHECKOUT_SESSION_ID}`
        : `/devenir-partenaire?success=1&session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      customer_email: values.email,
      allow_promotion_codes: true,
      client_reference_id: userId,
      success_url: `${baseUrl}${successPath}`,
      cancel_url: `${baseUrl}/devenir-partenaire?canceled=1`,
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        metadata: {
          userId,
          plan: values.plan,
          includes_pms: includesPms ? '1' : '0',
          includes_directory: includesDirectory ? '1' : '0',
        },
      },
      metadata: {
        userId,
        plan: values.plan,
        includes_pms: includesPms ? '1' : '0',
        includes_directory: includesDirectory ? '1' : '0',
        conciergerieName: values.conciergerieName,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone ?? '',
        website: values.website ?? '',
        cities: values.cities,
        address: values.address ?? '',
        description: values.description,
        logoUrl: values.logoUrl ?? '',
        siret: values.siret ?? '',
        notes: values.notes ?? '',
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    const message = err?.message ?? 'Unknown error';
    const status = err?.name === 'ZodError' ? 400 : 500;
    res.status(status).json({ error: message });
  }
}
