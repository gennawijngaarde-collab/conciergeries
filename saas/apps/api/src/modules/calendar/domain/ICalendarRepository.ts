import type { CalendarEvent, CalendarListFilters } from './CalendarEvent.js';
import type { CalendarBlockEvent, CalendarBlockInput } from './CalendarEvent.js';

export interface ICalendarRepository {
  listEvents(organizationId: string, filters?: CalendarListFilters): Promise<CalendarEvent[]>;
  findBlockById(organizationId: string, id: string): Promise<CalendarBlockEvent | null>;
  createBlock(organizationId: string, data: CalendarBlockInput): Promise<CalendarBlockEvent>;
  updateBlock(
    organizationId: string,
    id: string,
    data: Partial<CalendarBlockInput>,
  ): Promise<CalendarBlockEvent>;
  deleteBlock(organizationId: string, id: string): Promise<void>;

  /** @deprecated Prefer listEvents / block methods for MVP calendar */
  findById(organizationId: string, id: string): Promise<CalendarEvent | null>;
  list(organizationId: string): Promise<CalendarEvent[]>;
  create(organizationId: string, data: Partial<CalendarEvent>): Promise<CalendarEvent>;
  update(organizationId: string, id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent>;
  delete(organizationId: string, id: string): Promise<void>;
}
