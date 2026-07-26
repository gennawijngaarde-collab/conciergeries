import { AppError } from '../../../shared/errors/AppError.js';
import type { CrmLead } from '../domain/CrmLead.js';
import type { ICrmRepository } from '../domain/ICrmRepository.js';

export class CrmService {
  constructor(private readonly repo: ICrmRepository) {}

  async list(organizationId: string): Promise<CrmLead[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<CrmLead> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('CrmLead', id);
    return item;
  }

  async create(organizationId: string, data: Partial<CrmLead>): Promise<CrmLead> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<CrmLead>): Promise<CrmLead> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
