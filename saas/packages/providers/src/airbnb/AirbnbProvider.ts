import { StubChannelProvider } from '../contracts/StubChannelProvider.js';
import type { ProviderName } from '../contracts/types.js';

/** Airbnb Channel Manager adapter (stub). */
export class AirbnbProvider extends StubChannelProvider {
  readonly name: ProviderName = 'airbnb';

  // TODO: implement Airbnb Partner API
}
