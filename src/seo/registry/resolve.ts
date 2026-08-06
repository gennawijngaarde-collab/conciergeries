import { airbnbTools } from '@/data/airbnbTools';
import { airbnbToolCategories } from '@/data/airbnbToolCategories';
import { geoCities, getCityBySlug } from '@/data/geo/cities';
import { geoCountries, getCountryBySlug } from '@/data/geo/countries';
import { geoDepartments, getDepartmentByCode, getDepartmentBySlug } from '@/data/geo/departments';
import { geoRegions, getRegionBySlug } from '@/data/geo/regions';
import { guideTemplates } from '@/data/seoGuides';
import { getServiceByUrlSegment, seoServices } from '@/data/seoServices';
import { generateFaqs } from '@/seo/content/faqGenerator';
import { getConciergeriesForCity, getConciergeriesForDepartment, getConciergeriesForRegion } from '@/seo/services/conciergeriesByGeo';
import type { SeoPageDefinition, SeoPageType } from '@/seo/types';
import { fillPattern } from '@/utils/seo/slugify';

const RESERVED = new Set([
  'conciergeries',
  'conciergerie',
  'blog',
  'contact',
  'devis',
  'faq',
  'compte',
  'pms',
  'outils-airbnb',
  'devenir-partenaire',
  'mentions-legales',
  'confidentialite',
  'cgv',
  'espace-partenaire',
  'reinitialiser-mot-de-passe',
  'index.html',
]);

/** Paires de comparatifs outils (extensible). */
export const toolComparePairs: [string, string][] = [
  ['guesty', 'hostaway'],
  ['guesty', 'lodgify'],
  ['hostaway', 'lodgify'],
  ['guesty', 'smoobu'],
  ['pricelabs', 'wheelhouse'],
  ['pricelabs', 'beyond-pricing'],
  ['wheelhouse', 'beyond-pricing'],
  ['nuki', 'tedee'],
  ['nuki', 'yale'],
  ['zapier', 'make'],
];

function crumbs(...items: { name: string; path: string }[]) {
  return [{ name: 'Accueil', path: '/' }, { name: 'Annuaire', path: '/conciergeries' }, ...items];
}

function basePage(
  partial: Omit<SeoPageDefinition, 'faqs' | 'breadcrumbs'> & {
    breadcrumbs: SeoPageDefinition['breadcrumbs'];
    type: SeoPageType;
    faqCtx: Parameters<typeof generateFaqs>[1];
  }
): SeoPageDefinition {
  const { faqCtx, ...rest } = partial;
  return {
    ...rest,
    faqs: generateFaqs(rest.type, faqCtx),
    priority: rest.priority ?? 0.7,
    changefreq: rest.changefreq ?? 'weekly',
  };
}

/** Résout une URL programmatique → définition de page, ou null. */
export function resolveSeoPage(pathname: string): SeoPageDefinition | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/' || path.split('/').length !== 2) return null;
  const segment = path.slice(1);
  if (!segment || RESERVED.has(segment) || segment.includes('/')) return null;

  // /conciergerie-{city}
  if (segment.startsWith('conciergerie-')) {
    const citySlug = segment.slice('conciergerie-'.length);
    const city = getCityBySlug(citySlug);
    if (!city) return null;
    const list = getConciergeriesForCity(city);
    const dept = getDepartmentByCode(city.departmentCode);
    return basePage({
      path,
      type: 'conciergerie-ville',
      title: `Conciergerie Airbnb ${city.name} — comparatif ${new Date().getFullYear()}`,
      description: `Trouvez une conciergerie Airbnb à ${city.name}. Comparez avis, services, commissions et demandez des devis gratuits.`,
      h1: `Conciergerie Airbnb à ${city.name}`,
      intro: `Comparez les meilleures conciergeries pour votre location saisonnière à ${city.name}${
        list.length ? ` — ${list.length} fiche${list.length > 1 ? 's' : ''} correspondante${list.length > 1 ? 's' : ''}` : ''
      }.`,
      breadcrumbs: crumbs(
        ...(dept ? [{ name: dept.name, path: `/departement-${dept.slug}` }] : []),
        { name: city.name, path: `/ville-${city.slug}` },
        { name: `Conciergerie ${city.name}`, path }
      ),
      faqCtx: { placeName: city.name, count: list.length },
      context: { city, conciergeries: list, department: dept },
      priority: 0.85,
    });
  }

  // /ville-{city}
  if (segment.startsWith('ville-')) {
    const city = getCityBySlug(segment.slice('ville-'.length));
    if (!city) return null;
    const list = getConciergeriesForCity(city);
    const dept = geoDepartments.find((d) => d.code === city.departmentCode);
    const region = dept ? getRegionBySlug(dept.regionSlug) : null;
    return basePage({
      path,
      type: 'ville',
      title: `Airbnb ${city.name} — conciergeries, services et guides`,
      description: `Tout pour louer ou gérer un Airbnb à ${city.name} : conciergeries, services, outils et guides locaux.`,
      h1: `Location Airbnb à ${city.name}`,
      intro: `Hub local ${city.name} : annuaire de conciergeries, services (ménage, check-in, photos) et ressources pour maximiser vos revenus.`,
      breadcrumbs: crumbs(
        ...(region ? [{ name: region.name, path: `/region-${region.slug}` }] : []),
        ...(dept ? [{ name: dept.name, path: `/departement-${dept.slug}` }] : []),
        { name: city.name, path }
      ),
      faqCtx: { placeName: city.name, count: list.length },
      context: { city, conciergeries: list, department: dept, region },
      priority: 0.8,
    });
  }

  // /departement-{slug}
  if (segment.startsWith('departement-')) {
    const dept = getDepartmentBySlug(segment.slice('departement-'.length));
    if (!dept) return null;
    const region = getRegionBySlug(dept.regionSlug);
    const list = getConciergeriesForDepartment(dept.code);
    return basePage({
      path,
      type: 'departement',
      title: `Conciergerie Airbnb ${dept.name} (${dept.code})`,
      description: `Conciergeries Airbnb dans le ${dept.name}. Comparez les prestataires du département ${dept.code}.`,
      h1: `Conciergeries Airbnb dans le ${dept.name}`,
      intro: `Annuaire des conciergeries couvrant le département ${dept.name} (${dept.code}).`,
      breadcrumbs: crumbs(
        ...(region ? [{ name: region.name, path: `/region-${region.slug}` }] : []),
        { name: dept.name, path }
      ),
      faqCtx: { placeName: dept.name, count: list.length },
      context: { department: dept, region, conciergeries: list },
      priority: 0.7,
    });
  }

  // /region-{slug} et DOM-TOM (même préfixe region- pour régions ; dom-tom- dédié)
  if (segment.startsWith('region-')) {
    const region = getRegionBySlug(segment.slice('region-'.length));
    if (!region || region.isDomTom) return null;
    const list = getConciergeriesForRegion(region.slug);
    return basePage({
      path,
      type: 'region',
      title: `Conciergerie Airbnb ${region.name}`,
      description: `Trouvez une conciergerie Airbnb en ${region.name}. Villes, départements et comparatifs locaux.`,
      h1: `Conciergeries Airbnb en ${region.name}`,
      intro: `Vue régionale pour la location courte durée en ${region.name}.`,
      breadcrumbs: crumbs({ name: region.name, path }),
      faqCtx: { placeName: region.name, count: list.length },
      context: { region, conciergeries: list },
      priority: 0.75,
    });
  }

  if (segment.startsWith('dom-tom-')) {
    const region = getRegionBySlug(segment.slice('dom-tom-'.length));
    if (!region?.isDomTom) return null;
    return basePage({
      path,
      type: 'dom-tom',
      title: `Conciergerie Airbnb ${region.name} — DOM-TOM`,
      description: `Créer ou déléguer une location Airbnb en ${region.name} : marché, conciergeries et outils.`,
      h1: `Airbnb et conciergerie en ${region.name}`,
      intro: `Guide et annuaire pour la location saisonnière en ${region.name}.`,
      breadcrumbs: crumbs({ name: 'DOM-TOM', path: '/pays-france' }, { name: region.name, path }),
      faqCtx: { placeName: region.name },
      context: { region, conciergeries: getConciergeriesForRegion(region.slug) },
      priority: 0.75,
    });
  }

  if (segment.startsWith('pays-')) {
    const country = getCountryBySlug(segment.slice('pays-'.length));
    if (!country) return null;
    return basePage({
      path,
      type: 'pays',
      title: `Conciergerie Airbnb ${country.name}`,
      description: `Ressources pour la location courte durée et les conciergeries Airbnb en ${country.name}.`,
      h1: `Airbnb en ${country.name}`,
      intro: `Plateforme d’information pour hôtes et investisseurs sur le marché ${country.adjective}.`,
      breadcrumbs: crumbs({ name: country.name, path }),
      faqCtx: { placeName: country.name },
      context: { country },
      priority: 0.65,
    });
  }

  // /comparatif-{a}-vs-{b}
  if (segment.startsWith('comparatif-') && segment.includes('-vs-')) {
    const rest = segment.slice('comparatif-'.length);
    const [a, b] = rest.split('-vs-');
    const toolA = airbnbTools.find((t) => t.slug === a);
    const toolB = airbnbTools.find((t) => t.slug === b);
    if (!toolA || !toolB) return null;
    return basePage({
      path,
      type: 'comparatif',
      title: `${toolA.name} vs ${toolB.name} — comparatif ${new Date().getFullYear()}`,
      description: `Comparez ${toolA.name} et ${toolB.name} : prix, fonctionnalités, essai gratuit et pour qui choisir.`,
      h1: `${toolA.name} vs ${toolB.name}`,
      intro: `Comparatif détaillé pour choisir entre ${toolA.name} et ${toolB.name} pour votre activité Airbnb / conciergerie.`,
      breadcrumbs: crumbs(
        { name: 'Outils Airbnb', path: '/outils-airbnb' },
        { name: `${toolA.name} vs ${toolB.name}`, path }
      ),
      faqCtx: { toolA: toolA.name, toolB: toolB.name },
      context: { toolA, toolB },
      priority: 0.8,
    });
  }

  // /top-...
  if (segment.startsWith('top-')) {
    return resolveTop(segment, path);
  }

  // /guide-...
  if (segment.startsWith('guide-')) {
    return resolveGuide(segment.slice('guide-'.length), path);
  }

  // /{service}-airbnb-{city}
  const serviceMatch = matchServiceCity(segment);
  if (serviceMatch) {
    const { service, city } = serviceMatch;
    const list = getConciergeriesForCity(city);
    return basePage({
      path,
      type: 'service-ville',
      title: `${service.name} à ${city.name} — prestataires Airbnb`,
      description: `${service.description} Trouvez ${service.name.toLowerCase()} à ${city.name}.`,
      h1: `${service.name} à ${city.name}`,
      intro: `${service.description} Comparez les conciergeries et prestataires à ${city.name}.`,
      breadcrumbs: crumbs(
        { name: city.name, path: `/ville-${city.slug}` },
        { name: service.name, path }
      ),
      faqCtx: { placeName: city.name, serviceName: service.name, count: list.length },
      context: { city, service, conciergeries: list },
      priority: 0.8,
    });
  }

  return null;
}

function matchServiceCity(segment: string) {
  const marker = '-airbnb-';
  const idx = segment.lastIndexOf(marker);
  if (idx <= 0) return null;
  const serviceSeg = segment.slice(0, idx);
  const citySlug = segment.slice(idx + marker.length);
  const service = getServiceByUrlSegment(serviceSeg);
  const city = getCityBySlug(citySlug);
  if (!service || !city) return null;
  return { service, city };
}

function resolveGuide(slug: string, path: string): SeoPageDefinition | null {
  // generic
  for (const tpl of guideTemplates.filter((t) => t.kind === 'generic')) {
    if (slug === tpl.slugPattern) {
      return basePage({
        path,
        type: 'guide',
        title: tpl.titlePattern,
        description: tpl.descriptionPattern,
        h1: tpl.h1Pattern,
        intro: tpl.descriptionPattern,
        breadcrumbs: crumbs({ name: 'Guides', path: '/guide-prix-conciergerie-airbnb' }, { name: tpl.h1Pattern, path }),
        faqCtx: {},
        context: { guideKind: 'generic', template: tpl },
        priority: 0.7,
      });
    }
  }

  // city guides
  for (const tpl of guideTemplates.filter((t) => t.kind === 'city')) {
    // patterns like comment-creer-une-conciergerie-a-{city}
    if (!tpl.slugPattern.includes('{city}')) continue;
    const [before, after] = tpl.slugPattern.split('{city}');
    if (!slug.startsWith(before) || (after && !slug.endsWith(after))) continue;
    const citySlug = slug.slice(before.length, after ? slug.length - after.length : undefined);
    const city = getCityBySlug(citySlug);
    if (!city) continue;
    const vars = { city: city.slug, cityName: city.name };
    return basePage({
      path,
      type: 'guide',
      title: fillPattern(tpl.titlePattern, vars),
      description: fillPattern(tpl.descriptionPattern, vars),
      h1: fillPattern(tpl.h1Pattern, vars),
      intro: fillPattern(tpl.descriptionPattern, vars),
      breadcrumbs: crumbs(
        { name: city.name, path: `/ville-${city.slug}` },
        { name: fillPattern(tpl.h1Pattern, vars), path }
      ),
      faqCtx: { placeName: city.name },
      context: { guideKind: 'city', city, template: tpl },
      priority: 0.75,
    });
  }

  // dom-tom guides
  for (const tpl of guideTemplates.filter((t) => t.kind === 'dom-tom')) {
    const [before] = tpl.slugPattern.split('{place}');
    if (!slug.startsWith(before)) continue;
    const placeSlug = slug.slice(before.length);
    const region = getRegionBySlug(placeSlug);
    if (!region?.isDomTom) continue;
    const vars = { place: region.slug, placeName: region.name };
    return basePage({
      path,
      type: 'guide',
      title: fillPattern(tpl.titlePattern, vars),
      description: fillPattern(tpl.descriptionPattern, vars),
      h1: fillPattern(tpl.h1Pattern, vars),
      intro: fillPattern(tpl.descriptionPattern, vars),
      breadcrumbs: crumbs(
        { name: region.name, path: `/dom-tom-${region.slug}` },
        { name: fillPattern(tpl.h1Pattern, vars), path }
      ),
      faqCtx: { placeName: region.name },
      context: { guideKind: 'dom-tom', region, template: tpl },
      priority: 0.75,
    });
  }

  return null;
}

function resolveTop(segment: string, path: string): SeoPageDefinition | null {
  if (segment.startsWith('top-conciergeries-')) {
    const place = segment.slice('top-conciergeries-'.length);
    const city = getCityBySlug(place);
    if (city) {
      const list = getConciergeriesForCity(city);
      return basePage({
        path,
        type: 'top',
        title: `Top conciergeries Airbnb à ${city.name}`,
        description: `Classement des meilleures conciergeries Airbnb à ${city.name} selon notes et avis.`,
        h1: `Top conciergeries à ${city.name}`,
        intro: `Notre sélection des meilleures conciergeries pour ${city.name}.`,
        breadcrumbs: crumbs(
          { name: city.name, path: `/ville-${city.slug}` },
          { name: 'Top conciergeries', path }
        ),
        faqCtx: { placeName: city.name, count: list.length },
        context: { topKind: 'city', city, conciergeries: list },
        priority: 0.8,
      });
    }
    const dept = getDepartmentBySlug(place);
    if (dept) {
      const list = getConciergeriesForDepartment(dept.code);
      return basePage({
        path,
        type: 'top',
        title: `Top conciergeries Airbnb ${dept.name}`,
        description: `Meilleures conciergeries Airbnb dans le ${dept.name}.`,
        h1: `Top conciergeries — ${dept.name}`,
        intro: `Classement départemental pour le ${dept.name}.`,
        breadcrumbs: crumbs(
          { name: dept.name, path: `/departement-${dept.slug}` },
          { name: 'Top', path }
        ),
        faqCtx: { placeName: dept.name, count: list.length },
        context: { topKind: 'department', department: dept, conciergeries: list },
      });
    }
    const region = getRegionBySlug(place);
    if (region && !region.isDomTom) {
      const list = getConciergeriesForRegion(region.slug);
      return basePage({
        path,
        type: 'top',
        title: `Top conciergeries Airbnb ${region.name}`,
        description: `Meilleures conciergeries Airbnb en ${region.name}.`,
        h1: `Top conciergeries — ${region.name}`,
        intro: `Classement régional pour la ${region.name}.`,
        breadcrumbs: crumbs(
          { name: region.name, path: `/region-${region.slug}` },
          { name: 'Top', path }
        ),
        faqCtx: { placeName: region.name, count: list.length },
        context: { topKind: 'region', region, conciergeries: list },
      });
    }
  }

  const toolTops: Record<string, { title: string; category?: string; filter?: (slug: string) => boolean }> = {
    'top-logiciels-airbnb': { title: 'Top des meilleurs logiciels Airbnb' },
    'top-pms-airbnb': { title: 'Top des meilleurs PMS Airbnb', category: 'pms' },
    'top-channel-managers': { title: 'Top des meilleurs Channel Managers', category: 'channel-manager' },
    'top-serrures-connectees': {
      title: 'Top des meilleures serrures connectées',
      category: 'serrures-connectees',
    },
    'top-outils-ia-airbnb': {
      title: 'Top des meilleurs outils IA Airbnb',
      filter: (s) => ['chatgpt', 'hospitable', 'host-tools'].includes(s),
    },
    'top-assurances-airbnb': { title: 'Top des meilleures assurances Airbnb', category: 'assurance' },
    'top-outils-menage-airbnb': { title: 'Top des meilleurs outils de ménage Airbnb', category: 'menage' },
  };

  const conf = toolTops[segment];
  if (!conf) return null;
  let tools = [...airbnbTools];
  if (conf.category) tools = tools.filter((t) => t.category === conf.category);
  if (conf.filter) tools = tools.filter((t) => conf.filter!(t.slug));
  tools.sort((a, b) => b.note - a.note);

  return basePage({
    path,
    type: 'top',
    title: `${conf.title} ${new Date().getFullYear()}`,
    description: `${conf.title} : comparatif notes, prix et cas d’usage pour hôtes et conciergeries.`,
    h1: conf.title,
    intro: 'Classement basé sur notre note éditoriale et la pertinence pour la location courte durée.',
    breadcrumbs: crumbs(
      { name: 'Outils Airbnb', path: '/outils-airbnb' },
      { name: conf.title, path }
    ),
    faqCtx: { placeName: 'Airbnb' },
    context: { topKind: 'tools', tools, categories: airbnbToolCategories },
    priority: 0.85,
  });
}

/** Enumère toutes les URLs SEO programmatiques (sitemap). */
export function enumerateSeoPaths(): { path: string; priority: number; changefreq: string }[] {
  const out: { path: string; priority: number; changefreq: string }[] = [];
  const add = (path: string, priority = 0.7, changefreq = 'weekly') => {
    out.push({ path, priority, changefreq });
  };

  for (const city of geoCities) {
    add(`/ville-${city.slug}`, 0.8);
    add(`/conciergerie-${city.slug}`, 0.85);
    add(`/top-conciergeries-${city.slug}`, 0.75);
    for (const service of seoServices) {
      add(`/${service.urlSegment}-airbnb-${city.slug}`, 0.8);
    }
    for (const tpl of guideTemplates.filter((t) => t.kind === 'city')) {
      add(`/guide-${fillPattern(tpl.slugPattern, { city: city.slug })}`, 0.7);
    }
  }

  for (const dept of geoDepartments) {
    add(`/departement-${dept.slug}`, 0.7);
    add(`/top-conciergeries-${dept.slug}`, 0.65);
  }

  for (const region of geoRegions) {
    if (region.isDomTom) {
      add(`/dom-tom-${region.slug}`, 0.75);
      for (const tpl of guideTemplates.filter((t) => t.kind === 'dom-tom')) {
        add(`/guide-${fillPattern(tpl.slugPattern, { place: region.slug })}`, 0.7);
      }
    } else {
      add(`/region-${region.slug}`, 0.75);
      add(`/top-conciergeries-${region.slug}`, 0.7);
    }
  }

  for (const country of geoCountries) {
    add(`/pays-${country.slug}`, 0.65);
  }

  for (const [a, b] of toolComparePairs) {
    add(`/comparatif-${a}-vs-${b}`, 0.8);
  }

  for (const tpl of guideTemplates.filter((t) => t.kind === 'generic')) {
    add(`/guide-${tpl.slugPattern}`, 0.7);
  }

  for (const top of [
    'top-logiciels-airbnb',
    'top-pms-airbnb',
    'top-channel-managers',
    'top-serrures-connectees',
    'top-outils-ia-airbnb',
    'top-assurances-airbnb',
    'top-outils-menage-airbnb',
  ]) {
    add(`/${top}`, 0.85);
  }

  return out;
}

export function isSeoPath(pathname: string): boolean {
  return resolveSeoPage(pathname) !== null;
}
