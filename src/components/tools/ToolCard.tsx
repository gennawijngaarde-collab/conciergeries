import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { AirbnbTool } from '@/types/airbnbTool';
import { getCategoryBySlug } from '@/data/airbnbToolCategories';

type Props = {
  tool: AirbnbTool;
  favorite?: boolean;
  onToggleFavorite?: (slug: string) => void;
};

export function ToolCard({ tool, favorite, onToggleFavorite }: Props) {
  const category = getCategoryBySlug(tool.category);

  return (
    <Card className="group h-full overflow-hidden border-gray-200 hover:shadow-xl transition-shadow flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative aspect-[16/9] bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
          <img
            src={tool.image}
            alt={`${tool.name} — outil Airbnb`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {(tool.badges ?? []).slice(0, 2).map((b) => (
              <Badge key={b} className="bg-white/95 text-gray-900 border-0 shadow-sm">
                {b}
              </Badge>
            ))}
          </div>
          {onToggleFavorite && (
            <button
              type="button"
              aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(tool.slug);
              }}
              className="absolute top-3 right-3 rounded-full bg-white/95 p-2 shadow hover:bg-white"
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <img
              src={tool.logo}
              alt=""
              className="w-9 h-9 rounded-lg bg-white object-contain p-1 shadow"
              loading="lazy"
            />
            <span className="text-white font-semibold drop-shadow">{tool.name}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 mb-2 text-sm">
            <span className="text-blue-700 font-medium">{category?.name ?? tool.category}</span>
            <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {tool.note.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">{tool.description}</p>
          <p className="text-sm font-semibold text-gray-900 mb-4">{tool.priceLabel}</p>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link to={`/outils-airbnb/${tool.slug}`}>Découvrir</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
