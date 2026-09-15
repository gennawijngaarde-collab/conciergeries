/**
 * Universal Department Model
 */

export interface Department {
  id: string;
  tenantId: string;
  externalId?: string;
  sourceSystem?: string;
  
  name: string;
  code?: string;
  parentId?: string;
  managerId?: string;
  
  rawData?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
}
