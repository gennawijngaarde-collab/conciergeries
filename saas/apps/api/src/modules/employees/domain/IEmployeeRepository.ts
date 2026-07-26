import type { Employee } from './Employee.js';

export interface IEmployeeRepository {
  findById(organizationId: string, id: string): Promise<Employee | null>;
  list(organizationId: string): Promise<Employee[]>;
  create(organizationId: string, data: Partial<Employee>): Promise<Employee>;
  update(organizationId: string, id: string, data: Partial<Employee>): Promise<Employee>;
  delete(organizationId: string, id: string): Promise<void>;
}
