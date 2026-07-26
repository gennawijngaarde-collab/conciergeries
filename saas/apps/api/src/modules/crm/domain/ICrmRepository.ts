import type { CrmLead } from './CrmLead.js';

export interface ICrmRepository {
  findById(organizationId: string, id: string): Promise<CrmLead | null>;
  list(organizationId: string): Promise<CrmLead[]>;
  create(organizationId: string, data: Partial<CrmLead>): Promise<CrmLead>;
  update(organizationId: string, id: string, data: Partial<CrmLead>): Promise<CrmLead>;
  delete(organizationId: string, id: string): Promise<void>;
}
