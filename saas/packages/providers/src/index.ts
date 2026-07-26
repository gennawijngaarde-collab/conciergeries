import { AbritelProvider } from './abritel/index.js';
import { AirbnbProvider } from './airbnb/index.js';
import { BookingProvider } from './booking/index.js';
import type { ChannelProvider } from './contracts/ChannelProvider.js';
import { ExpediaProvider } from './expedia/index.js';
import { GoogleProvider } from './google/index.js';
import {
  createDefaultProviderRegistry,
  ProviderRegistry,
} from './registry/ProviderRegistry.js';
import { VrboProvider } from './vrbo/index.js';

export type { ChannelProvider } from './contracts/ChannelProvider.js';
export { StubChannelProvider } from './contracts/StubChannelProvider.js';
export type {
  AvailabilityDTO,
  CalendarEventDTO,
  MessageDTO,
  PricingDTO,
  ProviderCredentials,
  ProviderName,
  ReservationDTO,
  ReservationStatus,
  SendMessagePayload,
  SyncContext,
  WebhookResult,
} from './contracts/types.js';
export { ProviderNotConfiguredError } from './contracts/types.js';

export { AbritelProvider } from './abritel/index.js';
export { AirbnbProvider } from './airbnb/index.js';
export { BookingProvider } from './booking/index.js';
export { ExpediaProvider } from './expedia/index.js';
export { GoogleProvider } from './google/index.js';
export { VrboProvider } from './vrbo/index.js';

export {
  createDefaultProviderRegistry,
  ProviderRegistry,
} from './registry/ProviderRegistry.js';

/** All built-in stub providers. */
export function createBuiltinProviders(): ChannelProvider[] {
  return [
    new BookingProvider(),
    new AirbnbProvider(),
    new VrboProvider(),
    new ExpediaProvider(),
    new GoogleProvider(),
    new AbritelProvider(),
  ];
}

/** Registry with every built-in provider registered. */
export function createBuiltinProviderRegistry(): ProviderRegistry {
  return createDefaultProviderRegistry(createBuiltinProviders());
}
