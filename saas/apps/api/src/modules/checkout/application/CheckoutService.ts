import { AppError } from '../../../shared/errors/AppError.js';
import type { CheckoutSession } from '../domain/CheckoutSession.js';
import type { ICheckoutRepository } from '../domain/ICheckoutRepository.js';

export class CheckoutService {
  constructor(private readonly repo: ICheckoutRepository) {}

  async list(organizationId: string): Promise<CheckoutSession[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<CheckoutSession> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('CheckoutSession', id);
    return item;
  }

  async create(organizationId: string, data: Partial<CheckoutSession>): Promise<CheckoutSession> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<CheckoutSession>): Promise<CheckoutSession> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
