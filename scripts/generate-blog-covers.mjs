import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogPostsPath = path.join(root, 'src', 'data', 'blog-posts.ts');
const outDir = path.join(root, 'public', 'images', 'blog');

const source = fs.readFileSync(blogPostsPath, 'utf8').replace(/\r\n/g, '\n');
const posts = [];
const blocks = source.split(/\n  \{\n/).slice(1);

for (const block of blocks) {
  const slug = block.match(/slug:\s*['"]([^'"]+)['"]/)?.[1];
  const title = block.match(/title:\s*['"]([^'"]+)['"]/)?.[1];
  const category = block.match(/category:\s*['"]([^'"]+)['"]/)?.[1] || 'Blog';
  if (slug && title) posts.push({ slug, title, category });
}

const palettes = [
  ['#0f766e', '#115e59'],
  ['#1d4ed8', '#1e3a8a'],
  ['#b45309', '#7c2d12'],
  ['#047857', '#064e3b'],
  ['#4338ca', '#312e81'],
  ['#0e7490', '#155e75'],
  ['#be123c', '#9f1239'],
  ['#334155', '#0f172a'],
];

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Wrap title into up to 3 readable lines (safe for 1200px covers). */
function wrapTitle(title, maxChars = 34) {
  const clean = title.replace(/\s+/g, ' ').trim();
  const words = clean.split(' ');
  const lines = [];
  let line = '';

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
      if (lines.length === 3) {
        line = '';
        break;
      }
    } else {
      line = next;
    }
  }
  if (line && lines.length < 3) lines.push(line);

  const joined = lines.join(' ');
  if (joined.length < clean.length && lines.length) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = (last.length > 3 ? last.slice(0, Math.max(3, last.length - 1)) : last).replace(/\s+\S*$/, '') + '…';
  }

  return lines.slice(0, 3);
}

fs.mkdirSync(outDir, { recursive: true });
let created = 0;

for (let i = 0; i < posts.length; i++) {
  const { slug, title, category } = posts[i];
  const file = path.join(outDir, `${slug}.svg`);
  const [c1, c2] = palettes[i % palettes.length];
  const lines = wrapTitle(title);
  const lineCount = Math.max(lines.length, 1);
  const fontSize = lineCount >= 3 ? 36 : 42;
  const lineHeight = lineCount >= 3 ? 48 : 54;
  // Center title block vertically between category and footer
  const blockHeight = lineCount * lineHeight;
  const yStart = Math.round(280 - blockHeight / 2);

  const titleSvg = lines
    .map(
      (line, idx) =>
        `<text x="96" y="${yStart + idx * lineHeight}" fill="#ffffff" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="700">${esc(line)}</text>`
    )
    .join('\n  ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1040" cy="80" r="160" fill="rgba(255,255,255,0.07)"/>
  <circle cx="80" cy="560" r="120" fill="rgba(255,255,255,0.05)"/>
  <rect x="48" y="48" width="1104" height="534" rx="24" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.16)"/>
  <text x="96" y="120" fill="rgba(255,255,255,0.92)" font-family="system-ui,Segoe UI,Arial" font-size="22" letter-spacing="2.5">${esc(category.toUpperCase())}</text>
  ${titleSvg}
  <text x="96" y="545" fill="rgba(255,255,255,0.8)" font-family="system-ui,Segoe UI,Arial" font-size="20">ma-conciergerie-annuaire.com</text>
</svg>
`;

  fs.writeFileSync(file, svg, 'utf8');
  created += 1;
}

console.log(JSON.stringify({ posts: posts.length, created, outDir }, null, 2));
