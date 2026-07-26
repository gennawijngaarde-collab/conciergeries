import { AppError } from '../../../shared/errors/AppError.js';
import type { InventoryItem } from '../domain/InventoryItem.js';
import type { IInventoryRepository } from '../domain/IInventoryRepository.js';

export class InventoryService {
  constructor(private readonly repo: IInventoryRepository) {}

  async list(organizationId: string): Promise<InventoryItem[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<InventoryItem> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('InventoryItem', id);
    return item;
  }

  async create(organizationId: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
