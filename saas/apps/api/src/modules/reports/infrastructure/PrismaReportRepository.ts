import type { Report } from '../domain/Report.js';
import type { IReportRepository } from '../domain/IReportRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for Report.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaReportRepository implements IReportRepository {
  async findById(_organizationId: string, _id: string): Promise<Report | null> {
    throw AppError.notImplemented('ReportRepository.findById');
  }

  async list(organizationId: string): Promise<Report[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-reports-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<Report>): Promise<Report> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Report;
  }

  async update(_organizationId: string, id: string, data: Partial<Report>): Promise<Report> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Report;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
