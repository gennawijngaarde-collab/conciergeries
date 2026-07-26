import { isMemoryStoreEnabled } from '../../../infrastructure/memory/store.js';
import type { ICleaningRepository } from '../domain/ICleaningRepository.js';
import { MemoryCleaningRepository } from './MemoryCleaningRepository.js';
import { PrismaCleaningRepository } from './PrismaCleaningRepository.js';

export function createCleaningRepository(): ICleaningRepository {
  return isMemoryStoreEnabled() ? new MemoryCleaningRepository() : new PrismaCleaningRepository();
}
