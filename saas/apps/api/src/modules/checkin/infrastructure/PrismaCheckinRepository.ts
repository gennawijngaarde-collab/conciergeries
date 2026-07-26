import type { CheckinSession } from '../domain/CheckinSession.js';
import type { ICheckinRepository } from '../domain/ICheckinRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for CheckinSession.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaCheckinRepository implements ICheckinRepository {
  async findById(_organizationId: string, _id: string): Promise<CheckinSession | null> {
    throw AppError.notImplemented('CheckinRepository.findById');
  }

  async list(organizationId: string): Promise<CheckinSession[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-checkin-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<CheckinSession>): Promise<CheckinSession> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as CheckinSession;
  }

  async update(_organizationId: string, id: string, data: Partial<CheckinSession>): Promise<CheckinSession> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as CheckinSession;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
