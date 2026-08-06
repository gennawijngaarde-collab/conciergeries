const CITY_MAP: Record<string, string> = {
  paris: 'Paris',
  lyon: 'Lyon',
  marseille: 'Marseille',
  bordeaux: 'Bordeaux',
  nice: 'Nice',
};

const AFFILIATE_HOST =
  /join\.guesty\.com|gumroad\.com|airdna\.co|eur-invite\.airdna/i;

/** Rewrite legacy /annuaire, *.html article URLs, and absolute site URLs. */
export function rewriteBlogHref(href: string): string {
  let next = href
    .replace(/^https?:\/\/(www\.)?ma-conciergerie-annuaire\.com/i, '')
    .replace(/^\/annuaire\/([^/?#]+)/i, (_m, city: string) => {
      const label = CITY_MAP[city.toLowerCase()] || city;
      return `/conciergeries?city=${encodeURIComponent(label)}`;
    })
    .replace(/^\/annuaire\/?$/i, '/conciergeries');

  // public/*.html → /blog/{slug} (évite duplicate content indexé)
  const htmlArticle = next.match(/^\/([a-z0-9-]+)\.html(?:([?#].*)|$)/i);
  if (htmlArticle) {
    next = `/blog/${htmlArticle[1]}${htmlArticle[2] || ''}`;
  }

  return next;
}

export type ParsedBlogHtml = {
  bodyHtml: string;
  styles: string[];
  title?: string;
  /** Raw JSON-LD payloads from script[type="application/ld+json"] — ignorés côté React (1 seul Article JSON-LD). */
  jsonLd: string[];
};

const UTILITY_BLOCK = `
<section class="blog-utility-injected" style="margin:2.5rem 0;padding:1.5rem;border:1px solid #dbeafe;border-radius:12px;background:#eff6ff;">
  <h2 style="font-size:1.25rem;margin:0 0 0.5rem;color:#111827;">Ressources utiles</h2>
  <p style="margin:0 0 1rem;color:#374151;line-height:1.6;">Comparez des conciergeries, demandez des devis, ou explorez les outils Airbnb — contenu informatif, sans obligation.</p>
  <p style="margin:0;display:flex;flex-wrap:wrap;gap:0.75rem 1.25rem;">
    <a href="/devis" style="color:#1d4ed8;font-weight:600;">Obtenir des devis</a>
    <a href="/conciergeries" style="color:#1d4ed8;font-weight:600;">Annuaire conciergeries</a>
    <a href="/outils-airbnb" style="color:#1d4ed8;font-weight:600;">Outils Airbnb</a>
    <a href="/blog/choisir-conciergerie-airbnb-2026" style="color:#1d4ed8;font-weight:600;">Guide choisir une conciergerie</a>
    <a href="/contact" style="color:#1d4ed8;">Contact</a>
    <a href="/confidentialite" style="color:#1d4ed8;">Confidentialité</a>
  </p>
</section>
`;

/**
 * Parse a full HTML document from /public into injectable article markup.
 * Google + AdSense need the content in the main DOM (not an iframe).
 */
export function parseBlogHtmlDocument(html: string): ParsedBlogHtml {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Ne pas réinjecter le JSON-LD HTML (évite doublons / URLs incorrectes) — React gère Article schema.
  const jsonLd: string[] = [];

  doc.querySelectorAll('script').forEach((el) => el.remove());

  // Contenu éditeur / spam SEO — jamais affiché en production
  doc.querySelectorAll('#pack-seo-editeur, .seo-pack, [data-editor-only]').forEach((el) => el.remove());

  doc.querySelectorAll('a[href]').forEach((anchor) => {
    const a = anchor as HTMLAnchorElement;
    const href = a.getAttribute('href') || '';
    const next = rewriteBlogHref(href);
    if (next !== href) a.setAttribute('href', next);

    if (AFFILIATE_HOST.test(next) || AFFILIATE_HOST.test(href)) {
      const rel = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      rel.add('sponsored');
      rel.add('nofollow');
      a.setAttribute('rel', [...rel].join(' '));
      a.setAttribute('target', '_blank');
    } else if (next.startsWith('/') && !next.startsWith('//')) {
      a.removeAttribute('target');
    }
  });

  const styles = [...doc.querySelectorAll('style')].map((s) => s.textContent || '').filter(Boolean);

  // Injecter un bloc d’utilité publique avant le footer de l’article
  const main = doc.querySelector('main') || doc.body;
  if (main && !main.querySelector('.blog-utility-injected')) {
    main.insertAdjacentHTML('beforeend', UTILITY_BLOCK);
  }

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
