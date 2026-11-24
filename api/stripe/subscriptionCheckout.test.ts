import assert from 'node:assert/strict';
import { automaticTrialCheckout, subscriptionIdFromInvoice, TRIAL_DAYS } from './subscriptionCheckout';

const checkout = automaticTrialCheckout();

assert.equal(checkout.payment_method_collection, 'always');
assert.equal(checkout.subscription_data.trial_period_days, TRIAL_DAYS);
assert.equal(checkout.subscription_data.trial_settings.end_behavior.missing_payment_method, 'cancel');

assert.throws(() => automaticTrialCheckout(0), /positive integer/);

assert.equal(subscriptionIdFromInvoice({ subscription: 'sub_legacy' }), 'sub_legacy');
assert.equal(subscriptionIdFromInvoice({ subscription: { id: 'sub_obj' } }), 'sub_obj');
assert.equal(
  subscriptionIdFromInvoice({
    parent: { subscription_details: { subscription: 'sub_parent' } },
  }),
  'sub_parent',
);
assert.equal(subscriptionIdFromInvoice({}), null);

console.log('subscriptionCheckout tests passed');
