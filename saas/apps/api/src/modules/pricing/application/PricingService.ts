import type { PricingRule } from '../domain/PricingRule.js';
import type { IPricingRepository } from '../domain/IPricingRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import {
  PricingEngine,
  type PricingContext,
  type SeasonRate,
  type EventRate,
  type DiscountRule,
  type PromotionRule,
  type PriceBounds,
  type StayConstraints,
  type PricingResult,
} from './PricingEngine.js';

export class PricingService {
  private readonly engine = new PricingEngine();

  constructor(private readonly repo: IPricingRepository) {}

  async list(organizationId: string): Promise<PricingRule[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<PricingRule> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('PricingRule', id);
    return item;
  }

  async create(organizationId: string, data: Partial<PricingRule>): Promise<PricingRule> {
    return this.repo.create(organizationId, data);
  }

  async update(
    organizationId: string,
    id: string,
    data: Partial<PricingRule>,
  ): Promise<PricingRule> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }

  quote(
    ctx: PricingContext,
    options?: {
      weekendMultiplier?: number;
      seasons?: SeasonRate[];
      events?: EventRate[];
      bounds?: PriceBounds;
      stay?: StayConstraints;
      discount?: DiscountRule;
      promotions?: PromotionRule[];
    },
  ): PricingResult {
    return this.engine.quote(ctx, options);
  }
}
