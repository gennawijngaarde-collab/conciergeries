import { AppError } from '../../../shared/errors/AppError.js';
import type { Invoice } from '../domain/Invoice.js';
import type { IInvoiceRepository } from '../domain/IInvoiceRepository.js';

export class InvoiceService {
  constructor(private readonly repo: IInvoiceRepository) {}

  async list(organizationId: string): Promise<Invoice[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<Invoice> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('Invoice', id);
    return item;
  }

  async create(organizationId: string, data: Partial<Invoice>): Promise<Invoice> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<Invoice>): Promise<Invoice> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
