import { isMemoryStoreEnabled } from '../../../infrastructure/memory/store.js';
import type { IReservationRepository } from '../domain/IReservationRepository.js';
import { MemoryReservationRepository } from './MemoryReservationRepository.js';
import { PrismaReservationRepository } from './PrismaReservationRepository.js';

export function createReservationRepository(): IReservationRepository {
  return isMemoryStoreEnabled()
    ? new MemoryReservationRepository()
    : new PrismaReservationRepository();
}
