import { AppError } from '../../../shared/errors/AppError.js';
import type { Payment } from '../domain/Payment.js';
import type { IPaymentRepository } from '../domain/IPaymentRepository.js';

export class PaymentService {
  constructor(private readonly repo: IPaymentRepository) {}

  async list(organizationId: string): Promise<Payment[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<Payment> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('Payment', id);
    return item;
  }

  async create(organizationId: string, data: Partial<Payment>): Promise<Payment> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<Payment>): Promise<Payment> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
