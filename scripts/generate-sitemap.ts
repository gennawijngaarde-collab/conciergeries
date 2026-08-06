/**
 * Génère public/sitemap.xml (index) + public/sitemaps/*.xml + robots.txt
 * Usage: npm run generate:sitemap
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { enumerateSeoPaths } from '../src/seo/registry/resolve';
import blogPosts from '../src/data/blog-posts';
import conciergeries from '../src/data/conciergeries';
import { airbnbTools } from '../src/data/airbnbTools';
import { airbnbToolCategories } from '../src/data/airbnbToolCategories';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const ORIGIN = 'https://ma-conciergerie-annuaire.com';

const today = new Date().toISOString().slice(0, 10);

const seoPaths = enumerateSeoPaths();

const staticUrls = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/conciergeries', priority: '0.9', changefreq: 'weekly' },
  { path: '/outils-airbnb', priority: '0.9', changefreq: 'weekly' },
  { path: '/outils-airbnb/comparateur', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/devis', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/pms', priority: '0.8', changefreq: 'weekly' },
  { path: '/devenir-partenaire', priority: '0.7', changefreq: 'monthly' },
  { path: '/mentions-legales', priority: '0.3', changefreq: 'yearly' },
  { path: '/confidentialite', priority: '0.3', changefreq: 'yearly' },
  { path: '/cgv', priority: '0.3', changefreq: 'yearly' },
];

function urlXml(path: string, priority: string, changefreq: string) {
  return `  <url>
    <loc>${ORIGIN}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const blogUrls = blogPosts.map((p) =>
  urlXml(`/blog/${p.slug}`, '0.75', 'monthly')
);

const conciergerieUrls = conciergeries.map((c) =>
  urlXml(`/conciergerie/${c.slug}`, '0.7', 'monthly')
);

const toolUrls = [
  ...airbnbToolCategories.map((c) => urlXml(`/outils-airbnb/${c.slug}`, '0.75', 'weekly')),
  ...airbnbTools.map((t) => urlXml(`/outils-airbnb/${t.slug}`, '0.7', 'monthly')),
];

const seoXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${seoPaths.map((u) => urlXml(u.path, String(u.priority), u.changefreq)).join('\n')}
</urlset>
`;

const coreXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map((u) => urlXml(u.path, u.priority, u.changefreq)).join('\n')}
${blogUrls.join('\n')}
${conciergerieUrls.join('\n')}
${toolUrls.join('\n')}
</urlset>
`;

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${ORIGIN}/sitemaps/sitemap-core.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${ORIGIN}/sitemaps/sitemap-seo.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;

const sitemapsDir = join(root, 'public', 'sitemaps');
mkdirSync(sitemapsDir, { recursive: true });
writeFileSync(join(sitemapsDir, 'sitemap-seo.xml'), seoXml);
writeFileSync(join(sitemapsDir, 'sitemap-core.xml'), coreXml);
writeFileSync(join(root, 'public', 'sitemap.xml'), indexXml);

const robots = `User-agent: *
Allow: /

# Pages canoniques = routes React (/blog/..., /conciergerie/...).
# Les fichiers HTML sources ne doivent pas être indexés (contenu dupliqué).
Disallow: /*.html$

Disallow: /admin/
Disallow: /api/
Disallow: /espace-partenaire
Disallow: /compte
Disallow: /pms/dashboard
Disallow: /pms/properties
Disallow: /pms/cleanings

Sitemap: ${ORIGIN}/sitemap.xml
Sitemap: ${ORIGIN}/sitemaps/sitemap-seo.xml
Sitemap: ${ORIGIN}/sitemaps/sitemap-core.xml

User-agent: Googlebot
Allow: /
Disallow: /*.html$

User-agent: Bingbot
Allow: /
Disallow: /*.html$
`;
writeFileSync(join(root, 'public', 'robots.txt'), robots);

console.log(`SEO sitemap: ${seoPaths.length} URLs programmatiques`);
console.log(`Core: ${staticUrls.length} static + ${blogPosts.length} blog + ${conciergeries.length} fiches + ${toolUrls.length} outils`);
console.log('Wrote public/sitemap.xml (index) + public/sitemaps/* + robots.txt');
