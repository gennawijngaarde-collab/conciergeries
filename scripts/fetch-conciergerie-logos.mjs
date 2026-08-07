/**
 * Télécharge des logos "réels" (Clearbit / Brandfetch-style via unavatar / icon.horse)
 * pour chaque conciergerie ayant un site, vers public/logos/remote/{slug}.png
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public', 'logos', 'remote');
const dataFile = path.join(root, 'src', 'data', 'conciergeries.ts');

fs.mkdirSync(outDir, { recursive: true });

function hostname(website) {
  try {
    const raw = website.trim().startsWith('http') ? website.trim() : `https://${website.trim()}`;
    return new URL(raw).hostname.replace(/^www\./i, '');
  } catch {
    return null;
  }
}

function parseEntries(raw) {
  // Parse loosely: blocks with slug + website + logo
  const entries = [];
  const blocks = raw.split(/\n\s*\{/).slice(1);
  for (const block of blocks) {
    const slug = block.match(/"slug"\s*:\s*"([^"]+)"/)?.[1];
    const website = block.match(/"website"\s*:\s*("([^"]*)"|null)/)?.[2] ?? null;
    const logo = block.match(/"logo"\s*:\s*"([^"]+)"/)?.[1];
    const name = block.match(/"name"\s*:\s*"([^"]+)"/)?.[1];
    if (slug) entries.push({ slug, website, logo, name });
  }
  return entries;
}

async function tryFetch(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ConciergeriesLogoBot/1.0)',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return null;
  const ctype = (res.headers.get('content-type') || '').toLowerCase();
  if (!ctype.includes('image') && !ctype.includes('octet-stream') && !ctype.includes('icon')) {
    // some CDNs omit content-type; still try if body has bytes
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 200) return null; // too small = likely 1x1 / broken
  // Skip obvious HTML error pages
  const head = buf.subarray(0, 32).toString('utf8').toLowerCase();
  if (head.includes('<!doctype') || head.includes('<html')) return null;
  return { buf, ctype };
}

function pickExt(ctype, buf) {
  if (ctype.includes('svg')) return 'svg';
  if (ctype.includes('webp')) return 'webp';
  if (ctype.includes('jpeg') || ctype.includes('jpg')) return 'jpg';
  if (ctype.includes('gif')) return 'gif';
  // sniff
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'png';
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'jpg';
  if (buf.subarray(0, 4).toString() === 'RIFF') return 'webp';
  if (buf.subarray(0, 5).toString().includes('<?xml') || buf.subarray(0, 4).toString().includes('<svg')) return 'svg';
  return 'png';
}

async function fetchLogoForHost(host) {
  const candidates = [
    // Unavatar aggregates clearbit/google/etc.
    `https://unavatar.io/${host}?fallback=false`,
    `https://icon.horse/icon/${host}`,
    // High-res favicon as last remote attempt
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`,
  ];
  for (const url of candidates) {
    try {
      const got = await tryFetch(url);
      if (got) return { ...got, source: url };
    } catch {
      // next
    }
  }
  return null;
}

const raw = fs.readFileSync(dataFile, 'utf8');
const entries = parseEntries(raw);
const manifest = [];
let ok = 0;
let skip = 0;
let fail = 0;

console.log(`Found ${entries.length} conciergeries`);

for (const entry of entries) {
  const host = hostname(entry.website);
  if (!host) {
    skip++;
    manifest.push({ ...entry, status: 'no-website' });
    continue;
  }

  // Keep existing handcrafted SVGs unless missing remote
  const existingRemote = fs.readdirSync(outDir).find((f) => f.startsWith(`${entry.slug}.`));
  if (existingRemote) {
    ok++;
    manifest.push({
      slug: entry.slug,
      host,
      status: 'cached',
      file: `/logos/remote/${existingRemote}`,
    });
    continue;
  }

  process.stdout.write(`Fetching ${entry.slug} (${host})… `);
  const logo = await fetchLogoForHost(host);
  if (!logo) {
    fail++;
    console.log('FAIL');
    manifest.push({ slug: entry.slug, host, status: 'fail' });
    continue;
  }

  const ext = pickExt(logo.ctype || '', logo.buf);
  const filename = `${entry.slug}.${ext}`;
  fs.writeFileSync(path.join(outDir, filename), logo.buf);
  ok++;
  console.log(`OK (${ext}, ${logo.buf.length}b)`);
  manifest.push({
    slug: entry.slug,
    host,
    status: 'ok',
    file: `/logos/remote/${filename}`,
    source: logo.source,
  });

  // polite delay
  await new Promise((r) => setTimeout(r, 120));
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({ ok, skip, fail, total: entries.length }, null, 2));
