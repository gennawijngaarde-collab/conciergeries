import { AppError } from '../../../shared/errors/AppError.js';
import type { OrgSettings } from '../domain/OrgSettings.js';
import type { ISettingsRepository } from '../domain/ISettingsRepository.js';

export class SettingsService {
  constructor(private readonly repo: ISettingsRepository) {}

  async list(organizationId: string): Promise<OrgSettings[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<OrgSettings> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('OrgSettings', id);
    return item;
  }

  async create(organizationId: string, data: Partial<OrgSettings>): Promise<OrgSettings> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<OrgSettings>): Promise<OrgSettings> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
