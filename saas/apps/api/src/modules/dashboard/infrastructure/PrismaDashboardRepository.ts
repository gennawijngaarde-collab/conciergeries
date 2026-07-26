import type { DashboardSnapshot } from '../domain/DashboardSnapshot.js';
import type { IDashboardRepository } from '../domain/IDashboardRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for DashboardSnapshot.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaDashboardRepository implements IDashboardRepository {
  async findById(_organizationId: string, _id: string): Promise<DashboardSnapshot | null> {
    throw AppError.notImplemented('DashboardRepository.findById');
  }

  async list(organizationId: string): Promise<DashboardSnapshot[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-dashboard-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<DashboardSnapshot>): Promise<DashboardSnapshot> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as DashboardSnapshot;
  }

  async update(_organizationId: string, id: string, data: Partial<DashboardSnapshot>): Promise<DashboardSnapshot> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as DashboardSnapshot;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
