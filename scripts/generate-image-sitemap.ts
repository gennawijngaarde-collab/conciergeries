/**
 * Génère un sitemap XML dédié aux images (logos des conciergeries)
 * pour améliorer le référencement des images sur Google Images.
 * Usage: npx tsx scripts/generate-image-sitemap.ts
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const ORIGIN = 'https://ma-conciergerie-annuaire.com';

// Import conciergeries data
import conciergeries from '../src/data/conciergeries';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateImageSitemap() {
  const entries: string[] = [];

  // Pour chaque conciergerie, créer une entrée avec son image
  for (const conciergerie of conciergeries) {
    const pageUrl = `${ORIGIN}/conciergerie/${conciergerie.slug}`;
    
    // Déterminer l'URL de l'image du logo
    // Les logos peuvent être des SVG locaux, des PNG remote, ou des URL custom
    let imageUrl = '';
    
    if (conciergerie.logoUrl) {
      imageUrl = conciergerie.logoUrl;
    } else if (conciergerie.logo && conciergerie.logo !== 'default') {
      // Vérifier si c'est un logo remote (PNG)
      const remotePath = `/logos/remote/${conciergerie.slug}.png`;
      imageUrl = `${ORIGIN}${remotePath}`;
    } else {
      // Utiliser le logo par défaut
      imageUrl = `${ORIGIN}/logo.png`;
    }

    const imageCaption = `Logo de ${conciergerie.name} - Conciergerie Airbnb à ${conciergerie.city}`;
    const imageTitle = `${conciergerie.name} - Service de conciergerie professionnel`;
    
    entries.push(`  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:caption>${escapeXml(imageCaption)}</image:caption>
      <image:title>${escapeXml(imageTitle)}</image:title>
      <image:geo_location>${escapeXml(conciergerie.city)}</image:geo_location>
    </image:image>
  </url>`);
  }

  // Page d'accueil avec logo principal
  entries.unshift(`  <url>
    <loc>${ORIGIN}</loc>
    <image:image>
      <image:loc>${ORIGIN}/logo.png</image:loc>
      <image:caption>Conciergeries France - Annuaire des meilleures conciergeries Airbnb en France</image:caption>
      <image:title>Conciergeries France - Logo principal</image:title>
    </image:image>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>`;

  const outDir = join(root, 'public', 'sitemaps');
  mkdirSync(outDir, { recursive: true });
  
  const outPath = join(outDir, 'sitemap-images.xml');
  writeFileSync(outPath, xml, 'utf8');
  
  console.log(`✓ Sitemap d'images généré: ${outPath}`);
  console.log(`  ${entries.length} pages avec images`);
  console.log(`  ${conciergeries.length} logos de conciergeries`);
  
  return outPath;
}

// Générer le sitemap
generateImageSitemap();
