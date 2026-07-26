import { isMemoryStoreEnabled } from '../../../infrastructure/memory/store.js';
import type { IPropertyRepository } from '../domain/IPropertyRepository.js';
import { MemoryPropertyRepository } from './MemoryPropertyRepository.js';
import { PrismaPropertyRepository } from './PrismaPropertyRepository.js';

export function createPropertyRepository(): IPropertyRepository {
  return isMemoryStoreEnabled() ? new MemoryPropertyRepository() : new PrismaPropertyRepository();
}
