import type { Employee } from '../domain/Employee.js';
import type { IEmployeeRepository } from '../domain/IEmployeeRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for Employee.
 * Wire prisma client methods when schema models are ready.
 */
export class PrismaEmployeeRepository implements IEmployeeRepository {
  async findById(_organizationId: string, _id: string): Promise<Employee | null> {
    throw AppError.notImplemented('EmployeeRepository.findById');
  }

  async list(organizationId: string): Promise<Employee[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-employees-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<Employee>): Promise<Employee> {
    return {
      id: `stub-${Date.now()}`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Employee;
  }

  async update(_organizationId: string, id: string, data: Partial<Employee>): Promise<Employee> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Employee;
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
