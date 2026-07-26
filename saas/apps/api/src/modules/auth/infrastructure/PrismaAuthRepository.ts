import type { AuthSession } from '../domain/AuthSession.js';
import type { IAuthRepository } from '../domain/IAuthRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for AuthSession.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaAuthRepository implements IAuthRepository {
  async findById(_organizationId: string, _id: string): Promise<AuthSession | null> {
    throw AppError.notImplemented('AuthRepository.findById');
  }

  async list(organizationId: string): Promise<AuthSession[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-auth-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<AuthSession>): Promise<AuthSession> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as AuthSession;
  }

  async update(_organizationId: string, id: string, data: Partial<AuthSession>): Promise<AuthSession> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as AuthSession;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
