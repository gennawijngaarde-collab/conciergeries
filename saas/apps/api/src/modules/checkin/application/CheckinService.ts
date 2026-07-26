import { AppError } from '../../../shared/errors/AppError.js';
import type { CheckinSession } from '../domain/CheckinSession.js';
import type { ICheckinRepository } from '../domain/ICheckinRepository.js';

export class CheckinService {
  constructor(private readonly repo: ICheckinRepository) {}

  async list(organizationId: string): Promise<CheckinSession[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<CheckinSession> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('CheckinSession', id);
    return item;
  }

  async create(organizationId: string, data: Partial<CheckinSession>): Promise<CheckinSession> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<CheckinSession>): Promise<CheckinSession> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
