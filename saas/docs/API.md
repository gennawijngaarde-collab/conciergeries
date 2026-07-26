# API REST — référence

Base URL : `/api/v1`  
Docs interactives : `GET /docs` (OpenAPI / Swagger)

Auth : `Authorization: Bearer <supabase_jwt>`  
Tenant : claim JWT `organization_id` ou header `x-organization-id`

## Endpoints principaux

| Module | Prefixe | Opérations |
|--------|---------|------------|
| Auth | `/auth` | status, me, CRUD membres |
| Dashboard | `/dashboard` | overview + CRUD snapshots |
| Properties | `/properties` | CRUD logements |
| Reservations | `/reservations` | CRUD réservations |
| Calendar | `/calendar` | events, blocks |
| Guests | `/guests` | CRUD voyageurs |
| Payments | `/payments` | CRUD + Stripe intents |
| Invoices | `/invoices` | CRUD factures / PDF |
| Contracts | `/contracts` | CRUD |
| Employees | `/employees` | CRUD |
| Cleaning | `/cleaning` | tâches, équipes, checklists |
| Maintenance | `/maintenance` | tickets |
| Check-in | `/checkin` | sessions |
| Check-out | `/checkout` | sessions |
| Inventory | `/inventory` | items + logs |
| Messages | `/messages` | threads inbox unifiée |
| Reports | `/reports` | KPIs ADR / RevPAR |
| Settings | `/settings` | org settings |
| Pricing | `/pricing` | règles + quote |
| Automations | `/automations` | règles IF/THEN |
| CRM | `/crm` | owners / vendors |
| Channels | `/channels` | providers, sync, webhooks |
| AI | `/ai` | jobs (stub) |

## Channels (exemples)

```
GET  /api/v1/channels/providers
POST /api/v1/channels/:provider/sync
POST /api/v1/channels/:provider/webhooks
```

Providers : `booking`, `airbnb`, `vrbo`, `expedia`, `google`, `abritel`

## Health

```
GET /health
```

## Convention de réponse

```json
{
  "success": true,
  "data": {},
  "meta": { "requestId": "…" }
}
```

Erreurs : `AppError` → `{ success: false, error: { code, message } }`
