import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SeoGenerator } from '@/seo/components/SeoGenerator';
import conciergeries from '@/data/conciergeries';
import type { Conciergerie } from '@/types/conciergerie';
import ConciergerieCard from '@/components/ConciergerieCard';

export default function AbritelHub() {
  const path = '/abritel';
  const title = 'Abritel : Guide, Gestion et Conciergeries';
  const description =
    "Comprendre Abritel (Vrbo) pour les propriétaires : gestion des réservations, optimisation de l’annonce, automatisation et conciergeries spécialisées.";

  const abritelConciergeries = (conciergeries as unknown as Conciergerie[]).filter((c) => {
    const p = c.platforms ?? [];
    return p.includes('Abritel') || p.includes('Vrbo');
  });
  const top = [...abritelConciergeries]
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
          { name: 'Abritel', path },
        ]}
      />

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">Cluster Abritel</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Abritel pour les propriétaires de locations saisonnières
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/abritel/meilleure-conciergerie-abritel">Meilleure conciergerie Abritel</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link to="/conciergeries?platform=Abritel">Trouver une conciergerie Abritel</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6 lg:p-8 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Spécificités Abritel / Vrbo</h2>
              <p className="text-gray-700 leading-relaxed">
                Abritel (Vrbo) est souvent utilisé pour capter une audience “vacances” et des séjours plus longs selon les
                marchés. La qualité des photos, la précision des équipements, les politiques d’annulation et la réactivité
                impactent fortement la performance.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Comme pour Booking, la gestion multi-plateformes devient vite complexe. Les conciergeries et property managers
                s’appuient sur des outils (PMS/channel manager) pour éviter les doubles réservations et harmoniser pricing,
                messages et opérations (ménage, check-in, maintenance).
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="outline">
                  <Link to="/abritel/gestion-abritel">Gestion Abritel</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/abritel/optimiser-annonce-abritel">Optimiser son annonce</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/abritel/commission-abritel">Commissions & frais</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/outils-airbnb/channel-manager">Channel managers</Link>
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Note: les frais/commissions varient selon les pays et les offres; nous privilégions des explications qualitatives.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 lg:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Cas d’usage</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Maisons de vacances</strong> et locations saisonnières orientées familles.
                </li>
                <li>
                  <strong>Multi-canal</strong> (Airbnb + Abritel + Booking) pour réduire la dépendance.
                </li>
                <li>
                  <strong>Propriétaires</strong> cherchant une gestion déléguée (opérations + voyageurs).
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
              <h2 className="text-2xl font-bold text-gray-900">Conciergeries qui gèrent Abritel</h2>
              <p className="text-gray-600 text-sm mt-1">
                {abritelConciergeries.length} entreprise{abritelConciergeries.length > 1 ? 's' : ''} avec Abritel/Vrbo déclaré dans notre base.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/conciergeries?platform=Abritel">Tout voir</Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {top.map((c) => (
              <ConciergerieCard key={c.slug} conciergerie={c} />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">Tri: note puis volume d’avis (quand disponible).</p>
        </section>
      </div>
    </div>
  );
}

