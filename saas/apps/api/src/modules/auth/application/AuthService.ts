import { AppError } from '../../../shared/errors/AppError.js';
import type { AuthSession } from '../domain/AuthSession.js';
import type { IAuthRepository } from '../domain/IAuthRepository.js';

export class AuthService {
  constructor(private readonly repo: IAuthRepository) {}

  async list(organizationId: string): Promise<AuthSession[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<AuthSession> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('AuthSession', id);
    return item;
  }

  async create(organizationId: string, data: Partial<AuthSession>): Promise<AuthSession> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<AuthSession>): Promise<AuthSession> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
