/**
 * URL for files served from Vite `public/` (e.g. `/images/blog/foo.svg`).
 * With `base: './'`, prefixing `${BASE_URL}images/...` breaks on nested routes like `/blog/slug`
 * (browser resolves `./images/...` under `/blog/`). Root-absolute `/images/...` matches Vite dev + typical root deploys.
 */
export function resolvePublicAssetUrl(path: string): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const cleaned = path.replace(/^\//, '');
  const base = import.meta.env.BASE_URL;

  if (base === '/' || base === '' || base === './' || base === '.') {
    return `/${cleaned}`;
  }

  const normalized = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normalized}/${cleaned}`;
}
