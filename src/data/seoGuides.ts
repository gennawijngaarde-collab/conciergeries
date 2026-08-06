import type { GuideTemplate } from '@/seo/types';

/** Templates de guides — les slugs concrets sont générés par le registry. */
export const guideTemplates: GuideTemplate[] = [
  {
    kind: 'city',
    slugPattern: 'comment-creer-une-conciergerie-a-{city}',
    titlePattern: 'Comment créer une conciergerie à {cityName} (2026)',
    descriptionPattern:
      'Étapes pour créer une conciergerie Airbnb à {cityName} : statut, outils, acquisition clients et rentabilité.',
    h1Pattern: 'Comment créer une conciergerie à {cityName}',
  },
  {
    kind: 'city',
    slugPattern: 'rentabilite-airbnb-{city}',
    titlePattern: 'Rentabilité Airbnb à {cityName} : guide 2026',
    descriptionPattern:
      'Analyse de la rentabilité Airbnb à {cityName} : occupation, ADR, saisonnalité et rôle d’une conciergerie.',
    h1Pattern: 'Rentabilité Airbnb à {cityName}',
  },
  {
    kind: 'city',
    slugPattern: 'prix-conciergerie-airbnb-{city}',
    titlePattern: 'Prix d’une conciergerie Airbnb à {cityName}',
    descriptionPattern:
      'Combien coûte une conciergerie Airbnb à {cityName} ? Commissions, services inclus et critères de choix.',
    h1Pattern: 'Prix d’une conciergerie Airbnb à {cityName}',
  },
  {
    kind: 'dom-tom',
    slugPattern: 'ouvrir-conciergerie-{place}',
    titlePattern: 'Comment ouvrir une conciergerie en {placeName}',
    descriptionPattern:
      'Guide pour ouvrir une conciergerie Airbnb en {placeName} : marché local, réglementation et outils.',
    h1Pattern: 'Ouvrir une conciergerie en {placeName}',
  },
  {
    kind: 'generic',
    slugPattern: 'comment-devenir-co-hote-airbnb',
    titlePattern: 'Comment devenir co-hôte Airbnb en 2026',
    descriptionPattern:
      'Devenir co-hôte Airbnb : missions, rémunération, outils et bonnes pratiques pour démarrer.',
    h1Pattern: 'Comment devenir co-hôte Airbnb',
  },
  {
    kind: 'generic',
    slugPattern: 'prix-conciergerie-airbnb',
    titlePattern: 'Prix d’une conciergerie Airbnb : commissions et devis',
    descriptionPattern:
      'Tarifs moyens des conciergeries Airbnb en France, ce qui est inclus, et comment comparer les devis.',
    h1Pattern: 'Prix d’une conciergerie Airbnb',
  },
];
