import type { AuthSession } from './AuthSession.js';

export interface IAuthRepository {
  findById(organizationId: string, id: string): Promise<AuthSession | null>;
  list(organizationId: string): Promise<AuthSession[]>;
  create(organizationId: string, data: Partial<AuthSession>): Promise<AuthSession>;
  update(organizationId: string, id: string, data: Partial<AuthSession>): Promise<AuthSession>;
  delete(organizationId: string, id: string): Promise<void>;
}
