import type { InventoryItem } from '../domain/InventoryItem.js';
import type { IInventoryRepository } from '../domain/IInventoryRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for InventoryItem.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaInventoryRepository implements IInventoryRepository {
  async findById(_organizationId: string, _id: string): Promise<InventoryItem | null> {
    throw AppError.notImplemented('InventoryRepository.findById');
  }

  async list(organizationId: string): Promise<InventoryItem[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-inventory-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as InventoryItem;
  }

  async update(_organizationId: string, id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as InventoryItem;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
