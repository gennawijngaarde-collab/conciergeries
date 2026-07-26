import {
  BookingChannel,
  BookingStatus,
  Prisma,
} from '@prisma/client';
import { prisma } from '../../../infrastructure/prisma/client.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { serializeReservation } from '../../../shared/http/serialize.js';
import type { Reservation } from '../domain/Reservation.js';
import type { IReservationRepository } from '../domain/IReservationRepository.js';

const propertyInclude = { property: { select: { name: true } } } as const;

function optionalDecimal(v: unknown): number | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) throw AppError.validation('Invalid decimal value');
  return n;
}

function asDate(v: unknown, field: string): Date {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v;
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d;
  }
  throw AppError.validation(`${field} must be a valid date`);
}

function nightsBetween(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.max(0, Math.round(ms / (24 * 60 * 60 * 1000)));
}

function parseCreateBody(data: Partial<Reservation> & Record<string, unknown>) {
  if (!data.propertyId || typeof data.propertyId !== 'string') {
    throw AppError.validation('propertyId is required');
  }
  if (data.checkInDate === undefined || data.checkInDate === null) {
    throw AppError.validation('checkInDate is required');
  }
  if (data.checkOutDate === undefined || data.checkOutDate === null) {
    throw AppError.validation('checkOutDate is required');
  }

  const checkInDate = asDate(data.checkInDate, 'checkInDate');
  const checkOutDate = asDate(data.checkOutDate, 'checkOutDate');
  if (checkOutDate <= checkInDate) {
    throw AppError.validation('checkOutDate must be after checkInDate');
  }

  const nightsCount =
    typeof data.nightsCount === 'number'
      ? data.nightsCount
      : nightsBetween(checkInDate, checkOutDate);

  return {
    propertyId: data.propertyId,
    status: (data.status as BookingStatus | undefined) ?? BookingStatus.PENDING,
    channel: (data.channel as BookingChannel | undefined) ?? BookingChannel.DIRECT,
    confirmationCode: (data.confirmationCode as string | null | undefined) ?? null,
    checkInDate,
    checkOutDate,
    adults: typeof data.adults === 'number' ? data.adults : 1,
    children: typeof data.children === 'number' ? data.children : 0,
    currency: (data.currency as string | undefined) ?? 'EUR',
    nightlyRate: optionalDecimal(data.nightlyRate) ?? null,
    nightsCount,
    totalAmount: optionalDecimal(data.totalAmount) ?? null,
    notes: (data.notes as string | null | undefined) ?? null,
  };
}

function parseUpdateBody(data: Partial<Reservation> & Record<string, unknown>) {
  const patch: Prisma.ReservationUpdateInput = {};

  if (data.propertyId !== undefined) {
    patch.property = { connect: { id: data.propertyId as string } };
  }
  if (data.status !== undefined) patch.status = data.status as BookingStatus;
  if (data.channel !== undefined) patch.channel = data.channel as BookingChannel;
  if (data.confirmationCode !== undefined) {
    patch.confirmationCode = data.confirmationCode as string | null;
  }
  if (data.checkInDate !== undefined) {
    patch.checkInDate = asDate(data.checkInDate, 'checkInDate');
  }
  if (data.checkOutDate !== undefined) {
    patch.checkOutDate = asDate(data.checkOutDate, 'checkOutDate');
  }
  if (data.adults !== undefined) patch.adults = data.adults as number;
  if (data.children !== undefined) patch.children = data.children as number;
  if (data.currency !== undefined) patch.currency = data.currency as string;
  if (data.nightlyRate !== undefined) {
    patch.nightlyRate = optionalDecimal(data.nightlyRate);
  }
  if (data.nightsCount !== undefined) patch.nightsCount = data.nightsCount as number | null;
  if (data.totalAmount !== undefined) {
    patch.totalAmount = optionalDecimal(data.totalAmount);
  }
  if (data.notes !== undefined) patch.notes = data.notes as string | null;

  return patch;
}

export class PrismaReservationRepository implements IReservationRepository {
  async findById(organizationId: string, id: string): Promise<Reservation | null> {
    const row = await prisma.reservation.findFirst({
      where: { id, organizationId },
      include: propertyInclude,
    });
    return row ? serializeReservation(row) : null;
  }

  async list(organizationId: string): Promise<Reservation[]> {
    const rows = await prisma.reservation.findMany({
      where: { organizationId },
      include: propertyInclude,
      orderBy: { checkInDate: 'desc' },
    });
    return rows.map((r) => serializeReservation(r));
  }

  async create(
    organizationId: string,
    data: Partial<Reservation>,
  ): Promise<Reservation> {
    const body = parseCreateBody(data as Partial<Reservation> & Record<string, unknown>);

    const property = await prisma.property.findFirst({
      where: { id: body.propertyId, organizationId },
    });
    if (!property) {
      throw AppError.validation('propertyId does not belong to this organization');
    }

    const row = await prisma.reservation.create({
      data: {
        organizationId,
        ...body,
      },
      include: propertyInclude,
    });

    // Nice-to-have: schedule cleaning on checkout for confirmed bookings
    if (row.status === BookingStatus.CONFIRMED) {
      await prisma.cleaningTask.create({
        data: {
          organizationId,
          propertyId: row.propertyId,
          reservationId: row.id,
          status: 'PENDING',
          scheduledAt: row.checkOutDate,
          notes: 'Auto-created on confirmed reservation',
        },
      });
    }

    return serializeReservation(row);
  }

  async update(
    organizationId: string,
    id: string,
    data: Partial<Reservation>,
  ): Promise<Reservation> {
    const existing = await prisma.reservation.findFirst({
      where: { id, organizationId },
    });
    if (!existing) throw AppError.notFound('Reservation', id);

    if (data.propertyId) {
      const property = await prisma.property.findFirst({
        where: { id: data.propertyId, organizationId },
      });
      if (!property) {
        throw AppError.validation('propertyId does not belong to this organization');
      }
    }

    const row = await prisma.reservation.update({
      where: { id },
      data: parseUpdateBody(data as Partial<Reservation> & Record<string, unknown>),
      include: propertyInclude,
    });
    return serializeReservation(row);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    const existing = await prisma.reservation.findFirst({
      where: { id, organizationId },
    });
    if (!existing) throw AppError.notFound('Reservation', id);
    await prisma.reservation.delete({ where: { id } });
  }
}
