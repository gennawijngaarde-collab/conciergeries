import type { Invoice } from './Invoice.js';

export interface IInvoiceRepository {
  findById(organizationId: string, id: string): Promise<Invoice | null>;
  list(organizationId: string): Promise<Invoice[]>;
  create(organizationId: string, data: Partial<Invoice>): Promise<Invoice>;
  update(organizationId: string, id: string, data: Partial<Invoice>): Promise<Invoice>;
  delete(organizationId: string, id: string): Promise<void>;
}
