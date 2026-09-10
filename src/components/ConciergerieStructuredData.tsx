import type { Conciergerie } from '@/types/conciergerie';

type Props = {
  conciergerie: Conciergerie;
};

/**
 * Génère les métadonnées structurées Schema.org optimisées pour le SEO des images
 * Inclut LocalBusiness, Organization avec logo, et ImageObject
 */
export default function ConciergerieStructuredData({ conciergerie }: Props) {
  const ORIGIN = 'https://ma-conciergerie-annuaire.com';
  
  // Déterminer l'URL du logo
  let logoUrl = '';
  if (conciergerie.logoUrl) {
    logoUrl = conciergerie.logoUrl;
  } else if (conciergerie.logo && conciergerie.logo !== 'default') {
    logoUrl = `${ORIGIN}/logos/remote/${conciergerie.slug}.png`;
  } else {
    logoUrl = `${ORIGIN}/logo.png`;
  }

  const pageUrl = `${ORIGIN}/conciergerie/${conciergerie.slug}`;

  // Schema.org LocalBusiness avec logo optimisé
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': pageUrl,
    name: conciergerie.name,
    description: conciergerie.description,
    url: conciergerie.website || pageUrl,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl,
      contentUrl: logoUrl,
      width: '80',
      height: '80',
      caption: `Logo de ${conciergerie.name} - Conciergerie Airbnb à ${conciergerie.city}`,
      description: `Logo officiel de ${conciergerie.name}, service de conciergerie professionnelle pour locations courte durée Airbnb`,
    },
    image: logoUrl,
    telephone: conciergerie.phone || undefined,
    email: conciergerie.email || undefined,
    address: conciergerie.address
      ? {
          '@type': 'PostalAddress',
          addressLocality: conciergerie.city.split(',')[0]?.trim(),
          addressRegion: conciergerie.city.split(',')[1]?.trim(),
          addressCountry: 'FR',
        }
      : undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: conciergerie.rating.toString(),
      reviewCount: conciergerie.reviews.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: conciergerie.city,
    },
  };

  // Schema.org Organization pour renforcer l'identité de marque
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${pageUrl}#organization`,
    name: conciergerie.name,
    url: conciergerie.website || pageUrl,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl,
      contentUrl: logoUrl,
      width: '80',
      height: '80',
    },
    sameAs: conciergerie.website ? [conciergerie.website] : undefined,
    contactPoint: conciergerie.phone || conciergerie.email ? {
      '@type': 'ContactPoint',
      telephone: conciergerie.phone,
      email: conciergerie.email,
      contactType: 'customer service',
      availableLanguage: 'French',
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
