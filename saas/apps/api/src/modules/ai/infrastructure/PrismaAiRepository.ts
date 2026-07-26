import type { AiJob } from '../domain/AiJob.js';
import type { IAiRepository } from '../domain/IAiRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for AiJob.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaAiRepository implements IAiRepository {
  async findById(_organizationId: string, _id: string): Promise<AiJob | null> {
    throw AppError.notImplemented('AiRepository.findById');
  }

  async list(organizationId: string): Promise<AiJob[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-ai-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<AiJob>): Promise<AiJob> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as AiJob;
  }

  async update(_organizationId: string, id: string, data: Partial<AiJob>): Promise<AiJob> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as AiJob;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
