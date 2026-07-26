export interface PricingRule {
  id: string;
  organizationId: string;
  propertyId?: string;
  name?: string;
  baseNightly?: number;
  weekendMultiplier?: number;
  minPrice?: number;
  maxPrice?: number;
  minStay?: number;
  maxStay?: number;
  createdAt: Date;
  updatedAt: Date;
}
