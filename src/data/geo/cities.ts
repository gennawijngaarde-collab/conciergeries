import type { GeoCity } from '@/seo/types';

/**
 * Villes SEO. Ajouter une ville ici génère automatiquement :
 * - /ville-{slug}
 * - /conciergerie-{slug}
 * - /{service}-airbnb-{slug} pour chaque service
 * - guides + tops associés
 */
export const geoCities: GeoCity[] = [
  { slug: 'paris', name: 'Paris', departmentCode: '75', nearby: ['versailles', 'boulogne-billancourt'] },
  { slug: 'lyon', name: 'Lyon', departmentCode: '69', nearby: ['villeurbanne', 'annecy'] },
  { slug: 'marseille', name: 'Marseille', departmentCode: '13', nearby: ['aix-en-provence', 'toulon'] },
  { slug: 'bordeaux', name: 'Bordeaux', departmentCode: '33', nearby: ['biarritz', 'arcachon'] },
  { slug: 'nice', name: 'Nice', departmentCode: '06', nearby: ['cannes', 'antibes'] },
  { slug: 'toulouse', name: 'Toulouse', departmentCode: '31', nearby: ['montpellier', 'carcassonne'] },
  { slug: 'nantes', name: 'Nantes', departmentCode: '44', nearby: ['rennes', 'la-rochelle'] },
  { slug: 'strasbourg', name: 'Strasbourg', departmentCode: '67', nearby: ['colmar', 'mulhouse'] },
  { slug: 'montpellier', name: 'Montpellier', departmentCode: '34', nearby: ['nimes', 'sete'] },
  { slug: 'lille', name: 'Lille', departmentCode: '59', nearby: ['amiens', 'valenciennes'] },
  { slug: 'rennes', name: 'Rennes', departmentCode: '35', nearby: ['nantes', 'saint-malo'] },
  { slug: 'reims', name: 'Reims', departmentCode: '51', nearby: ['paris', 'metz'] },
  { slug: 'le-havre', name: 'Le Havre', departmentCode: '76', nearby: ['rouen', 'deauville'] },
  { slug: 'saint-etienne', name: 'Saint-Étienne', departmentCode: '42', nearby: ['lyon', 'clermont-ferrand'] },
  { slug: 'toulon', name: 'Toulon', departmentCode: '83', nearby: ['marseille', 'nice'] },
  { slug: 'grenoble', name: 'Grenoble', departmentCode: '38', nearby: ['lyon', 'chambery'] },
  { slug: 'dijon', name: 'Dijon', departmentCode: '21', nearby: ['lyon', 'besancon'] },
  { slug: 'angers', name: 'Angers', departmentCode: '49', nearby: ['nantes', 'tours'] },
  { slug: 'nimes', name: 'Nîmes', departmentCode: '30', nearby: ['montpellier', 'avignon'] },
  { slug: 'aix-en-provence', name: 'Aix-en-Provence', departmentCode: '13', nearby: ['marseille', 'avignon'] },
  { slug: 'avignon', name: 'Avignon', departmentCode: '84', nearby: ['aix-en-provence', 'nimes'] },
  { slug: 'biarritz', name: 'Biarritz', departmentCode: '64', nearby: ['bayonne', 'bordeaux'] },
  { slug: 'cannes', name: 'Cannes', departmentCode: '06', nearby: ['nice', 'antibes'] },
  { slug: 'annecy', name: 'Annecy', departmentCode: '74', nearby: ['geneve', 'chambery'] },
  { slug: 'chamonix', name: 'Chamonix', departmentCode: '74', nearby: ['annecy', 'megeve'] },
  { slug: 'la-rochelle', name: 'La Rochelle', departmentCode: '17', nearby: ['bordeaux', 'nantes'] },
  { slug: 'saint-malo', name: 'Saint-Malo', departmentCode: '35', nearby: ['rennes', 'dinard'] },
  { slug: 'colmar', name: 'Colmar', departmentCode: '68', nearby: ['strasbourg', 'mulhouse'] },
  { slug: 'perpignan', name: 'Perpignan', departmentCode: '66', nearby: ['montpellier', 'carcassonne'] },
  { slug: 'caen', name: 'Caen', departmentCode: '14', nearby: ['deauville', 'rouen'] },
  { slug: 'rouen', name: 'Rouen', departmentCode: '76', nearby: ['le-havre', 'paris'] },
  { slug: 'nancy', name: 'Nancy', departmentCode: '54', nearby: ['metz', 'strasbourg'] },
  { slug: 'metz', name: 'Metz', departmentCode: '57', nearby: ['nancy', 'luxembourg'] },
  { slug: 'brest', name: 'Brest', departmentCode: '29', nearby: ['quimper', 'rennes'] },
  { slug: 'quimper', name: 'Quimper', departmentCode: '29', nearby: ['brest', 'vannes'] },
  { slug: 'vannes', name: 'Vannes', departmentCode: '56', nearby: ['nantes', 'quimper'] },
  { slug: 'deauville', name: 'Deauville', departmentCode: '14', nearby: ['caen', 'honfleur'] },
  { slug: 'honfleur', name: 'Honfleur', departmentCode: '14', nearby: ['deauville', 'le-havre'] },
  { slug: 'tours', name: 'Tours', departmentCode: '37', nearby: ['orleans', 'angers'] },
  { slug: 'orleans', name: 'Orléans', departmentCode: '45', nearby: ['tours', 'paris'] },
  { slug: 'limoges', name: 'Limoges', departmentCode: '87', nearby: ['bordeaux', 'clermont-ferrand'] },
  { slug: 'clermont-ferrand', name: 'Clermont-Ferrand', departmentCode: '63', nearby: ['lyon', 'limoges'] },
  { slug: 'besancon', name: 'Besançon', departmentCode: '25', nearby: ['dijon', 'mulhouse'] },
  { slug: 'mulhouse', name: 'Mulhouse', departmentCode: '68', nearby: ['basel', 'strasbourg'] },
  { slug: 'amiens', name: 'Amiens', departmentCode: '80', nearby: ['lille', 'paris'] },
  { slug: 'pau', name: 'Pau', departmentCode: '64', nearby: ['biarritz', 'tarbes'] },
  { slug: 'bayonne', name: 'Bayonne', departmentCode: '64', nearby: ['biarritz', 'saint-jean-de-luz'] },
  { slug: 'carcassonne', name: 'Carcassonne', departmentCode: '11', nearby: ['toulouse', 'narbonne'] },
  { slug: 'valence', name: 'Valence', departmentCode: '26', nearby: ['lyon', 'avignon'] },
  { slug: 'chambery', name: 'Chambéry', departmentCode: '73', nearby: ['annecy', 'grenoble'] },
  { slug: 'megeve', name: 'Megève', departmentCode: '74', nearby: ['chamonix', 'annecy'] },
  { slug: 'courchevel', name: 'Courchevel', departmentCode: '73', nearby: ['meribel', 'val-disere'] },
  { slug: 'saint-quentin', name: 'Saint-Quentin', departmentCode: '02', nearby: ['amiens', 'lille'] },
  { slug: 'poitiers', name: 'Poitiers', departmentCode: '86', nearby: ['tours', 'niort'] },
  { slug: 'le-mans', name: 'Le Mans', departmentCode: '72', nearby: ['tours', 'angers'] },
  { slug: 'ajaccio', name: 'Ajaccio', departmentCode: '2A', nearby: ['bastia', 'porto-vecchio'] },
  { slug: 'bastia', name: 'Bastia', departmentCode: '2B', nearby: ['ajaccio', 'calvi'] },
  // DOM-TOM villes / territoires
  { slug: 'fort-de-france', name: 'Fort-de-France', departmentCode: '972', nearby: ['le-marin'], isDomTom: true },
  { slug: 'pointe-a-pitre', name: 'Pointe-à-Pitre', departmentCode: '971', nearby: ['basse-terre'], isDomTom: true },
  { slug: 'cayenne', name: 'Cayenne', departmentCode: '973', nearby: [], isDomTom: true },
  { slug: 'saint-denis-reunion', name: 'Saint-Denis', departmentCode: '974', nearby: ['saint-pierre-reunion'], isDomTom: true },
  { slug: 'mamoudzou', name: 'Mamoudzou', departmentCode: '976', nearby: [], isDomTom: true },
];

export function getCityBySlug(slug: string) {
  return geoCities.find((c) => c.slug === slug) ?? null;
}

export function getCitiesByDepartment(code: string) {
  return geoCities.filter((c) => c.departmentCode === code);
}

export function getCitiesByRegion(regionSlug: string, departments: { code: string; regionSlug: string }[]) {
  const codes = new Set(departments.filter((d) => d.regionSlug === regionSlug).map((d) => d.code));
  return geoCities.filter((c) => codes.has(c.departmentCode));
}
