import type { MessageThread } from './MessageThread.js';

export interface IMessageRepository {
  findById(organizationId: string, id: string): Promise<MessageThread | null>;
  list(organizationId: string): Promise<MessageThread[]>;
  create(organizationId: string, data: Partial<MessageThread>): Promise<MessageThread>;
  update(organizationId: string, id: string, data: Partial<MessageThread>): Promise<MessageThread>;
  delete(organizationId: string, id: string): Promise<void>;
}
