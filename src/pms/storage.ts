import type { PmsCleaning, PmsCleaningStatus, PmsProfile, PmsProperty } from './types';

const KEYS = {
  profile: 'cleanbnb_pms_profile',
  properties: 'cleanbnb_pms_properties',
  cleanings: 'cleanbnb_pms_cleanings',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getProfile(): PmsProfile | null {
  return read<PmsProfile | null>(KEYS.profile, null);
}

export function saveProfile(profile: PmsProfile) {
  write(KEYS.profile, profile);
}

export function getProperties(): PmsProperty[] {
  return read<PmsProperty[]>(KEYS.properties, []);
}

export function saveProperties(properties: PmsProperty[]) {
  write(KEYS.properties, properties);
}

export function addProperty(input: Omit<PmsProperty, 'id' | 'createdAt'>): PmsProperty {
  const property: PmsProperty = {
    ...input,
    id: uid('prop'),
    createdAt: new Date().toISOString(),
  };
  const next = [...getProperties(), property];
  saveProperties(next);
  return property;
}

export function deleteProperty(id: string) {
  saveProperties(getProperties().filter((p) => p.id !== id));
  saveCleanings(getCleanings().filter((c) => c.propertyId !== id));
}

export function getCleanings(): PmsCleaning[] {
  return read<PmsCleaning[]>(KEYS.cleanings, []);
}

export function saveCleanings(cleanings: PmsCleaning[]) {
  write(KEYS.cleanings, cleanings);
}

export function addCleaning(input: Omit<PmsCleaning, 'id' | 'createdAt'>): PmsCleaning {
  const cleaning: PmsCleaning = {
    ...input,
    id: uid('clean'),
    createdAt: new Date().toISOString(),
  };
  saveCleanings([cleaning, ...getCleanings()]);
  return cleaning;
}

export function updateCleaningStatus(id: string, status: PmsCleaningStatus) {
  saveCleanings(
    getCleanings().map((c) => (c.id === id ? { ...c, status } : c))
  );
}

export function seedDemoData() {
  if (getProperties().length > 0) return;

  const demoProps: PmsProperty[] = [
    {
      id: 'prop_demo_1',
      name: 'Loft Saint-Quentin Centre',
      address: '20 rue Baudin, 02100 Saint-Quentin',
      icalUrl: 'https://www.airbnb.fr/calendar/ical/demo1.ics',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prop_demo_2',
      name: 'Appart Cosy Gare',
      address: 'Place de la Gare, 02100 Saint-Quentin',
      icalUrl: 'https://www.airbnb.fr/calendar/ical/demo2.ics',
      createdAt: new Date().toISOString(),
    },
  ];
  saveProperties(demoProps);

  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const d1 = new Date(today);
  d1.setDate(today.getDate() + 1);
  const d2 = new Date(today);
  d2.setDate(today.getDate() + 3);

  saveCleanings([
    {
      id: 'clean_demo_1',
      propertyId: demoProps[0].id,
      propertyName: demoProps[0].name,
      cleaningDate: iso(today),
      status: 'pending',
      notes: 'Check-out 11h → check-in 16h',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'clean_demo_2',
      propertyId: demoProps[1].id,
      propertyName: demoProps[1].name,
      cleaningDate: iso(d1),
      status: 'in_progress',
      notes: 'Linge + contrôle qualité',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'clean_demo_3',
      propertyId: demoProps[0].id,
      propertyName: demoProps[0].name,
      cleaningDate: iso(d2),
      status: 'done',
      notes: 'Terminé',
      createdAt: new Date().toISOString(),
    },
  ]);
}

export function resetPmsData() {
  localStorage.removeItem(KEYS.profile);
  localStorage.removeItem(KEYS.properties);
  localStorage.removeItem(KEYS.cleanings);
}
