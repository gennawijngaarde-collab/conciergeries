import { StubChannelProvider } from '../contracts/StubChannelProvider.js';
import type { ProviderName } from '../contracts/types.js';

/** Google Vacation Rentals / Hotels adapter (stub). */
export class GoogleProvider extends StubChannelProvider {
  readonly name: ProviderName = 'google';

  // TODO: implement Google Vacation Rentals / Hotel Center APIs
}
