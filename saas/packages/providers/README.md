# @pms/providers

Channel Manager provider architecture for the PMS SaaS. Each OTA / distribution channel is an adapter that implements a shared `ChannelProvider` contract. The core sync engine depends only on that contract — never on a concrete Booking.com or Airbnb class.

## Principles

- **Open/Closed**: add a new channel by creating a new provider class and registering it. Do not modify existing providers or the sync engine.
- **Dependency Inversion**: consumers resolve providers via `ProviderRegistry.get(name)`, not by importing concrete classes in business logic.
- **Strict TypeScript**: shared DTOs live in `src/contracts/types.ts`; stubs throw `ProviderNotConfiguredError` until implemented.

## Package layout

```
src/
  contracts/
    ChannelProvider.ts      # interface
    StubChannelProvider.ts  # base stub
    types.ts                # DTOs + ProviderNotConfiguredError
  registry/
    ProviderRegistry.ts     # register / get / list
  booking/ | airbnb/ | vrbo/ | expedia/ | google/ | abritel/
    *Provider.ts
    index.ts
  index.ts
```

## Usage

```ts
import {
  createBuiltinProviderRegistry,
  type SyncContext,
} from '@pms/providers';

const registry = createBuiltinProviderRegistry();
const airbnb = registry.get('airbnb');

const ctx: SyncContext = {
  accountId: 'acc_1',
  propertyId: 'listing_42',
  credentials: { accessToken: '…' },
};

// Throws ProviderNotConfiguredError until the stub is implemented
await airbnb.syncReservations(ctx);
```

## How to add a new provider

1. **Extend `ProviderName`** in `src/contracts/types.ts` with the new channel id (e.g. `'agoda'`).

2. **Create a folder** `src/agoda/` with:

   ```ts
   // src/agoda/AgodaProvider.ts
   import { StubChannelProvider } from '../contracts/StubChannelProvider.js';
   import type { ProviderName } from '../contracts/types.js';

   export class AgodaProvider extends StubChannelProvider {
     readonly name: ProviderName = 'agoda';

     // Override methods as you implement them:
     // async syncReservations(ctx) { … }
   }
   ```

   ```ts
   // src/agoda/index.ts
   export { AgodaProvider } from './AgodaProvider.js';
   ```

3. **Register it** — either at bootstrap:

   ```ts
   import { AgodaProvider, createBuiltinProviderRegistry } from '@pms/providers';

   const registry = createBuiltinProviderRegistry();
   registry.register(new AgodaProvider());
   ```

   or by adding `new AgodaProvider()` to `createBuiltinProviders()` in `src/index.ts` and re-exporting the class.

4. **Implement methods incrementally**. Unimplemented methods keep throwing `ProviderNotConfiguredError`, so you can ship `authenticate` + `syncReservations` first and leave pricing / messaging for later.

5. **Do not** change `ChannelProvider` unless the capability is truly cross-cutting for every channel. Prefer optional behavior inside the adapter, or a narrow extension interface if only some channels need a feature.

## Contract methods

| Method | Role |
|--------|------|
| `authenticate` | Validate / refresh credentials |
| `syncReservations` | Pull reservations into PMS DTOs |
| `pushAvailability` / `pullAvailability` | Inventory sync |
| `pushPricing` / `pullPricing` | Rate sync |
| `syncMessages` / `sendMessage` | Guest messaging |
| `syncCalendar` | Blocks / holds / reservation windows |
| `handleWebhook` | Normalize inbound channel webhooks |

## Errors

`ProviderNotConfiguredError` — thrown by stubs for methods not yet wired to a real API. Catch it in the sync worker to mark the job as skipped / not configured rather than failing the whole pipeline.
