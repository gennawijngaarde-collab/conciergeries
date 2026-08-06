import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { SeoBreadcrumbItem } from '@/seo/types';

type Props = {
  items: SeoBreadcrumbItem[];
  variant?: 'light' | 'dark';
};

export function BreadcrumbGenerator({ items, variant = 'light' }: Props) {
  const isDark = variant === 'dark';

  return (
    <nav aria-label="Fil d'Ariane" className={`text-sm mb-6 ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path + item.name} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              {last ? (
                <span className={isDark ? 'text-white font-medium' : 'text-gray-800 font-medium'}>
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-blue-600'}`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
