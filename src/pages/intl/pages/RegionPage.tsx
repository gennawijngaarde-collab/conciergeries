import { Link, useParams } from 'react-router-dom';
import type { Country } from '@/types/intl';
import { getRegion } from '@/data/intl/regions';
import { getCitiesByRegion } from '@/data/intl/cities';
import NotFound from '@/pages/NotFound';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IntlSeo from '@/pages/intl/components/IntlSeo';

type Props = { country: Country };

export default function RegionPage({ country }: Props) {
  const { regionSlug } = useParams();
  const region = regionSlug ? getRegion(country.slug, regionSlug) : null;
  if (!region) return <NotFound />;

  const cities = getCitiesByRegion(country.slug, region.slug);
  const path = `/${country.slug}/${region.slug}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <IntlSeo
        title={`${region.name} — ${country.name} | annuaire location courte durée`}
        description={`Explorez les villes et services de location courte durée en ${region.name} (${country.name}).`}
        path={path}
        h1={region.name}
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: country.name, path: `/${country.slug}` },
          { name: region.name, path },
        ]}
        businessesCount={0}
      />
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">{country.name}</Badge>
            <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">{region.name}</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">{region.name}</h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">
            Explorez les villes disponibles et les pages d’annuaire par catégorie (activation progressive).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to={`/${country.slug}`}>Retour {country.name}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link to="/devenir-partenaire">Ajouter mon entreprise</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Villes</h2>
          {cities.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cities.map((c) => (
                <Card key={c.slug} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <p className="font-semibold text-gray-900 mb-2">{c.name}</p>
                    <p className="text-sm text-gray-600 mb-4">
                      Annuaire local et catégories (conciergeries, PMS, ménage…).
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/${country.slug}/${region.slug}/${c.slug}`}>
                        Voir {c.name}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-gray-600">Aucune ville disponible pour le moment.</CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

