import type { OrgSettings } from '../domain/OrgSettings.js';
import type { ISettingsRepository } from '../domain/ISettingsRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for OrgSettings.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaSettingsRepository implements ISettingsRepository {
  async findById(_organizationId: string, _id: string): Promise<OrgSettings | null> {
    throw AppError.notImplemented('SettingsRepository.findById');
  }

  async list(organizationId: string): Promise<OrgSettings[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-settings-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<OrgSettings>): Promise<OrgSettings> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as OrgSettings;
  }

  async update(_organizationId: string, id: string, data: Partial<OrgSettings>): Promise<OrgSettings> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as OrgSettings;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
