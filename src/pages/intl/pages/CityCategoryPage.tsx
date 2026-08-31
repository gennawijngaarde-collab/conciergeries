import { Link, useParams } from 'react-router-dom';
import type { Country } from '@/types/intl';
import { getRegion } from '@/data/intl/regions';
import { getCity } from '@/data/intl/cities';
import NotFound from '@/pages/NotFound';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IntlSeo from '@/pages/intl/components/IntlSeo';

type Props = { country: Country };

/**
 * Page ville + catégorie (ex: /france/ile-de-france/paris/conciergeries-airbnb)
 * La règle noindex + contenu local arrive à l'étape suivante (thin content).
 */
export default function CityCategoryPage({ country }: Props) {
  const { regionSlug, citySlug, categorySlug } = useParams();
  const region = regionSlug ? getRegion(country.slug, regionSlug) : null;
  const city = region && citySlug ? getCity(country.slug, region.slug, citySlug) : null;
  if (!region || !city || !categorySlug) return <NotFound />;

  const isFrance = country.slug === 'france';
  const path = `/${country.slug}/${region.slug}/${city.slug}/${categorySlug}`;

  const kind = String(categorySlug).toLowerCase();
  const platform =
    kind.includes('booking') ? 'booking' : kind.includes('abritel') ? 'abritel' : 'airbnb';

  const h1 =
    platform === 'booking'
      ? `Conciergeries Booking à ${city.name}`
      : platform === 'abritel'
        ? `Conciergeries Abritel à ${city.name}`
        : `Conciergeries Airbnb à ${city.name}`;

  // Placeholder for now (we will wire real filtering next).
  const businessesCount = isFrance ? 0 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <IntlSeo
        title={`${h1} | ${country.name}`}
        description={
          businessesCount
            ? `Trouvez ${h1.toLowerCase()} : ${businessesCount} entreprise${businessesCount > 1 ? 's' : ''} vérifiée${businessesCount > 1 ? 's' : ''}, services et contacts.`
            : `Page en cours d’activation pour ${city.name} (${country.name}). Ajoutez votre entreprise pour activer l’annuaire local.`
        }
        path={path}
        h1={h1}
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: country.name, path: `/${country.slug}` },
          { name: region.name, path: `/${country.slug}/${region.slug}` },
          { name: city.name, path: `/${country.slug}/${region.slug}/${city.slug}` },
          { name: categorySlug, path },
        ]}
        businessesCount={businessesCount}
      />
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">{country.name}</Badge>
            <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">{region.name}</Badge>
            <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">{city.name}</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">{h1}</h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">
            {businessesCount
              ? `${businessesCount} entreprise${businessesCount > 1 ? 's' : ''} disponible${businessesCount > 1 ? 's' : ''}.`
              : `Page en cours d’activation : nous n’avons pas encore assez d’entreprises vérifiées pour ${city.name}.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to={`/${country.slug}/${region.slug}`}>Retour {region.name}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link to="/devenir-partenaire">Ajouter ma conciergerie</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <Card>
          <CardContent className="p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Annuaire local</h2>
            <p className="text-gray-700 leading-relaxed">
              Cette page est prête à recevoir des entreprises par ville/catégorie. À l’étape suivante, on ajoute le
              seuil anti “thin content” (noindex/follow si trop peu d’entreprises), des FAQ locales, du maillage interne
              et la génération sitemap par pays.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button asChild variant="outline">
                <Link to="/conciergeries">Voir l’annuaire France (existant)</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/outils-airbnb">Outils Airbnb</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/devis">Demander des devis</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

