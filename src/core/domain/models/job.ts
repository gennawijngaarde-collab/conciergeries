/**
 * Universal Job Model
 */

export interface Job {
  id: string;
  tenantId: string;
  externalId?: string;
  sourceSystem?: string;
  
  title: string;
  code?: string;
  level?: string;
  category?: string;
  
  rawData?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
}
