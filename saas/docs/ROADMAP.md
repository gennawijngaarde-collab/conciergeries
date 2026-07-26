# Roadmap de développement — PMS SaaS

## Phase 0 — Fondations (semaine 1–2) ✅ scaffold

- [x] Monorepo `saas/` (api, web, providers)
- [x] Schéma Prisma multi-tenant + migration init
- [x] Docker Compose (Postgres, Redis)
- [x] Auth Supabase (contrat) + RBAC modèle
- [x] OpenAPI stub + healthcheck
- [x] Interface `ChannelProvider` + 6 stubs
- [ ] CI (lint, test, build)
- [ ] Environnements staging / prod

**Livrable** : API + Web démarrables en local, schéma DB prêt.

---

## Phase 1 — MVP Ops (semaine 3–6) ✅ en cours / exécutable

1. [x] **Auth** — Supabase + mode démo (`USE_MEMORY_STORE` sans Docker)
2. [x] **Propriétés** CRUD
3. [x] **Réservations** manuelles (canal DIRECT) + ménage auto si CONFIRMED
4. [x] **Calendrier** événements + blocages
5. [x] **Ménage** tâches + statuts
6. [ ] Clients (voyageurs) basique — phase 1.1
7. [ ] Paramètres org / rôles UI — phase 1.1

Voir `docs/PHASE1.md`.

**Critère de succès** : une conciergerie gère logements + turnovers sans Excel.

---

## Phase 2 — Finance & documents (semaine 7–10)

1. Stripe Connect / paiements voyageurs
2. Factures PDF + TVA + avoirs
3. Contrats (templates)
4. Dépôts de garantie (workflow)
5. Rapports : revenus, occupation simple

---

## Phase 3 — Channel Manager v1 (semaine 11–16)

1. iCal bidirectionnel (tous canaux)
2. Provider **Airbnb** (ou partenaire API / scraper légal selon accès)
3. Provider **Booking**
4. Mapping listings ↔ propriétés
5. Inbox emails + messages OTA (lecture)
6. Webhooks + retry / DLQ Redis

**Note** : les accès API OTA officiels dépendent des partenariats ; l’architecture `providers/` isole ce risque.

---

## Phase 4 — Calendrier Guesty-like (semaine 17–20)

1. Vues jour / semaine / mois / année
2. Drag & drop réservations / blocages
3. Couches ménage + maintenance
4. Performance multi-propriétés (virtualisation)

---

## Phase 5 — Tarification & automatisations (semaine 21–24)

1. Moteur de règles complet branché UI
2. Saisons / événements / min stay
3. Automation builder (UI type Zapier)
4. Templates messages + guide auto

---

## Phase 6 — Ops avancées & CRM (semaine 25–28)

1. Maintenance tickets + techniciens
2. Check-in / check-out digital
3. Inventaire
4. CRM propriétaires / prestataires / documents
5. Employés & planning équipes ménage

---

## Phase 7 — Analytics & scale (semaine 29–32)

1. ADR, RevPAR, occupation, YoY
2. Commissions & rentabilité par bien
3. Cache Redis rapports
4. Multi-région / read replicas si besoin

---

## Phase 8 — IA (semaine 33+)

Couche `modules/ai` découplée :

1. Réponses automatiques inbox
2. Traduction
3. Génération d’annonces
4. Suggestions prix (dynamic pricing)
5. Détection fraude / anomalies
6. Assistant virtuel ops

---

## Phase 9 — Providers étendus

- VRBO, Expedia, Google Vacation Rentals, Abritel
- WhatsApp / SMS messaging
- Marketplace d’intégrations

---

## Estimation effort

| Phase | Effort indicatif |
|-------|------------------|
| 0–1   | 1–1,5 mois |
| 2–3   | 2 mois |
| 4–5   | 1,5–2 mois |
| 6–7   | 1,5 mois |
| 8–9   | continu |

Équipe recommandée MVP : 1 architecte/backend, 1 frontend, 1 fullstack ops/intégrations.
