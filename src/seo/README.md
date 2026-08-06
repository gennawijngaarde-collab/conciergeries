# Moteur SEO programmatique

Architecture pour générer automatiquement des milliers de pages à partir des données (`src/data/**`), sans coder de page en dur.

## Ajouter une ville

Éditez `src/data/geo/cities.ts` :

```ts
{ slug: 'narbonne', name: 'Narbonne', departmentCode: '11', nearby: ['carcassonne'] }
```

Pages générées automatiquement :

- `/ville-narbonne`
- `/conciergerie-narbonne`
- `/menage-airbnb-narbonne` (+ tous les services)
- `/top-conciergeries-narbonne`
- guides `guide-*-narbonne`

Puis : `npm run generate:sitemap`

## Ajouter un service

Éditez `src/data/seoServices.ts` — une page par ville est créée (`/{urlSegment}-airbnb-{ville}`).

## Ajouter un comparatif outils

Ajoutez une paire dans `toolComparePairs` (`src/seo/registry/resolve.ts`).

## Structure

| Dossier | Rôle |
|---------|------|
| `src/data/geo/` | Villes, départements, régions, pays |
| `src/data/seoServices.ts` | Services × ville |
| `src/seo/registry/` | Résolution d’URL + énumération sitemap |
| `src/seo/components/` | PageBuilder, SeoGenerator, FAQ, maillage… |
| `src/seo/content/` | FAQ & templates texte |
| `src/routes/seoRoutes.ts` | Catch-all React Router |
| `scripts/generate-sitemap.ts` | Index sitemap + robots.txt |

## URLs types

- `/conciergerie-paris`
- `/menage-airbnb-lyon`
- `/ville-bordeaux`
- `/departement-gironde`
- `/region-nouvelle-aquitaine`
- `/dom-tom-martinique`
- `/pays-belgique`
- `/comparatif-guesty-vs-hostaway`
- `/guide-rentabilite-airbnb-bordeaux`
- `/top-pms-airbnb`

## Build

```bash
npm run generate:sitemap
npm run build
```

Le build appelle déjà `generate:sitemap`.

## Note crawlabilité

Le site reste une SPA Vite. Les meta/JSON-LD sont injectés côté client (comme pour les outils). Pour un indexage Google maximal à grande échelle, prévoir ensuite un pré-rendu (SSG/prerender) des URLs du sitemap — le registry est déjà prêt pour ça.
