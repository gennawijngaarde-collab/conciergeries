import type { City } from '@/types/intl';

/**
 * Seed minimal villes pour Phase 1.
 * NOTE: on ne publie pas (indexation) sans entreprises => géré plus tard par règle thin content.
 */
export const cities: City[] = [
  // France
  { country_slug: 'france', region_slug: 'ile-de-france', name: 'Paris', slug: 'paris', active: true },
  {
    country_slug: 'france',
    region_slug: 'provence-alpes-cote-d-azur',
    name: 'Nice',
    slug: 'nice',
    active: true,
  },

  // Belgique
  { country_slug: 'belgique', region_slug: 'bruxelles', name: 'Bruxelles', slug: 'bruxelles', active: true },

  // Suisse
  { country_slug: 'suisse', region_slug: 'geneve', name: 'Genève', slug: 'geneve', active: true },

  // Canada
  { country_slug: 'canada', region_slug: 'quebec', name: 'Montréal', slug: 'montreal', active: true },
];

export function getCitiesByRegion(countrySlug: string, regionSlug: string) {
  return cities.filter((c) => c.country_slug === countrySlug && c.region_slug === regionSlug && c.active);
}

export function getCity(countrySlug: string, regionSlug: string, citySlug: string) {
  return (
    cities.find(
      (c) => c.country_slug === countrySlug && c.region_slug === regionSlug && c.slug === citySlug && c.active
    ) ?? null
  );
}

