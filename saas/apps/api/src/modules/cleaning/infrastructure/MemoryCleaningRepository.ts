import type { CleaningTask, CleaningTaskStatus } from '../domain/CleaningTask.js';
import type { ICleaningRepository } from '../domain/ICleaningRepository.js';
import { memoryStore, newId, type MemCleaning } from '../../../infrastructure/memory/store.js';
import { AppError } from '../../../shared/errors/AppError.js';

function map(c: MemCleaning): CleaningTask {
  const prop = memoryStore().properties.find((p) => p.id === c.propertyId);
  return {
    id: c.id,
    organizationId: c.organizationId,
    propertyId: c.propertyId,
    reservationId: c.reservationId,
    status: c.status as CleaningTaskStatus,
    scheduledAt: c.scheduledAt,
    notes: c.notes,
    propertyName: prop?.name ?? null,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export class MemoryCleaningRepository implements ICleaningRepository {
  async findById(organizationId: string, id: string): Promise<CleaningTask | null> {
    const c = memoryStore().cleanings.find((x) => x.id === id && x.organizationId === organizationId);
    return c ? map(c) : null;
  }

  async list(organizationId: string): Promise<CleaningTask[]> {
    return memoryStore()
      .cleanings.filter((c) => c.organizationId === organizationId)
      .sort((a, b) => (b.scheduledAt?.getTime() ?? 0) - (a.scheduledAt?.getTime() ?? 0))
      .map(map);
  }

  async create(organizationId: string, data: Partial<CleaningTask>): Promise<CleaningTask> {
    if (!data.propertyId) throw AppError.validation('propertyId is required');
    const prop = memoryStore().properties.find(
      (p) => p.id === data.propertyId && p.organizationId === organizationId,
    );
    if (!prop) throw AppError.validation('property not found');
    const now = new Date();
    const row: MemCleaning = {
      id: newId('clean'),
      organizationId,
      propertyId: data.propertyId,
      reservationId: data.reservationId ?? null,
      status: data.status ?? 'PENDING',
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : now,
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    };
    memoryStore().cleanings.push(row);
    return map(row);
  }

  async update(organizationId: string, id: string, data: Partial<CleaningTask>): Promise<CleaningTask> {
    const idx = memoryStore().cleanings.findIndex((c) => c.id === id && c.organizationId === organizationId);
    if (idx < 0) throw AppError.notFound('CleaningTask', id);
    const prev = memoryStore().cleanings[idx]!;
    const next: MemCleaning = {
      ...prev,
      ...data,
      id: prev.id,
      organizationId: prev.organizationId,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : prev.scheduledAt,
      updatedAt: new Date(),
    };
    memoryStore().cleanings[idx] = next;
    return map(next);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    const store = memoryStore();
    store.cleanings = store.cleanings.filter((c) => !(c.id === id && c.organizationId === organizationId));
  }
}
