import { AppError } from '../../../shared/errors/AppError.js';
import type { MessageThread } from '../domain/MessageThread.js';
import type { IMessageRepository } from '../domain/IMessageRepository.js';

export class MessageService {
  constructor(private readonly repo: IMessageRepository) {}

  async list(organizationId: string): Promise<MessageThread[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<MessageThread> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('MessageThread', id);
    return item;
  }

  async create(organizationId: string, data: Partial<MessageThread>): Promise<MessageThread> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<MessageThread>): Promise<MessageThread> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
