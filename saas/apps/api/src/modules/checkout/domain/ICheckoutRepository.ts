import type { CheckoutSession } from './CheckoutSession.js';

export interface ICheckoutRepository {
  findById(organizationId: string, id: string): Promise<CheckoutSession | null>;
  list(organizationId: string): Promise<CheckoutSession[]>;
  create(organizationId: string, data: Partial<CheckoutSession>): Promise<CheckoutSession>;
  update(organizationId: string, id: string, data: Partial<CheckoutSession>): Promise<CheckoutSession>;
  delete(organizationId: string, id: string): Promise<void>;
}
