import { readFileSync, writeFileSync } from 'node:fs';

const p = new URL('../public/airdna-avis-investissement-airbnb.html', import.meta.url);
let s = readFileSync(p, 'utf8');
const re = /<aside class="seo-pack" id="pack-seo-editeur">[\s\S]*?<\/aside>/;
if (!re.test(s)) {
  console.error('pack not found');
  process.exit(1);
}
s = s.replace(re, '');
writeFileSync(p, s);
console.log('removed pack-seo-editeur from AirDNA article');
