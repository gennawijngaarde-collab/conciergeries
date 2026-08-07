/**
 * Génère src/data/conciergerieRemoteLogos.ts depuis public/logos/remote/manifest.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'public', 'logos', 'remote', 'manifest.json');
const outPath = path.join(root, 'src', 'data', 'conciergerieRemoteLogos.ts');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const map = {};
for (const row of manifest) {
  if ((row.status === 'ok' || row.status === 'cached') && row.file) {
    map[row.slug] = row.file;
  }
}

const body = `/* Auto-généré par scripts/generate-remote-logo-map.mjs — ne pas éditer à la main */
export const CONCIERGERIE_REMOTE_LOGOS: Record<string, string> = ${JSON.stringify(map, null, 2)};
`;

fs.writeFileSync(outPath, body);
console.log(`Wrote ${Object.keys(map).length} entries → ${path.relative(root, outPath)}`);
