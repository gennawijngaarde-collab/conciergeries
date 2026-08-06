import type { GeoCountry } from '@/seo/types';

/** Pays / zones francophones — page /pays-{slug}. */
export const geoCountries: GeoCountry[] = [
  { slug: 'france', name: 'France', adjective: 'français' },
  { slug: 'belgique', name: 'Belgique', adjective: 'belge' },
  { slug: 'suisse', name: 'Suisse', adjective: 'suisse' },
  { slug: 'luxembourg', name: 'Luxembourg', adjective: 'luxembourgeois' },
  { slug: 'canada', name: 'Canada', adjective: 'canadien' },
  { slug: 'afrique-francophone', name: 'Afrique francophone', adjective: 'africain francophone' },
];

export function getCountryBySlug(slug: string) {
  return geoCountries.find((c) => c.slug === slug) ?? null;
}
