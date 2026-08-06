import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { airbnbToolCategories } from '@/data/airbnbToolCategories';
import type { AirbnbToolCategorySlug } from '@/types/airbnbTool';
import type { SortKey } from '@/utils/airbnbTools';

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  category: AirbnbToolCategorySlug | null;
  onCategoryChange: (v: AirbnbToolCategorySlug | null) => void;
  sort: SortKey;
  onSortChange: (v: SortKey) => void;
  favoritesOnly?: boolean;
  onFavoritesOnlyChange?: (v: boolean) => void;
  showCategoryChips?: boolean;
};

export function ToolFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  showCategoryChips = true,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Rechercher un outil (Guesty, PriceLabs, Nuki…)"
            className="pl-11 h-12 bg-white"
            aria-label="Rechercher un outil Airbnb"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="h-12 rounded-md border border-input bg-white px-3 text-sm"
          aria-label="Trier les outils"
        >
          <option value="note">Trier par note</option>
          <option value="name">Trier par nom</option>
          <option value="price">Trier par prix</option>
        </select>
        {onFavoritesOnlyChange && (
          <Button
            type="button"
            variant={favoritesOnly ? 'default' : 'outline'}
            className={favoritesOnly ? 'bg-blue-600' : ''}
            onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
          >
            Favoris
          </Button>
        )}
      </div>

      {showCategoryChips && (
        <div className="flex flex-wrap gap-2">
          <Badge
            asChild
            className={`cursor-pointer ${!category ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            <button type="button" onClick={() => onCategoryChange(null)}>
              Toutes
            </button>
          </Badge>
          {airbnbToolCategories.map((c) => (
            <Badge
              key={c.slug}
              asChild
              className={`cursor-pointer ${
                category === c.slug
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              <button type="button" onClick={() => onCategoryChange(c.slug)}>
                {c.name}
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
