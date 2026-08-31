import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SeoGenerator } from '@/seo/components/SeoGenerator';
import conciergeries from '@/data/conciergeries';
import type { Conciergerie } from '@/types/conciergerie';
import ConciergerieCard from '@/components/ConciergerieCard';

export default function BookingHub() {
  const path = '/booking';
  const title = 'Booking : Guide, Gestion et Conciergeries';
  const description =
    "Comprendre Booking pour les propriétaires : mise en ligne, gestion des réservations, automatisation, conciergeries spécialisées et outils (PMS, channel managers).";

  const bookingConciergeries = (conciergeries as unknown as Conciergerie[]).filter((c) =>
    (c.platforms ?? []).includes('Booking.com')
  );
  const top = [...bookingConciergeries]
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, 9);

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoGenerator
        title={title}
        description={description}
        path={path}
        type="guide"
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: 'Booking', path },
        ]}
      />

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">Cluster Booking</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Booking pour les propriétaires et les locations saisonnières
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/booking/meilleure-conciergerie-booking">Meilleure conciergerie Booking</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link to="/conciergeries?platform=Booking.com">Trouver une conciergerie Booking</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6 lg:p-8 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Ce que vous devez savoir sur Booking</h2>
              <p className="text-gray-700 leading-relaxed">
                Booking est un canal puissant pour remplir un calendrier, mais la performance dépend fortement de la
                qualité de l’annonce, des conditions, du pricing, de la rapidité de réponse et de la gestion opérationnelle
                (ménage, check-in, support voyageurs).
              </p>
              <p className="text-gray-700 leading-relaxed">
                Plutôt que de “faire du Booking” manuellement, les professionnels s’appuient souvent sur un{' '}
                <strong>PMS</strong> et/ou un <strong>channel manager</strong> pour synchroniser disponibilité, prix et messages
                entre plateformes (Airbnb, Booking, Abritel/Vrbo, Expedia…).
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="outline">
                  <Link to="/booking/gestion-booking">Gestion Booking</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/booking/optimiser-annonce-booking">Optimiser son annonce</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/booking/commission-booking">Commissions & frais</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/outils-airbnb/channel-manager">Channel managers</Link>
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Note: nous évitons d’afficher des chiffres “universels” de commissions sans source, car les frais varient selon
                le pays, la catégorie et les conditions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 lg:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Pour qui ?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Propriétaires</strong> qui veulent diversifier les canaux et stabiliser l’occupation.
                </li>
                <li>
                  <strong>Conciergeries / PM</strong> qui gèrent plusieurs biens et optimisent pricing + opérations.
                </li>
                <li>
                  <strong>Hôtes</strong> qui souhaitent réduire la dépendance à une seule plateforme.
                </li>
              </ul>
              <div className="mt-6">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/devis">Obtenir des devis</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Conciergeries qui gèrent Booking</h2>
              <p className="text-gray-600 text-sm mt-1">
                {bookingConciergeries.length} entreprise{bookingConciergeries.length > 1 ? 's' : ''} avec “Booking.com” déclaré dans notre base.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/conciergeries?platform=Booking.com">Tout voir</Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {top.map((c) => (
              <ConciergerieCard key={c.slug} conciergerie={c} />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Tri: note puis volume d’avis (quand disponible). Nous ne publions pas d’avis inventés.
          </p>
        </section>
      </div>
    </div>
  );
}

