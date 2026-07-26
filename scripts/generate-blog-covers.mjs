import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogPostsPath = path.join(root, 'src', 'data', 'blog-posts.ts');
const outDir = path.join(root, 'public', 'images', 'blog');

const source = fs.readFileSync(blogPostsPath, 'utf8');
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

function wrapTitle(title, max = 28) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > max && line) {
      lines.push(line);
      line = w;
      if (lines.length === 2) break;
    } else {
      line = next;
    }
  }
  if (lines.length < 2 && line) lines.push(line);
  if (words.join(' ').length > lines.join(' ').length) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = `${last.replace(/\s+\S*$/, '')}…`;
  }
  return lines.slice(0, 2);
}

fs.mkdirSync(outDir, { recursive: true });

let created = 0;
let skipped = 0;

for (let i = 0; i < posts.length; i++) {
  const { slug, title, category } = posts[i];
  const file = path.join(outDir, `${slug}.svg`);
  if (fs.existsSync(file) && slug === 'formation-conciergerie-airbnb-livre-numerique') {
    skipped += 1;
    continue;
  }

  const [c1, c2] = palettes[i % palettes.length];
  const lines = wrapTitle(title);
  const y1 = 210;
  const titleSvg = lines
    .map(
      (line, idx) =>
        `<text x="70" y="${y1 + idx * 58}" fill="white" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="700">${esc(line)}</text>`
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
  <circle cx="980" cy="120" r="180" fill="rgba(255,255,255,0.08)"/>
  <circle cx="1080" cy="480" r="220" fill="rgba(255,255,255,0.06)"/>
  <rect x="56" y="56" width="1088" height="518" rx="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)"/>
  <text x="70" y="140" fill="rgba(255,255,255,0.9)" font-family="system-ui,Segoe UI,Arial" font-size="24" letter-spacing="2">${esc(category.toUpperCase())}</text>
  ${titleSvg}
  <text x="70" y="520" fill="rgba(255,255,255,0.85)" font-family="system-ui,Segoe UI,Arial" font-size="22">ma-conciergerie-annuaire.com</text>
</svg>
`;

  fs.writeFileSync(file, svg, 'utf8');
  created += 1;
}

console.log(JSON.stringify({ posts: posts.length, created, skipped, outDir }, null, 2));
