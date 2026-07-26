# @pms/web — PMS SaaS frontend

Separate Vite + React 19 app for the seasonal rental PMS (not the directory marketing site).

## Stack

- React 19 + TypeScript + Vite 6
- React Router 7
- TanStack Query
- Tailwind CSS (brand accent `#114c09`)
- Supabase Auth client (stub)
- Zod, date-fns, Lucide, Recharts

## Setup

```bash
cd saas/apps/web
cp .env.example .env
npm install
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173). API defaults to `VITE_API_URL=http://localhost:3001`.

## Structure

```
src/
  app/App.tsx              # BrowserRouter + all module routes
  layouts/AppShell.tsx     # Sidebar ops shell
  modules/<name>/
    pages/*Page.tsx
    hooks/use*.ts
  shared/
    api/client.ts
    auth/AuthProvider.tsx
    hooks/usePermissions.ts
    ui/PageHeader.tsx
```

## Modules / routes

| Route | Module |
|-------|--------|
| `/dashboard` | Dashboard |
| `/properties`, `/properties/:id`, `/properties/new`, `/properties/:id/edit` | Properties |
| `/reservations` | Reservations |
| `/calendar` | Calendar (multi-view board) |
| `/guests` | Guests |
| `/payments` | Payments |
| `/invoices` | Invoices |
| `/contracts` | Contracts |
| `/employees` | Employees |
| `/cleaning` | Cleaning |
| `/maintenance` | Maintenance |
| `/checkin` | Check-in |
| `/checkout` | Check-out |
| `/inventory` | Inventory |
| `/messages`, `/messages/inbox` | Messages / unified inbox |
| `/reports` | Reports (ADR / RevPAR / occupancy) |
| `/settings` | Settings |
| `/crm` | CRM |
| `/pricing` | Pricing |
| `/automations` | Automations |
| `/channels` | Channels |

## Notes

- Module hooks call `api.get('/api/<module>')` via the shared fetch wrapper; pages tolerate API downtime with placeholders.
- Auth is a Supabase stub — without `VITE_SUPABASE_*` the shell still renders for local UI work.
- Permissions read `user.app_metadata.role` (default `MANAGER`).
