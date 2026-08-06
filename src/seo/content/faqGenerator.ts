import type { SeoFaqItem, SeoPageType } from '@/seo/types';

type FaqCtx = {
  placeName?: string;
  serviceName?: string;
  toolA?: string;
  toolB?: string;
  count?: number;
};

export function generateFaqs(type: SeoPageType, ctx: FaqCtx): SeoFaqItem[] {
  const place = ctx.placeName ?? 'votre ville';
  const service = ctx.serviceName ?? 'ce service';
  const count = ctx.count ?? 0;

  switch (type) {
    case 'conciergerie-ville':
    case 'ville':
      return [
        {
          question: `Comment trouver une conciergerie Airbnb à ${place} ?`,
          answer: `Comparez les conciergeries présentes sur notre annuaire pour ${place}, vérifiez avis, services inclus et demandez plusieurs devis.`,
        },
        {
          question: `Combien coûte une conciergerie à ${place} ?`,
          answer: `Les commissions varient souvent entre 15 % et 25 % selon les services (ménage, check-in, linge, maintenance). Demandez un devis détaillé.`,
        },
        {
          question: `Quels services une conciergerie gère-t-elle à ${place} ?`,
          answer: `En général : annonces, calendrier, voyageurs, ménage, linge, maintenance et optimisation des revenus sur Airbnb et Booking.`,
        },
        {
          question: count
            ? `Combien de conciergeries sont référencées à ${place} ?`
            : `Y a-t-il des conciergeries à ${place} ?`,
          answer: count
            ? `Nous référencons actuellement ${count} conciergerie${count > 1 ? 's' : ''} couvrant ${place}.`
            : `Même si le volume local varie, vous pouvez élargir votre recherche aux villes voisines ou demander des devis nationaux.`,
        },
      ];
    case 'service-ville':
      return [
        {
          question: `Qui propose ${service} à ${place} ?`,
          answer: `Les conciergeries locales et certains prestataires spécialisés couvrent ${service.toLowerCase()} à ${place}. Filtrez via notre annuaire et demandez un devis.`,
        },
        {
          question: `Le ${service.toLowerCase()} est-il inclus dans une conciergerie ?`,
          answer: `Souvent oui, mais pas toujours. Vérifiez le contrat : certains postes (photos, linge) peuvent être facturés à part.`,
        },
        {
          question: `Comment comparer les offres à ${place} ?`,
          answer: `Comparez réactivité, avis, couverture géographique, outils utilisés (PMS, channel manager) et transparence des tarifs.`,
        },
      ];
    case 'departement':
    case 'region':
    case 'dom-tom':
    case 'pays':
      return [
        {
          question: `Puis-je trouver une conciergerie en ${place} ?`,
          answer: `Oui. Parcourez les villes et départements associés, comparez les fiches et demandez des devis adaptés à votre bien.`,
        },
        {
          question: `La réglementation Airbnb est-elle la même partout en ${place} ?`,
          answer: `Non. Les règles varient selon la commune (enregistrement, durée de location, copropriété). Vérifiez toujours la mairie locale.`,
        },
        {
          question: `Quels outils utiliser pour gérer des biens en ${place} ?`,
          answer: `Un PMS / channel manager, un outil de pricing et éventuellement des serrures connectées facilitent la gestion multi-biens.`,
        },
      ];
    case 'guide':
      return [
        {
          question: 'Par où commencer ?',
          answer: 'Clarifiez votre offre (gestion complète ou services à la carte), votre zone, puis équipez-vous d’un PMS et d’un process ménage fiable.',
        },
        {
          question: 'Faut-il un statut professionnel ?',
          answer: 'Dès que vous gérez l’activité d’autrui ou facturez des services, un cadre professionnel (micro, société…) est généralement nécessaire. Consultez un expert-comptable.',
        },
        {
          question: 'Combien de temps pour démarrer ?',
          answer: 'Comptez souvent quelques semaines pour le legal, les outils, les process et les premiers clients — plus selon votre marché.',
        },
      ];
    case 'comparatif':
      return [
        {
          question: `Quel outil choisir entre ${ctx.toolA} et ${ctx.toolB} ?`,
          answer: `Tout dépend du volume de logements, du budget et du besoin d’automatisation. Comparez essai gratuit, sync OTA, support et API.`,
        },
        {
          question: 'Puis-je changer d’outil plus tard ?',
          answer: 'Oui, mais prévoyez une migration calendriers / annonces. Testez toujours en parallèle avant de couper l’ancien outil.',
        },
      ];
    case 'top':
      return [
        {
          question: `Comment est établi ce classement pour ${place} ?`,
          answer: 'Nous nous basons sur notes, volume d’avis, couverture et pertinence des services — à croiser avec vos besoins locaux.',
        },
        {
          question: 'Le n°1 est-il forcément le meilleur pour moi ?',
          answer: 'Pas forcément. Priorisez la proximité, la réactivité et le fit avec votre type de bien plutôt que le seul classement.',
        },
      ];
    default:
      return [];
  }
}
