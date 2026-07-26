import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'src', 'data', 'blog-posts.ts');
let source = fs.readFileSync(file, 'utf8');

const blocks = source.split(/\n  \{\n/);
const out = [blocks[0]];
let updated = 0;

for (let i = 1; i < blocks.length; i++) {
  let block = blocks[i];
  const slug = block.match(/slug:\s*['"]([^'"]+)['"]/)?.[1];
  if (!slug || slug === 'formation-conciergerie-airbnb-livre-numerique') {
    out.push(block);
    continue;
  }
  const nextImage = `image: '/images/blog/${slug}.svg'`;
  if (/image:\s*['"][^'"]*['"]/.test(block)) {
    block = block.replace(/image:\s*['"][^'"]*['"]/, nextImage);
    updated += 1;
  }
  out.push(block);
}

fs.writeFileSync(file, out.join('\n  {\n'), 'utf8');
console.log(`Updated ${updated} image paths`);
