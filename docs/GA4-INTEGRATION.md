# Intégration Google Analytics 4 (GA4)

Ce document décrit l'intégration complète de Google Analytics 4 dans l'annuaire ma-conciergerie-annuaire.com.

## 📋 Vue d'ensemble

Une solution de tracking GA4 centralisée et orientée SEO, acquisition, génération de prospects et monétisation a été mise en place. L'architecture est propre, maintenable et respecte les bonnes pratiques.

## 🗂️ Fichiers créés

### 1. Service Analytics centralisé
- **`src/lib/analytics.ts`** (184 lignes)
  - Service centralisé pour tous les événements GA4
  - Fonctions type-safe avec interfaces TypeScript
  - Vérification automatique de la disponibilité de GA4
  - Logging en mode développement

### 2. Hook de tracking des pages
- **`src/hooks/usePageTracking.ts`** (20 lignes)
  - Hook React pour tracker automatiquement les changements de route
  - Intégré avec React Router
  - Délai pour permettre la mise à jour du titre de la page

## 📝 Fichiers modifiés

### Configuration
1. **`index.html`**
   - Ajout du script GA4 avec injection de `VITE_GA_MEASUREMENT_ID`
   - Chargement asynchrone du script gtag.js
   - Configuration avec `send_page_view: false` (géré manuellement)

2. **`.env.example`**
   - Ajout de `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
   - Documentation de la variable d'environnement

3. **`src/main.tsx`**
   - Injection dynamique du Measurement ID depuis les variables d'environnement

4. **`src/App.tsx`**
   - Intégration du hook `usePageTracking()` pour le tracking automatique des pages

### Pages avec tracking

5. **`src/pages/ConciergerieDetail.tsx`**
   - ✅ Track `view_listing` au chargement de la fiche
   - ✅ Track `click_phone` sur les clics téléphone
   - ✅ Track `click_email` sur les clics email
   - ✅ Track `click_website` sur les clics site web
   - Paramètres: `listing_id`, `listing_name`, `city`, `department`, `country`, `premium`

6. **`src/pages/Conciergeries.tsx`**
   - ✅ Track `view_directory` au chargement de l'annuaire
   - ✅ Track `search_directory` lors des recherches
   - Paramètres: `search_term`, `city`, `department`

7. **`src/pages/Devis.tsx`**
   - ✅ Track `quote_submit` lors de la soumission du formulaire
   - Paramètres: `city`

8. **`src/pages/DevenirPartenaire.tsx`**
   - ✅ Track `premium_click` sur le clic du bouton Premium
   - ✅ Track `pms_checkout` au démarrage du paiement Stripe
   - ✅ Track `pms_purchase` après confirmation du paiement
   - Paramètres: `plan`, `price`, `currency`, `premium`

9. **`src/pms/pages/PmsLanding.tsx`**
   - ✅ Track `pms_view` au chargement de la page PMS

10. **`src/pms/pages/PmsOnboarding.tsx`**
    - ✅ Track `pms_signup` à la fin de l'onboarding
    - Paramètres: `plan`

## 📊 Événements GA4 implémentés

### Événements de navigation
| Événement | Description | Paramètres |
|-----------|-------------|------------|
| `page_view` | Changement de page (automatique) | `page_path`, `page_title` |
| `view_directory` | Vue de la page annuaire | - |
| `view_listing` | Vue d'une fiche conciergerie | `listing_id`, `listing_name`, `city`, `department`, `country`, `premium` |

### Événements d'interaction
| Événement | Description | Paramètres |
|-----------|-------------|------------|
| `search_directory` | Recherche dans l'annuaire | `search_term`, `city`, `department` |
| `click_phone` | Clic sur un numéro de téléphone | `listing_id`, `listing_name`, `city`, `department`, `country`, `premium` |
| `click_email` | Clic sur un email | `listing_id`, `listing_name`, `city`, `department`, `country`, `premium` |
| `click_website` | Clic sur un site web | `listing_id`, `listing_name`, `city`, `department`, `country`, `premium` |
| `premium_click` | Clic sur un élément premium | `premium` |

### Événements de conversion
| Événement | Description | Paramètres |
|-----------|-------------|------------|
| `quote_submit` | Soumission d'une demande de devis | `city` |
| `pms_view` | Vue de la page PMS | - |
| `pms_signup` | Inscription PMS complétée | `plan` |
| `pms_checkout` | Début du processus de paiement | `plan`, `price`, `currency` |
| `pms_purchase` | Achat/abonnement confirmé | `plan`, `price`, `currency` |

## 🎯 Conversions à configurer dans GA4

Une fois le site déployé avec le Measurement ID configuré, déclarez ces événements comme conversions dans Google Analytics 4:

1. **`quote_submit`** - Demande de devis (lead)
2. **`pms_signup`** - Inscription PMS (lead qualifié)
3. **`pms_purchase`** - Achat confirmé (conversion monétaire)
4. **`click_website`** - Clic vers site partenaire (engagement fort)

### Comment configurer les conversions:
1. Aller sur [Google Analytics 4](https://analytics.google.com)
2. Admin → Data display → Events
3. Attendre que les événements apparaissent (après quelques heures)
4. Cocher "Mark as conversion" pour chaque événement ci-dessus

## 🔧 Configuration requise

### 1. Variable d'environnement

Créer un fichier `.env.local` à la racine du projet:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

⚠️ **Important**: Remplacer `G-XXXXXXXXXX` par votre vrai Measurement ID Google Analytics 4.

### 2. Obtenir un Measurement ID

1. Aller sur [Google Analytics](https://analytics.google.com)
2. Créer une propriété GA4 (si pas déjà fait)
3. Admin → Data Streams → Web
4. Copier le "Measurement ID" (format: `G-XXXXXXXXXX`)

### 3. Déploiement Vercel

Ajouter la variable d'environnement dans Vercel:

1. Projet Vercel → Settings → Environment Variables
2. Ajouter: `VITE_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
3. Redéployer l'application

## 📈 Vérification et tests

### Mode développement
En mode dev (`npm run dev`), les événements sont loggés dans la console:
```
[Analytics] Event tracked: view_listing {...}
[Analytics] Event tracked: click_website {...}
```

### Mode production
1. Ouvrir le site en production
2. Ouvrir les DevTools (F12)
3. Console → taper `dataLayer` pour voir les événements
4. Ou installer l'extension Chrome "Google Analytics Debugger"

### Vérifier dans GA4
1. Aller sur [Google Analytics](https://analytics.google.com)
2. Reports → Realtime
3. Naviguer sur le site
4. Voir les événements apparaître en temps réel

## 🛡️ Respect du RGPD

### État actuel
- ❌ **Aucun système de consentement détecté** dans l'application
- Le GA4 se charge automatiquement sans demander le consentement

### Recommandation
Pour être conforme RGPD, vous devez:

1. **Implémenter une bannière de cookies** (CMP)
   - Recommandations: Axeptio, Cookiebot, OneTrust, ou Tarteaucitron.js
   - Solution gratuite: [Tarteaucitron.js](https://github.com/AmauriC/tarteaucitron.js)

2. **Conditionner le chargement de GA4**
   Modifier `index.html` pour ne charger GA4 qu'après consentement:
   ```javascript
   // Ne charger que si consentement = true
   if (userConsent.analytics === true) {
     // Charger GA4
   }
   ```

3. **Alternative simple**
   Ajouter un disclaimer dans les mentions légales et la politique de confidentialité indiquant l'utilisation de Google Analytics.

## 🔍 Points importants

### ✅ Bonnes pratiques respectées
- Service centralisé (un seul point d'entrée)
- Types TypeScript pour la sécurité
- Pas de Measurement ID hardcodé dans le code
- Vérification de disponibilité GA4 avant chaque événement
- Logging en développement
- Tracking des conversions clés

### ⚠️ À noter
- **PMS Purchase**: L'événement `pms_purchase` n'est envoyé QUE sur la page de retour Stripe avec `?success=1&session_id=xxx`. C'est correct car cela garantit que le paiement est validé.
- **Pas de double tracking**: Les pageviews sont désactivés dans la config GA4 et gérés manuellement via le hook React Router.
- **Aucune donnée bancaire**: Aucune information sensible n'est envoyée à GA4 (conforme aux CGU Google Analytics).

## 📚 Ressources

### Documentation Google Analytics 4
- [Vue d'ensemble GA4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Événements recommandés](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Paramètres personnalisés](https://support.google.com/analytics/answer/10075209)

### Outils utiles
- [GA4 Event Builder](https://ga-dev-tools.google/ga4/event-builder/)
- [Tag Assistant](https://tagassistant.google.com/)
- Extension Chrome: "Google Analytics Debugger"

## 🐛 Dépannage

### GA4 ne se charge pas
1. Vérifier que `VITE_GA_MEASUREMENT_ID` est défini
2. Vérifier dans la console: `window.gtag` doit être une fonction
3. Vérifier Network tab: doit charger `gtag/js?id=G-...`

### Les événements n'apparaissent pas dans GA4
1. Attendre 24-48h pour les rapports standards
2. Utiliser le rapport "Realtime" pour voir immédiatement
3. Vérifier la console browser pour les erreurs

### Erreurs TypeScript
Si TypeScript se plaint de `window.gtag`:
```typescript
// Déjà ajouté dans src/lib/analytics.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
```

## ✅ Prochaines étapes

1. **Immédiat**
   - [ ] Ajouter `VITE_GA_MEASUREMENT_ID` dans `.env.local`
   - [ ] Tester en local
   - [ ] Déployer sur Vercel avec la variable d'environnement
   - [ ] Vérifier les événements dans GA4 Realtime

2. **Court terme** (1-2 semaines)
   - [ ] Configurer les 4 conversions dans GA4
   - [ ] Créer des rapports personnalisés
   - [ ] Lier Google Search Console à GA4
   - [ ] Configurer des alertes pour les conversions

3. **Moyen terme** (1-2 mois)
   - [ ] Implémenter une solution de consentement RGPD
   - [ ] Ajouter des événements d'engagement supplémentaires
   - [ ] Mettre en place des audiences pour le remarketing
   - [ ] Intégrer Google Ads pour les conversions

## 📊 Tableau récapitulatif

| Catégorie | Événements | Pages concernées |
|-----------|------------|------------------|
| Navigation | `page_view`, `view_directory`, `view_listing` | Toutes, Annuaire, Fiches |
| Recherche | `search_directory` | Annuaire |
| Interactions | `click_phone`, `click_email`, `click_website` | Fiches conciergeries |
| Leads | `quote_submit`, `pms_signup` | Devis, PMS Onboarding |
| Monétisation | `pms_checkout`, `pms_purchase` | Devenir Partenaire |
| Premium | `premium_click` | Devenir Partenaire |

**Total: 11 événements distincts + 1 événement automatique (page_view)**
