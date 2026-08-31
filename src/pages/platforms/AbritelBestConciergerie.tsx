import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SeoGenerator } from '@/seo/components/SeoGenerator';
import conciergeries from '@/data/conciergeries';
import type { Conciergerie } from '@/types/conciergerie';
import ConciergerieCard from '@/components/ConciergerieCard';

function getAbritelList() {
  return (conciergeries as unknown as Conciergerie[])
    .filter((c) => {
      const p = c.platforms ?? [];
      return p.includes('Abritel') || p.includes('Vrbo');
    })
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
}

export default function AbritelBestConciergerie() {
  const path = '/abritel/meilleure-conciergerie-abritel';
  const title = 'Meilleure Conciergerie Abritel : Comparatif 2026';
  const description =
    "Critères, services et sélection basée sur les données disponibles (plateformes, note, avis). Trouvez une conciergerie qui gère Abritel/Vrbo.";

  const list = getAbritelList();
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
          { name: 'Abritel', path: '/abritel' },
          { name: 'Meilleure conciergerie Abritel', path },
        ]}
      />

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Badge className="mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">Commercial · Abritel</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Quelle est la meilleure conciergerie Abritel ?
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">
            Abritel (Vrbo) a ses spécificités: audience “vacances”, exigences de présentation et attentes voyageurs.
            Cette page propose une méthode de choix et une sélection basée sur les données de l’annuaire — sans avis inventés.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/conciergeries?platform=Abritel">Trouver une conciergerie Abritel</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link to="/abritel">Guide Abritel</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6 lg:p-8 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Critères de sélection (spécifiques à Abritel/Vrbo)</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  <strong>Qualité de l’annonce</strong> : photos, équipements, précision, conditions et cohérence du calendrier.
                </li>
                <li>
                  <strong>Expérience voyageurs</strong> : check-in, propreté, communication, gestion des incidents.
                </li>
                <li>
                  <strong>Tarification</strong> : stratégie saisonnière, minimum nights, ajustements selon demande locale.
                </li>
                <li>
                  <strong>Outils</strong> : PMS / channel manager pour synchroniser Airbnb/Booking/Abritel.
                </li>
                <li>
                  <strong>Contrat & reporting</strong> : transparence, suivi revenus, obligations.
                </li>
              </ul>
              <p className="text-sm text-gray-600">
                Astuce: privilégiez une conciergerie qui maîtrise vraiment le multi-canal et la qualité opérationnelle (ménage/check-list).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 lg:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">CTA</h3>
              <p className="text-sm text-gray-700 mb-4">Recevoir plusieurs propositions adaptées à votre ville.</p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/devis">Trouver une conciergerie Abritel</Link>
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                Nous n’affichons pas de faux avis. La liste utilise les données visibles dans l’annuaire.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Conciergeries recommandées (données annuaire)</h2>
              <p className="text-gray-600 text-sm mt-1">
                {list.length} entreprise{list.length > 1 ? 's' : ''} avec Abritel/Vrbo déclaré.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/conciergeries?platform=Abritel">Voir tout l’annuaire Abritel</Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {top.map((c) => (
              <ConciergerieCard key={c.slug} conciergerie={c} />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Méthode: tri par note puis volume d’avis (si présents). Pas de note “Abritel” inventée.
          </p>
        </section>
      </div>
    </div>
  );
}

