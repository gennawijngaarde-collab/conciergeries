import conciergeries from '@/data/conciergeries';
import type { Conciergerie } from '@/types/conciergerie';
import type { GeoCity } from '@/seo/types';
import { getCitiesByDepartment } from '@/data/geo/cities';
import { geoDepartments } from '@/data/geo/departments';

/** Match souple : token ville présent dans le champ city (souvent multi-villes). */
export function matchesCity(conciergerie: Conciergerie, city: GeoCity): boolean {
  const hay = `${conciergerie.city} ${conciergerie.address ?? ''} ${conciergerie.description}`.toLowerCase();
  const name = city.name.toLowerCase();
  const slugToken = city.slug.replace(/-/g, ' ');
  return hay.includes(name) || hay.includes(slugToken);
}

export function getConciergeriesForCity(city: GeoCity): Conciergerie[] {
  return conciergeries
    .filter((c) => matchesCity(c, city))
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
}

export function getConciergeriesForDepartment(departmentCode: string): Conciergerie[] {
  const cities = getCitiesByDepartment(departmentCode);
  const set = new Map<string | number, Conciergerie>();
  for (const city of cities) {
    for (const c of getConciergeriesForCity(city)) set.set(c.id, c);
  }
  return [...set.values()].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
}

export function getConciergeriesForRegion(regionSlug: string): Conciergerie[] {
  const depts = geoDepartments.filter((d) => d.regionSlug === regionSlug);
  const set = new Map<string | number, Conciergerie>();
  for (const d of depts) {
    for (const c of getConciergeriesForDepartment(d.code)) set.set(c.id, c);
  }
  return [...set.values()].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
}

export function topConciergeries(list: Conciergerie[], limit = 10) {
  return list.slice(0, limit);
}
