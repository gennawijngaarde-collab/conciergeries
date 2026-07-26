import type { MaintenanceTicket } from './MaintenanceTicket.js';

export interface IMaintenanceRepository {
  findById(organizationId: string, id: string): Promise<MaintenanceTicket | null>;
  list(organizationId: string): Promise<MaintenanceTicket[]>;
  create(organizationId: string, data: Partial<MaintenanceTicket>): Promise<MaintenanceTicket>;
  update(organizationId: string, id: string, data: Partial<MaintenanceTicket>): Promise<MaintenanceTicket>;
  delete(organizationId: string, id: string): Promise<void>;
}
