import { AppError } from '../../../shared/errors/AppError.js';
import type { Report } from '../domain/Report.js';
import type { IReportRepository } from '../domain/IReportRepository.js';

export class ReportService {
  constructor(private readonly repo: IReportRepository) {}

  async list(organizationId: string): Promise<Report[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<Report> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('Report', id);
    return item;
  }

  async create(organizationId: string, data: Partial<Report>): Promise<Report> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<Report>): Promise<Report> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
