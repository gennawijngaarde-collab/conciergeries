import { StubChannelProvider } from '../contracts/StubChannelProvider.js';
import type { ProviderName } from '../contracts/types.js';

/** Booking.com Channel Manager adapter (stub). */
export class BookingProvider extends StubChannelProvider {
  readonly name: ProviderName = 'booking';

  // TODO: implement Booking.com Connectivity APIs
}
