/**
 * Universal Location Model
 */

export interface Location {
  id: string;
  tenantId: string;
  externalId?: string;
  sourceSystem?: string;
  
  name: string;
  code?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  
  rawData?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
}
