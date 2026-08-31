import type { Country } from '@/types/intl';

/**
 * Marchés internationaux (activation progressive).
 * IMPORTANT: n'activez pas un pays tant que les pages ont du contenu réel.
 */
export const countries: Country[] = [
  {
    name: 'France',
    slug: 'france',
    code: 'FR',
    language: 'fr',
    currency: 'EUR',
    active: true,
    seo_title: 'Annuaire conciergeries Airbnb en France',
    seo_description:
      'Trouvez une conciergerie Airbnb en France : gestion locative courte durée, ménage, check-in et services propriétaires.',
  },
  {
    name: 'Belgique',
    slug: 'belgique',
    code: 'BE',
    language: 'fr',
    currency: 'EUR',
    active: true,
    seo_title: 'Annuaire conciergeries Airbnb en Belgique',
    seo_description:
      'Conciergeries Airbnb en Belgique : gestion, ménage, accueil voyageurs et services de property management.',
  },
  {
    name: 'Suisse',
    slug: 'suisse',
    code: 'CH',
    language: 'fr',
    currency: 'CHF',
    active: true,
    seo_title: 'Annuaire conciergeries Airbnb en Suisse',
    seo_description:
      'Conciergeries Airbnb en Suisse : gestion locative courte durée, services hôtes et propriétaires.',
  },
  {
    name: 'Canada',
    slug: 'canada',
    code: 'CA',
    language: 'fr',
    currency: 'CAD',
    active: true,
    seo_title: 'Annuaire conciergeries & property managers au Canada',
    seo_description:
      'Trouvez des property managers et conciergeries pour Airbnb au Canada : Montréal, Québec et grandes villes.',
  },
  {
    name: 'Espagne',
    slug: 'espagne',
    code: 'ES',
    language: 'es',
    currency: 'EUR',
    active: false,
  },
  {
    name: 'Portugal',
    slug: 'portugal',
    code: 'PT',
    language: 'pt',
    currency: 'EUR',
    active: false,
  },
  {
    name: 'Italie',
    slug: 'italie',
    code: 'IT',
    language: 'it',
    currency: 'EUR',
    active: false,
  },
  {
    name: 'Royaume-Uni',
    slug: 'royaume-uni',
    code: 'GB',
    language: 'en',
    currency: 'GBP',
    active: false,
  },
  {
    name: 'USA',
    slug: 'usa',
    code: 'US',
    language: 'en',
    currency: 'USD',
    active: false,
  },
  {
    name: 'Afrique',
    slug: 'afrique',
    code: 'AF',
    language: 'fr',
    currency: 'EUR',
    active: false,
  },
];

export function getCountryBySlug(slug: string) {
  return countries.find((c) => c.slug === slug) ?? null;
}

export function getActiveCountries() {
  return countries.filter((c) => c.active);
}

