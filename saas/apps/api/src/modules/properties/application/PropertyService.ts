import { AppError } from '../../../shared/errors/AppError.js';
import type { Property } from '../domain/Property.js';
import type { IPropertyRepository } from '../domain/IPropertyRepository.js';

export class PropertyService {
  constructor(private readonly repo: IPropertyRepository) {}

  async list(organizationId: string): Promise<Property[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<Property> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('Property', id);
    return item;
  }

  async create(organizationId: string, data: Partial<Property>): Promise<Property> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<Property>): Promise<Property> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
