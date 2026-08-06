/**
 * Types du moteur SEO programmatique.
 * Toute page SEO est une SeoPageDefinition résolue depuis les données (jamais codée en dur).
 */

export type SeoPageType =
  | 'conciergerie-ville'
  | 'service-ville'
  | 'ville'
  | 'departement'
  | 'region'
  | 'dom-tom'
  | 'pays'
  | 'guide'
  | 'comparatif'
  | 'top';

export type SeoFaqItem = { question: string; answer: string };

export type SeoBreadcrumbItem = { name: string; path: string };

export type SeoJsonLdKind =
  | 'breadcrumb'
  | 'faq'
  | 'localBusiness'
  | 'article'
  | 'softwareApplication'
  | 'review'
  | 'itemList';

export type SeoPageDefinition = {
  /** Chemin absolu sans domaine, ex: /conciergerie-paris */
  path: string;
  type: SeoPageType;
  title: string;
  description: string;
  h1: string;
  intro: string;
  breadcrumbs: SeoBreadcrumbItem[];
  faqs: SeoFaqItem[];
  /** Contexte libre pour le template */
  context: Record<string, unknown>;
  priority?: number;
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
};

export type GeoCity = {
  slug: string;
  name: string;
  departmentCode: string;
  /** slugs de villes voisines pour le maillage */
  nearby?: string[];
  isDomTom?: boolean;
};

export type GeoDepartment = {
  code: string;
  slug: string;
  name: string;
  regionSlug: string;
};

export type GeoRegion = {
  slug: string;
  name: string;
  isDomTom?: boolean;
};

export type GeoCountry = {
  slug: string;
  name: string;
  adjective: string;
};

export type SeoService = {
  slug: string;
  name: string;
  /** Segment URL avant -airbnb-{ville}, ex: menage → /menage-airbnb-paris */
  urlSegment: string;
  description: string;
  keywords: string[];
};

export type GuideTemplate = {
  slugPattern: string; // e.g. "creer-conciergerie-{city}"
  titlePattern: string;
  descriptionPattern: string;
  h1Pattern: string;
  kind: 'city' | 'dom-tom' | 'generic';
};
