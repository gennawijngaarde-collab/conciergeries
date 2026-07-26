import { isMemoryStoreEnabled } from '../../../infrastructure/memory/store.js';
import type { ICalendarRepository } from '../domain/ICalendarRepository.js';
import { MemoryCalendarRepository } from './MemoryCalendarRepository.js';
import { PrismaCalendarRepository } from './PrismaCalendarRepository.js';

export function createCalendarRepository(): ICalendarRepository {
  return isMemoryStoreEnabled() ? new MemoryCalendarRepository() : new PrismaCalendarRepository();
}
