import type {
  AvailabilityDTO,
  CalendarEventDTO,
  MessageDTO,
  PricingDTO,
  ProviderCredentials,
  ProviderName,
  ReservationDTO,
  SendMessagePayload,
  SyncContext,
  WebhookResult,
} from './types.js';

/**
 * Contract every Channel Manager adapter must implement.
 * New channels are added by creating a class that satisfies this interface
 * and registering it — without modifying existing providers (Open/Closed).
 */
export interface ChannelProvider {
  readonly name: ProviderName;

  authenticate(credentials: ProviderCredentials): Promise<void>;

  syncReservations(ctx: SyncContext): Promise<ReservationDTO[]>;

  pushAvailability(ctx: SyncContext, availability: AvailabilityDTO[]): Promise<void>;

  pullAvailability(ctx: SyncContext): Promise<AvailabilityDTO[]>;

  pushPricing(ctx: SyncContext, pricing: PricingDTO[]): Promise<void>;

  pullPricing(ctx: SyncContext): Promise<PricingDTO[]>;

  syncMessages(ctx: SyncContext): Promise<MessageDTO[]>;

  sendMessage(ctx: SyncContext, payload: SendMessagePayload): Promise<MessageDTO>;

  syncCalendar(ctx: SyncContext): Promise<CalendarEventDTO[]>;

  handleWebhook(
    rawHeaders: Record<string, string | string[] | undefined>,
    rawBody: string | Uint8Array,
  ): Promise<WebhookResult>;
}

export type {
  AvailabilityDTO,
  CalendarEventDTO,
  MessageDTO,
  PricingDTO,
  ProviderCredentials,
  ProviderName,
  ReservationDTO,
  SendMessagePayload,
  SyncContext,
  WebhookResult,
};
