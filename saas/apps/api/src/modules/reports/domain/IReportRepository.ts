import type { Report } from './Report.js';

export interface IReportRepository {
  findById(organizationId: string, id: string): Promise<Report | null>;
  list(organizationId: string): Promise<Report[]>;
  create(organizationId: string, data: Partial<Report>): Promise<Report>;
  update(organizationId: string, id: string, data: Partial<Report>): Promise<Report>;
  delete(organizationId: string, id: string): Promise<void>;
}
