export interface AutomationRule {
  id: string;
  organizationId: string;
  name?: string;
  enabled?: boolean;
  priority?: number;
  /** JSON IF conditions */
  conditions?: unknown;
  /** JSON THEN actions */
  actions?: unknown;
  createdAt: Date;
  updatedAt: Date;
}
