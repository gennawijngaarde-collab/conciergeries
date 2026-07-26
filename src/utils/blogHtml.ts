const CITY_MAP: Record<string, string> = {
  paris: 'Paris',
  lyon: 'Lyon',
  marseille: 'Marseille',
  bordeaux: 'Bordeaux',
  nice: 'Nice',
};

/** Rewrite legacy /annuaire links and absolute site URLs for in-app navigation. */
export function rewriteBlogHref(href: string): string {
  return href
    .replace(/^https?:\/\/(www\.)?ma-conciergerie-annuaire\.com/i, '')
    .replace(/^\/annuaire\/([^/?#]+)/i, (_m, city: string) => {
      const label = CITY_MAP[city.toLowerCase()] || city;
      return `/conciergeries?city=${encodeURIComponent(label)}`;
    })
    .replace(/^\/annuaire\/?$/i, '/conciergeries');
}

export type ParsedBlogHtml = {
  bodyHtml: string;
  styles: string[];
  title?: string;
  /** Raw JSON-LD payloads from script[type="application/ld+json"] */
  jsonLd: string[];
};

/**
 * Parse a full HTML document from /public into injectable article markup.
 * Google + AdSense need the content in the main DOM (not an iframe).
 */
export function parseBlogHtmlDocument(html: string): ParsedBlogHtml {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const jsonLd = [...doc.querySelectorAll('script[type="application/ld+json"]')]
    .map((s) => (s.textContent || '').trim())
    .filter(Boolean);

  doc.querySelectorAll('script').forEach((el) => el.remove());

  doc.querySelectorAll('a[href]').forEach((anchor) => {
    const a = anchor as HTMLAnchorElement;
    const href = a.getAttribute('href') || '';
    const next = rewriteBlogHref(href);
    if (next !== href) a.setAttribute('href', next);
    if (next.startsWith('/') && !next.startsWith('//')) {
      a.removeAttribute('target');
    }
  });

  const styles = [...doc.querySelectorAll('style')].map((s) => s.textContent || '').filter(Boolean);
  const bodyHtml = doc.body?.innerHTML?.trim() || html;
  const title = doc.querySelector('title')?.textContent?.trim();

  return { bodyHtml, styles, title, jsonLd };
}

export async function fetchBlogHtml(path: string): Promise<ParsedBlogHtml> {
  const res = await fetch(path, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`Impossible de charger l'article (${res.status})`);
  const html = await res.text();
  return parseBlogHtmlDocument(html);
}
