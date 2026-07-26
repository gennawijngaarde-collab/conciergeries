import type { CheckoutSession } from '../domain/CheckoutSession.js';
import type { ICheckoutRepository } from '../domain/ICheckoutRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for CheckoutSession.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaCheckoutRepository implements ICheckoutRepository {
  async findById(_organizationId: string, _id: string): Promise<CheckoutSession | null> {
    throw AppError.notImplemented('CheckoutRepository.findById');
  }

  async list(organizationId: string): Promise<CheckoutSession[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-checkout-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<CheckoutSession>): Promise<CheckoutSession> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as CheckoutSession;
  }

  async update(_organizationId: string, id: string, data: Partial<CheckoutSession>): Promise<CheckoutSession> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as CheckoutSession;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
