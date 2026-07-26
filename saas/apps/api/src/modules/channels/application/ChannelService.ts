import type { ChannelConnection } from '../domain/ChannelConnection.js';
import type { IChannelRepository } from '../domain/IChannelRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import {
  createBuiltinProviderRegistry,
  type ProviderName,
  type SyncContext,
  type WebhookResult,
} from '@pms/providers';

export class ChannelService {
  private readonly registry = createBuiltinProviderRegistry();

  constructor(private readonly repo: IChannelRepository) {}

  async list(organizationId: string): Promise<ChannelConnection[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<ChannelConnection> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('ChannelConnection', id);
    return item;
  }

  async create(
    organizationId: string,
    data: Partial<ChannelConnection>,
  ): Promise<ChannelConnection> {
    return this.repo.create(organizationId, data);
  }

  async update(
    organizationId: string,
    id: string,
    data: Partial<ChannelConnection>,
  ): Promise<ChannelConnection> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }

  listProviders(): ProviderName[] {
    return this.registry.listNames();
  }

  private syncCtx(
    organizationId: string,
    propertyId: string,
  ): SyncContext {
    return {
      accountId: organizationId,
      propertyId,
      credentials: {},
    };
  }

  async syncReservations(
    organizationId: string,
    providerName: ProviderName,
    propertyId: string,
  ) {
    const provider = this.registry.get(providerName);
    return provider.syncReservations(this.syncCtx(organizationId, propertyId));
  }

  async syncCalendar(
    organizationId: string,
    providerName: ProviderName,
    propertyId: string,
  ) {
    const provider = this.registry.get(providerName);
    return provider.syncCalendar(this.syncCtx(organizationId, propertyId));
  }

  async handleWebhook(
    providerName: ProviderName,
    headers: Record<string, string | string[] | undefined>,
    rawBody: string | Uint8Array,
  ): Promise<WebhookResult> {
    const provider = this.registry.get(providerName);
    return provider.handleWebhook(headers, rawBody);
  }
}
