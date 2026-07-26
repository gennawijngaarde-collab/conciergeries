# PMS SaaS — Location saisonnière

SaaS complet de gestion de locations saisonnières (PMS + Channel Manager + CRM + Ops).

## Stack

React · TypeScript · Node.js · Express · PostgreSQL · Prisma · Redis · Supabase Auth · Stripe · Docker

## Démarrage rapide

```bash
cd saas/apps/api
cp .env.example .env   # USE_MEMORY_STORE=true (sans Docker)
npm install && npm run dev

# autre terminal
cd saas/apps/web
cp .env.example .env
npm install && npm run dev
```

Login web → **Continuer en mode démo**

- API : `http://localhost:3001` — docs : `/docs`
- Guide Phase 1 : [docs/PHASE1.md](./docs/PHASE1.md)

## Documentation

| Doc | Contenu |
|-----|---------|
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Clean Architecture, DDD, multi-tenant |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Phases de livraison |
| [docs/FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) | Arborescence |
| [docs/API.md](./docs/API.md) | Routes REST |
| [packages/providers/README.md](./packages/providers/README.md) | Ajouter un channel |

## Modules

Dashboard · Propriétés · Réservations · Calendrier · Clients · Paiements · Factures · Contrats · Employés · Ménage · Maintenance · Check-in/out · Inventaire · Messages · Rapports · Paramètres · Pricing · Automatisations · CRM · Channels · IA (stub)

## Relation avec l’annuaire

Le site `ma-conciergerie-annuaire.com` (racine du repo) reste l’acquisition / SEO.  
Ce dossier `saas/` est le **produit ops** (Cleanbnb évolue vers ce PMS).
