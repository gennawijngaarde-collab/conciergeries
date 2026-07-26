import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const eyebrow = String.fromCharCode(70, 79, 82, 77, 65, 84, 73, 79, 78);
const out = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'images',
  'blog',
  'formation-conciergerie-airbnb-livre-numerique.svg'
);

const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img">',
  '  <defs>',
  '    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">',
  '      <stop offset="0" stop-color="#0f1f3d"/>',
  '      <stop offset="1" stop-color="#1a2d52"/>',
  '    </linearGradient>',
  '  </defs>',
  '  <rect width="1200" height="630" fill="url(#bg)"/>',
  '  <circle cx="1020" cy="90" r="200" fill="rgba(201,168,76,0.12)"/>',
  '  <rect x="56" y="56" width="1088" height="518" rx="28" fill="rgba(255,255,255,0.06)" stroke="rgba(201,168,76,0.35)"/>',
  `  <text x="90" y="150" fill="#c9a84c" font-family="system-ui,Segoe UI,Arial" font-size="24" letter-spacing="3">${eyebrow}</text>`,
  '  <text x="90" y="250" fill="#ffffff" font-family="Georgia,serif" font-size="64" font-weight="700">Conciergerie Airbnb</text>',
  '  <text x="90" y="320" fill="rgba(255,255,255,0.9)" font-family="system-ui,Segoe UI,Arial" font-size="32">De zero a rentable - guide complet 2026</text>',
  '  <text x="90" y="400" fill="rgba(255,255,255,0.75)" font-family="system-ui,Segoe UI,Arial" font-size="22">Statut - Business plan - SEO - Fiscalite</text>',
  '  <text x="90" y="520" fill="rgba(255,255,255,0.7)" font-family="system-ui,Segoe UI,Arial" font-size="20">ma-conciergerie-annuaire.com</text>',
  '</svg>',
  '',
].join('\n');

fs.writeFileSync(out, svg, 'utf8');
console.log('ok', eyebrow, fs.statSync(out).size);
