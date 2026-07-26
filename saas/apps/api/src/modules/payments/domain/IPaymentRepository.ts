import type { Payment } from './Payment.js';

export interface IPaymentRepository {
  findById(organizationId: string, id: string): Promise<Payment | null>;
  list(organizationId: string): Promise<Payment[]>;
  create(organizationId: string, data: Partial<Payment>): Promise<Payment>;
  update(organizationId: string, id: string, data: Partial<Payment>): Promise<Payment>;
  delete(organizationId: string, id: string): Promise<void>;
}
