import { Link } from 'react-router-dom';
import { seoServices } from '@/data/seoServices';
import type { GeoCity } from '@/seo/types';
import { airbnbToolCategories } from '@/data/airbnbToolCategories';

type Props = {
  city?: GeoCity | null;
  showTools?: boolean;
  showGuides?: boolean;
};

/** Maillage interne automatique. */
export function InternalLinks({ city, showTools = true, showGuides = true }: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Liens utiles</h2>

      {city && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Services à {city.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {seoServices.map((s) => (
              <Link
                key={s.slug}
                to={`/${s.urlSegment}-airbnb-${city.slug}`}
                className="text-sm text-blue-700 hover:underline"
              >
                {s.name}
              </Link>
            ))}
            <Link to={`/guide-comment-creer-une-conciergerie-a-${city.slug}`} className="text-sm text-blue-700 hover:underline">
              Créer une conciergerie
            </Link>
            <Link to={`/top-conciergeries-${city.slug}`} className="text-sm text-blue-700 hover:underline">
              Top conciergeries
            </Link>
          </div>
        </div>
      )}

      {showTools && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Catégories d’outils
          </h3>
          <div className="flex flex-wrap gap-2">
            {airbnbToolCategories.slice(0, 8).map((c) => (
              <Link
                key={c.slug}
                to={`/outils-airbnb/${c.slug}`}
                className="text-sm px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {c.name}
              </Link>
            ))}
            <Link to="/top-pms-airbnb" className="text-sm px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              Top PMS
            </Link>
            <Link
              to="/comparatif-guesty-vs-hostaway"
              className="text-sm px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Guesty vs Hostaway
            </Link>
          </div>
        </div>
      )}

      {showGuides && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Guides</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/guide-comment-devenir-co-hote-airbnb" className="text-blue-700 hover:underline">
              Devenir co-hôte
            </Link>
            <Link to="/guide-prix-conciergerie-airbnb" className="text-blue-700 hover:underline">
              Prix d’une conciergerie
            </Link>
            <Link to="/hub" className="text-blue-700 hover:underline">
              Créer sa conciergerie (Hub)
            </Link>
            <Link to="/hub/simulateur-rentabilite" className="text-blue-700 hover:underline">
              Simulateur rentabilité
            </Link>
            <Link to="/outils-airbnb" className="text-blue-700 hover:underline">
              Marketplace outils
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
