import PlatformIntentPage from '@/pages/platforms/PlatformIntentPage';

export function BookingGestion() {
  return (
    <PlatformIntentPage
      path="/booking/gestion-booking"
      title="Gestion Booking : conciergerie, PMS et automatisation (2026)"
      h1="Gestion Booking : comment déléguer et automatiser"
      description="Guide pratique pour gérer Booking efficacement : calendrier, pricing, messages, opérations et outils pour éviter les doubles réservations."
      platformLabel="Booking"
      ctaHref="/conciergeries?platform=Booking.com"
      ctaLabel="Trouver une conciergerie Booking"
      sections={[
        {
          title: 'Ce qui rend Booking exigeant',
          body: [
            "Booking peut apporter beaucoup de demandes, mais la performance dépend de la disponibilité, du pricing, des conditions et de l’exécution opérationnelle (ménage, check-in, support).",
            "Dès qu’on ajoute d’autres canaux (Airbnb, Abritel/Vrbo), le risque principal devient la désynchronisation du calendrier et des tarifs.",
          ],
        },
        {
          title: 'La stack “pro” recommandée',
          body: [
            "Pour une gestion fiable, la plupart des pros utilisent un PMS et/ou un channel manager pour synchroniser canaux, règles, prix et messages.",
            "Côté terrain, le process ménage + check-list et la gestion incidents sont déterminants (qualité = meilleures performances à long terme).",
          ],
        },
      ]}
    />
  );
}

export function BookingCommission() {
  return (
    <PlatformIntentPage
      path="/booking/commission-booking"
      title="Commission Booking : comment ça marche (sans chiffres non sourcés)"
      h1="Commission Booking : comprendre les frais (propriétaires)"
      description="Comprendre les frais Booking côté propriétaires : variables selon pays, conditions, catégories. Comment comparer et éviter les surprises."
      platformLabel="Booking"
      ctaHref="/booking/meilleure-conciergerie-booking"
      ctaLabel="Meilleure conciergerie Booking"
      sections={[
        {
          title: 'Pourquoi on ne donne pas un “% universel”',
          body: [
            "Les frais dépendent du pays, du type d’hébergement, des options, des conditions commerciales et parfois de la configuration de paiement.",
            "La bonne approche consiste à raisonner en coût total (frais + opérationnel + outils) et à comparer selon votre situation.",
          ],
        },
        {
          title: 'Checklist pour comparer correctement',
          body: [
            "Demandez un récapitulatif clair: frais, taxes, conditions d’annulation, règles de paiement, et impact sur le pricing.",
            "Si vous passez par une conciergerie: comparez commission, prestations incluses (ménage, linge, check-in), et la façon dont ils synchronisent Booking avec les autres canaux.",
          ],
        },
      ]}
    />
  );
}

export function BookingOptimiserAnnonce() {
  return (
    <PlatformIntentPage
      path="/booking/optimiser-annonce-booking"
      title="Optimiser son annonce Booking : visibilité & réservations (2026)"
      h1="Optimiser son annonce Booking : augmenter la visibilité"
      description="Actions concrètes pour améliorer une annonce Booking : contenu, équipements, politiques, pricing, calendrier, opérations."
      platformLabel="Booking"
      ctaHref="/conciergeries?platform=Booking.com"
      ctaLabel="Trouver une conciergerie Booking"
      sections={[
        {
          title: 'Fondations de l’optimisation',
          body: [
            "La clarté de l’offre (équipements, règles, politique), la qualité des photos et la cohérence du calendrier influencent fortement la conversion.",
            "La réactivité et l’exécution opérationnelle réduisent les frictions et améliorent les performances dans la durée.",
          ],
        },
        {
          title: 'Quand déléguer',
          body: [
            "Si vous manquez de temps, une conciergerie qui maîtrise le multi-canal peut gérer l’annonce, les messages, le pricing et les opérations.",
            "L’objectif: une distribution stable (Airbnb + Booking + Abritel) sans surréservations et avec un standard de qualité constant.",
          ],
        },
      ]}
    />
  );
}

