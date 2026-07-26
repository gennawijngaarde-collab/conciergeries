import type { InventoryItem } from './InventoryItem.js';

export interface IInventoryRepository {
  findById(organizationId: string, id: string): Promise<InventoryItem | null>;
  list(organizationId: string): Promise<InventoryItem[]>;
  create(organizationId: string, data: Partial<InventoryItem>): Promise<InventoryItem>;
  update(organizationId: string, id: string, data: Partial<InventoryItem>): Promise<InventoryItem>;
  delete(organizationId: string, id: string): Promise<void>;
}
