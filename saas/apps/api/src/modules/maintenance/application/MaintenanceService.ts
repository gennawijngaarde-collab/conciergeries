import { AppError } from '../../../shared/errors/AppError.js';
import type { MaintenanceTicket } from '../domain/MaintenanceTicket.js';
import type { IMaintenanceRepository } from '../domain/IMaintenanceRepository.js';

export class MaintenanceService {
  constructor(private readonly repo: IMaintenanceRepository) {}

  async list(organizationId: string): Promise<MaintenanceTicket[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<MaintenanceTicket> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('MaintenanceTicket', id);
    return item;
  }

  async create(organizationId: string, data: Partial<MaintenanceTicket>): Promise<MaintenanceTicket> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<MaintenanceTicket>): Promise<MaintenanceTicket> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
