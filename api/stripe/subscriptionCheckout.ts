/** Checkout settings so a free trial converts to an automatic monthly charge. */

export const TRIAL_DAYS = 30;

export type AutomaticTrialCheckout = {
  payment_method_collection: 'always';
  subscription_data: {
    trial_period_days: number;
    trial_settings: {
      end_behavior: {
        missing_payment_method: 'cancel';
      };
    };
  };
};

/**
 * Collect a card during the free trial and let Stripe charge it when the trial ends.
 * `payment_method_collection: 'always'` saves the card even though nothing is due today.
 * With a saved card, Stripe's default collection method (`charge_automatically`) invoices
 * and debits that card at the end of the trial, then every month.
 * If no card is on file, the subscription is canceled instead of remaining free.
 */
export function automaticTrialCheckout(trialDays: number = TRIAL_DAYS): AutomaticTrialCheckout {
  if (!Number.isInteger(trialDays) || trialDays < 1) {
    throw new Error('trialDays must be a positive integer');
  }
  return {
    payment_method_collection: 'always',
    subscription_data: {
      trial_period_days: trialDays,
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel',
        },
      },
    },
  };
}

type InvoiceSubscriptionRef = string | { id?: string | null } | null | undefined;

/** Stripe Invoice.subscription, including the newer parent.subscription_details shape. */
export function subscriptionIdFromInvoice(invoice: {
  subscription?: InvoiceSubscriptionRef;
  parent?: {
    subscription_details?: {
      subscription?: InvoiceSubscriptionRef;
    } | null;
  } | null;
}): string | null {
  const from = (value: InvoiceSubscriptionRef): string | null => {
    if (typeof value === 'string' && value) return value;
    if (value && typeof value === 'object' && typeof value.id === 'string' && value.id) return value.id;
    return null;
  };
  return from(invoice.subscription) ?? from(invoice.parent?.subscription_details?.subscription) ?? null;
}
