import type { ChannelProvider } from '../contracts/ChannelProvider.js';
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
} from '../contracts/types.js';
import { ProviderNotConfiguredError } from '../contracts/types.js';

/**
 * Base stub that throws {@link ProviderNotConfiguredError} for every method.
 * Concrete providers override only the methods they support.
 */
export abstract class StubChannelProvider implements ChannelProvider {
  abstract readonly name: ProviderName;

  authenticate(_credentials: ProviderCredentials): Promise<void> {
    return this.notImplemented('authenticate');
  }

  syncReservations(_ctx: SyncContext): Promise<ReservationDTO[]> {
    return this.notImplemented('syncReservations');
  }

  pushAvailability(_ctx: SyncContext, _availability: AvailabilityDTO[]): Promise<void> {
    return this.notImplemented('pushAvailability');
  }

  pullAvailability(_ctx: SyncContext): Promise<AvailabilityDTO[]> {
    return this.notImplemented('pullAvailability');
  }

  pushPricing(_ctx: SyncContext, _pricing: PricingDTO[]): Promise<void> {
    return this.notImplemented('pushPricing');
  }

  pullPricing(_ctx: SyncContext): Promise<PricingDTO[]> {
    return this.notImplemented('pullPricing');
  }

  syncMessages(_ctx: SyncContext): Promise<MessageDTO[]> {
    return this.notImplemented('syncMessages');
  }

  sendMessage(_ctx: SyncContext, _payload: SendMessagePayload): Promise<MessageDTO> {
    return this.notImplemented('sendMessage');
  }

  syncCalendar(_ctx: SyncContext): Promise<CalendarEventDTO[]> {
    return this.notImplemented('syncCalendar');
  }

  handleWebhook(
    _rawHeaders: Record<string, string | string[] | undefined>,
    _rawBody: string | Uint8Array,
  ): Promise<WebhookResult> {
    return this.notImplemented('handleWebhook');
  }

  protected notImplemented(method: string): never {
    throw new ProviderNotConfiguredError(this.name, method);
  }
}
