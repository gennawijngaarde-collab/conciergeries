import type { GeoRegion } from '@/seo/types';

/** Régions métropolitaines + DOM-TOM (ajout = nouvelles pages auto). */
export const geoRegions: GeoRegion[] = [
  { slug: 'auvergne-rhone-alpes', name: 'Auvergne-Rhône-Alpes' },
  { slug: 'bourgogne-franche-comte', name: 'Bourgogne-Franche-Comté' },
  { slug: 'bretagne', name: 'Bretagne' },
  { slug: 'centre-val-de-loire', name: 'Centre-Val de Loire' },
  { slug: 'corse', name: 'Corse' },
  { slug: 'grand-est', name: 'Grand Est' },
  { slug: 'hauts-de-france', name: 'Hauts-de-France' },
  { slug: 'ile-de-france', name: 'Île-de-France' },
  { slug: 'normandie', name: 'Normandie' },
  { slug: 'nouvelle-aquitaine', name: 'Nouvelle-Aquitaine' },
  { slug: 'occitanie', name: 'Occitanie' },
  { slug: 'pays-de-la-loire', name: 'Pays de la Loire' },
  { slug: 'provence-alpes-cote-dazur', name: "Provence-Alpes-Côte d'Azur" },
  // DOM-TOM
  { slug: 'guadeloupe', name: 'Guadeloupe', isDomTom: true },
  { slug: 'martinique', name: 'Martinique', isDomTom: true },
  { slug: 'guyane', name: 'Guyane', isDomTom: true },
  { slug: 'la-reunion', name: 'La Réunion', isDomTom: true },
  { slug: 'mayotte', name: 'Mayotte', isDomTom: true },
  { slug: 'saint-martin', name: 'Saint-Martin', isDomTom: true },
  { slug: 'saint-barthelemy', name: 'Saint-Barthélemy', isDomTom: true },
  { slug: 'polynesie-francaise', name: 'Polynésie française', isDomTom: true },
  { slug: 'nouvelle-caledonie', name: 'Nouvelle-Calédonie', isDomTom: true },
];

export function getRegionBySlug(slug: string) {
  return geoRegions.find((r) => r.slug === slug) ?? null;
}
