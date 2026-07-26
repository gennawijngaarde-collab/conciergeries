import type {
  CalendarBlockEvent,
  CalendarBlockInput,
  CalendarBlockReason,
  CalendarEvent,
  CalendarListFilters,
} from '../domain/CalendarEvent.js';
import type { ICalendarRepository } from '../domain/ICalendarRepository.js';
import { memoryStore, newId, type MemBlock } from '../../../infrastructure/memory/store.js';
import { AppError } from '../../../shared/errors/AppError.js';

function propName(propertyId: string) {
  return memoryStore().properties.find((p) => p.id === propertyId)?.name ?? null;
}

function asBlock(b: MemBlock): CalendarBlockEvent {
  return {
    kind: 'block',
    id: b.id,
    organizationId: b.organizationId,
    propertyId: b.propertyId,
    startDate: b.startDate,
    endDate: b.endDate,
    title: `Blocage · ${propName(b.propertyId) ?? b.propertyId}`,
    reason: (b.reason as CalendarBlockReason) || 'MANUAL',
    notes: b.notes,
    propertyName: propName(b.propertyId),
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

function inRange(start: Date, end: Date, from?: Date, to?: Date) {
  if (from && end < from) return false;
  if (to && start > to) return false;
  return true;
}

export class MemoryCalendarRepository implements ICalendarRepository {
  async listEvents(organizationId: string, filters: CalendarListFilters = {}): Promise<CalendarEvent[]> {
    const from = filters.from ? new Date(filters.from) : undefined;
    const to = filters.to ? new Date(filters.to) : undefined;
    const propertyId = filters.propertyId;
    const store = memoryStore();
    const events: CalendarEvent[] = [];

    for (const r of store.reservations) {
      if (r.organizationId !== organizationId) continue;
      if (propertyId && r.propertyId !== propertyId) continue;
      if (!inRange(r.checkInDate, r.checkOutDate, from, to)) continue;
      events.push({
        kind: 'reservation',
        id: r.id,
        organizationId: r.organizationId,
        propertyId: r.propertyId,
        startDate: r.checkInDate,
        endDate: r.checkOutDate,
        title: `${propName(r.propertyId) ?? 'Réservation'} · ${r.status}`,
        status: r.status,
        channel: r.channel,
        propertyName: propName(r.propertyId),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      });
    }

    for (const b of store.blocks) {
      if (b.organizationId !== organizationId) continue;
      if (propertyId && b.propertyId !== propertyId) continue;
      if (!inRange(b.startDate, b.endDate, from, to)) continue;
      events.push(asBlock(b));
    }

    for (const c of store.cleanings) {
      if (c.organizationId !== organizationId) continue;
      if (propertyId && c.propertyId !== propertyId) continue;
      const start = c.scheduledAt ?? c.createdAt;
      if (!inRange(start, start, from, to)) continue;
      events.push({
        kind: 'cleaning',
        id: c.id,
        organizationId: c.organizationId,
        propertyId: c.propertyId,
        startDate: start,
        endDate: start,
        title: `Ménage · ${propName(c.propertyId) ?? c.propertyId}`,
        status: c.status,
        reservationId: c.reservationId,
        notes: c.notes,
        propertyName: propName(c.propertyId),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      });
    }

    return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  async findBlockById(organizationId: string, id: string): Promise<CalendarBlockEvent | null> {
    const b = memoryStore().blocks.find((x) => x.id === id && x.organizationId === organizationId);
    return b ? asBlock(b) : null;
  }

  async createBlock(organizationId: string, data: CalendarBlockInput): Promise<CalendarBlockEvent> {
    const prop = memoryStore().properties.find(
      (p) => p.id === data.propertyId && p.organizationId === organizationId,
    );
    if (!prop) throw AppError.validation('property not found');
    const now = new Date();
    const row: MemBlock = {
      id: newId('block'),
      organizationId,
      propertyId: data.propertyId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason ?? 'MANUAL',
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    };
    memoryStore().blocks.push(row);
    return asBlock(row);
  }

  async updateBlock(
    organizationId: string,
    id: string,
    data: Partial<CalendarBlockInput>,
  ): Promise<CalendarBlockEvent> {
    const idx = memoryStore().blocks.findIndex((b) => b.id === id && b.organizationId === organizationId);
    if (idx < 0) throw AppError.notFound('CalendarBlock', id);
    const prev = memoryStore().blocks[idx]!;
    const next: MemBlock = {
      ...prev,
      propertyId: data.propertyId ?? prev.propertyId,
      startDate: data.startDate ? new Date(data.startDate) : prev.startDate,
      endDate: data.endDate ? new Date(data.endDate) : prev.endDate,
      reason: data.reason ?? prev.reason,
      notes: data.notes !== undefined ? data.notes ?? null : prev.notes,
      updatedAt: new Date(),
    };
    memoryStore().blocks[idx] = next;
    return asBlock(next);
  }

  async deleteBlock(organizationId: string, id: string): Promise<void> {
    const store = memoryStore();
    store.blocks = store.blocks.filter((b) => !(b.id === id && b.organizationId === organizationId));
  }

  async findById(organizationId: string, id: string): Promise<CalendarEvent | null> {
    return (await this.listEvents(organizationId)).find((e) => e.id === id) ?? null;
  }

  async list(organizationId: string): Promise<CalendarEvent[]> {
    return this.listEvents(organizationId);
  }

  async create(organizationId: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return this.createBlock(organizationId, {
      propertyId: (data as { propertyId?: string }).propertyId || '',
      startDate: (data as { startDate?: Date }).startDate || new Date(),
      endDate: (data as { endDate?: Date }).endDate || new Date(),
      notes: (data as { notes?: string }).notes,
    });
  }

  async update(organizationId: string, id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return this.updateBlock(organizationId, id, data as Partial<CalendarBlockInput>);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    return this.deleteBlock(organizationId, id);
  }
}
