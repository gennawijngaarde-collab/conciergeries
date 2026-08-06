import type { AirbnbToolCategory } from '@/types/airbnbTool';

export const airbnbToolCategories: AirbnbToolCategory[] = [
  {
    slug: 'channel-manager',
    name: 'Channel Managers',
    description: 'Synchronisez Airbnb, Booking et vos autres plateformes sans surbooking.',
    seoTitle: 'Meilleurs Channel Managers Airbnb 2026',
    seoDescription:
      'Comparez les meilleurs channel managers pour location saisonnière : Guesty, Hostaway, Lodgify, Smoobu, Beds24.',
    icon: 'Layers',
  },
  {
    slug: 'pms',
    name: 'PMS',
    description: 'Logiciels de gestion pour hôtes et conciergeries multi-biens.',
    seoTitle: 'Meilleurs PMS location courte durée 2026',
    seoDescription:
      'PMS Airbnb : comparez Guesty, Hostaway, OwnerRez, Lodgify et Cleanbnb pour automatiser votre gestion.',
    icon: 'LayoutDashboard',
  },
  {
    slug: 'pricing-dynamique',
    name: 'Pricing dynamique',
    description: 'Optimisez vos tarifs nuitée selon la demande et la concurrence.',
    seoTitle: 'PriceLabs, Wheelhouse, Beyond Pricing — comparatif 2026',
    seoDescription:
      'Comparez PriceLabs, Wheelhouse et Beyond Pricing pour maximiser vos revenus Airbnb.',
    icon: 'TrendingUp',
  },
  {
    slug: 'serrures-connectees',
    name: 'Serrures connectées',
    description: 'Accès sans clé pour check-in autonome et sécurité.',
    seoTitle: 'Meilleures serrures connectées Airbnb 2026',
    seoDescription: 'Nuki, Yale, Tedee, Igloohome : comparatif des serrures connectées pour locations saisonnières.',
    icon: 'Lock',
  },
  {
    slug: 'check-in-automatique',
    name: 'Check-in automatique',
    description: 'Automatisez l’accueil voyageurs et les codes d’accès.',
    seoTitle: 'Check-in automatique Airbnb — outils 2026',
    seoDescription: 'Solutions de check-in automatique pour Airbnb : serrures, guides voyageurs et automatisations.',
    icon: 'KeyRound',
  },
  {
    slug: 'menage',
    name: 'Ménage & turnovers',
    description: 'Planifiez ménages, linge et équipes de cleaning.',
    seoTitle: 'Outils ménage Airbnb — Turno et alternatives',
    seoDescription: 'Organisez vos turnovers Airbnb avec Turno et les meilleurs outils de planning ménage.',
    icon: 'Sparkles',
  },
  {
    slug: 'messagerie',
    name: 'Messagerie',
    description: 'Réponses automatiques et inbox unifiée multi-canaux.',
    seoTitle: 'Messagerie Airbnb automatisée 2026',
    seoDescription: 'Hospitable, Host Tools et outils de messagerie pour répondre plus vite aux voyageurs.',
    icon: 'MessageSquare',
  },
  {
    slug: 'comptabilite',
    name: 'Comptabilité & paiements',
    description: 'Encaissements, dépôts, facturation et suivi des revenus.',
    seoTitle: 'Paiements et comptabilité location saisonnière',
    seoDescription: 'GuestyPay, Stripe, Swikly : outils de paiement et caution pour hôtes Airbnb.',
    icon: 'Wallet',
  },
  {
    slug: 'assurance',
    name: 'Assurance',
    description: 'Protégez vos biens et couvrez les risques locatifs.',
    seoTitle: 'Assurance Airbnb et caution voyageur',
    seoDescription: 'Superhog et solutions d’assurance / caution pour sécuriser vos locations courte durée.',
    icon: 'Shield',
  },
  {
    slug: 'analyse-marche',
    name: 'Analyse de marché',
    description: 'Estimez revenus, occupation et rentabilité avant d’investir.',
    seoTitle: 'AirDNA et outils d’analyse marché Airbnb',
    seoDescription: 'Analysez un marché Airbnb avec AirDNA : occupation, ADR, RevPAR et estimation de revenus.',
    icon: 'BarChart3',
  },
  {
    slug: 'site-web',
    name: 'Site web & booking',
    description: 'Site direct pour réduire les commissions OTA.',
    seoTitle: 'Créer un site de réservation directe Airbnb',
    seoDescription: 'Lodgify et outils pour créer un site web de location saisonnière avec réservation directe.',
    icon: 'Globe',
  },
  {
    slug: 'photos',
    name: 'Photos & design',
    description: 'Visuels professionnels pour booster vos annonces.',
    seoTitle: 'Photos et design d’annonces Airbnb',
    seoDescription: 'Canva et bonnes pratiques pour des annonces Airbnb plus attractives.',
    icon: 'Camera',
  },
  {
    slug: 'automatisation',
    name: 'Automatisation',
    description: 'Connectez vos apps et automatisez les workflows.',
    seoTitle: 'Zapier, Make, ChatGPT pour automatiser Airbnb',
    seoDescription: 'Automatisez votre activité location courte durée avec Zapier, Make et ChatGPT.',
    icon: 'Workflow',
  },
  {
    slug: 'formation',
    name: 'Formation',
    description: 'Apprenez à structurer et scaler une activité Airbnb / conciergerie.',
    seoTitle: 'Formations Airbnb et conciergerie',
    seoDescription: 'Formations et ressources pour créer une activité rentable en location courte durée.',
    icon: 'GraduationCap',
  },
];

export function getCategoryBySlug(slug: string) {
  return airbnbToolCategories.find((c) => c.slug === slug) ?? null;
}
