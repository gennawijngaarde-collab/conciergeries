/**
 * In-memory store for Phase 1 when Docker/Postgres is unavailable.
 * Enable with USE_MEMORY_STORE=true
 */

export type MemProperty = {
  id: string;
  organizationId: string;
  name: string;
  slug: string | null;
  description: string | null;
  propertyType: string | null;
  addressLine1: string | null;
  city: string | null;
  postalCode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  currency: string;
  touristTax: number | null;
  deposit: number | null;
  cleaningFee: number | null;
  checkInTime: string;
  checkOutTime: string;
  houseRules: string | null;
  digitalGuide: unknown;
  amenitiesNotes: string | null;
  isActive: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MemReservation = {
  id: string;
  organizationId: string;
  propertyId: string;
  status: string;
  channel: string;
  confirmationCode: string | null;
  checkInDate: Date;
  checkOutDate: Date;
  adults: number;
  children: number;
  currency: string;
  nightlyRate: number | null;
  nightsCount: number | null;
  totalAmount: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type MemBlock = {
  id: string;
  organizationId: string;
  propertyId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type MemCleaning = {
  id: string;
  organizationId: string;
  propertyId: string;
  reservationId: string | null;
  status: string;
  scheduledAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const ORG = 'org_demo';

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}

function seed() {
  const now = new Date();
  const p1: MemProperty = {
    id: 'prop_demo_1',
    organizationId: ORG,
    name: 'Loft Saint-Quentin Centre',
    slug: 'loft-saint-quentin-centre',
    description: 'Loft lumineux centre-ville',
    propertyType: 'apartment',
    addressLine1: '20 rue Baudin',
    city: 'Saint-Quentin',
    postalCode: '02100',
    country: 'FR',
    latitude: 49.846, longitude: 3.2875,
    capacity: 4, bedrooms: 2, bathrooms: 1,
    basePrice: 95, currency: 'EUR',
    touristTax: 1.5, deposit: 300, cleaningFee: 45,
    checkInTime: '16:00', checkOutTime: '11:00',
    houseRules: 'Pas de fête. Animaux sur demande.',
    digitalGuide: { wifi: 'Cleanbnb_Guest', code: '1234' },
    amenitiesNotes: 'Wifi, lave-linge',
    isActive: true, isPublished: true,
    createdAt: now, updatedAt: now,
  };
  const p2: MemProperty = {
    ...p1,
    id: 'prop_demo_2',
    name: 'Appart Cosy Gare',
    slug: 'appart-cosy-gare',
    addressLine1: 'Place de la Gare',
    capacity: 2, bedrooms: 1, basePrice: 75,
  };

  const r1: MemReservation = {
    id: 'res_demo_1',
    organizationId: ORG,
    propertyId: p1.id,
    status: 'CONFIRMED',
    channel: 'DIRECT',
    confirmationCode: 'CB-1001',
    checkInDate: daysFromNow(1),
    checkOutDate: daysFromNow(4),
    adults: 2, children: 0,
    currency: 'EUR',
    nightlyRate: 95, nightsCount: 3, totalAmount: 330,
    notes: 'Arrivée tardive OK',
    createdAt: now, updatedAt: now,
  };
  const r2: MemReservation = {
    ...r1,
    id: 'res_demo_2',
    propertyId: p2.id,
    confirmationCode: 'CB-1002',
    checkInDate: daysFromNow(7),
    checkOutDate: daysFromNow(10),
    nightlyRate: 75, totalAmount: 270,
    notes: null,
  };

  const b1: MemBlock = {
    id: 'block_demo_1',
    organizationId: ORG,
    propertyId: p1.id,
    startDate: daysFromNow(14),
    endDate: daysFromNow(16),
    reason: 'MANUAL',
    notes: 'Travaux peinture',
    createdAt: now, updatedAt: now,
  };

  const c1: MemCleaning = {
    id: 'clean_demo_1',
    organizationId: ORG,
    propertyId: p1.id,
    reservationId: r1.id,
    status: 'PENDING',
    scheduledAt: daysFromNow(4),
    notes: 'Turnover checkout',
    createdAt: now, updatedAt: now,
  };
  const c2: MemCleaning = {
    id: 'clean_demo_2',
    organizationId: ORG,
    propertyId: p2.id,
    reservationId: null,
    status: 'IN_PROGRESS',
    scheduledAt: daysFromNow(0),
    notes: 'Ménage profond',
    createdAt: now, updatedAt: now,
  };

  return {
    properties: [p1, p2] as MemProperty[],
    reservations: [r1, r2] as MemReservation[],
    blocks: [b1] as MemBlock[],
    cleanings: [c1, c2] as MemCleaning[],
  };
}

const g = globalThis as unknown as { __pmsMemory?: ReturnType<typeof seed> };

export function memoryStore() {
  if (!g.__pmsMemory) g.__pmsMemory = seed();
  return g.__pmsMemory;
}

export function newId(prefix: string) {
  return id(prefix);
}

export function isMemoryStoreEnabled() {
  return process.env.USE_MEMORY_STORE === 'true';
}
