import { AppError } from '../../../shared/errors/AppError.js';
import type { Employee } from '../domain/Employee.js';
import type { IEmployeeRepository } from '../domain/IEmployeeRepository.js';

export class EmployeeService {
  constructor(private readonly repo: IEmployeeRepository) {}

  async list(organizationId: string): Promise<Employee[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<Employee> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('Employee', id);
    return item;
  }

  async create(organizationId: string, data: Partial<Employee>): Promise<Employee> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<Employee>): Promise<Employee> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
