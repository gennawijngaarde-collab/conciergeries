/** Plans d’abonnement annuaire + PMS Cleanbnb */

export type SubscriptionPlanId = 'standard' | 'premium' | 'pms';

export const subscriptionPlans = {
  trialDays: 30,
  currency: 'EUR',
  standard: {
    id: 'standard' as const,
    label: 'Standard',
    priceMonthly: 11.99,
    priceLabel: '11,99€',
    description: 'Présence dans l’annuaire avec fiche complète.',
    includesDirectory: true,
    includesPms: false,
    features: [
      'Fiche conciergerie (logo, description, services, plateformes)',
      'Coordonnées (téléphone, email, site web, adresse)',
      'Apparition dans la recherche et la carte',
      'Badge Standard',
      'Espace partenaire',
    ],
  },
  premium: {
    id: 'premium' as const,
    label: 'Premium',
    priceMonthly: 29.99,
    priceLabel: '29,99€',
    description: 'Mise en avant annuaire + accès Cleanbnb PMS inclus.',
    includesDirectory: true,
    includesPms: true,
    features: [
      'Tout le Standard',
      'Badge Premium + priorisation dans l’annuaire',
      'Bloc Conciergeries Premium (si activé)',
      'Cleanbnb PMS inclus (propriétés, calendrier, ménages)',
      'Onboarding PMS + espace opérations',
    ],
  },
  pms: {
    id: 'pms' as const,
    label: 'Cleanbnb PMS',
    priceMonthly: 19.99,
    priceLabel: '19,99€',
    description: 'Abonnement PMS seul (sans fiche annuaire Premium).',
    includesDirectory: false,
    includesPms: true,
    features: [
      'Accès Cleanbnb PMS (dashboard, propriétés, ménages)',
      'Calendrier & planning turnovers',
      'Onboarding guidé',
      'Sans mise en avant annuaire (ajoutez Premium pour le bundle)',
    ],
  },
} as const;

export function planIncludesPms(plan: string | null | undefined): boolean {
  const p = String(plan ?? '').toLowerCase();
  return p === 'premium' || p === 'pms';
}

export function formatPlanPrice(planId: SubscriptionPlanId): string {
  const plan = subscriptionPlans[planId];
  return `${plan.priceLabel} / mois`;
}

export const siteConfig = {
  productHunt: {
    url: 'https://www.producthunt.com/@genna_wijngaarde',
    label: 'Référencé sur Product Hunt',
  },
  adSense: {
    client: 'ca-pub-9936231227383684',
    slot: '5627212251',
    format: 'auto',
  },
  guesty: {
    referralUrl: 'https://join.guesty.com/hcwnx9j6z9r1',
    label: 'Guesty',
    ctaLabel: 'Découvrir Guesty',
    ctaSecondary: 'Essayer Guesty',
  },
  airdna: {
    referralUrl: 'https://eur-invite.airdna.co/Gennarro-Wijngaarde',
    pricingUrl: 'https://www.airdna.co/pricing',
    label: 'AirDNA',
    ctaLabel: 'Essayer AirDNA gratuitement',
    ctaSecondary: 'Tester AirDNA maintenant',
    ctaTertiary: 'Commencer votre analyse Airbnb',
  },
  cleanbnb: {
    label: 'Cleanbnb',
    ctaLabel: 'Découvrir Cleanbnb',
    demoUrl: '/pms/onboarding',
    appUrl: '/pms',
    description: 'PMS pour automatiser le planning ménage Airbnb des conciergeries',
  },
  subscriptions: subscriptionPlans,
} as const;
