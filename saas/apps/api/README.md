# @pms/api

Express + TypeScript API for the seasonal rental PMS SaaS.

## Stack

- **Express** + TypeScript (ESM / NodeNext)
- **Prisma** (PostgreSQL) — schema in `prisma/`
- **Supabase Auth** — JWT verification
- **Redis** / **BullMQ** — queues & cache (clients stubbed)
- **Stripe** — payments client stub
- **Zod** — validation (ready to wire)
- **OpenAPI** — Swagger UI at `/docs`
- **@pms/providers** — channel manager adapters

## Architecture

Clean Architecture / DDD per business module under `src/modules/<name>/`:

| Layer | Role |
|-------|------|
| `domain/` | Entities/types + repository **ports** (`I*Repository`) |
| `application/` | Use-case **services** (+ engines where pure logic lives) |
| `infrastructure/` | Prisma **repository stubs** |
| `http/` | Controllers + Express routers |

Modules: `dashboard`, `properties`, `reservations`, `calendar`, `guests`, `payments`, `invoices`, `contracts`, `employees`, `cleaning`, `maintenance`, `checkin`, `checkout`, `inventory`, `messages`, `reports`, `settings`, `pricing`, `automations`, `crm`, `ai`, `auth`, `channels`.

Shared cross-cutting code lives in `src/shared/` (errors, ApiResponse, middleware) and `src/infrastructure/` (prisma, redis, stripe, supabase).

## Quick start

```bash
cd saas/apps/api
cp .env.example .env
npm install
npm run prisma:generate
npm run dev
```

- API: `http://localhost:3001`
- Health: `GET /health`
- Docs: `http://localhost:3001/docs`

### Dev auth bypass

In non-production, send:

```http
Authorization: Bearer dev:<userId>:<organizationId>:<role>
x-organization-id: <organizationId>
```

Example: `Bearer dev:user-1:org-1:MANAGER`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Watch mode via `tsx` |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run compiled server |
| `npm test` | Vitest (unit + API stubs) |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run migrations |
| `npm run prisma:studio` | Prisma Studio |

## API surface

All business routers are mounted under `/api/v1`:

- `GET /api/v1/dashboard/overview` — mock KPIs
- CRUD stubs for properties, reservations, guests, …
- `POST /api/v1/channels/webhooks/:provider` — inbound webhooks
- `POST /api/v1/channels/sync/:provider/reservations|calendar` — sync via `@pms/providers`

Responses use a uniform envelope:

```json
{ "success": true, "data": { } }
```

Errors:

```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "…" } }
```

## Notable engines

- **`PricingEngine`** — pure nightly / weekend / season / event / min-max / stay / discount / promotion logic (`src/modules/pricing/application/PricingEngine.ts`)
- **`AutomationEngine`** — IF/THEN rule evaluation (`src/modules/automations/application/AutomationEngine.ts`)
- **`DashboardService.getOverview`** — aggregated KPIs stub

## Status

Repositories and many use cases return **mock data** or throw `AppError.notImplemented`. Controllers are wired to services so you can replace stubs module-by-module without changing HTTP boundaries.
