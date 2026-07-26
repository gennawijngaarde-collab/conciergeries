import type { AutomationRule } from '../domain/AutomationRule.js';
import type { IAutomationRepository } from '../domain/IAutomationRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for AutomationRule.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaAutomationRepository implements IAutomationRepository {
  async findById(_organizationId: string, _id: string): Promise<AutomationRule | null> {
    throw AppError.notImplemented('AutomationRepository.findById');
  }

  async list(organizationId: string): Promise<AutomationRule[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-automations-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<AutomationRule>): Promise<AutomationRule> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as AutomationRule;
  }

  async update(_organizationId: string, id: string, data: Partial<AutomationRule>): Promise<AutomationRule> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as AutomationRule;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
