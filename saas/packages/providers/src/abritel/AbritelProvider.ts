import { StubChannelProvider } from '../contracts/StubChannelProvider.js';
import type { ProviderName } from '../contracts/types.js';

/** Abritel (HomeAway FR) Channel Manager adapter (stub). */
export class AbritelProvider extends StubChannelProvider {
  readonly name: ProviderName = 'abritel';

  // TODO: implement Abritel / Vrbo FR connectivity
}
