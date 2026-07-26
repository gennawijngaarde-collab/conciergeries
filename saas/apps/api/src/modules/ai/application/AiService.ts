import { AppError } from '../../../shared/errors/AppError.js';
import type { AiJob } from '../domain/AiJob.js';
import type { IAiRepository } from '../domain/IAiRepository.js';

export class AiService {
  constructor(private readonly repo: IAiRepository) {}

  async list(organizationId: string): Promise<AiJob[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<AiJob> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('AiJob', id);
    return item;
  }

  async create(organizationId: string, data: Partial<AiJob>): Promise<AiJob> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<AiJob>): Promise<AiJob> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
