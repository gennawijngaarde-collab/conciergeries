import type { DashboardSnapshot } from './DashboardSnapshot.js';

export interface IDashboardRepository {
  findById(organizationId: string, id: string): Promise<DashboardSnapshot | null>;
  list(organizationId: string): Promise<DashboardSnapshot[]>;
  create(organizationId: string, data: Partial<DashboardSnapshot>): Promise<DashboardSnapshot>;
  update(organizationId: string, id: string, data: Partial<DashboardSnapshot>): Promise<DashboardSnapshot>;
  delete(organizationId: string, id: string): Promise<void>;
}
