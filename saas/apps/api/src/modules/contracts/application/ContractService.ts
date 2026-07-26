import { AppError } from '../../../shared/errors/AppError.js';
import type { Contract } from '../domain/Contract.js';
import type { IContractRepository } from '../domain/IContractRepository.js';

export class ContractService {
  constructor(private readonly repo: IContractRepository) {}

  async list(organizationId: string): Promise<Contract[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<Contract> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('Contract', id);
    return item;
  }

  async create(organizationId: string, data: Partial<Contract>): Promise<Contract> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<Contract>): Promise<Contract> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
