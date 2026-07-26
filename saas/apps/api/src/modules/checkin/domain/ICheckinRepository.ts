import type { CheckinSession } from './CheckinSession.js';

export interface ICheckinRepository {
  findById(organizationId: string, id: string): Promise<CheckinSession | null>;
  list(organizationId: string): Promise<CheckinSession[]>;
  create(organizationId: string, data: Partial<CheckinSession>): Promise<CheckinSession>;
  update(organizationId: string, id: string, data: Partial<CheckinSession>): Promise<CheckinSession>;
  delete(organizationId: string, id: string): Promise<void>;
}
