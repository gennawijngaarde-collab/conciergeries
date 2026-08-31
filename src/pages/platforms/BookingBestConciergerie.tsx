import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SeoGenerator } from '@/seo/components/SeoGenerator';
import conciergeries from '@/data/conciergeries';
import type { Conciergerie } from '@/types/conciergerie';
import ConciergerieCard from '@/components/ConciergerieCard';

function getBookingList() {
  return (conciergeries as unknown as Conciergerie[])
    .filter((c) => (c.platforms ?? []).includes('Booking.com'))
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
}

export default function BookingBestConciergerie() {
  const path = '/booking/meilleure-conciergerie-booking';
  const title = 'Meilleure Conciergerie Booking : Comparatif 2026';
  const description =
    "Critères, services et sélection basée sur les données disponibles (plateformes, note, avis). Trouvez une conciergerie qui gère Booking.";

  const list = getBookingList();
  const top = list.slice(0, 9);

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoGenerator
        title={title}
        description={description}
        path={path}
        type="comparatif"
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: 'Booking', path: '/booking' },
          { name: 'Meilleure conciergerie Booking', path },
        ]}
      />

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">Commercial · Booking</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Quelle est la meilleure conciergerie Booking ?
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">
            On ne publie pas de “classement inventé”. Cette page aide à choisir une conciergerie capable de gérer Booking,
            en s’appuyant sur les informations disponibles dans notre annuaire (services, plateformes, note/avis quand présents).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/conciergeries?platform=Booking.com">Trouver une conciergerie Booking</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link to="/booking">Guide Booking</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6 lg:p-8 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Critères de sélection (spécifiques à Booking)</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  <strong>Qualité opérationnelle</strong> : ménage, check-in/out, support voyageurs, gestion incidents.
                </li>
                <li>
                  <strong>Optimisation d’annonce</strong> : photos, équipements, conditions, calendrier, réactivité.
                </li>
                <li>
                  <strong>Pricing & disponibilité</strong> : stratégie prix, restrictions, cohérence multi-plateformes.
                </li>
                <li>
                  <strong>Outils</strong> : PMS / channel manager pour éviter les doubles réservations.
                </li>
                <li>
                  <strong>Transparence</strong> : contrat, reporting, frais, responsabilités.
                </li>
              </ul>
              <p className="text-sm text-gray-600">
                Astuce: demandez toujours un devis détaillé + un exemple de reporting, et vérifiez comment la conciergerie
                synchronise Booking avec Airbnb/Abritel.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 lg:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">CTA</h3>
              <p className="text-sm text-gray-700 mb-4">Recevoir plusieurs propositions adaptées à votre ville.</p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/devis">Trouver une conciergerie Booking</Link>
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                Nous ne créons pas de faux avis. Les listes ci-dessous utilisent les données visibles dans l’annuaire.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Conciergeries recommandées (données annuaire)</h2>
              <p className="text-gray-600 text-sm mt-1">
                {list.length} entreprise{list.length > 1 ? 's' : ''} avec Booking déclaré.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/conciergeries?platform=Booking.com">Voir tout l’annuaire Booking</Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {top.map((c) => (
              <ConciergerieCard key={c.slug} conciergerie={c} />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Méthode: tri par note puis volume d’avis (si présents). Pas de note “Booking” inventée.
          </p>
        </section>
      </div>
    </div>
  );
}

