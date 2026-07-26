import type { AiJob } from './AiJob.js';

export interface IAiRepository {
  findById(organizationId: string, id: string): Promise<AiJob | null>;
  list(organizationId: string): Promise<AiJob[]>;
  create(organizationId: string, data: Partial<AiJob>): Promise<AiJob>;
  update(organizationId: string, id: string, data: Partial<AiJob>): Promise<AiJob>;
  delete(organizationId: string, id: string): Promise<void>;
}
