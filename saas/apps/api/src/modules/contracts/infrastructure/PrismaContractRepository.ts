import type { Contract } from '../domain/Contract.js';
import type { IContractRepository } from '../domain/IContractRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for Contract.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaContractRepository implements IContractRepository {
  async findById(_organizationId: string, _id: string): Promise<Contract | null> {
    throw AppError.notImplemented('ContractRepository.findById');
  }

  async list(organizationId: string): Promise<Contract[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-contracts-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<Contract>): Promise<Contract> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Contract;
  }

  async update(_organizationId: string, id: string, data: Partial<Contract>): Promise<Contract> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Contract;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
