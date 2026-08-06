import airbnbTools from '@/data/airbnbTools';
import { getCategoryBySlug } from '@/data/airbnbToolCategories';
import type { AirbnbTool, AirbnbToolCategorySlug } from '@/types/airbnbTool';

const FAV_KEY = 'outils_airbnb_favorites';
const CLICK_KEY = 'outils_airbnb_clicks';

export function getAllTools() {
  return airbnbTools;
}

export function getToolBySlug(slug: string): AirbnbTool | null {
  return airbnbTools.find((t) => t.slug === slug) ?? null;
}

export function getToolsByCategory(category: AirbnbToolCategorySlug) {
  return airbnbTools.filter((t) => t.category === category);
}

export function getFeaturedTools(limit = 8) {
  return airbnbTools.filter((t) => t.featured).slice(0, limit);
}

export function getTopTools(limit = 10) {
  return [...airbnbTools].sort((a, b) => b.note - a.note).slice(0, limit);
}

export function searchTools(query: string, category?: AirbnbToolCategorySlug | null) {
  const q = query.trim().toLowerCase();
  return airbnbTools.filter((t) => {
    if (category && t.category !== category) return false;
    if (!q) return true;
    const hay = [t.name, t.description, t.category, ...(t.badges ?? []), ...t.fonctionnalites]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getAlternatives(tool: AirbnbTool) {
  return (tool.alternatives ?? [])
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is AirbnbTool => Boolean(t));
}

export function resolveSlug(slug: string): { type: 'category' | 'tool'; value: NonNullable<ReturnType<typeof getCategoryBySlug> | AirbnbTool> } | null {
  const cat = getCategoryBySlug(slug);
  if (cat) return { type: 'category', value: cat };
  const tool = getToolBySlug(slug);
  if (tool) return { type: 'tool', value: tool };
  return null;
}

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(slug: string): string[] {
  const current = new Set(getFavorites());
  if (current.has(slug)) current.delete(slug);
  else current.add(slug);
  const next = [...current];
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}

export function trackAffiliateClick(toolSlug: string, url: string) {
  try {
    const raw = localStorage.getItem(CLICK_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[toolSlug] = (map[toolSlug] ?? 0) + 1;
    localStorage.setItem(CLICK_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && 'gtag' in window) {
    try {
      // @ts-expect-error optional analytics
      window.gtag?.('event', 'affiliate_click', { tool: toolSlug, url });
    } catch {
      /* ignore */
    }
  }
}

export function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export const comparatorToolSlugs = ['guesty', 'hostaway', 'lodgify', 'smoobu'] as const;

export type SortKey = 'note' | 'name' | 'price';

export function sortTools(tools: AirbnbTool[], sort: SortKey) {
  const copy = [...tools];
  if (sort === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  if (sort === 'price') {
    return copy.sort((a, b) => (a.priceFrom ?? 9999) - (b.priceFrom ?? 9999));
  }
  return copy.sort((a, b) => b.note - a.note);
}
