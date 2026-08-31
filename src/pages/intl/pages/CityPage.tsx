import { Link, useParams } from 'react-router-dom';
import type { Country } from '@/types/intl';
import { getRegion } from '@/data/intl/regions';
import { getCity } from '@/data/intl/cities';
import NotFound from '@/pages/NotFound';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IntlSeo from '@/pages/intl/components/IntlSeo';
import conciergeries from '@/data/conciergeries';
import type { Conciergerie } from '@/types/conciergerie';

type Props = { country: Country };

function matchesCityLoose(conciergerie: Conciergerie, cityName: string, citySlug: string) {
  const hay = `${conciergerie.city} ${conciergerie.address ?? ''} ${conciergerie.description}`.toLowerCase();
  const name = cityName.toLowerCase();
  const slugToken = citySlug.replace(/-/g, ' ');
  return hay.includes(name) || hay.includes(slugToken);
}

function countFor(cityName: string, citySlug: string, platform: 'airbnb' | 'booking' | 'abritel') {
  const list = conciergeries as unknown as Conciergerie[];
  const platformMatch = (c: Conciergerie) => {
    const p = c.platforms ?? [];
    if (platform === 'airbnb') return p.includes('Airbnb');
    if (platform === 'booking') return p.includes('Booking.com');
    return p.includes('Abritel') || p.includes('Vrbo');
  };
  return list.filter((c) => matchesCityLoose(c, cityName, citySlug) && platformMatch(c)).length;
}

export default function CityPage({ country }: Props) {
  const { regionSlug, citySlug } = useParams();
  const region = regionSlug ? getRegion(country.slug, regionSlug) : null;
  const city = region && citySlug ? getCity(country.slug, region.slug, citySlug) : null;
  if (!region || !city) return <NotFound />;

  const path = `/${country.slug}/${region.slug}/${city.slug}`;

  // For now, we only have reliable business data for France via the existing conciergerie dataset.
  const isFrance = country.slug === 'france';
  const countAirbnb = isFrance ? countFor(city.name, city.slug, 'airbnb') : 0;
  const countBooking = isFrance ? countFor(city.name, city.slug, 'booking') : 0;
  const countAbritel = isFrance ? countFor(city.name, city.slug, 'abritel') : 0;
  const total = countAirbnb + countBooking + countAbritel;

  return (
    <div className="min-h-screen bg-gray-50">
      <IntlSeo
        title={`${city.name} — ${country.name} | Annuaire location courte durée`}
        description={`Pages locales pour ${city.name} : conciergeries Airbnb, Booking, Abritel/Vrbo, services et guides.`}
        path={path}
        h1={city.name}
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: country.name, path: `/${country.slug}` },
          { name: region.name, path: `/${country.slug}/${region.slug}` },
          { name: city.name, path },
        ]}
        businessesCount={total}
        hasSubstantialLocalContent={isFrance && total >= 1}
      />

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">{country.name}</Badge>
            <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">{region.name}</Badge>
            <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">{city.name}</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">{city.name}</h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">
            Hub local: pages “conciergerie” par plateforme (Airbnb, Booking, Abritel/Vrbo) + services.
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
              <Link to="/devis">Demander des devis</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="font-semibold text-gray-900 mb-2">Conciergeries Airbnb</p>
              <p className="text-sm text-gray-600 mb-4">
                {isFrance ? `${countAirbnb} entreprise(s) détectée(s)` : 'Activation progressive'}
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to={`${path}/conciergeries-airbnb`}>Voir</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="font-semibold text-gray-900 mb-2">Conciergeries Booking</p>
              <p className="text-sm text-gray-600 mb-4">
                {isFrance ? `${countBooking} entreprise(s) détectée(s)` : 'Activation progressive'}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to={`${path}/conciergerie-booking`}>Voir</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="font-semibold text-gray-900 mb-2">Conciergeries Abritel</p>
              <p className="text-sm text-gray-600 mb-4">
                {isFrance ? `${countAbritel} entreprise(s) détectée(s)` : 'Activation progressive'}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to={`${path}/conciergerie-abritel`}>Voir</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

