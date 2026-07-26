import { AppError } from '../../../shared/errors/AppError.js';
import type { CleaningTask } from '../domain/CleaningTask.js';
import type { ICleaningRepository } from '../domain/ICleaningRepository.js';

export class CleaningService {
  constructor(private readonly repo: ICleaningRepository) {}

  async list(organizationId: string): Promise<CleaningTask[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<CleaningTask> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('CleaningTask', id);
    return item;
  }

  async create(organizationId: string, data: Partial<CleaningTask>): Promise<CleaningTask> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<CleaningTask>): Promise<CleaningTask> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
