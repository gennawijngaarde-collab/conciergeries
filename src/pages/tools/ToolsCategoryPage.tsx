import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolFilters } from '@/components/tools/ToolFilters';
import { ToolsSeo } from '@/components/tools/ToolsSeo';
import { getCategoryIcon } from '@/components/tools/categoryIcons';
import type { AirbnbToolCategory } from '@/types/airbnbTool';
import {
  getFavorites,
  getToolsByCategory,
  searchTools,
  sortTools,
  toggleFavorite,
  type SortKey,
} from '@/utils/airbnbTools';

const PAGE_SIZE = 9;

type Props = {
  category: AirbnbToolCategory;
};

export default function ToolsCategoryPage({ category }: Props) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('note');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const Icon = getCategoryIcon(category.slug);

  useEffect(() => {
    setFavorites(getFavorites());
    setQuery('');
    setPage(1);
  }, [category.slug]);

  const filtered = useMemo(() => {
    const base = searchTools(query, category.slug);
    return sortTools(base.length ? base : getToolsByCategory(category.slug), sort);
  }, [query, category.slug, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolsSeo kind="category" category={category} path={`/outils-airbnb/${category.slug}`} />

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <Link to="/outils-airbnb" className="inline-flex items-center text-blue-100 hover:text-white text-sm mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Tous les outils
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">{category.name}</h1>
              <p className="text-lg text-blue-100 max-w-2xl">{category.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <ToolFilters
          query={query}
          onQueryChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          category={category.slug}
          onCategoryChange={() => undefined}
          sort={sort}
          onSortChange={(v) => {
            setSort(v);
            setPage(1);
          }}
          showCategoryChips={false}
        />

        <p className="text-sm text-gray-500">
          {filtered.length} outil{filtered.length > 1 ? 's' : ''} dans cette catégorie
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pageItems.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              favorite={favorites.includes(tool.slug)}
              onToggleFavorite={(slug) => setFavorites(toggleFavorite(slug))}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-gray-600">
              Aucun outil pour le moment. Revenez bientôt ou explorez le{' '}
              <Link to="/outils-airbnb" className="text-blue-600 hover:underline">
                catalogue complet
              </Link>
              .
            </CardContent>
          </Card>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Précédent
            </Button>
            <span className="inline-flex items-center px-3 text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Suivant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
