import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolsComparator } from '@/components/tools/ToolsComparator';
import { ToolsSeo } from '@/components/tools/ToolsSeo';
import { getAllTools, getToolBySlug, comparatorToolSlugs } from '@/utils/airbnbTools';

export default function ToolsComparatorPage() {
  const all = getAllTools();
  const [selected, setSelected] = useState<string[]>([...comparatorToolSlugs]);

  const tools = useMemo(
    () => selected.map((s) => getToolBySlug(s)).filter(Boolean) as NonNullable<ReturnType<typeof getToolBySlug>>[],
    [selected]
  );

  const toggle = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) {
        if (prev.length <= 2) return prev;
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 5) return prev;
      return [...prev, slug];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolsSeo
        kind="hub"
        title="Comparateur outils Airbnb — Guesty, Hostaway, Lodgify, Smoobu"
        description="Comparez prix, essai gratuit, sync Airbnb/Booking, automatisation, API et paiements des meilleurs PMS et channel managers."
        path="/outils-airbnb/comparateur"
      />

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Link to="/outils-airbnb" className="inline-flex items-center text-blue-100 hover:text-white text-sm mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Outils Airbnb
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Comparateur dynamique</h1>
          <p className="text-blue-100 max-w-2xl">
            Sélectionnez jusqu’à 5 outils (minimum 2) pour comparer prix, essai, mobile, synchronisations, automatisation, support, API et paiements.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-wrap gap-2">
          {all.map((t) => {
            const active = selected.includes(t.slug);
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => toggle(t.slug)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  active
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                {t.name}
              </button>
            );
          })}
        </div>

        <ToolsComparator tools={tools} />

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/outils-airbnb">Retour au catalogue</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/outils-airbnb/pms">Meilleurs PMS</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/outils-airbnb/channel-manager">Meilleurs Channel Managers</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/outils-airbnb/serrures-connectees">Meilleures serrures</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
