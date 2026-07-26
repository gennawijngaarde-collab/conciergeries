export type BookingStatus =
  | 'INQUIRY'
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'BLOCKED';

export type BookingChannel =
  | 'AIRBNB'
  | 'BOOKING'
  | 'VRBO'
  | 'EXPEDIA'
  | 'GOOGLE'
  | 'ABRITEL'
  | 'DIRECT'
  | 'OTHER';

export interface Reservation {
  id: string;
  organizationId: string;
  propertyId: string;
  status: BookingStatus;
  channel: BookingChannel;
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
  propertyName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
