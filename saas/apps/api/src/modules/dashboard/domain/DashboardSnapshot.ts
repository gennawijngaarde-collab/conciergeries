export interface DashboardSnapshot {
  id: string;
  organizationId: string;
  label?: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
