import type { CrmLead } from '../domain/CrmLead.js';
import type { ICrmRepository } from '../domain/ICrmRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for CrmLead.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaCrmRepository implements ICrmRepository {
  async findById(_organizationId: string, _id: string): Promise<CrmLead | null> {
    throw AppError.notImplemented('CrmRepository.findById');
  }

  async list(organizationId: string): Promise<CrmLead[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-crm-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<CrmLead>): Promise<CrmLead> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as CrmLead;
  }

  async update(_organizationId: string, id: string, data: Partial<CrmLead>): Promise<CrmLead> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as CrmLead;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
