import type { MessageThread } from '../domain/MessageThread.js';
import type { IMessageRepository } from '../domain/IMessageRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for MessageThread.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaMessageRepository implements IMessageRepository {
  async findById(_organizationId: string, _id: string): Promise<MessageThread | null> {
    throw AppError.notImplemented('MessageRepository.findById');
  }

  async list(organizationId: string): Promise<MessageThread[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-messages-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<MessageThread>): Promise<MessageThread> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as MessageThread;
  }

  async update(_organizationId: string, id: string, data: Partial<MessageThread>): Promise<MessageThread> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as MessageThread;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
