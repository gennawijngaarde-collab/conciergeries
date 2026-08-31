export type HubAffiliateCategory =
  | 'creation-entreprise'
  | 'banque-professionnelle'
  | 'assurance'
  | 'comptabilite'
  | 'facturation'
  | 'pms-logiciels'
  | 'financement'
  | 'marketing';

export type AffiliatePartner = {
  id: string;
  name: string;
  slug: string;
  category: HubAffiliateCategory;
  /** Short neutral description (no invented claims). */
  description: string;
  /** Optional known pricing string only if verified (otherwise omit). */
  pricing?: string;
  features?: string[];
  pros?: string[];
  cons?: string[];
  /** URL shown to users (non-affiliate allowed). */
  websiteUrl?: string;
  /** Affiliate URL if available (must be real + verified). */
  affiliateUrl?: string;
  /** When true, UI will show the affiliation disclosure near CTA. */
  isAffiliate?: boolean;
  /** Optional logo in /public. */
  logoSrc?: string;
  /** Notes for maintainers (sources, last check). */
  sourceNotes?: string;
  updatedAt?: string; // yyyy-mm-dd
};

/**
 * Partenaires du hub (banque, assurance, compta...). Intentionnellement vide au départ:
 * on n’ajoute des partenaires que lorsqu’on dispose d’infos vérifiées (tarifs, conditions, programme).
 */
export const hubPartners: AffiliatePartner[] = [
  {
    id: 'qonto',
    name: 'Qonto',
    slug: 'qonto',
    category: 'banque-professionnelle',
    description:
      "Compte pro orienté TPE/PME avec outils de gestion. À comparer selon vos besoins (cartes équipe, exports, intégrations).",
    websiteUrl: 'https://qonto.com',
    logoSrc: '/images/partners/qonto.svg',
    isAffiliate: false,
    sourceNotes: 'Site officiel (à vérifier pour tarifs/conditions selon pays).',
    updatedAt: '2026-08-31',
  },
  {
    id: 'shine',
    name: 'Shine',
    slug: 'shine',
    category: 'banque-professionnelle',
    description:
      "Solution compte pro pensée pour indépendants. Utile à comparer si vous démarrez (simplicité, app).",
    websiteUrl: 'https://www.shine.fr',
    logoSrc: '/images/partners/shine.svg',
    isAffiliate: false,
    sourceNotes: 'Site officiel (à vérifier pour tarifs/conditions).',
    updatedAt: '2026-08-31',
  },
  {
    id: 'revolut-business',
    name: 'Revolut Business',
    slug: 'revolut-business',
    category: 'banque-professionnelle',
    description:
      "Compte business avec focus international. À comparer si vous encaissez en multi-devises ou avez des flux internationaux.",
    websiteUrl: 'https://www.revolut.com/business/',
    logoSrc: '/images/partners/revolut-business.svg',
    isAffiliate: false,
    sourceNotes: 'Site officiel (fonctionnalités/tarifs variables selon offre).',
    updatedAt: '2026-08-31',
  },
  {
    id: 'hello-bank-pro',
    name: 'Hello bank! Pro',
    slug: 'hello-bank-pro',
    category: 'banque-professionnelle',
    description:
      "Offre pro d’une banque grand public. À comparer si vous privilégiez une banque traditionnelle et un réseau.",
    websiteUrl: 'https://www.hellobank.fr',
    logoSrc: '/images/partners/hello-bank-pro.svg',
    isAffiliate: false,
    sourceNotes: 'Site officiel (à vérifier l’offre “pro” disponible).',
    updatedAt: '2026-08-31',
  },
  {
    id: 'bnp-paribas-pro',
    name: 'BNP Paribas (Pro)',
    slug: 'bnp-paribas-pro',
    category: 'banque-professionnelle',
    description:
      "Banque traditionnelle. À comparer si vous valorisez un accompagnement, des services pro “classiques” et un réseau d’agences.",
    websiteUrl: 'https://mabanque.bnpparibas/',
    logoSrc: '/images/partners/bnp-paribas-pro.svg',
    isAffiliate: false,
    sourceNotes: 'Point d’entrée officiel (navigation vers offres professionnelles).',
    updatedAt: '2026-08-31',
  },
  {
    id: 'societe-generale-pro',
    name: 'Société Générale (Pro)',
    slug: 'societe-generale-pro',
    category: 'banque-professionnelle',
    description:
      "Banque traditionnelle. À comparer si vous cherchez une relation bancaire + des services entreprises.",
    websiteUrl: 'https://www.societegenerale.fr',
    logoSrc: '/images/partners/societe-generale-pro.svg',
    isAffiliate: false,
    sourceNotes: 'Site officiel (section pro/entreprises à vérifier).',
    updatedAt: '2026-08-31',
  },
  {
    id: 'credit-agricole-pro',
    name: 'Crédit Agricole (Pro)',
    slug: 'credit-agricole-pro',
    category: 'banque-professionnelle',
    description:
      "Banque mutualiste. À comparer si vous privilégiez une présence locale et des services pro (selon caisse régionale).",
    websiteUrl: 'https://www.credit-agricole.fr',
    logoSrc: '/images/partners/credit-agricole-pro.svg',
    isAffiliate: false,
    sourceNotes: 'Site officiel (offres pro varient selon région).',
    updatedAt: '2026-08-31',
  },
  {
    id: 'credit-mutuel-pro',
    name: 'Crédit Mutuel (Pro)',
    slug: 'credit-mutuel-pro',
    category: 'banque-professionnelle',
    description:
      "Banque mutualiste. À comparer si vous voulez une banque traditionnelle avec accompagnement local.",
    websiteUrl: 'https://www.creditmutuel.fr',
    isAffiliate: false,
    sourceNotes: 'Site officiel (section pro).',
    updatedAt: '2026-08-31',
  },
  {
    id: 'cic-pro',
    name: 'CIC (Pro)',
    slug: 'cic-pro',
    category: 'banque-professionnelle',
    description:
      "Banque traditionnelle. À comparer pour une approche “pro” avec réseau et services entreprises.",
    websiteUrl: 'https://www.cic.fr',
    isAffiliate: false,
    sourceNotes: 'Site officiel (section pro).',
    updatedAt: '2026-08-31',
  },
  {
    id: 'caisse-epargne-pro',
    name: "Caisse d'Épargne (Pro)",
    slug: 'caisse-epargne-pro',
    category: 'banque-professionnelle',
    description:
      "Banque traditionnelle/mutualiste. À comparer si vous cherchez une banque de réseau (offres selon caisse).",
    websiteUrl: 'https://www.caisse-epargne.fr',
    isAffiliate: false,
    sourceNotes: 'Site officiel (offres pro varient selon région).',
    updatedAt: '2026-08-31',
  },
  {
    id: 'banque-populaire-pro',
    name: 'Banque Populaire (Pro)',
    slug: 'banque-populaire-pro',
    category: 'banque-professionnelle',
    description:
      "Banque de réseau. À comparer si vous privilégiez une relation locale et des services pro (selon région).",
    websiteUrl: 'https://www.banquepopulaire.fr',
    isAffiliate: false,
    sourceNotes: 'Site officiel (offres pro varient selon région).',
    updatedAt: '2026-08-31',
  },
];

export function getPartnersByCategory(category: HubAffiliateCategory) {
  return hubPartners.filter((p) => p.category === category);
}

