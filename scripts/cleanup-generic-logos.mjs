/**
 * Retire du manifest les logos « génériques » (même hash partagé par ≥ N fiches),
 * régénère la map TS, et produit des avatars initiales SVG pour les slugs concernés.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const remoteDir = path.join(root, 'public', 'logos', 'remote');
const initialsDir = path.join(root, 'public', 'logos', 'initials');
const dataFile = path.join(root, 'src', 'data', 'conciergeries.ts');
const manifestPath = path.join(remoteDir, 'manifest.json');
const mapOut = path.join(root, 'src', 'data', 'conciergerieRemoteLogos.ts');

fs.mkdirSync(initialsDir, { recursive: true });

const MIN_UNIQUE = 4; // if same file used by ≥4 listings → treat as junk

function hashFile(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

function parseNames(raw) {
  const map = {};
  const blocks = raw.split(/\n\s*\{/).slice(1);
  for (const block of blocks) {
    const slug = block.match(/"slug"\s*:\s*"([^"]+)"/)?.[1];
    const name = block.match(/"name"\s*:\s*"([^"]+)"/)?.[1];
    if (slug && name) map[slug] = name;
  }
  return map;
}

function initialsFromName(name) {
  const parts = String(name)
    .replace(/[^a-zA-ZÀ-ÿ0-9\s-]/g, ' ')
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function colorFromSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return { bg: `hsl(${hue} 45% 92%)`, fg: `hsl(${hue} 55% 32%)` };
}

function writeInitialsSvg(slug, name) {
  const letters = initialsFromName(name);
  const { bg, fg } = colorFromSlug(slug);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="24" fill="${bg}"/>
  <text x="64" y="64" text-anchor="middle" dominant-baseline="central" font-family="system-ui,Segoe UI,sans-serif" font-size="48" font-weight="700" fill="${fg}">${letters}</text>
</svg>`;
  const file = `${slug}.svg`;
  fs.writeFileSync(path.join(initialsDir, file), svg);
  return `/logos/initials/${file}`;
}

const names = parseNames(fs.readFileSync(dataFile, 'utf8'));
const files = fs.readdirSync(remoteDir).filter((f) => f !== 'manifest.json');
const byHash = new Map();
for (const f of files) {
  const p = path.join(remoteDir, f);
  const h = hashFile(p);
  if (!byHash.has(h)) byHash.set(h, []);
  byHash.get(h).push(f);
}

const junkFiles = new Set();
for (const [, list] of byHash) {
  if (list.length >= MIN_UNIQUE) {
    for (const f of list) junkFiles.add(f);
  }
}

const map = {};
let kept = 0;
let replaced = 0;

for (const f of files) {
  const slug = f.replace(/\.(png|jpe?g|webp|svg)$/i, '');
  if (junkFiles.has(f)) {
    map[slug] = writeInitialsSvg(slug, names[slug] || slug);
    replaced++;
  } else {
    map[slug] = `/logos/remote/${f}`;
    kept++;
  }
}

// Also ensure every slug in data has at least initials
for (const [slug, name] of Object.entries(names)) {
  if (!map[slug]) {
    map[slug] = writeInitialsSvg(slug, name);
    replaced++;
  }
}

const body = `/* Auto-généré — ne pas éditer à la main */
export const CONCIERGERIE_REMOTE_LOGOS: Record<string, string> = ${JSON.stringify(map, null, 2)};
`;
fs.writeFileSync(mapOut, body);

console.log(
  JSON.stringify(
    {
      totalMapped: Object.keys(map).length,
      uniqueBrandLogos: kept,
      initialsFallbacks: replaced,
      junkDuplicateFiles: junkFiles.size,
    },
    null,
    2,
  ),
);
