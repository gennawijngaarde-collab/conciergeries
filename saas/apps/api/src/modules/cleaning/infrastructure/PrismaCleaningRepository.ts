import { CleaningTaskStatus } from '@prisma/client';
import { prisma } from '../../../infrastructure/prisma/client.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { serializeCleaningTask } from '../../../shared/http/serialize.js';
import type { CleaningTask } from '../domain/CleaningTask.js';
import type { ICleaningRepository } from '../domain/ICleaningRepository.js';

const propertyInclude = { property: { select: { name: true } } } as const;

const STATUS_TRANSITIONS: Record<CleaningTaskStatus, CleaningTaskStatus[]> = {
  PENDING: ['ASSIGNED', 'IN_PROGRESS', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED', 'PENDING'],
  IN_PROGRESS: ['COMPLETED', 'FAILED', 'CANCELLED'],
  COMPLETED: ['INSPECTED', 'FAILED'],
  INSPECTED: [],
  FAILED: ['PENDING', 'ASSIGNED', 'CANCELLED'],
  CANCELLED: ['PENDING'],
};

function asDate(v: unknown, field: string): Date {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v;
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d;
  }
  throw AppError.validation(`${field} must be a valid date`);
}

function parseCreateBody(data: Partial<CleaningTask> & Record<string, unknown>) {
  if (!data.propertyId || typeof data.propertyId !== 'string') {
    throw AppError.validation('propertyId is required');
  }

  return {
    propertyId: data.propertyId,
    reservationId: (data.reservationId as string | null | undefined) ?? null,
    status: (data.status as CleaningTaskStatus | undefined) ?? CleaningTaskStatus.PENDING,
    scheduledAt:
      data.scheduledAt === undefined || data.scheduledAt === null
        ? null
        : asDate(data.scheduledAt, 'scheduledAt'),
    notes: (data.notes as string | null | undefined) ?? null,
  };
}

export class PrismaCleaningRepository implements ICleaningRepository {
  async findById(organizationId: string, id: string): Promise<CleaningTask | null> {
    const row = await prisma.cleaningTask.findFirst({
      where: { id, organizationId },
      include: propertyInclude,
    });
    return row ? serializeCleaningTask(row) : null;
  }

  async list(organizationId: string): Promise<CleaningTask[]> {
    const rows = await prisma.cleaningTask.findMany({
      where: { organizationId },
      include: propertyInclude,
      orderBy: [{ scheduledAt: 'asc' }, { updatedAt: 'desc' }],
    });
    return rows.map((r) => serializeCleaningTask(r));
  }

  async create(
    organizationId: string,
    data: Partial<CleaningTask>,
  ): Promise<CleaningTask> {
    const body = parseCreateBody(data as Partial<CleaningTask> & Record<string, unknown>);

    const property = await prisma.property.findFirst({
      where: { id: body.propertyId, organizationId },
    });
    if (!property) {
      throw AppError.validation('propertyId does not belong to this organization');
    }

    if (body.reservationId) {
      const reservation = await prisma.reservation.findFirst({
        where: { id: body.reservationId, organizationId },
      });
      if (!reservation) {
        throw AppError.validation('reservationId does not belong to this organization');
      }
    }

    const row = await prisma.cleaningTask.create({
      data: {
        organizationId,
        ...body,
      },
      include: propertyInclude,
    });
    return serializeCleaningTask(row);
  }

  async update(
    organizationId: string,
    id: string,
    data: Partial<CleaningTask>,
  ): Promise<CleaningTask> {
    const existing = await prisma.cleaningTask.findFirst({
      where: { id, organizationId },
    });
    if (!existing) throw AppError.notFound('CleaningTask', id);

    if (data.status !== undefined) {
      const next = data.status as CleaningTaskStatus;
      const allowed = STATUS_TRANSITIONS[existing.status] ?? [];
      if (next !== existing.status && !allowed.includes(next)) {
        throw AppError.validation(
          `Invalid status transition from ${existing.status} to ${next}`,
        );
      }
    }

    if (data.propertyId) {
      const property = await prisma.property.findFirst({
        where: { id: data.propertyId, organizationId },
      });
      if (!property) {
        throw AppError.validation('propertyId does not belong to this organization');
      }
    }

    const row = await prisma.cleaningTask.update({
      where: { id },
      data: {
        ...(data.propertyId ? { propertyId: data.propertyId } : {}),
        ...(data.reservationId !== undefined
          ? { reservationId: data.reservationId }
          : {}),
        ...(data.status !== undefined
          ? { status: data.status as CleaningTaskStatus }
          : {}),
        ...(data.scheduledAt !== undefined
          ? {
              scheduledAt:
                data.scheduledAt === null
                  ? null
                  : asDate(data.scheduledAt, 'scheduledAt'),
            }
          : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.status === 'IN_PROGRESS' && !existing.startedAt
          ? { startedAt: new Date() }
          : {}),
        ...(data.status === 'COMPLETED' || data.status === 'INSPECTED'
          ? { completedAt: existing.completedAt ?? new Date() }
          : {}),
      },
      include: propertyInclude,
    });
    return serializeCleaningTask(row);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    const existing = await prisma.cleaningTask.findFirst({
      where: { id, organizationId },
    });
    if (!existing) throw AppError.notFound('CleaningTask', id);
    await prisma.cleaningTask.delete({ where: { id } });
  }
}
