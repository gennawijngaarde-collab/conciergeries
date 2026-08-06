import type { SeoService } from '@/seo/types';

/**
 * Services Airbnb × ville → /{urlSegment}-airbnb-{ville}
 * Ajouter un service ici génère toutes les pages ville associées.
 */
export const seoServices: SeoService[] = [
  {
    slug: 'menage',
    urlSegment: 'menage',
    name: 'Ménage Airbnb',
    description: 'Ménage professionnel entre deux séjours, linge et check-list hôtelière.',
    keywords: ['ménage', 'turnover', 'linge'],
  },
  {
    slug: 'check-in',
    urlSegment: 'check-in',
    name: 'Check-in Airbnb',
    description: 'Accueil voyageurs, remise des clés et check-in autonome.',
    keywords: ['check-in', 'accueil', 'clés'],
  },
  {
    slug: 'photographe',
    urlSegment: 'photographe',
    name: 'Photographe Airbnb',
    description: 'Photos professionnelles pour maximiser le taux de clic de votre annonce.',
    keywords: ['photos', 'annonce', 'shooting'],
  },
  {
    slug: 'gestion-location-saisonniere',
    urlSegment: 'gestion-location-saisonniere',
    name: 'Gestion location saisonnière',
    description: 'Gestion complète : annonces, réservations, voyageurs et optimisation des revenus.',
    keywords: ['gestion', 'conciergerie', 'revenus'],
  },
  {
    slug: 'pricing',
    urlSegment: 'pricing',
    name: 'Tarification dynamique',
    description: 'Optimisation des prix nuitée selon la demande locale.',
    keywords: ['prix', 'pricing', 'revenus'],
  },
  {
    slug: 'blanchisserie',
    urlSegment: 'blanchisserie',
    name: 'Blanchisserie Airbnb',
    description: 'Linge de maison hôtelier, stock et rotation.',
    keywords: ['linge', 'blanchisserie'],
  },
];

export function getServiceByUrlSegment(segment: string) {
  return seoServices.find((s) => s.urlSegment === segment) ?? null;
}
