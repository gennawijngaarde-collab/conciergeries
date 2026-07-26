import { StubChannelProvider } from '../contracts/StubChannelProvider.js';
import type { ProviderName } from '../contracts/types.js';

/** Expedia Channel Manager adapter (stub). */
export class ExpediaProvider extends StubChannelProvider {
  readonly name: ProviderName = 'expedia';

  // TODO: implement Expedia Partner Central / EQCs APIs
}
