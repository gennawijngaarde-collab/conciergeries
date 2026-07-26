import type { PricingRule } from './PricingRule.js';

export interface IPricingRepository {
  findById(organizationId: string, id: string): Promise<PricingRule | null>;
  list(organizationId: string): Promise<PricingRule[]>;
  create(organizationId: string, data: Partial<PricingRule>): Promise<PricingRule>;
  update(organizationId: string, id: string, data: Partial<PricingRule>): Promise<PricingRule>;
  delete(organizationId: string, id: string): Promise<void>;
}
