import { AppError } from '../../../shared/errors/AppError.js';
import type { Guest } from '../domain/Guest.js';
import type { IGuestRepository } from '../domain/IGuestRepository.js';

export class GuestService {
  constructor(private readonly repo: IGuestRepository) {}

  async list(organizationId: string): Promise<Guest[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<Guest> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('Guest', id);
    return item;
  }

  async create(organizationId: string, data: Partial<Guest>): Promise<Guest> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<Guest>): Promise<Guest> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
