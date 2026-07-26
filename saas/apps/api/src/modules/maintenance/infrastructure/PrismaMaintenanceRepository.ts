import type { MaintenanceTicket } from '../domain/MaintenanceTicket.js';
import type { IMaintenanceRepository } from '../domain/IMaintenanceRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for MaintenanceTicket.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaMaintenanceRepository implements IMaintenanceRepository {
  async findById(_organizationId: string, _id: string): Promise<MaintenanceTicket | null> {
    throw AppError.notImplemented('MaintenanceRepository.findById');
  }

  async list(organizationId: string): Promise<MaintenanceTicket[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-maintenance-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<MaintenanceTicket>): Promise<MaintenanceTicket> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as MaintenanceTicket;
  }

  async update(_organizationId: string, id: string, data: Partial<MaintenanceTicket>): Promise<MaintenanceTicket> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as MaintenanceTicket;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
