import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY ?? 'sk_test_stub';
    // apiVersion omitted — Stripe SDK defaults to the account's pinned version
    stripe = new Stripe(key);
  }
  return stripe;
}
