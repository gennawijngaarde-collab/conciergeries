# Abonnements — Annuaire + Cleanbnb PMS

## Offres

| Plan | Prix | Annuaire | PMS | Essai |
|------|------|----------|-----|-------|
| **Standard** | 11,99€/mois | Oui | Non | 30 jours |
| **Premium** | 29,99€/mois | Oui (mise en avant) | **Inclus** | 30 jours |
| **PMS seul** | 19,99€/mois | Non | Oui | 30 jours |

Source de vérité UI : `src/data/site.ts` → `subscriptionPlans`.

## Stripe (à configurer)

Créer 3 prix récurrents mensuels et renseigner :

- `STRIPE_STANDARD_PRICE` → 11,99€
- `STRIPE_PREMIUM_PRICE` → 29,99€
- `STRIPE_PMS_PRICE` → 19,99€

Le checkout (`api/stripe/create-checkout-session.ts`) ouvre un essai de 30 jours et exige une carte (`payment_method_collection: always`). Rien n’est débité pendant l’essai. À la fin, Stripe prélève automatiquement cette carte (`charge_automatically`), puis chaque mois. Sans carte, l’abonnement est annulé au lieu de rester gratuit.

Webhooks à écouter en plus de `checkout.session.completed` : `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`. Le premier prélèvement met le statut à `active`.

## Base Supabase

Exécuter / mettre à jour dans Supabase → SQL Editor :

1. `supabase/subscriptions.sql` (ou la migration complète)
2. `supabase/partner_profiles.sql` (contrainte `plan` inclut désormais `pms`)
3. Ou en une fois : `supabase/migrations/20260726_subscriptions_and_partners.sql`

Changements clés :
- `plan` ∈ `standard | premium | pms`
- colonnes `includes_pms`, `includes_directory`, `trial_ends_at`
- profils annuaire publics : uniquement `standard` / `premium` actifs (le plan `pms` seul n’apparaît pas dans l’annuaire)

## Accès produit

- `premium` ou `pms` + statut `active`/`trialing` → accès Cleanbnb (`/pms`)
- `standard` ou `premium` → fiche partenaire / annuaire
