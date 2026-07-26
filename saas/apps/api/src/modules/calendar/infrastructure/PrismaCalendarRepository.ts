import { CalendarBlockReason } from '@prisma/client';
import { prisma } from '../../../infrastructure/prisma/client.js';
import { AppError } from '../../../shared/errors/AppError.js';
import type {
  CalendarBlockEvent,
  CalendarBlockInput,
  CalendarEvent,
  CalendarListFilters,
} from '../domain/CalendarEvent.js';
import type { ICalendarRepository } from '../domain/ICalendarRepository.js';

function asDate(v: unknown, field: string): Date {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v;
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d;
  }
  throw AppError.validation(`${field} must be a valid date`);
}

function optionalDate(v: unknown): Date | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  return asDate(v, 'date');
}

function mapBlock(row: {
  id: string;
  organizationId: string;
  propertyId: string;
  startDate: Date;
  endDate: Date;
  reason: CalendarBlockReason;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  property?: { name: string } | null;
}): CalendarBlockEvent {
  return {
    kind: 'block',
    id: row.id,
    organizationId: row.organizationId,
    propertyId: row.propertyId,
    startDate: row.startDate,
    endDate: row.endDate,
    title: row.reason,
    reason: row.reason,
    notes: row.notes,
    propertyName: row.property?.name ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaCalendarRepository implements ICalendarRepository {
  async listEvents(
    organizationId: string,
    filters: CalendarListFilters = {},
  ): Promise<CalendarEvent[]> {
    const from = optionalDate(filters.from);
    const to = optionalDate(filters.to);
    const propertyId = filters.propertyId;

    const reservationWhere: Record<string, unknown> = { organizationId };
    const blockWhere: Record<string, unknown> = { organizationId };
    const cleaningWhere: Record<string, unknown> = { organizationId };

    if (propertyId) {
      reservationWhere.propertyId = propertyId;
      blockWhere.propertyId = propertyId;
      cleaningWhere.propertyId = propertyId;
    }

    if (from || to) {
      reservationWhere.AND = [
        ...(from ? [{ checkOutDate: { gte: from } }] : []),
        ...(to ? [{ checkInDate: { lte: to } }] : []),
      ];
      blockWhere.AND = [
        ...(from ? [{ endDate: { gte: from } }] : []),
        ...(to ? [{ startDate: { lte: to } }] : []),
      ];
      cleaningWhere.AND = [
        ...(from ? [{ scheduledAt: { gte: from } }] : []),
        ...(to ? [{ scheduledAt: { lte: to } }] : []),
      ];
    }

    const [reservations, blocks, cleanings] = await Promise.all([
      prisma.reservation.findMany({
        where: reservationWhere,
        include: { property: { select: { name: true } } },
        orderBy: { checkInDate: 'asc' },
      }),
      prisma.calendarBlock.findMany({
        where: blockWhere,
        include: { property: { select: { name: true } } },
        orderBy: { startDate: 'asc' },
      }),
      prisma.cleaningTask.findMany({
        where: {
          ...cleaningWhere,
          scheduledAt: { not: null },
        },
        include: { property: { select: { name: true } } },
        orderBy: { scheduledAt: 'asc' },
      }),
    ]);

    const events: CalendarEvent[] = [
      ...reservations.map((r) => ({
        kind: 'reservation' as const,
        id: r.id,
        organizationId: r.organizationId,
        propertyId: r.propertyId,
        startDate: r.checkInDate,
        endDate: r.checkOutDate,
        title: r.confirmationCode ?? r.property.name,
        status: r.status,
        channel: r.channel,
        propertyName: r.property.name,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      ...blocks.map(mapBlock),
      ...cleanings.map((c) => {
        const start = c.scheduledAt!;
        return {
          kind: 'cleaning' as const,
          id: c.id,
          organizationId: c.organizationId,
          propertyId: c.propertyId,
          startDate: start,
          endDate: start,
          title: `Cleaning · ${c.property.name}`,
          status: c.status,
          reservationId: c.reservationId,
          notes: c.notes,
          propertyName: c.property.name,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        };
      }),
    ];

    return events.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );
  }

  async findBlockById(
    organizationId: string,
    id: string,
  ): Promise<CalendarBlockEvent | null> {
    const row = await prisma.calendarBlock.findFirst({
      where: { id, organizationId },
      include: { property: { select: { name: true } } },
    });
    return row ? mapBlock(row) : null;
  }

  async createBlock(
    organizationId: string,
    data: CalendarBlockInput,
  ): Promise<CalendarBlockEvent> {
    if (!data.propertyId) throw AppError.validation('propertyId is required');
    const startDate = asDate(data.startDate, 'startDate');
    const endDate = asDate(data.endDate, 'endDate');
    if (endDate < startDate) {
      throw AppError.validation('endDate must be on or after startDate');
    }

    const property = await prisma.property.findFirst({
      where: { id: data.propertyId, organizationId },
    });
    if (!property) {
      throw AppError.validation('propertyId does not belong to this organization');
    }

    const row = await prisma.calendarBlock.create({
      data: {
        organizationId,
        propertyId: data.propertyId,
        startDate,
        endDate,
        reason: (data.reason as CalendarBlockReason | undefined) ?? CalendarBlockReason.MANUAL,
        notes: data.notes ?? null,
      },
      include: { property: { select: { name: true } } },
    });
    return mapBlock(row);
  }

  async updateBlock(
    organizationId: string,
    id: string,
    data: Partial<CalendarBlockInput>,
  ): Promise<CalendarBlockEvent> {
    const existing = await prisma.calendarBlock.findFirst({
      where: { id, organizationId },
    });
    if (!existing) throw AppError.notFound('CalendarBlock', id);

    if (data.propertyId) {
      const property = await prisma.property.findFirst({
        where: { id: data.propertyId, organizationId },
      });
      if (!property) {
        throw AppError.validation('propertyId does not belong to this organization');
      }
    }

    const row = await prisma.calendarBlock.update({
      where: { id },
      data: {
        ...(data.propertyId ? { propertyId: data.propertyId } : {}),
        ...(data.startDate !== undefined
          ? { startDate: asDate(data.startDate, 'startDate') }
          : {}),
        ...(data.endDate !== undefined
          ? { endDate: asDate(data.endDate, 'endDate') }
          : {}),
        ...(data.reason !== undefined
          ? { reason: data.reason as CalendarBlockReason }
          : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
      },
      include: { property: { select: { name: true } } },
    });
    return mapBlock(row);
  }

  async deleteBlock(organizationId: string, id: string): Promise<void> {
    const existing = await prisma.calendarBlock.findFirst({
      where: { id, organizationId },
    });
    if (!existing) throw AppError.notFound('CalendarBlock', id);
    await prisma.calendarBlock.delete({ where: { id } });
  }

  async findById(organizationId: string, id: string): Promise<CalendarEvent | null> {
    return this.findBlockById(organizationId, id);
  }

  async list(organizationId: string): Promise<CalendarEvent[]> {
    return this.listEvents(organizationId);
  }

  async create(
    organizationId: string,
    data: Partial<CalendarEvent>,
  ): Promise<CalendarEvent> {
    if (!('propertyId' in data) || !data.propertyId) {
      throw AppError.validation('propertyId is required');
    }
    return this.createBlock(organizationId, {
      propertyId: data.propertyId,
      startDate: 'startDate' in data && data.startDate ? data.startDate : new Date(),
      endDate: 'endDate' in data && data.endDate ? data.endDate : new Date(),
      reason:
        data.kind === 'block' && 'reason' in data
          ? data.reason
          : CalendarBlockReason.MANUAL,
      notes: data.kind === 'block' && 'notes' in data ? data.notes : null,
    });
  }

  async update(
    organizationId: string,
    id: string,
    data: Partial<CalendarEvent>,
  ): Promise<CalendarEvent> {
    return this.updateBlock(organizationId, id, {
      ...(data.propertyId ? { propertyId: data.propertyId } : {}),
      ...('startDate' in data && data.startDate ? { startDate: data.startDate } : {}),
      ...('endDate' in data && data.endDate ? { endDate: data.endDate } : {}),
      ...(data.kind === 'block' && 'reason' in data ? { reason: data.reason } : {}),
      ...(data.kind === 'block' && 'notes' in data ? { notes: data.notes } : {}),
    });
  }

  async delete(organizationId: string, id: string): Promise<void> {
    await this.deleteBlock(organizationId, id);
  }
}
