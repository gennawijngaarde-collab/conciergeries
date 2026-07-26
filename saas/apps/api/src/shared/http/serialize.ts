import type { Decimal } from '@prisma/client/runtime/library';
import type { Property } from '../../modules/properties/domain/Property.js';
import type { Reservation } from '../../modules/reservations/domain/Reservation.js';
import type { CleaningTask } from '../../modules/cleaning/domain/CleaningTask.js';

type DecimalLike = Decimal | number | string | null | undefined;

/** Prisma Decimal | null → number | null */
export function dec(v: DecimalLike): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  const n = v.toNumber();
  return Number.isFinite(n) ? n : null;
}

function asNumber(v: DecimalLike, fallback = 0): number {
  return dec(v) ?? fallback;
}

export function serializeProperty(p: {
  id: string;
  organizationId: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  propertyType?: string | null;
  addressLine1?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  latitude?: DecimalLike;
  longitude?: DecimalLike;
  capacity?: number;
  bedrooms?: number;
  bathrooms?: DecimalLike;
  basePrice?: DecimalLike;
  currency?: string;
  touristTax?: DecimalLike;
  deposit?: DecimalLike;
  cleaningFee?: DecimalLike;
  checkInTime?: string;
  checkOutTime?: string;
  houseRules?: string | null;
  digitalGuide?: unknown;
  amenitiesNotes?: string | null;
  isActive?: boolean;
  isPublished?: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Property {
  return {
    id: p.id,
    organizationId: p.organizationId,
    name: p.name,
    slug: p.slug ?? null,
    description: p.description ?? null,
    propertyType: p.propertyType ?? null,
    addressLine1: p.addressLine1 ?? null,
    city: p.city ?? null,
    postalCode: p.postalCode ?? null,
    country: p.country ?? 'FR',
    latitude: dec(p.latitude),
    longitude: dec(p.longitude),
    capacity: p.capacity ?? 2,
    bedrooms: p.bedrooms ?? 1,
    bathrooms: asNumber(p.bathrooms, 1),
    basePrice: asNumber(p.basePrice, 0),
    currency: p.currency ?? 'EUR',
    touristTax: dec(p.touristTax),
    deposit: dec(p.deposit),
    cleaningFee: dec(p.cleaningFee),
    checkInTime: p.checkInTime ?? '16:00',
    checkOutTime: p.checkOutTime ?? '11:00',
    houseRules: p.houseRules ?? null,
    digitalGuide: (p.digitalGuide as Property['digitalGuide']) ?? null,
    amenitiesNotes: p.amenitiesNotes ?? null,
    isActive: p.isActive ?? true,
    isPublished: p.isPublished ?? false,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export function serializeReservation(
  r: {
    id: string;
    organizationId: string;
    propertyId: string;
    status: string;
    channel: string;
    confirmationCode?: string | null;
    checkInDate: Date;
    checkOutDate: Date;
    adults?: number;
    children?: number;
    currency?: string;
    nightlyRate?: DecimalLike;
    nightsCount?: number | null;
    totalAmount?: DecimalLike;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
    property?: { name: string } | null;
  },
  propertyName?: string | null,
): Reservation {
  return {
    id: r.id,
    organizationId: r.organizationId,
    propertyId: r.propertyId,
    status: r.status as Reservation['status'],
    channel: r.channel as Reservation['channel'],
    confirmationCode: r.confirmationCode ?? null,
    checkInDate: r.checkInDate,
    checkOutDate: r.checkOutDate,
    adults: r.adults ?? 1,
    children: r.children ?? 0,
    currency: r.currency ?? 'EUR',
    nightlyRate: dec(r.nightlyRate),
    nightsCount: r.nightsCount ?? null,
    totalAmount: dec(r.totalAmount),
    notes: r.notes ?? null,
    propertyName: propertyName ?? r.property?.name ?? null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export function serializeCleaningTask(
  t: {
    id: string;
    organizationId: string;
    propertyId: string;
    reservationId?: string | null;
    status: string;
    scheduledAt?: Date | null;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
    property?: { name: string } | null;
  },
  propertyName?: string | null,
): CleaningTask {
  return {
    id: t.id,
    organizationId: t.organizationId,
    propertyId: t.propertyId,
    reservationId: t.reservationId ?? null,
    status: t.status as CleaningTask['status'],
    scheduledAt: t.scheduledAt ?? null,
    notes: t.notes ?? null,
    propertyName: propertyName ?? t.property?.name ?? null,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

export function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'property';
}
