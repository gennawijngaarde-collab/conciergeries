export type AirbnbToolCategorySlug =
  | 'channel-manager'
  | 'pms'
  | 'pricing-dynamique'
  | 'serrures-connectees'
  | 'check-in-automatique'
  | 'menage'
  | 'messagerie'
  | 'comptabilite'
  | 'assurance'
  | 'analyse-marche'
  | 'site-web'
  | 'photos'
  | 'automatisation'
  | 'formation';

export type AirbnbToolCategory = {
  slug: AirbnbToolCategorySlug;
  name: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  icon: string;
};

export type AirbnbToolFaq = { question: string; answer: string };

export type AirbnbTool = {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  logo: string;
  image: string;
  note: number;
  priceLabel: string;
  priceFrom?: number;
  currency?: string;
  site: string;
  lienAffiliation: string;
  liensAffiliation?: { label: string; url: string }[];
  fonctionnalites: string[];
  avantages: string[];
  inconvenients: string[];
  badges?: string[];
  seoTitle: string;
  seoDescription: string;
  faq: AirbnbToolFaq[];
  category: AirbnbToolCategorySlug;
  featured?: boolean;
  freeTrial?: boolean;
  mobileApp?: boolean;
  syncAirbnb?: boolean;
  syncBooking?: boolean;
  automation?: boolean;
  support?: string;
  api?: boolean;
  payments?: boolean;
  relatedBlogSlugs?: string[];
  alternatives?: string[];
};
