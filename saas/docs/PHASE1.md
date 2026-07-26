# Phase 1 MVP — démarrage

## Prérequis
- Node 20+
- Docker optionnel (Postgres). Sans Docker : `USE_MEMORY_STORE=true` (défaut)

## Lancer (sans Docker — recommandé pour démarrer)

```bash
cd saas/apps/api
cp .env.example .env   # USE_MEMORY_STORE=true
npm install
npm run dev            # http://localhost:3001

# autre terminal
cd saas/apps/web
cp .env.example .env
npm install
npm run dev            # Vite
```

## Lancer avec Postgres (quand Docker est installé)

```bash
cd saas
docker compose up -d postgres redis
# dans apps/api/.env : USE_MEMORY_STORE=false
npx prisma db push && npm run prisma:seed
npm run dev
```

## Auth démo
Sur l’écran de login : **Continuer en mode démo**

Token utilisé : `dev:demo-user:org_demo:MANAGER`  
Header : `x-organization-id: org_demo`

## Scope Phase 1
- Auth (Supabase ou mode démo)
- Propriétés CRUD
- Réservations CRUD (+ tâche ménage auto si CONFIRMED)
- Calendrier (événements + blocages)
- Ménage (tâches + statuts)

## Docs API
http://localhost:3001/docs
