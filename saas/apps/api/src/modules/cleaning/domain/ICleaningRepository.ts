import type { CleaningTask } from './CleaningTask.js';

export interface ICleaningRepository {
  findById(organizationId: string, id: string): Promise<CleaningTask | null>;
  list(organizationId: string): Promise<CleaningTask[]>;
  create(organizationId: string, data: Partial<CleaningTask>): Promise<CleaningTask>;
  update(organizationId: string, id: string, data: Partial<CleaningTask>): Promise<CleaningTask>;
  delete(organizationId: string, id: string): Promise<void>;
}
