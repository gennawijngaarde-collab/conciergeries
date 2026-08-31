import type { SeoBreadcrumbItem, SeoFaqItem, SeoPageType } from '@/seo/types';
import type { HubAffiliateCategory } from '@/data/hub/partners';

export type HubCta = { label: string; href: string };

export type HubContentSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type HubComparisonTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type HubPageDefinition = {
  /** Route path relative to /hub (no leading slash). Empty string = index. */
  route: string;
  /** Canonical path (absolute, no trailing slash) */
  path: string;
  type: SeoPageType;
  indexable: boolean;
  title: string;
  description: string;
  h1: string;
  /** Optional short intro shown in hero. Falls back to description. */
  intro?: string;
  /** Primary keyword + variants for editorial guidance */
  primaryKeyword: string;
  variants?: string[];
  intent: string;
  funnel: 'TOFU' | 'MOFU' | 'BOFU' | 'Mixte';
  cluster: string;
  parent?: { name: string; path: string };
  ctaPrimary: HubCta;
  ctaSecondary?: HubCta;
  affiliateDisclosure?: boolean;
  legalDisclaimer?: boolean;
  updatedAt?: string;
  sections: HubContentSection[];
  faqs?: SeoFaqItem[];
  comparisonTable?: HubComparisonTable;
  partnerCategory?: HubAffiliateCategory;
};

function crumbs(base: { name: string; path: string }, parent: HubPageDefinition['parent'] | undefined, current: HubPageDefinition) {
  const items: SeoBreadcrumbItem[] = [{ name: 'Accueil', path: '/' }, base];
  if (parent) items.push(parent);
  items.push({ name: current.h1, path: current.path });
  // Deduplicate consecutive items that may match (eg. base == parent)
  return items.filter((it, idx) => idx === 0 || it.path !== items[idx - 1]?.path);
}

export const HUB_BASE = { name: 'Hub', path: '/hub' } as const;

export function getHubBreadcrumbs(page: HubPageDefinition) {
  return crumbs(HUB_BASE, page.parent, page);
}

export const hubPages: HubPageDefinition[] = [
  // Cluster landings
  {
    route: 'creation-entreprise',
    path: '/hub/creation-entreprise',
    type: 'guide',
    indexable: true,
    title: "Créer une conciergerie Airbnb : création d’entreprise (2026)",
    description:
      "De l’idée aux premiers mandats: modèle économique, statut, process, outils et acquisition. Une approche pragmatique (sans promesses irréalistes).",
    h1: "Création d’entreprise : lancer une conciergerie",
    primaryKeyword: 'créer une conciergerie airbnb',
    variants: ['création entreprise conciergerie', 'lancer conciergerie', 'ouvrir conciergerie airbnb'],
    intent: 'Répondre aux questions de démarrage et orienter vers les étapes concrètes.',
    funnel: 'TOFU',
    cluster: 'Création d’entreprise',
    parent: HUB_BASE,
    ctaPrimary: { label: 'Simuler la rentabilité', href: '/hub/simulateur-rentabilite' },
    ctaSecondary: { label: 'Trouver une conciergerie (annuaire)', href: '/conciergeries' },
    affiliateDisclosure: false,
    legalDisclaimer: true,
    updatedAt: '2026-08-31',
    sections: [
      {
        title: 'Le bon angle (pour éviter de se tromper de “métier”)',
        paragraphs: [
          "Une conciergerie n’est pas “un site Airbnb”: c’est une activité de services (opérations + expérience voyageurs) où la qualité d’exécution crée la réputation — puis la croissance.",
          "Le Hub se concentre sur la création et la structuration (finance, juridique, outils, acquisition), sans dupliquer les guides locaux déjà présents sur le site.",
        ],
      },
      {
        title: 'Par où commencer',
        bullets: [
          'Choisir un modèle: gestion complète vs services à la carte.',
          'Définir une offre + pricing (commission, forfaits, options).',
          'Documenter process (ménage, check-in, incidents) avant le marketing.',
          'Sélectionner une stack minimale (outils, messagerie, sync calendrier).',
          'Trouver les premiers mandats (réseau, partenariats, contenu local).',
        ],
      },
      {
        title: 'Pages à consulter en priorité',
        bullets: [
          'Créer une conciergerie Airbnb: /hub/creation-entreprise/creer-conciergerie-airbnb',
          'Coûts de création: /hub/creation-entreprise/cout-creation-conciergerie',
          'Business plan: /hub/creation-entreprise/business-plan-conciergerie',
          'Étude de marché: /hub/creation-entreprise/etude-marche-conciergerie',
        ],
      },
    ],
  },
  {
    route: 'statut-juridique',
    path: '/hub/statut-juridique',
    type: 'guide',
    indexable: true,
    title: 'Statut juridique conciergerie : micro, SASU, EURL… (2026)',
    description:
      'Comprendre les options de statuts pour une conciergerie: implications (TVA, charges, compta), profils types, et critères de choix.',
    h1: 'Statut juridique : choisir le bon cadre',
    primaryKeyword: 'statut juridique conciergerie',
    variants: ['micro-entreprise conciergerie', 'SASU conciergerie', 'EURL conciergerie', 'micro vs SASU conciergerie'],
    intent: 'Aider à comparer les statuts sans donner de conseil juridique personnalisé.',
    funnel: 'MOFU',
    cluster: 'Statut juridique',
    parent: HUB_BASE,
    ctaPrimary: { label: 'Comparer micro vs SASU', href: '/hub/statut-juridique/micro-entreprise-vs-sasu-conciergerie' },
    ctaSecondary: { label: 'Simuler la rentabilité', href: '/hub/simulateur-rentabilite' },
    legalDisclaimer: true,
    sections: [
      {
        title: 'Comment décider sans se perdre',
        paragraphs: [
          "Le bon statut dépend du volume, de votre situation, de votre projet (solo, associés), et des besoins (investissements, embauche).",
          "L’objectif ici est de vous donner une méthode et une grille de lecture — pas un conseil fiscal/juridique définitif.",
        ],
      },
      {
        title: 'Questions à vous poser',
        bullets: [
          'Votre CA cible à 12–24 mois (réaliste, pas “optimiste”).',
          'Souhaitez-vous récupérer la TVA ?',
          'Votre tolérance à la comptabilité / formalités.',
          'Besoin d’investir (véhicule, stockage, équipe).',
          'Besoin de crédibilité bancaire/partenaires.',
        ],
      },
    ],
  },
  {
    route: 'financement',
    path: '/hub/financement',
    type: 'guide',
    indexable: true,
    title: 'Financer une conciergerie : options, dossiers, aides (2026)',
    description:
      "Panorama des solutions de financement (sans promesses): prêt, microcrédit, aides, et surtout comment construire un dossier crédible.",
    h1: 'Financement : construire un dossier solide',
    primaryKeyword: 'financer une conciergerie',
    variants: ['prêt création conciergerie', 'microcrédit conciergerie', 'financement sans apport conciergerie'],
    intent: "Répondre à l’intention “comment financer” et cadrer les attentes.",
    funnel: 'MOFU',
    cluster: 'Financement',
    parent: HUB_BASE,
    ctaPrimary: { label: 'Voir les aides (avec sources)', href: '/hub/financement/aides-creation-entreprise-conciergerie' },
    ctaSecondary: { label: 'Simuler la rentabilité', href: '/hub/simulateur-rentabilite' },
    legalDisclaimer: true,
    sections: [
      {
        title: 'Ce que les financeurs veulent voir',
        bullets: [
          'Une offre claire + une preuve de demande (marché local).',
          'Une capacité d’exécution (process opérationnels).',
          'Un budget réaliste (outils, assurance, compta, pub).',
          'Des hypothèses prudentes (pas de promesses de CA).',
        ],
      },
      {
        title: 'Pages à consulter',
        bullets: [
          'Financer une conciergerie: /hub/financement/financer-conciergerie',
          'Prêt création: /hub/financement/pret-creation-conciergerie',
          'Microcrédit: /hub/financement/microcredit-conciergerie',
        ],
      },
    ],
  },
  {
    route: 'banque-professionnelle',
    path: '/hub/banque-professionnelle',
    type: 'guide',
    indexable: true,
    title: 'Banque professionnelle : compte pro pour conciergerie (2026)',
    description:
      "Choisir un compte pro adapté à une conciergerie: encaissements, carte, multi-utilisateurs, exports compta, et critères de comparaison.",
    h1: 'Banque professionnelle : choisir un compte pro',
    primaryKeyword: 'banque pro conciergerie',
    variants: ['compte pro micro-entreprise', 'compte pro SASU', 'comparatif banque pro'],
    intent: 'Aider à comparer les comptes pro (forte intention commerciale).',
    funnel: 'BOFU',
    cluster: 'Banque pro',
    parent: HUB_BASE,
    ctaPrimary: { label: 'Comparatif banque pro', href: '/hub/banque-professionnelle/comparatif-banque-pro' },
    ctaSecondary: { label: 'Simuler la rentabilité', href: '/hub/simulateur-rentabilite' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    partnerCategory: 'banque-professionnelle',
    sections: [
      {
        title: 'Ce qui compte vraiment pour une conciergerie',
        bullets: [
          'Encaissements (virements, cartes) + intégrations/exports.',
          'Sous-comptes / cartes équipe si vous déléguez.',
          'Catégorisation + exports pour la compta.',
          'Support réactif (incidents carte, plafonds).',
        ],
      },
      {
        title: 'Checklist de comparaison (sans se faire piéger)',
        bullets: [
          'Frais visibles (mensuel + opérations).',
          'Encaissements (virements, dépôts, CB) + délais.',
          'Exports compta (CSV, intégrations) + catégorisation.',
          'Cartes supplémentaires / droits d’accès si équipe.',
          'Support: horaires, canaux, qualité perçue (tests).',
          'Conditions: plafonds, justificatifs, restrictions.',
        ],
      },
      {
        title: 'Pour quel profil ?',
        bullets: [
          'Débutant (1–5 logements): simplicité + exports compta.',
          'Croissance (5–30): cartes équipe + rôles + reporting.',
          'Multi-canal / international: multi-devises et flux plus complexes.',
        ],
      },
      {
        title: 'À lire ensuite',
        bullets: [
          'Meilleure banque conciergerie: /hub/banque-professionnelle/meilleure-banque-conciergerie',
          'Compte pro micro-entreprise: /hub/banque-professionnelle/compte-pro-micro-entreprise',
          'Compte pro SASU: /hub/banque-professionnelle/compte-pro-sasu',
        ],
      },
    ],
  },
  {
    route: 'assurance',
    path: '/hub/assurance',
    type: 'guide',
    indexable: true,
    title: 'Assurance conciergerie : RC Pro, garanties, comparatif (2026)',
    description:
      "Quelles assurances pour une conciergerie ? RC Pro, protection des clés, dommages, et comment comparer sans se faire piéger.",
    h1: 'Assurance : sécuriser l’activité',
    primaryKeyword: 'assurance conciergerie',
    variants: ['rc pro conciergerie', 'assurance conciergerie airbnb', 'comparatif assurance conciergerie'],
    intent: 'Répondre à des questions MOFU/BOFU avec prudence.',
    funnel: 'Mixte',
    cluster: 'Assurance',
    parent: HUB_BASE,
    ctaPrimary: { label: 'RC Pro conciergerie', href: '/hub/assurance/rc-pro-conciergerie' },
    ctaSecondary: { label: 'Comparer les assurances', href: '/hub/assurance/comparatif-assurance-conciergerie' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    sections: [
      {
        title: 'Pourquoi la RC Pro revient toujours',
        paragraphs: [
          "La conciergerie gère des clés, intervient sur un bien, et peut avoir des dommages/erreurs. La RC Pro est souvent la base du socle, à compléter selon votre modèle.",
        ],
      },
      {
        title: 'Pages à consulter',
        bullets: [
          'RC Pro: /hub/assurance/rc-pro-conciergerie',
          'Assurance conciergerie Airbnb: /hub/assurance/assurance-conciergerie-airbnb',
          'Comparatif: /hub/assurance/comparatif-assurance-conciergerie',
        ],
      },
    ],
  },
  {
    route: 'comptabilite',
    path: '/hub/comptabilite',
    type: 'guide',
    indexable: true,
    title: 'Comptabilité conciergerie : comptable, logiciel, TVA (2026)',
    description:
      'Organisation comptable pour une conciergerie: choix d’un expert-comptable ou d’un logiciel, facturation, TVA, et reporting.',
    h1: 'Comptabilité : structurer, piloter, éviter les erreurs',
    primaryKeyword: 'comptabilité conciergerie',
    variants: ['expert-comptable conciergerie', 'logiciel comptabilité conciergerie', 'TVA conciergerie'],
    intent: 'Répondre aux intentions MOFU/BOFU sans affirmer de règles fixes.',
    funnel: 'Mixte',
    cluster: 'Comptabilité',
    parent: HUB_BASE,
    ctaPrimary: { label: 'TVA conciergerie', href: '/hub/comptabilite/tva-conciergerie' },
    ctaSecondary: { label: 'Simuler la rentabilité', href: '/hub/simulateur-rentabilite' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    sections: [
      {
        title: 'Ce qu’il faut suivre dès le début',
        bullets: [
          'CA et marge par client / logement.',
          'Coûts récurrents (outils, assurance, compta, pub).',
          'Délai d’encaissement et BFR (trésorerie).',
          'Qualité d’exécution (incidents) → impact business.',
        ],
      },
      {
        title: 'Pages à consulter',
        bullets: [
          'Expert-comptable: /hub/comptabilite/comptable-conciergerie',
          'Logiciel compta: /hub/comptabilite/logiciel-comptabilite-conciergerie',
          'Facturation: /hub/comptabilite/facturation-conciergerie',
        ],
      },
    ],
  },
  {
    route: 'facturation',
    path: '/hub/facturation',
    type: 'guide',
    indexable: true,
    title: 'Facturation conciergerie : modèles, TVA, outils (2026)',
    description:
      'Comment facturer une conciergerie: commission, forfaits, options, documents, et outils pour gagner du temps.',
    h1: 'Facturation : modèles simples et solides',
    primaryKeyword: 'facturation conciergerie',
    variants: ['facture conciergerie', 'commission conciergerie', 'logiciel facturation conciergerie'],
    intent: 'Répondre aux intentions MOFU et orienter vers compta/TVA.',
    funnel: 'MOFU',
    cluster: 'Facturation',
    parent: HUB_BASE,
    ctaPrimary: { label: 'Voir la page compta', href: '/hub/comptabilite' },
    ctaSecondary: { label: 'Simuler la rentabilité', href: '/hub/simulateur-rentabilite' },
    legalDisclaimer: true,
    sections: [
      {
        title: 'Les 3 modèles les plus fréquents',
        bullets: [
          'Commission sur revenus locatifs (ex: %).',
          'Forfait mensuel par logement (prévisible).',
          'Services à la carte (ménage, check-in, consommables).',
        ],
      },
      {
        title: 'À lire ensuite',
        bullets: [
          'Facturation conciergerie (détails): /hub/comptabilite/facturation-conciergerie',
          'TVA: /hub/comptabilite/tva-conciergerie',
        ],
      },
    ],
  },
  {
    route: 'aides-creation-entreprise',
    path: '/hub/aides-creation-entreprise',
    type: 'guide',
    indexable: true,
    title: 'Aides création entreprise conciergerie : où chercher (2026)',
    description:
      "Méthode pour identifier des aides (sans inventer): organismes, critères, documents et sources à vérifier.",
    h1: 'Aides : trouver des infos fiables (avec sources)',
    primaryKeyword: 'aides création entreprise conciergerie',
    variants: ['aides création entreprise conciergerie airbnb', 'subvention conciergerie', 'aides entrepreneur'],
    intent: 'Informationnelle avec prudence et liens vers sources officielles.',
    funnel: 'TOFU',
    cluster: 'Aides',
    parent: HUB_BASE,
    ctaPrimary: { label: 'Aides (financement)', href: '/hub/financement/aides-creation-entreprise-conciergerie' },
    ctaSecondary: { label: 'Étude de marché', href: '/hub/creation-entreprise/etude-marche-conciergerie' },
    legalDisclaimer: true,
    sections: [
      {
        title: 'Principe',
        paragraphs: [
          "Les dispositifs évoluent. Cette page doit rester un guide de méthode: où regarder, quoi vérifier, quels documents préparer.",
        ],
      },
      {
        title: 'Checklist',
        bullets: [
          'Identifier votre profil (demandeur d’emploi, étudiant, reconversion…).',
          'Lister besoins (trésorerie, équipement, véhicule, logiciel).',
          'Préparer un mini-dossier (offre, budget, hypothèses).',
          'Vérifier la source et la date de mise à jour.',
        ],
      },
    ],
  },
  {
    route: 'logiciels',
    path: '/hub/logiciels',
    type: 'guide',
    indexable: true,
    title: 'Logiciels conciergerie : PMS, channel manager, facturation (2026)',
    description:
      "Stack recommandée pour une conciergerie: PMS, channel manager, messagerie, pricing, facturation, assurance/garanties.",
    h1: 'Logiciels : construire une stack légère',
    primaryKeyword: 'logiciels conciergerie',
    variants: ['pms conciergerie', 'channel manager conciergerie', 'logiciel gestion conciergerie'],
    intent: 'Aider à choisir des outils selon le stade (1 logement vs multi).',
    funnel: 'MOFU',
    cluster: 'Logiciels',
    parent: HUB_BASE,
    ctaPrimary: { label: 'Marketplace outils', href: '/outils-airbnb' },
    ctaSecondary: { label: 'Guide channel manager', href: '/blog/channel-manager-guide-complet' },
    affiliateDisclosure: true,
    legalDisclaimer: false,
    sections: [
      {
        title: 'Objectif: éviter le surbooking et gagner du temps',
        bullets: [
          'Synchronisation calendrier (Airbnb/Booking/Abritel).',
          'Automatisation messages + checklists.',
          'Visibilité sur les coûts par logement (pilotage).',
        ],
      },
      {
        title: 'Ressources existantes',
        bullets: [
          'Marketplace outils: /outils-airbnb',
          'Comparatifs outils (existant): /comparatif-guesty-vs-hostaway',
          'Guide complet channel manager: /blog/channel-manager-guide-complet',
        ],
      },
    ],
  },
  {
    route: 'simulateur-rentabilite',
    path: '/hub/simulateur-rentabilite',
    type: 'guide',
    indexable: true,
    title: 'Simulateur rentabilité conciergerie : calcul CA, charges, marge (2026)',
    description:
      "Simulez le CA et la marge d’une conciergerie selon vos hypothèses (logements, revenus, commission, charges). Résultats indicatifs.",
    h1: 'Simulateur de rentabilité conciergerie',
    primaryKeyword: 'simulateur rentabilité conciergerie',
    variants: ['calcul rentabilité conciergerie', 'combien rapporte une conciergerie', 'marge conciergerie airbnb'],
    intent: 'Outil + intention MOFU (projection) avec disclaimer.',
    funnel: 'MOFU',
    cluster: 'Simulateur',
    parent: HUB_BASE,
    ctaPrimary: { label: 'Lancer la simulation', href: '/hub/simulateur-rentabilite' },
    ctaSecondary: { label: 'Demander des devis', href: '/devis' },
    legalDisclaimer: true,
    sections: [
      {
        title: 'À propos de ce simulateur',
        paragraphs: [
          "Ce simulateur est indicatif. Il sert à structurer vos hypothèses (revenus, commission, charges) et à tester des scénarios, pas à promettre un résultat.",
        ],
      },
    ],
  },

  // Création d'entreprise — pages
  {
    route: 'creation-entreprise/creer-conciergerie-airbnb',
    path: '/hub/creation-entreprise/creer-conciergerie-airbnb',
    type: 'guide',
    indexable: true,
    title: 'Créer une conciergerie Airbnb : étapes, offre, acquisition (2026)',
    description:
      "Plan d’action pour créer une conciergerie: offre, process, outils, acquisition des premiers propriétaires, et pilotage.",
    h1: 'Créer une conciergerie Airbnb (méthode 2026)',
    primaryKeyword: 'créer une conciergerie airbnb',
    variants: ['ouvrir conciergerie airbnb', 'lancer conciergerie', 'devenir conciergerie airbnb'],
    intent: 'Informationnelle avec étapes concrètes + CTAs utiles.',
    funnel: 'TOFU',
    cluster: 'Création d’entreprise',
    parent: { name: 'Création d’entreprise', path: '/hub/creation-entreprise' },
    ctaPrimary: { label: 'Simuler la rentabilité', href: '/hub/simulateur-rentabilite' },
    ctaSecondary: { label: 'Trouver une conciergerie (référence)', href: '/conciergeries' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    sections: [
      {
        title: 'Étape 1 — Clarifier l’offre',
        bullets: [
          'Gestion complète (recommandé si vous visez la scalabilité).',
          'Services à la carte (ménage / check-in) pour démarrer localement.',
          'Spécialisation (luxe, montagne, famille, centre-ville).',
        ],
      },
      {
        title: 'Étape 2 — Écrire les process',
        bullets: [
          'Checklist ménage + inspection (photos).',
          'Scripts de messages voyageurs + escalation incidents.',
          'Gestion clés / accès (boîte à clés, serrure connectée).',
        ],
      },
      {
        title: 'Étape 3 — Trouver les premiers mandats',
        bullets: [
          'Réseau local (artisans, agents immo, syndics).',
          'Audit gratuit d’annonce + pricing comme “lead magnet”.',
          'Contenu local (guides) pour capter la demande propriétaire.',
        ],
      },
      {
        title: 'Ressources déjà présentes sur le site',
        bullets: [
          'Annuaire conciergeries: /conciergeries',
          'Devis: /devis',
          'Outils: /outils-airbnb',
          'Formation (optionnelle, commercial): /blog/formation-conciergerie-airbnb-livre-numerique',
        ],
      },
    ],
  },
  {
    route: 'creation-entreprise/creer-conciergerie-sans-experience',
    path: '/hub/creation-entreprise/creer-conciergerie-sans-experience',
    type: 'guide',
    indexable: true,
    title: 'Créer une conciergerie sans expérience : plan 30 jours (2026)',
    description:
      "Méthode pour démarrer sans expérience: apprendre l’opérationnel, cadrer l’offre, obtenir les 1ers clients, et éviter les erreurs coûteuses.",
    h1: 'Créer une conciergerie sans expérience',
    primaryKeyword: 'créer une conciergerie sans expérience',
    variants: ['devenir conciergerie sans expérience', 'se lancer conciergerie débutant'],
    intent: 'TOFU “je débute” → plan d’action simple.',
    funnel: 'TOFU',
    cluster: 'Création d’entreprise',
    parent: { name: 'Création d’entreprise', path: '/hub/creation-entreprise' },
    ctaPrimary: { label: 'Voir les coûts', href: '/hub/creation-entreprise/cout-creation-conciergerie' },
    ctaSecondary: { label: 'Étude de marché', href: '/hub/creation-entreprise/etude-marche-conciergerie' },
    legalDisclaimer: true,
    sections: [
      {
        title: 'Ce que vous devez maîtriser en premier',
        bullets: [
          'Ménage et inspection (qualité constante).',
          'Communication voyageurs + gestion incidents.',
          'Organisation terrain (planning, prestataires, clés).',
        ],
      },
      {
        title: 'Plan 30 jours (résumé)',
        bullets: [
          'Semaine 1: comprendre le marché local + offre.',
          'Semaine 2: process + outils minimum.',
          'Semaine 3: prospection + 1ers essais.',
          'Semaine 4: standardiser + contractualiser.',
        ],
      },
    ],
  },
  {
    route: 'creation-entreprise/creer-conciergerie-sans-apport',
    path: '/hub/creation-entreprise/creer-conciergerie-sans-apport',
    type: 'guide',
    indexable: true,
    title: 'Créer une conciergerie sans apport : budget, priorités, options (2026)',
    description:
      "Démarrer avec peu de capital: poste de coûts, priorités, financement possible, et stratégies pour rester léger.",
    h1: 'Créer une conciergerie sans apport',
    primaryKeyword: 'créer une conciergerie sans apport',
    variants: ['financement sans apport conciergerie', 'démarrer conciergerie sans budget'],
    intent: 'MOFU: clarifier budget + options.',
    funnel: 'MOFU',
    cluster: 'Création d’entreprise',
    parent: { name: 'Création d’entreprise', path: '/hub/creation-entreprise' },
    ctaPrimary: { label: 'Financement sans apport', href: '/hub/financement/financement-sans-apport' },
    ctaSecondary: { label: 'Simuler la rentabilité', href: '/hub/simulateur-rentabilite' },
    legalDisclaimer: true,
    sections: [
      {
        title: 'Priorités “low cost”',
        bullets: [
          'Process + checklists (gratuit) avant “les outils”.',
          'Une page vitrine simple + WhatsApp/Email pro.',
          'Partenariats locaux (agents immo, artisans) avant pub.',
        ],
      },
      {
        title: 'Coûts à anticiper',
        bullets: ['Assurance (au minimum RC Pro)', 'Outils (selon volume)', 'Comptabilité', 'Déplacements / consommables'],
      },
    ],
  },
  {
    route: 'creation-entreprise/cout-creation-conciergerie',
    path: '/hub/creation-entreprise/cout-creation-conciergerie',
    type: 'guide',
    indexable: true,
    title: 'Coût création conciergerie : budget, charges, outils (2026)',
    description:
      "Budget de lancement: ce qui est vraiment indispensable, charges récurrentes, et comment éviter d’acheter trop tôt.",
    h1: 'Coût de création d’une conciergerie',
    primaryKeyword: 'coût création conciergerie',
    variants: ['budget conciergerie', 'charges conciergerie', 'coût démarrage conciergerie'],
    intent: 'MOFU: chiffrer et prioriser.',
    funnel: 'MOFU',
    cluster: 'Création d’entreprise',
    parent: { name: 'Création d’entreprise', path: '/hub/creation-entreprise' },
    ctaPrimary: { label: 'Simuler la rentabilité', href: '/hub/simulateur-rentabilite' },
    ctaSecondary: { label: 'Banque pro', href: '/hub/banque-professionnelle' },
    legalDisclaimer: true,
    sections: [
      {
        title: 'Indispensable vs optionnel',
        bullets: [
          'Indispensable: assurance + process + outils de base.',
          'Optionnel au début: stack “enterprise”, pub agressive, équipe.',
        ],
      },
      {
        title: 'Charges récurrentes typiques',
        bullets: ['Assurance', 'Compta', 'Logiciels', 'Déplacements', 'Marketing (progressif)'],
      },
    ],
  },
  {
    route: 'creation-entreprise/business-plan-conciergerie',
    path: '/hub/creation-entreprise/business-plan-conciergerie',
    type: 'guide',
    indexable: true,
    title: 'Business plan conciergerie : structure, hypothèses, modèle (2026)',
    description:
      'Comment structurer un business plan crédible: hypothèses prudentes, offres, coûts, scénarios et KPI.',
    h1: 'Business plan pour une conciergerie',
    primaryKeyword: 'business plan conciergerie',
    variants: ['business plan conciergerie airbnb', 'prévisionnel conciergerie'],
    intent: 'MOFU: structurer et préparer financement.',
    funnel: 'MOFU',
    cluster: 'Création d’entreprise',
    parent: { name: 'Création d’entreprise', path: '/hub/creation-entreprise' },
    ctaPrimary: { label: 'Préparer un financement', href: '/hub/financement' },
    ctaSecondary: { label: 'Simuler la rentabilité', href: '/hub/simulateur-rentabilite' },
    legalDisclaimer: true,
    sections: [
      {
        title: 'Hypothèses à documenter',
        bullets: [
          'Nombre de logements gérés (scénario prudent vs ambitieux).',
          'Commission moyenne et prestations incluses.',
          'Coûts (outils, assurance, compta, sous-traitance).',
          'Temps opérationnel (capacité réelle).',
        ],
      },
      {
        title: 'KPI utiles',
        bullets: ['Marge par logement', 'Taux d’incidents', 'Temps de réponse', 'Satisfaction propriétaires'],
      },
    ],
  },
  {
    route: 'creation-entreprise/etude-marche-conciergerie',
    path: '/hub/creation-entreprise/etude-marche-conciergerie',
    type: 'guide',
    indexable: true,
    title: 'Étude de marché conciergerie : méthode, données, concurrence (2026)',
    description:
      'Méthode simple pour analyser la demande, la concurrence et le pricing local, et choisir un positionnement réaliste.',
    h1: 'Étude de marché pour une conciergerie',
    primaryKeyword: 'étude de marché conciergerie',
    variants: ['analyse marché conciergerie', 'concurrence conciergerie'],
    intent: 'TOFU/MOFU: valider la demande avant de se lancer.',
    funnel: 'TOFU',
    cluster: 'Création d’entreprise',
    parent: { name: 'Création d’entreprise', path: '/hub/creation-entreprise' },
    ctaPrimary: { label: 'Voir l’annuaire (concurrence)', href: '/conciergeries' },
    ctaSecondary: { label: 'Simuler la rentabilité', href: '/hub/simulateur-rentabilite' },
    legalDisclaimer: false,
    sections: [
      {
        title: '3 sources de vérité',
        bullets: [
          'Concurrents locaux (sites, offres, avis, zones couvertes).',
          'Demande propriétaires (forums, agences immo, groupes locaux).',
          'Contraintes locales (règlementation, saisonnalité).',
        ],
      },
      {
        title: 'Votre “edge”',
        bullets: ['Fiabilité opérationnelle', 'Spécialisation', 'Outils + reporting', 'Réseau prestataires'],
      },
    ],
  },

  // Statut juridique — pages
  {
    route: 'statut-juridique/micro-entreprise-conciergerie',
    path: '/hub/statut-juridique/micro-entreprise-conciergerie',
    type: 'guide',
    indexable: true,
    title: 'Micro-entreprise conciergerie : avantages, limites, TVA (2026)',
    description:
      'Micro-entreprise pour conciergerie: quand ça marche bien, limites, organisation comptable et points d’attention.',
    h1: 'Micro-entreprise pour une conciergerie',
    primaryKeyword: 'micro-entreprise conciergerie',
    variants: ['auto-entrepreneur conciergerie', 'micro-entreprise conciergerie airbnb'],
    intent: 'MOFU: comprendre et comparer.',
    funnel: 'MOFU',
    cluster: 'Statut juridique',
    parent: { name: 'Statut juridique', path: '/hub/statut-juridique' },
    ctaPrimary: { label: 'Micro vs SASU', href: '/hub/statut-juridique/micro-entreprise-vs-sasu-conciergerie' },
    ctaSecondary: { label: 'TVA conciergerie', href: '/hub/comptabilite/tva-conciergerie' },
    legalDisclaimer: true,
    sections: [
      { title: 'Avantages', bullets: ['Simple à lancer', 'Formalités allégées', 'Bon pour tester le marché local'] },
      { title: 'Limites', bullets: ['Plafonds', 'TVA selon régime', 'Image “pro” selon partenaires'] },
    ],
  },
  {
    route: 'statut-juridique/sasu-conciergerie',
    path: '/hub/statut-juridique/sasu-conciergerie',
    type: 'guide',
    indexable: false,
    title: 'SASU conciergerie : pour qui, contraintes, pilotage (2026)',
    description:
      'SASU pour conciergerie: quand ça devient pertinent, implications (gestion, compta) et erreurs à éviter.',
    h1: 'SASU pour une conciergerie',
    primaryKeyword: 'SASU conciergerie',
    intent: 'MOFU: expliquer sans conseiller.',
    funnel: 'MOFU',
    cluster: 'Statut juridique',
    parent: { name: 'Statut juridique', path: '/hub/statut-juridique' },
    ctaPrimary: { label: 'Micro vs SASU', href: '/hub/statut-juridique/micro-entreprise-vs-sasu-conciergerie' },
    ctaSecondary: { label: 'Banque pro', href: '/hub/banque-professionnelle' },
    legalDisclaimer: true,
    sections: [{ title: 'À traiter', bullets: ['Rémunération', 'Charges', 'TVA', 'Compta', 'Crédibilité bancaire'] }],
  },
  {
    route: 'statut-juridique/eurl-conciergerie',
    path: '/hub/statut-juridique/eurl-conciergerie',
    type: 'guide',
    indexable: false,
    title: 'EURL conciergerie : pour qui, points clés (2026)',
    description: 'EURL pour conciergerie: cadre, obligations, et profils pour lesquels ça peut convenir.',
    h1: 'EURL pour une conciergerie',
    primaryKeyword: 'EURL conciergerie',
    intent: 'MOFU.',
    funnel: 'MOFU',
    cluster: 'Statut juridique',
    parent: { name: 'Statut juridique', path: '/hub/statut-juridique' },
    ctaPrimary: { label: 'Voir comptabilité', href: '/hub/comptabilite' },
    ctaSecondary: { label: 'Micro vs SASU', href: '/hub/statut-juridique/micro-entreprise-vs-sasu-conciergerie' },
    legalDisclaimer: true,
    sections: [{ title: 'À comparer', bullets: ['Charges', 'TVA', 'Compta', 'Protection sociale', 'Évolution'] }],
  },
  {
    route: 'statut-juridique/sarl-conciergerie',
    path: '/hub/statut-juridique/sarl-conciergerie',
    type: 'guide',
    indexable: false,
    title: 'SARL conciergerie : cas d’usage, points clés (2026)',
    description: 'SARL: utile si projet à plusieurs, mais avec des règles spécifiques. Guide de lecture.',
    h1: 'SARL pour une conciergerie',
    primaryKeyword: 'SARL conciergerie',
    intent: 'MOFU.',
    funnel: 'MOFU',
    cluster: 'Statut juridique',
    parent: { name: 'Statut juridique', path: '/hub/statut-juridique' },
    ctaPrimary: { label: 'Voir comptabilité', href: '/hub/comptabilite' },
    ctaSecondary: { label: 'Banque pro', href: '/hub/banque-professionnelle' },
    legalDisclaimer: true,
    sections: [{ title: 'À cadrer', bullets: ['Associés', 'Gérance', 'TVA', 'Compta', 'Distribution'] }],
  },
  {
    route: 'statut-juridique/micro-entreprise-vs-sasu-conciergerie',
    path: '/hub/statut-juridique/micro-entreprise-vs-sasu-conciergerie',
    type: 'comparatif',
    indexable: true,
    title: 'Micro-entreprise vs SASU (conciergerie) : comparatif 2026',
    description:
      'Comparatif clair micro vs SASU pour une conciergerie: coûts, TVA, compta, protection sociale, et profils types (sans conseil figé).',
    h1: 'Micro-entreprise vs SASU : quel statut pour une conciergerie ?',
    primaryKeyword: 'micro-entreprise vs sasu conciergerie',
    intent: 'BOFU: décider et passer à l’action.',
    funnel: 'BOFU',
    cluster: 'Statut juridique',
    parent: { name: 'Statut juridique', path: '/hub/statut-juridique' },
    ctaPrimary: { label: 'Parler à un pro (devis)', href: '/devis' },
    ctaSecondary: { label: 'Banque pro', href: '/hub/banque-professionnelle' },
    legalDisclaimer: true,
    sections: [
      {
        title: 'Lecture rapide',
        paragraphs: [
          "Micro = simplicité pour tester. SASU = structure plus “entreprise” quand le volume et les enjeux montent. Le détail dépend de votre situation.",
        ],
      },
    ],
    comparisonTable: {
      caption: 'Comparaison indicative (à vérifier selon votre situation).',
      headers: ['Critère', 'Micro-entreprise', 'SASU'],
      rows: [
        ['Coût/complexité', 'Faible', 'Plus élevé'],
        ['Fiscalité', 'Simplifiée', 'Plus structurée'],
        ['Cotisations', 'Selon régime', 'Selon rémunération'],
        ['Protection sociale', 'Selon situation', 'Selon statut du dirigeant'],
        ['Comptabilité', 'Plus simple', 'Plus complète'],
        ['TVA', 'Selon régime / seuils', 'Souvent plus flexible'],
        ['Facilité de création', 'Très simple', 'Simple mais plus formel'],
        ['Profil type', 'Tester / démarrer', 'Structurer / scaler'],
      ],
    },
  },

  // Banque pro — pages
  {
    route: 'banque-professionnelle/meilleure-banque-conciergerie',
    path: '/hub/banque-professionnelle/meilleure-banque-conciergerie',
    type: 'comparatif',
    indexable: false,
    title: 'Meilleure banque pro pour conciergerie : critères (2026)',
    description:
      "Critères pour choisir une banque pro pour conciergerie. Les offres partenaires (avec liens affiliés) seront ajoutées uniquement avec infos vérifiées.",
    h1: 'Meilleure banque pro pour une conciergerie (critères)',
    primaryKeyword: 'meilleure banque conciergerie',
    intent: 'BOFU commerciale: comparer.',
    funnel: 'BOFU',
    cluster: 'Banque pro',
    parent: { name: 'Banque professionnelle', path: '/hub/banque-professionnelle' },
    ctaPrimary: { label: 'Comparatif banque pro', href: '/hub/banque-professionnelle/comparatif-banque-pro' },
    ctaSecondary: { label: 'Compte pro micro', href: '/hub/banque-professionnelle/compte-pro-micro-entreprise' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    sections: [
      {
        title: 'Critères de sélection',
        bullets: ['Frais clairs', 'Encaissements', 'Exports compta', 'Cartes équipe', 'Support', 'Plafonds'],
      },
      {
        title: 'Transparence',
        paragraphs: [
          "Nous n’affichons pas de “classement” sans données vérifiables. Les fiches partenaires seront ajoutées uniquement avec caractéristiques sourcées et modifiables.",
        ],
      },
    ],
  },
  {
    route: 'banque-professionnelle/compte-pro-micro-entreprise',
    path: '/hub/banque-professionnelle/compte-pro-micro-entreprise',
    type: 'guide',
    indexable: true,
    title: 'Compte pro micro-entreprise (conciergerie) : comment choisir (2026)',
    description:
      'Points clés pour choisir un compte pro quand on démarre en micro: encaissements, carte, exports, support.',
    h1: 'Compte pro micro-entreprise : conciergerie',
    primaryKeyword: 'compte pro micro-entreprise conciergerie',
    intent: 'BOFU: choisir un compte.',
    funnel: 'BOFU',
    cluster: 'Banque pro',
    parent: { name: 'Banque professionnelle', path: '/hub/banque-professionnelle' },
    ctaPrimary: { label: 'Comparatif banque pro', href: '/hub/banque-professionnelle/comparatif-banque-pro' },
    ctaSecondary: { label: 'Comptabilité', href: '/hub/comptabilite' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    sections: [{ title: 'Checklist', bullets: ['Frais', 'Carte', 'Exports', 'Support', 'Encaissements'] }],
  },
  {
    route: 'banque-professionnelle/compte-pro-sasu',
    path: '/hub/banque-professionnelle/compte-pro-sasu',
    type: 'guide',
    indexable: false,
    title: 'Compte pro SASU (conciergerie) : critères (2026)',
    description:
      'Critères de choix compte pro en SASU: cartes, multi-utilisateurs, exports, gestion.',
    h1: 'Compte pro SASU : conciergerie',
    primaryKeyword: 'compte pro sasu conciergerie',
    intent: 'BOFU.',
    funnel: 'BOFU',
    cluster: 'Banque pro',
    parent: { name: 'Banque professionnelle', path: '/hub/banque-professionnelle' },
    ctaPrimary: { label: 'Comparatif banque pro', href: '/hub/banque-professionnelle/comparatif-banque-pro' },
    ctaSecondary: { label: 'Statut juridique', href: '/hub/statut-juridique' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    sections: [{ title: 'À regarder', bullets: ['Cartes', 'Rôles', 'Exports', 'Support', 'Plafonds'] }],
  },
  {
    route: 'banque-professionnelle/comparatif-banque-pro',
    path: '/hub/banque-professionnelle/comparatif-banque-pro',
    type: 'comparatif',
    indexable: true,
    title: 'Comparatif banque pro : choisir un compte pro (critères 2026)',
    description:
      "Comparatif orienté critères (sans inventer de tarifs): quels points vérifier, pièges fréquents, et liste de banques/solutions à comparer via liens officiels.",
    h1: 'Comparatif banque pro : méthode + checklist',
    primaryKeyword: 'comparatif banque pro',
    intent: 'BOFU.',
    funnel: 'BOFU',
    cluster: 'Banque pro',
    parent: { name: 'Banque professionnelle', path: '/hub/banque-professionnelle' },
    ctaPrimary: { label: 'Voir critères banque pro', href: '/hub/banque-professionnelle/meilleure-banque-conciergerie' },
    ctaSecondary: { label: 'Comptabilité', href: '/hub/comptabilite' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    partnerCategory: 'banque-professionnelle',
    comparisonTable: {
      caption: "Tableau de critères (à valider sur les pages officielles des banques).",
      headers: ['Critère', 'Pourquoi c’est important', 'Ce qu’il faut vérifier', 'Pièges fréquents'],
      rows: [
        ['Frais', 'Impact direct sur la marge', 'Prix mensuel + frais d’opérations', 'Offre “d’appel” puis options payantes'],
        ['Encaissements', 'Vous facturez des propriétaires / prestataires', 'Virements entrants/sortants + délais', 'Frais cachés selon volume'],
        ['Cartes', 'Dépenses terrain / équipe', 'Nombre de cartes, plafonds, assurances', 'Plafonds trop bas au début'],
        ['Exports compta', 'Gain de temps + pilotage', 'CSV, intégrations, catégorisation', 'Exports incomplets'],
        ['Rôles / accès', 'Si vous déléguez', 'Droits par utilisateur', 'Tout le monde admin par défaut'],
        ['Support', 'Incidents carte / virements', 'Canaux, horaires, délais', 'Support lent en cas d’urgence'],
        ['Justificatifs', 'Onboarding & conformité', 'KYC, statuts, pièces', 'Blocages si dossier incomplet'],
        ['International', 'Si multi-devises', 'Devises, frais FX', 'FX attractif mais options manquantes'],
        ['Dépôts / cash', 'Selon activité', 'Dépôt d’espèces/chèques (si nécessaire)', 'Certaines offres n’en proposent pas'],
        ['Évolutivité', 'Croissance', 'Passerelle vers offre supérieure', 'Migration douloureuse'],
      ],
    },
    sections: [
      {
        title: 'Méthode de comparaison (en 20 minutes)',
        bullets: [
          'Étape 1: liste tes besoins (équipe, exports compta, international…).',
          'Étape 2: ouvre 3–5 pages officielles, compare les critères ci-dessous.',
          'Étape 3: vérifie les frais réels (mensuel + opérations) sur ton scénario.',
          'Étape 4: teste le support (un message) avant de décider.',
        ],
      },
      {
        title: 'Checklist “conciergerie” (spécifique métier)',
        bullets: [
          'Cartes & plafonds (dépenses ménage/linge/maintenance).',
          'Exports compta (suivi par client/logement).',
          'Rôles si tu as une équipe (prestataires, ops).',
          'Réactivité support (incidents terrain).',
        ],
      },
      {
        title: 'À faire avant l’ouverture',
        bullets: [
          'Préparer documents (KYC): statuts, identité, justificatifs.',
          'Lister paiements récurrents (logiciels, assurance, compta).',
          'Définir qui a accès et quels plafonds.',
          'Décider d’un process de facturation (commission/forfait/options).',
        ],
      },
    ],
  },

  // Assurance — pages
  {
    route: 'assurance/rc-pro-conciergerie',
    path: '/hub/assurance/rc-pro-conciergerie',
    type: 'guide',
    indexable: true,
    title: 'RC Pro conciergerie : pourquoi, garanties, checklist (2026)',
    description:
      'Comprendre la RC Pro pour une conciergerie: pourquoi, comment comparer, et points de vigilance.',
    h1: 'RC Pro conciergerie : le socle',
    primaryKeyword: 'rc pro conciergerie',
    intent: 'BOFU: acheter/comparer.',
    funnel: 'BOFU',
    cluster: 'Assurance',
    parent: { name: 'Assurance', path: '/hub/assurance' },
    ctaPrimary: { label: 'Comparatif assurance', href: '/hub/assurance/comparatif-assurance-conciergerie' },
    ctaSecondary: { label: 'Devis', href: '/devis' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    sections: [
      { title: 'Checklist', bullets: ['Activités couvertes', 'Franchises', 'Plafonds', 'Sous-traitants', 'Clés / accès'] },
    ],
  },
  {
    route: 'assurance/assurance-conciergerie-airbnb',
    path: '/hub/assurance/assurance-conciergerie-airbnb',
    type: 'guide',
    indexable: false,
    title: 'Assurance conciergerie Airbnb : risques & couverture (2026)',
    description:
      'Panorama des risques (clés, dommages, incidents) et comment structurer un socle d’assurance.',
    h1: 'Assurance conciergerie Airbnb',
    primaryKeyword: 'assurance conciergerie airbnb',
    intent: 'MOFU.',
    funnel: 'MOFU',
    cluster: 'Assurance',
    parent: { name: 'Assurance', path: '/hub/assurance' },
    ctaPrimary: { label: 'RC Pro', href: '/hub/assurance/rc-pro-conciergerie' },
    ctaSecondary: { label: 'Comparatif', href: '/hub/assurance/comparatif-assurance-conciergerie' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    sections: [{ title: 'Risques', bullets: ['Clés', 'Dommages', 'Prestataires', 'Incidents voyageurs'] }],
  },
  {
    route: 'assurance/assurance-location-saisonniere',
    path: '/hub/assurance/assurance-location-saisonniere',
    type: 'guide',
    indexable: false,
    title: 'Assurance location saisonnière : qui couvre quoi (2026)',
    description:
      'Clarifier les périmètres: propriétaire, locataire, conciergerie. Quelles garanties regarder.',
    h1: 'Assurance location saisonnière (rôles et périmètres)',
    primaryKeyword: 'assurance location saisonnière conciergerie',
    intent: 'MOFU.',
    funnel: 'MOFU',
    cluster: 'Assurance',
    parent: { name: 'Assurance', path: '/hub/assurance' },
    ctaPrimary: { label: 'RC Pro', href: '/hub/assurance/rc-pro-conciergerie' },
    ctaSecondary: { label: 'Comptabilité', href: '/hub/comptabilite' },
    legalDisclaimer: true,
    sections: [{ title: 'À clarifier', bullets: ['PNO', 'RC pro', 'Garanties voyageurs', 'Dépôts / cautions'] }],
  },
  {
    route: 'assurance/comparatif-assurance-conciergerie',
    path: '/hub/assurance/comparatif-assurance-conciergerie',
    type: 'comparatif',
    indexable: false,
    title: 'Comparatif assurance conciergerie : critères & méthode (2026)',
    description:
      "Comparatif orienté critères (sans inventer d’offres). Les partenaires seront ajoutés avec infos vérifiées.",
    h1: 'Comparatif assurance conciergerie (méthode)',
    primaryKeyword: 'comparatif assurance conciergerie',
    intent: 'BOFU.',
    funnel: 'BOFU',
    cluster: 'Assurance',
    parent: { name: 'Assurance', path: '/hub/assurance' },
    ctaPrimary: { label: 'RC Pro', href: '/hub/assurance/rc-pro-conciergerie' },
    ctaSecondary: { label: 'Devis', href: '/devis' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    sections: [{ title: 'Critères', bullets: ['Plafonds', 'Franchises', 'Sous-traitance', 'Clés', 'Exclusions'] }],
  },

  // Comptabilité — pages
  {
    route: 'comptabilite/comptable-conciergerie',
    path: '/hub/comptabilite/comptable-conciergerie',
    type: 'guide',
    indexable: true,
    title: 'Expert-comptable conciergerie : comment choisir (2026)',
    description:
      'Choisir un comptable pour une conciergerie: attentes, questions à poser, et pièges à éviter.',
    h1: 'Expert-comptable pour conciergerie',
    primaryKeyword: 'expert-comptable conciergerie',
    intent: 'BOFU.',
    funnel: 'BOFU',
    cluster: 'Comptabilité',
    parent: { name: 'Comptabilité', path: '/hub/comptabilite' },
    ctaPrimary: { label: 'TVA conciergerie', href: '/hub/comptabilite/tva-conciergerie' },
    ctaSecondary: { label: 'Banque pro', href: '/hub/banque-professionnelle' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    sections: [{ title: 'Questions à poser', bullets: ['TVA', 'Outils', 'Reporting', 'Facturation', 'Conseil'] }],
  },
  {
    route: 'comptabilite/logiciel-comptabilite-conciergerie',
    path: '/hub/comptabilite/logiciel-comptabilite-conciergerie',
    type: 'guide',
    indexable: false,
    title: 'Logiciel comptabilité conciergerie : critères (2026)',
    description:
      'Choisir un logiciel compta: exports, facturation, intégrations, et pilotage.',
    h1: 'Logiciel de comptabilité pour conciergerie',
    primaryKeyword: 'logiciel comptabilité conciergerie',
    intent: 'BOFU.',
    funnel: 'BOFU',
    cluster: 'Comptabilité',
    parent: { name: 'Comptabilité', path: '/hub/comptabilite' },
    ctaPrimary: { label: 'Facturation', href: '/hub/comptabilite/facturation-conciergerie' },
    ctaSecondary: { label: 'Banque pro', href: '/hub/banque-professionnelle' },
    affiliateDisclosure: true,
    legalDisclaimer: true,
    sections: [{ title: 'Critères', bullets: ['Factures', 'TVA', 'Exports', 'Catégorisation', 'Accès équipe'] }],
  },
  {
    route: 'comptabilite/facturation-conciergerie',
    path: '/hub/comptabilite/facturation-conciergerie',
    type: 'guide',
    indexable: true,
    title: 'Facturation conciergerie : commission, forfaits, modèles (2026)',
    description:
      'Structurer la facturation: commission vs forfait, options, et documents.',
    h1: 'Facturation conciergerie (détails)',
    primaryKeyword: 'facturation conciergerie',
    intent: 'MOFU.',
    funnel: 'MOFU',
    cluster: 'Comptabilité',
    parent: { name: 'Comptabilité', path: '/hub/comptabilite' },
    ctaPrimary: { label: 'Voir TVA', href: '/hub/comptabilite/tva-conciergerie' },
    ctaSecondary: { label: 'Simulateur', href: '/hub/simulateur-rentabilite' },
    legalDisclaimer: true,
    sections: [{ title: 'Modèles', bullets: ['Commission', 'Forfait', 'À la carte', 'Hybrid'] }],
  },
  {
    route: 'comptabilite/tva-conciergerie',
    path: '/hub/comptabilite/tva-conciergerie',
    type: 'guide',
    indexable: true,
    title: 'TVA conciergerie : points d’attention (2026)',
    description:
      'TVA: points de vigilance, questions à poser à un pro, et méthode pour vérifier les règles à jour.',
    h1: 'TVA et conciergerie (points d’attention)',
    primaryKeyword: 'TVA conciergerie',
    intent: 'MOFU.',
    funnel: 'MOFU',
    cluster: 'Comptabilité',
    parent: { name: 'Comptabilité', path: '/hub/comptabilite' },
    ctaPrimary: { label: 'Expert-comptable', href: '/hub/comptabilite/comptable-conciergerie' },
    ctaSecondary: { label: 'Statut juridique', href: '/hub/statut-juridique' },
    legalDisclaimer: true,
    sections: [
      {
        title: 'Règle de prudence',
        paragraphs: [
          "Les règles fiscales évoluent. Cette page donne une grille de questions, pas une recommandation définitive.",
        ],
      },
      { title: 'Questions', bullets: ['Régime', 'Seuils', 'Facturation', 'Déclarations', 'Cas particuliers'] },
    ],
  },

  // Financement — pages
  {
    route: 'financement/financer-conciergerie',
    path: '/hub/financement/financer-conciergerie',
    type: 'guide',
    indexable: true,
    title: 'Financer une conciergerie : plan, dossier, scénarios (2026)',
    description:
      'Construire un plan de financement: besoins, hypothèses, scénario prudent, et pièces utiles.',
    h1: 'Financer une conciergerie (méthode)',
    primaryKeyword: 'financer une conciergerie',
    intent: 'MOFU.',
    funnel: 'MOFU',
    cluster: 'Financement',
    parent: { name: 'Financement', path: '/hub/financement' },
    ctaPrimary: { label: 'Business plan', href: '/hub/creation-entreprise/business-plan-conciergerie' },
    ctaSecondary: { label: 'Simulateur', href: '/hub/simulateur-rentabilite' },
    legalDisclaimer: true,
    sections: [{ title: 'Pièces', bullets: ['Offre', 'Budget', 'Hypothèses', 'Preuves marché', 'Process'] }],
  },
  {
    route: 'financement/pret-creation-conciergerie',
    path: '/hub/financement/pret-creation-conciergerie',
    type: 'guide',
    indexable: false,
    title: 'Prêt création conciergerie : comment se préparer (2026)',
    description:
      'Préparer une demande de prêt sans promesse: dossier, risques, et points de vigilance.',
    h1: 'Prêt de création: conciergerie',
    primaryKeyword: 'prêt création conciergerie',
    intent: 'MOFU/BOFU.',
    funnel: 'MOFU',
    cluster: 'Financement',
    parent: { name: 'Financement', path: '/hub/financement' },
    ctaPrimary: { label: 'Business plan', href: '/hub/creation-entreprise/business-plan-conciergerie' },
    ctaSecondary: { label: 'Banque pro', href: '/hub/banque-professionnelle' },
    legalDisclaimer: true,
    sections: [{ title: 'À préparer', bullets: ['Hypothèses prudentes', 'Apport', 'Trésorerie', 'Capacité exécution'] }],
  },
  {
    route: 'financement/microcredit-conciergerie',
    path: '/hub/financement/microcredit-conciergerie',
    type: 'guide',
    indexable: false,
    title: 'Microcrédit conciergerie : pour qui, comment (2026)',
    description:
      'Microcrédit: à qui ça s’adresse, quels documents préparer, et comment éviter les attentes irréalistes.',
    h1: 'Microcrédit pour conciergerie',
    primaryKeyword: 'microcrédit conciergerie',
    intent: 'MOFU.',
    funnel: 'MOFU',
    cluster: 'Financement',
    parent: { name: 'Financement', path: '/hub/financement' },
    ctaPrimary: { label: 'Sans apport', href: '/hub/financement/financement-sans-apport' },
    ctaSecondary: { label: 'Business plan', href: '/hub/creation-entreprise/business-plan-conciergerie' },
    legalDisclaimer: true,
    sections: [{ title: 'À cadrer', bullets: ['Besoins', 'Budget', 'Preuves marché', 'Accompagnement'] }],
  },
  {
    route: 'financement/financement-sans-apport',
    path: '/hub/financement/financement-sans-apport',
    type: 'guide',
    indexable: false,
    title: 'Financement sans apport (conciergerie) : options réalistes (2026)',
    description:
      'Alternatives pour démarrer léger sans promesse: réduire coûts, préventes, partenariats, et dossier prudent.',
    h1: 'Financement sans apport : conciergerie',
    primaryKeyword: 'financement sans apport conciergerie',
    intent: 'MOFU.',
    funnel: 'MOFU',
    cluster: 'Financement',
    parent: { name: 'Financement', path: '/hub/financement' },
    ctaPrimary: { label: 'Coût création', href: '/hub/creation-entreprise/cout-creation-conciergerie' },
    ctaSecondary: { label: 'Simulateur', href: '/hub/simulateur-rentabilite' },
    legalDisclaimer: true,
    sections: [{ title: 'Approches', bullets: ['Process d’abord', 'Outils minimum', 'Partenariats', 'Offre claire'] }],
  },
  {
    route: 'financement/aides-creation-entreprise-conciergerie',
    path: '/hub/financement/aides-creation-entreprise-conciergerie',
    type: 'guide',
    indexable: true,
    title: 'Aides création entreprise conciergerie : méthode + sources (2026)',
    description:
      'Aides: comment chercher, vérifier, et documenter les infos avec sources officielles.',
    h1: 'Aides création entreprise: conciergerie',
    primaryKeyword: 'aides création entreprise conciergerie',
    intent: 'TOFU/MOFU.',
    funnel: 'TOFU',
    cluster: 'Financement',
    parent: { name: 'Financement', path: '/hub/financement' },
    ctaPrimary: { label: 'Étude de marché', href: '/hub/creation-entreprise/etude-marche-conciergerie' },
    ctaSecondary: { label: 'Business plan', href: '/hub/creation-entreprise/business-plan-conciergerie' },
    legalDisclaimer: true,
    sections: [
      { title: 'Règle', paragraphs: ['Ne jamais “promettre” une aide. Toujours vérifier la source et la date.'] },
      { title: 'Méthode', bullets: ['Lister profil', 'Lister besoins', 'Préparer pièces', 'Vérifier sources'] },
    ],
  },
];

