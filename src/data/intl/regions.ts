import type { Region } from '@/types/intl';

/**
 * Seed minimal régions/états/provinces pour Phase 1.
 * (Extensible + remplaçable par Supabase ensuite.)
 */
export const regions: Region[] = [
  // France
  { country_slug: 'france', name: 'Île-de-France', slug: 'ile-de-france', active: true },
  { country_slug: 'france', name: "Provence-Alpes-Côte d'Azur", slug: 'provence-alpes-cote-d-azur', active: true },

  // Belgique
  { country_slug: 'belgique', name: 'Bruxelles-Capitale', slug: 'bruxelles', active: true },

  // Suisse
  { country_slug: 'suisse', name: 'Genève', slug: 'geneve', active: true },

  // Canada
  { country_slug: 'canada', name: 'Québec', slug: 'quebec', active: true },
];

export function getRegionsByCountry(countrySlug: string) {
  return regions.filter((r) => r.country_slug === countrySlug && r.active);
}

export function getRegion(countrySlug: string, regionSlug: string) {
  return regions.find((r) => r.country_slug === countrySlug && r.slug === regionSlug) ?? null;
}

