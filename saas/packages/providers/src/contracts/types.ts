/**
 * Shared DTOs and error types for Channel Manager providers.
 */

export type ProviderName =
  | 'booking'
  | 'airbnb'
  | 'vrbo'
  | 'expedia'
  | 'google'
  | 'abritel';

/** Opaque credential bag — each provider validates its own shape. */
export type ProviderCredentials = Record<string, string>;

export interface SyncContext {
  /** Tenant / workspace that owns the connection. */
  accountId: string;
  /** External property / listing identifier on the channel. */
  propertyId: string;
  /** Authenticated credentials for the provider API. */
  credentials: ProviderCredentials;
  /** Inclusive ISO date (YYYY-MM-DD) for sync window start. */
  from?: string;
  /** Inclusive ISO date (YYYY-MM-DD) for sync window end. */
  to?: string;
  /** Opaque cursor for incremental sync. */
  cursor?: string;
}

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'checked_in'
  | 'checked_out'
  | 'no_show';

export interface ReservationDTO {
  externalId: string;
  propertyId: string;
  status: ReservationStatus;
  guestName?: string;
  guestEmail?: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  currency?: string;
  totalAmount?: number;
  channel?: ProviderName;
  raw?: unknown;
}

export interface AvailabilityDTO {
  propertyId: string;
  date: string;
  available: boolean;
  minStay?: number;
  maxStay?: number;
  closedToArrival?: boolean;
  closedToDeparture?: boolean;
}

export interface PricingDTO {
  propertyId: string;
  date: string;
  currency: string;
  amount: number;
  minStay?: number;
}

export interface MessageDTO {
  externalId: string;
  threadId: string;
  propertyId: string;
  reservationId?: string;
  direction: 'inbound' | 'outbound';
  body: string;
  sentAt: string;
  senderName?: string;
}

export interface SendMessagePayload {
  threadId: string;
  body: string;
  reservationId?: string;
}

export interface CalendarEventDTO {
  externalId: string;
  propertyId: string;
  start: string;
  end: string;
  summary?: string;
  type: 'reservation' | 'block' | 'hold' | 'other';
  reservationId?: string;
}

export interface WebhookResult {
  handled: boolean;
  provider: ProviderName;
  eventType?: string;
  /** Normalized entities produced from the webhook, if any. */
  reservations?: ReservationDTO[];
  messages?: MessageDTO[];
  availability?: AvailabilityDTO[];
  pricing?: PricingDTO[];
  calendarEvents?: CalendarEventDTO[];
  raw?: unknown;
}

export class ProviderNotConfiguredError extends Error {
  readonly provider: ProviderName;
  readonly method: string;

  constructor(provider: ProviderName, method: string) {
    super(
      `[${provider}] ${method} is not implemented yet. Configure or implement this provider method.`,
    );
    this.name = 'ProviderNotConfiguredError';
    this.provider = provider;
    this.method = method;
  }
}
