import type { ChannelConnection } from '../domain/ChannelConnection.js';
import type { IChannelRepository } from '../domain/IChannelRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for ChannelConnection.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaChannelRepository implements IChannelRepository {
  async findById(_organizationId: string, _id: string): Promise<ChannelConnection | null> {
    throw AppError.notImplemented('ChannelRepository.findById');
  }

  async list(organizationId: string): Promise<ChannelConnection[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-channels-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<ChannelConnection>): Promise<ChannelConnection> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as ChannelConnection;
  }

  async update(_organizationId: string, id: string, data: Partial<ChannelConnection>): Promise<ChannelConnection> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as ChannelConnection;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
