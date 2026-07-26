/** Shared domain primitives for the PMS SaaS (DDD). */

export type OrganizationId = string & { readonly brand: 'OrganizationId' };
export type PropertyId = string & { readonly brand: 'PropertyId' };
export type ReservationId = string & { readonly brand: 'ReservationId' };

export type Money = {
  amountCents: number;
  currency: string;
};

export type DateRange = {
  start: string; // ISO date
  end: string;
};

export type RoleCode =
  | 'SUPER_ADMIN'
  | 'ENTERPRISE'
  | 'MANAGER'
  | 'RECEPTION'
  | 'CLEANING'
  | 'MAINTENANCE'
  | 'OWNER';

export type BookingChannel =
  | 'AIRBNB'
  | 'BOOKING'
  | 'VRBO'
  | 'EXPEDIA'
  | 'GOOGLE'
  | 'ABRITEL'
  | 'DIRECT'
  | 'OTHER';
