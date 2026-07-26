import type { Guest } from '../domain/Guest.js';
import type { IGuestRepository } from '../domain/IGuestRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for Guest.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaGuestRepository implements IGuestRepository {
  async findById(_organizationId: string, _id: string): Promise<Guest | null> {
    throw AppError.notImplemented('GuestRepository.findById');
  }

  async list(organizationId: string): Promise<Guest[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-guests-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<Guest>): Promise<Guest> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Guest;
  }

  async update(_organizationId: string, id: string, data: Partial<Guest>): Promise<Guest> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Guest;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
