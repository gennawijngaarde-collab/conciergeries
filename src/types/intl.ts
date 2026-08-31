export type LanguageCode = 'fr' | 'en' | 'es' | 'pt' | 'it';

export type CountryCode =
  | 'FR'
  | 'BE'
  | 'CH'
  | 'CA'
  | 'ES'
  | 'PT'
  | 'IT'
  | 'GB'
  | 'US'
  | 'AF';

export type CurrencyCode = 'EUR' | 'USD' | 'CAD' | 'CHF' | 'GBP';

export type Country = {
  id?: string;
  name: string;
  slug: string; // france, belgique...
  code: CountryCode;
  language: LanguageCode;
  currency: CurrencyCode;
  active: boolean;
  seo_title?: string;
  seo_description?: string;
};

export type Region = {
  id?: string;
  country_slug: string;
  name: string;
  slug: string;
  active: boolean;
  seo_title?: string;
  seo_description?: string;
};

export type City = {
  id?: string;
  country_slug: string;
  region_slug: string;
  name: string;
  slug: string;
  active: boolean;
  latitude?: number | null;
  longitude?: number | null;
};

export type BusinessCategory = {
  id?: string;
  name: string;
  slug: string;
  active: boolean;
  seo_title?: string;
  seo_description?: string;
};

export type Business = {
  id?: string;
  country_slug: string;
  region_slug: string;
  city_slug: string;
  category_slug: string;
  name: string;
  slug: string;
  description: string;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  logo?: string | null;
  cover_image?: string | null;
  services?: string[];
  languages?: LanguageCode[];
  verified?: boolean;
  premium?: boolean;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

