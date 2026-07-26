import type { Payment } from '../domain/Payment.js';
import type { IPaymentRepository } from '../domain/IPaymentRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for Payment.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaPaymentRepository implements IPaymentRepository {
  async findById(_organizationId: string, _id: string): Promise<Payment | null> {
    throw AppError.notImplemented('PaymentRepository.findById');
  }

  async list(organizationId: string): Promise<Payment[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-payments-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<Payment>): Promise<Payment> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Payment;
  }

  async update(_organizationId: string, id: string, data: Partial<Payment>): Promise<Payment> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Payment;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
