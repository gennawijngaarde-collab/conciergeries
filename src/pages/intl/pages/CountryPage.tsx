import { Link } from 'react-router-dom';
import type { Country } from '@/types/intl';
import { getRegionsByCountry } from '@/data/intl/regions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IntlSeo from '@/pages/intl/components/IntlSeo';

type Props = { country: Country };

export default function CountryPage({ country }: Props) {
  const regions = getRegionsByCountry(country.slug);
  const path = `/${country.slug}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <IntlSeo
        title={country.seo_title ?? `${country.name} — annuaire location courte durée`}
        description={
          country.seo_description ??
          `Annuaire et ressources pour la location courte durée en ${country.name}.`
        }
        path={path}
        h1={country.name}
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: country.name, path },
        ]}
        businessesCount={0}
      />
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">
            Annuaire international
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{country.name}</h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">
            {country.seo_description ??
              `Explorez les conciergeries et services de location courte durée en ${country.name}.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/conciergeries">Annuaire France (existant)</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link to="/devis">Demander un devis</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Régions / Provinces</h2>
          {regions.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {regions.map((r) => (
                <Card key={r.slug} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <p className="font-semibold text-gray-900 mb-2">{r.name}</p>
                    <p className="text-sm text-gray-600 mb-4">
                      Pages locales et villes principales (activation progressive).
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/${country.slug}/${r.slug}`}>Voir {r.name}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-gray-600">
                Aucune région disponible pour le moment.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

