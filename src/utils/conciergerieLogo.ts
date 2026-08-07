import type { Conciergerie } from '@/types/conciergerie';
import { CONCIERGERIE_REMOTE_LOGOS } from '@/data/conciergerieRemoteLogos';

/** Logos SVG présents dans public/logos/ (racine) */
export const LOCAL_CONCIERGERIE_LOGOS = new Set([
  'butler',
  'default',
  'guester',
  'guestready',
  'hoomy',
  'hostnfly',
  'louloue',
  'nestorjeeves',
  'simplyhome',
  'upperkey',
  'wehost',
  'welkeys',
]);

export function websiteHostname(website: string | null | undefined): string | null {
  if (!website?.trim()) return null;
  try {
    const raw = website.trim().startsWith('http') ? website.trim() : `https://${website.trim()}`;
    return new URL(raw).hostname.replace(/^www\./i, '');
  } catch {
    return null;
  }
}

/**
 * Chaîne de candidats logo (du plus spécifique au fallback).
 * 1) logoUrl partenaire / custom
 * 2) Logo remote téléchargé depuis le site officiel
 * 3) SVG local artisanal si disponible
 * 4) Services logo/favicon haute résolution dérivés du domaine
 * 5) default.svg
 */
export function getConciergerieLogoCandidates(
  conciergerie: Pick<Conciergerie, 'logo' | 'logoUrl' | 'website' | 'slug'>
): string[] {
  const out: string[] = [];

  if (conciergerie.logoUrl?.trim()) {
    out.push(conciergerie.logoUrl.trim());
  }

  // SVG locaux artisanaux (meilleure qualité visuelle quand disponibles)
  if (conciergerie.logo && LOCAL_CONCIERGERIE_LOGOS.has(conciergerie.logo)) {
    out.push(`/logos/${conciergerie.logo}.svg`);
  }

  // Logos téléchargés depuis les sites officiels (ou initiales si logo générique)
  const remote = conciergerie.slug ? CONCIERGERIE_REMOTE_LOGOS[conciergerie.slug] : undefined;
  if (remote) {
    out.push(remote);
  }

  const host = websiteHostname(conciergerie.website);
  if (host) {
    // Unavatar agrège Clearbit / Google / etc. → souvent le vrai logo marque
    out.push(`https://unavatar.io/${host}?fallback=false`);
    out.push(`https://icon.horse/icon/${host}`);
    out.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`);
    out.push(`https://icons.duckduckgo.com/ip3/${host}.ico`);
  }

  out.push('/logos/default.svg');

  return [...new Set(out)];
}

/** Première URL à tenter (pour attributs img simples). */
export function resolveConciergerieLogo(
  conciergerie: Pick<Conciergerie, 'logo' | 'logoUrl' | 'website' | 'slug'>
): string {
  return getConciergerieLogoCandidates(conciergerie)[0] ?? '/logos/default.svg';
}
