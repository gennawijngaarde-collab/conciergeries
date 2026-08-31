import PlatformIntentPage from '@/pages/platforms/PlatformIntentPage';

export function AbritelGestion() {
  return (
    <PlatformIntentPage
      path="/abritel/gestion-abritel"
      title="Gestion Abritel : conciergerie, PMS et automatisation (2026)"
      h1="Gestion Abritel : comment déléguer et automatiser"
      description="Guide pratique pour gérer Abritel/Vrbo : calendrier, pricing saisonnier, messages, opérations et outils multi-canal."
      platformLabel="Abritel"
      ctaHref="/conciergeries?platform=Abritel"
      ctaLabel="Trouver une conciergerie Abritel"
      sections={[
        {
          title: 'Spécificités Abritel/Vrbo',
          body: [
            "Selon les destinations, Abritel peut attirer des séjours plus longs et des attentes élevées sur les équipements et la propreté.",
            "La performance dépend de la qualité de l’annonce (photos, équipements), de la cohérence des règles et du process opérationnel.",
          ],
        },
        {
          title: 'Multi-canal sans surbooking',
          body: [
            "Si vous diffusez aussi sur Airbnb/Booking, un PMS et/ou un channel manager est fortement recommandé pour synchroniser prix, disponibilités et messages.",
            "Une conciergerie compétente doit pouvoir expliquer clairement son process de sync et son contrôle qualité ménage.",
          ],
        },
      ]}
    />
  );
}

export function AbritelCommission() {
  return (
    <PlatformIntentPage
      path="/abritel/commission-abritel"
      title="Commission Abritel : comment ça marche (sans chiffres non sourcés)"
      h1="Commission Abritel : comprendre les frais (propriétaires)"
      description="Comprendre les frais Abritel/Vrbo : variables selon pays, offres et options. Comment comparer sans se tromper."
      platformLabel="Abritel"
      ctaHref="/abritel/meilleure-conciergerie-abritel"
      ctaLabel="Meilleure conciergerie Abritel"
      sections={[
        {
          title: 'Frais variables selon l’offre et le pays',
          body: [
            "Abritel/Vrbo propose des modèles et options qui peuvent varier selon les marchés. Il est risqué d’annoncer un chiffre unique sans source à jour.",
            "La bonne pratique: documenter votre configuration, puis comparer le coût total (frais + outils + opérationnel).",
          ],
        },
        {
          title: 'Si vous déléguez à une conciergerie',
          body: [
            "Comparez ce qui est inclus: photos, diffusion multi-plateformes, gestion voyageurs, ménage, linge, maintenance, reporting.",
            "Demandez comment ils gèrent le pricing saisonnier et la synchronisation avec Airbnb/Booking.",
          ],
        },
      ]}
    />
  );
}

export function AbritelOptimiserAnnonce() {
  return (
    <PlatformIntentPage
      path="/abritel/optimiser-annonce-abritel"
      title="Optimiser son annonce Abritel : visibilité & réservations (2026)"
      h1="Optimiser son annonce Abritel : augmenter les réservations"
      description="Actions concrètes pour améliorer une annonce Abritel/Vrbo : visuels, équipements, calendrier, règles et opérations."
      platformLabel="Abritel"
      ctaHref="/conciergeries?platform=Abritel"
      ctaLabel="Trouver une conciergerie Abritel"
      sections={[
        {
          title: 'Ce qui fait la différence sur Abritel',
          body: [
            "Les familles et groupes cherchent de la clarté: équipements, couchages, règles, accessibilité, stationnement, et photos très explicites.",
            "Les opérations (ménage, check-in) doivent être sans friction: c’est un levier majeur de satisfaction.",
          ],
        },
        {
          title: 'Industrialiser la qualité',
          body: [
            "Une conciergerie ou un property manager peut standardiser check-lists, rotations linge, inspection et support voyageurs.",
            "En multi-canal, privilégiez une stack outillée (PMS/channel manager) pour éviter incohérences et doubles réservations.",
          ],
        },
      ]}
    />
  );
}

