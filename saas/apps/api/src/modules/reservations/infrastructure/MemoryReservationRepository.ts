import type { BookingChannel, BookingStatus, Reservation } from '../domain/Reservation.js';
import type { IReservationRepository } from '../domain/IReservationRepository.js';
import { memoryStore, newId, type MemReservation } from '../../../infrastructure/memory/store.js';
import { AppError } from '../../../shared/errors/AppError.js';

function nightsBetween(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function map(r: MemReservation): Reservation {
  const prop = memoryStore().properties.find((p) => p.id === r.propertyId);
  return {
    id: r.id,
    organizationId: r.organizationId,
    propertyId: r.propertyId,
    status: r.status as BookingStatus,
    channel: r.channel as BookingChannel,
    confirmationCode: r.confirmationCode,
    checkInDate: r.checkInDate,
    checkOutDate: r.checkOutDate,
    adults: r.adults,
    children: r.children,
    currency: r.currency,
    nightlyRate: r.nightlyRate,
    nightsCount: r.nightsCount,
    totalAmount: r.totalAmount,
    notes: r.notes,
    propertyName: prop?.name ?? null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export class MemoryReservationRepository implements IReservationRepository {
  async findById(organizationId: string, id: string): Promise<Reservation | null> {
    const r = memoryStore().reservations.find((x) => x.id === id && x.organizationId === organizationId);
    return r ? map(r) : null;
  }

  async list(organizationId: string): Promise<Reservation[]> {
    return memoryStore()
      .reservations.filter((r) => r.organizationId === organizationId)
      .sort((a, b) => b.checkInDate.getTime() - a.checkInDate.getTime())
      .map(map);
  }

  async create(organizationId: string, data: Partial<Reservation>): Promise<Reservation> {
    if (!data.propertyId) throw AppError.validation('propertyId is required');
    if (!data.checkInDate || !data.checkOutDate) {
      throw AppError.validation('checkInDate and checkOutDate are required');
    }
    const prop = memoryStore().properties.find(
      (p) => p.id === data.propertyId && p.organizationId === organizationId,
    );
    if (!prop) throw AppError.validation('property not found in organization');

    const checkInDate = new Date(data.checkInDate);
    const checkOutDate = new Date(data.checkOutDate);
    const nightsCount = data.nightsCount ?? nightsBetween(checkInDate, checkOutDate);
    const nightlyRate = data.nightlyRate ?? prop.basePrice;
    const now = new Date();
    const status: BookingStatus = data.status ?? 'PENDING';

    const row: MemReservation = {
      id: newId('res'),
      organizationId,
      propertyId: data.propertyId,
      status,
      channel: data.channel ?? 'DIRECT',
      confirmationCode: data.confirmationCode ?? `CB-${Math.floor(Math.random() * 9000 + 1000)}`,
      checkInDate,
      checkOutDate,
      adults: data.adults ?? 1,
      children: data.children ?? 0,
      currency: data.currency ?? 'EUR',
      nightlyRate,
      nightsCount,
      totalAmount: data.totalAmount ?? nightlyRate * nightsCount + (prop.cleaningFee ?? 0),
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    };
    memoryStore().reservations.push(row);

    if (status === 'CONFIRMED') {
      memoryStore().cleanings.push({
        id: newId('clean'),
        organizationId,
        propertyId: row.propertyId,
        reservationId: row.id,
        status: 'PENDING',
        scheduledAt: checkOutDate,
        notes: 'Turnover auto',
        createdAt: now,
        updatedAt: now,
      });
    }

    return map(row);
  }

  async update(organizationId: string, id: string, data: Partial<Reservation>): Promise<Reservation> {
    const idx = memoryStore().reservations.findIndex((r) => r.id === id && r.organizationId === organizationId);
    if (idx < 0) throw AppError.notFound('Reservation', id);
    const prev = memoryStore().reservations[idx]!;
    const next: MemReservation = {
      ...prev,
      ...data,
      id: prev.id,
      organizationId: prev.organizationId,
      checkInDate: data.checkInDate ? new Date(data.checkInDate) : prev.checkInDate,
      checkOutDate: data.checkOutDate ? new Date(data.checkOutDate) : prev.checkOutDate,
      updatedAt: new Date(),
    };
    memoryStore().reservations[idx] = next;
    return map(next);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    const store = memoryStore();
    store.reservations = store.reservations.filter((r) => !(r.id === id && r.organizationId === organizationId));
  }
}
