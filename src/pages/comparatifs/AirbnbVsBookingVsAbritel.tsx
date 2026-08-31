import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SeoGenerator } from '@/seo/components/SeoGenerator';

type Row = {
  k: string;
  airbnb: string;
  booking: string;
  abritel: string;
};

const rows: Row[] = [
  {
    k: 'Clientèle',
    airbnb: 'Large, variée; forte part de courts séjours selon marchés.',
    booking: 'Très large audience; souvent “réservation de dernière minute” et demand-driven selon zones.',
    abritel: 'Souvent “vacances” et séjours plus longs selon marchés (mais dépend de la destination).',
  },
  {
    k: 'Gestion du calendrier',
    airbnb: 'Simple en natif; devient complexe en multi-canal.',
    booking: 'Très performant mais nécessite une discipline forte en disponibilité/pricing.',
    abritel: 'Bon pour saisonnier; multi-canal recommandé avec PMS/channel manager.',
  },
  {
    k: 'Paiements',
    airbnb: 'Flux intégré Airbnb (selon conditions).',
    booking: 'Variable selon configuration (paiement plateforme vs établissement) et pays.',
    abritel: 'Variable selon offres/marchés; à cadrer dans le contrat de gestion.',
  },
  {
    k: 'Optimisation',
    airbnb: 'Photos, description, prix, réactivité, reviews (quand applicables).',
    booking: 'Très sensible aux conditions, tarifs, disponibilité, contenu et performance service.',
    abritel: 'Très sensible aux visuels, équipements, politique et cohérence des infos.',
  },
  {
    k: 'Outils recommandés',
    airbnb: 'PMS, pricing, automatisation messages, check-in.',
    booking: 'PMS + channel manager quasi indispensables en multi-canal.',
    abritel: 'PMS + channel manager + process ménage/check-in robustes.',
  },
];

export default function AirbnbVsBookingVsAbritel() {
  const path = '/comparatifs/airbnb-vs-booking-vs-abritel';
  const title = 'Airbnb vs Booking vs Abritel : Quelle plateforme choisir en 2026 ?';
  const description =
    'Comparatif clair pour choisir Airbnb, Booking ou Abritel selon votre profil (propriétaire, conciergerie), la destination, la saisonnalité et l’organisation.';

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoGenerator
        title={title}
        description={description}
        path={path}
        type="comparatif"
        breadcrumbs={[
          { name: 'Accueil', path: '/' },
          { name: 'Comparatifs', path: '/comparatifs/airbnb-vs-booking-vs-abritel' },
          { name: 'Airbnb vs Booking vs Abritel', path },
        ]}
      />

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">Comparatif plateformes</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Airbnb vs Booking vs Abritel : quelle plateforme choisir ?
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/conciergeries">Trouver une conciergerie</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link to="/outils-airbnb">Comparer les outils (PMS, channel managers)</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <Card>
          <CardContent className="p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Tableau comparatif (sans chiffres non sourcés)</h2>
            <p className="text-gray-700 mb-6">
              Les frais/commissions dépendent du pays, de la catégorie et des conditions. On privilégie donc une comparaison
              utile et vérifiable: organisation, opérations, multi-canal, outils et cas d’usage.
            </p>
            <div className="overflow-x-auto rounded-xl border bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left p-3 border-b w-44">Critère</th>
                    <th className="text-left p-3 border-b min-w-[220px]">Airbnb</th>
                    <th className="text-left p-3 border-b min-w-[220px]">Booking</th>
                    <th className="text-left p-3 border-b min-w-[220px]">Abritel (Vrbo)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.k} className="align-top">
                      <td className="p-3 border-b font-semibold text-gray-900">{r.k}</td>
                      <td className="p-3 border-b text-gray-700">{r.airbnb}</td>
                      <td className="p-3 border-b text-gray-700">{r.booking}</td>
                      <td className="p-3 border-b text-gray-700">{r.abritel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6 lg:p-8 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Recommandation “multi-canal”</h2>
              <p className="text-gray-700 leading-relaxed">
                Pour la majorité des propriétaires, la meilleure stratégie n’est pas de “choisir une seule plateforme”,
                mais de construire une distribution cohérente. Le point dur devient alors l’exécution: synchro calendrier,
                pricing, messages, ménage, check-in et support.
              </p>
              <p className="text-gray-700 leading-relaxed">
                C’est là qu’un <strong>PMS</strong> et/ou un <strong>channel manager</strong> (et parfois une conciergerie)
                font la différence.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="outline">
                  <Link to="/booking">Guide Booking</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/abritel">Guide Abritel</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/outils-airbnb/channel-manager">Top channel managers</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 lg:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Actions rapides</h3>
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/conciergeries?platform=Booking.com">Conciergeries Booking</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/conciergeries?platform=Abritel">Conciergeries Abritel</Link>
                </Button>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/devis">Obtenir des devis</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

