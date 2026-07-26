import type { Invoice } from '../domain/Invoice.js';
import type { IInvoiceRepository } from '../domain/IInvoiceRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for Invoice.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaInvoiceRepository implements IInvoiceRepository {
  async findById(_organizationId: string, _id: string): Promise<Invoice | null> {
    throw AppError.notImplemented('InvoiceRepository.findById');
  }

  async list(organizationId: string): Promise<Invoice[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-invoices-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<Invoice>): Promise<Invoice> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Invoice;
  }

  async update(_organizationId: string, id: string, data: Partial<Invoice>): Promise<Invoice> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Invoice;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
