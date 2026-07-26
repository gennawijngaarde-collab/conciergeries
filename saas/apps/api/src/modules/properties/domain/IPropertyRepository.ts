import type { Property } from './Property.js';

export interface IPropertyRepository {
  findById(organizationId: string, id: string): Promise<Property | null>;
  list(organizationId: string): Promise<Property[]>;
  create(organizationId: string, data: Partial<Property>): Promise<Property>;
  update(organizationId: string, id: string, data: Partial<Property>): Promise<Property>;
  delete(organizationId: string, id: string): Promise<void>;
}
