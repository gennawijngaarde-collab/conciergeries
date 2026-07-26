import type { PricingRule } from '../domain/PricingRule.js';
import type { IPricingRepository } from '../domain/IPricingRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for PricingRule.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaPricingRepository implements IPricingRepository {
  async findById(_organizationId: string, _id: string): Promise<PricingRule | null> {
    throw AppError.notImplemented('PricingRepository.findById');
  }

  async list(organizationId: string): Promise<PricingRule[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-pricing-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<PricingRule>): Promise<PricingRule> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as PricingRule;
  }

  async update(_organizationId: string, id: string, data: Partial<PricingRule>): Promise<PricingRule> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as PricingRule;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
