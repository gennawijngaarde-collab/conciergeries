/**
 * Ajoute noindex sur les HTML blog publics (sources injectées dans /blog/:slug).
 * Évite le duplicate content AdSense / Search Console.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const NOINDEX =
  '<meta name="robots" content="noindex, follow" />\n    <link rel="canonical" href="CANONICAL" />';

const files = readdirSync(publicDir).filter((f) => f.endsWith('.html') && f !== 'index.html');

let updated = 0;
for (const file of files) {
  const path = join(publicDir, file);
  let html = readFileSync(path, 'utf8');
  const slug = file.replace(/\.html$/i, '');
  const canonical = `https://ma-conciergerie-annuaire.com/blog/${slug}`;

  if (/name=["']robots["']/i.test(html)) {
    html = html.replace(
      /<meta[^>]+name=["']robots["'][^>]*>/i,
      `<meta name="robots" content="noindex, follow" />`
    );
  } else if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head[^>]*>/i, (m) => `${m}\n    ${NOINDEX.replace('CANONICAL', canonical)}`);
  } else {
    continue;
  }

  if (!/rel=["']canonical["']/i.test(html)) {
    html = html.replace(
      /<meta name="robots" content="noindex, follow" \/>/,
      `<meta name="robots" content="noindex, follow" />\n    <link rel="canonical" href="${canonical}" />`
    );
  } else {
    html = html.replace(
      /<link[^>]+rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${canonical}" />`
    );
  }

  writeFileSync(path, html);
  updated++;
}

console.log(`noindex + canonical applied to ${updated} HTML files`);
