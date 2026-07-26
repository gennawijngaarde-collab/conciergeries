import type { ChannelConnection } from './ChannelConnection.js';

export interface IChannelRepository {
  findById(organizationId: string, id: string): Promise<ChannelConnection | null>;
  list(organizationId: string): Promise<ChannelConnection[]>;
  create(organizationId: string, data: Partial<ChannelConnection>): Promise<ChannelConnection>;
  update(organizationId: string, id: string, data: Partial<ChannelConnection>): Promise<ChannelConnection>;
  delete(organizationId: string, id: string): Promise<void>;
}
