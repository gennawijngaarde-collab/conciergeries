export type CalendarBlockReason =
  | 'OWNER_STAY'
  | 'MAINTENANCE'
  | 'PREPARATION'
  | 'SEASONAL_CLOSE'
  | 'MANUAL'
  | 'EXTERNAL'
  | 'OTHER';

export interface CalendarReservationEvent {
  kind: 'reservation';
  id: string;
  organizationId: string;
  propertyId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  status: string;
  channel: string;
  propertyName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarBlockEvent {
  kind: 'block';
  id: string;
  organizationId: string;
  propertyId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  reason: CalendarBlockReason;
  notes: string | null;
  propertyName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarCleaningEvent {
  kind: 'cleaning';
  id: string;
  organizationId: string;
  propertyId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  status: string;
  reservationId: string | null;
  notes: string | null;
  propertyName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CalendarEvent =
  | CalendarReservationEvent
  | CalendarBlockEvent
  | CalendarCleaningEvent;

export interface CalendarBlockInput {
  propertyId: string;
  startDate: Date | string;
  endDate: Date | string;
  reason?: CalendarBlockReason;
  notes?: string | null;
}

export interface CalendarListFilters {
  from?: Date | string;
  to?: Date | string;
  propertyId?: string;
}
