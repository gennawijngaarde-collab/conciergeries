import type { Contract } from './Contract.js';

export interface IContractRepository {
  findById(organizationId: string, id: string): Promise<Contract | null>;
  list(organizationId: string): Promise<Contract[]>;
  create(organizationId: string, data: Partial<Contract>): Promise<Contract>;
  update(organizationId: string, id: string, data: Partial<Contract>): Promise<Contract>;
  delete(organizationId: string, id: string): Promise<void>;
}
