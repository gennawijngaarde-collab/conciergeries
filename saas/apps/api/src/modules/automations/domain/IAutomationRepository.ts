import type { AutomationRule } from './AutomationRule.js';

export interface IAutomationRepository {
  findById(organizationId: string, id: string): Promise<AutomationRule | null>;
  list(organizationId: string): Promise<AutomationRule[]>;
  create(organizationId: string, data: Partial<AutomationRule>): Promise<AutomationRule>;
  update(organizationId: string, id: string, data: Partial<AutomationRule>): Promise<AutomationRule>;
  delete(organizationId: string, id: string): Promise<void>;
}
