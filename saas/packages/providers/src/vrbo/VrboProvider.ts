import { StubChannelProvider } from '../contracts/StubChannelProvider.js';
import type { ProviderName } from '../contracts/types.js';

/** Vrbo Channel Manager adapter (stub). */
export class VrboProvider extends StubChannelProvider {
  readonly name: ProviderName = 'vrbo';

  // TODO: implement Vrbo / Expedia Group APIs
}
