import { Link } from 'react-router-dom';
import { getCityBySlug } from '@/data/geo/cities';
import type { GeoCity } from '@/seo/types';

type Props = {
  city?: GeoCity | null;
  title?: string;
};

export function RelatedCities({ city, title = 'Villes voisines' }: Props) {
  if (!city?.nearby?.length) return null;
  const related = city.nearby.map((s) => getCityBySlug(s)).filter(Boolean) as GeoCity[];
  if (!related.length) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {related.map((c) => (
          <Link
            key={c.slug}
            to={`/conciergerie-${c.slug}`}
            className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 transition-colors"
          >
            Conciergerie {c.name}
          </Link>
        ))}
        {related.map((c) => (
          <Link
            key={`v-${c.slug}`}
            to={`/ville-${c.slug}`}
            className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
