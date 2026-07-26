import type { OrgSettings } from './OrgSettings.js';

export interface ISettingsRepository {
  findById(organizationId: string, id: string): Promise<OrgSettings | null>;
  list(organizationId: string): Promise<OrgSettings[]>;
  create(organizationId: string, data: Partial<OrgSettings>): Promise<OrgSettings>;
  update(organizationId: string, id: string, data: Partial<OrgSettings>): Promise<OrgSettings>;
  delete(organizationId: string, id: string): Promise<void>;
}
