# Structure des dossiers

```
saas/
├── docker-compose.yml
├── package.json                 # workspaces npm
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   ├── FOLDER_STRUCTURE.md
│   └── API.md
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── app/
│   │   │   ├── infrastructure/  # prisma, redis, stripe, supabase, queue
│   │   │   ├── shared/          # errors, middleware, http
│   │   │   └── modules/
│   │   │       ├── auth/
│   │   │       ├── dashboard/
│   │   │       ├── properties/
│   │   │       ├── reservations/
│   │   │       ├── calendar/
│   │   │       ├── guests/
│   │   │       ├── payments/
│   │   │       ├── invoices/
│   │   │       ├── contracts/
│   │   │       ├── employees/
│   │   │       ├── cleaning/
│   │   │       ├── maintenance/
│   │   │       ├── checkin/
│   │   │       ├── checkout/
│   │   │       ├── inventory/
│   │   │       ├── messages/
│   │   │       ├── reports/
│   │   │       ├── settings/
│   │   │       ├── pricing/
│   │   │       ├── automations/
│   │   │       ├── crm/
│   │   │       ├── channels/
│   │   │       └── ai/
│   │   └── tests/               # unit | api | e2e
│   └── web/
│       └── src/
│           ├── app/
│           ├── layouts/
│           ├── modules/         # miroir des modules API
│           └── shared/          # api client, auth, hooks, ui
└── packages/
    ├── providers/               # Channel Manager
    │   └── src/
    │       ├── contracts/
    │       ├── booking|airbnb|vrbo|expedia|google|abritel/
    │       └── registry/
    ├── domain/
    └── shared/
```

Chaque module API suit :

```
modules/<name>/
  domain/
  application/
  infrastructure/
  http/
```
