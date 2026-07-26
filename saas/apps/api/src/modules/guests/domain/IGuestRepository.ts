import type { Guest } from './Guest.js';

export interface IGuestRepository {
  findById(organizationId: string, id: string): Promise<Guest | null>;
  list(organizationId: string): Promise<Guest[]>;
  create(organizationId: string, data: Partial<Guest>): Promise<Guest>;
  update(organizationId: string, id: string, data: Partial<Guest>): Promise<Guest>;
  delete(organizationId: string, id: string): Promise<void>;
}
