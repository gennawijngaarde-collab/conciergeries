import type { ChannelProvider } from '../contracts/ChannelProvider.js';
import type { ProviderName } from '../contracts/types.js';

/**
 * In-memory registry of Channel Manager providers.
 * Register adapters at bootstrap; resolve by {@link ProviderName} at runtime.
 */
export class ProviderRegistry {
  private readonly providers = new Map<ProviderName, ChannelProvider>();

  register(provider: ChannelProvider): void {
    if (this.providers.has(provider.name)) {
      throw new Error(`Provider "${provider.name}" is already registered.`);
    }
    this.providers.set(provider.name, provider);
  }

  get(name: ProviderName): ChannelProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider "${name}" is not registered.`);
    }
    return provider;
  }

  has(name: ProviderName): boolean {
    return this.providers.has(name);
  }

  list(): ChannelProvider[] {
    return [...this.providers.values()];
  }

  listNames(): ProviderName[] {
    return [...this.providers.keys()];
  }
}

/** Default registry pre-populated by {@link createDefaultProviderRegistry}. */
export function createDefaultProviderRegistry(
  providers: ChannelProvider[],
): ProviderRegistry {
  const registry = new ProviderRegistry();
  for (const provider of providers) {
    registry.register(provider);
  }
  return registry;
}
