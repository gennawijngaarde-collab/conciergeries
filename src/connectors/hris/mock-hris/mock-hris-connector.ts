/**
 * Mock HRIS Connector
 * 
 * This is a mock implementation for testing and demonstration purposes.
 * It simulates an HRIS system without requiring actual HRIS credentials.
 */

import { BaseHRISConnector } from '../base-hris-connector';
import { 
  HRISConnector, 
  ConnectorConfig, 
  ValidationResult, 
  HealthCheckResult 
} from '../../interfaces/hris-connector.interface';
import { UniversalEmployee, HRISSystem } from '@/core/domain/models/employee';
import { BaseEvent } from '@/core/domain/events/base-event';
import { EmployeeCreatedEvent } from '@/core/domain/events/employee-created';
import { EmployeeTerminatedEvent } from '@/core/domain/events/employee-terminated';
import { EmployeeJobChangedEvent } from '@/core/domain/events/employee-job-changed';

export class MockHRISConnector extends BaseHRISConnector implements HRISConnector {
  readonly systemName: HRISSystem = 'mock';
  readonly version: string = '1.0.0';
  
  async validateConfig(config: ConnectorConfig): Promise<ValidationResult> {
    // Mock connector always validates successfully
    return {
      valid: true,
    };
  }
  
  async syncEmployees(): Promise<UniversalEmployee[]> {
    this.ensureConfigured();
    this.log('info', 'Syncing employees from Mock HRIS');
    
    // Return mock employee data
    return this.getMockEmployees();
  }
  
  async syncEmployee(externalId: string): Promise<UniversalEmployee> {
    this.ensureConfigured();
    this.log('info', `Syncing employee ${externalId} from Mock HRIS`);
    
    const employees = this.getMockEmployees();
    const employee = employees.find(emp => emp.externalId === externalId);
    
    if (!employee) {
      throw new Error(`Employee ${externalId} not found`);
    }
    
    return employee;
  }
  
  async handleWebhook(payload: any, headers?: Record<string, string>): Promise<BaseEvent | null> {
    this.ensureConfigured();
    this.log('info', 'Handling webhook from Mock HRIS', { payload });
    
    const eventType = payload.event_type;
    const employeeData = payload.employee;
    
    if (!eventType || !employeeData) {
      this.log('warn', 'Invalid webhook payload', { payload });
      return null;
    }
    
    const employee = this.mapToUniversal(employeeData);
    
    const baseEvent = {
      id: payload.id || `evt_${Date.now()}`,
      eventSource: this.systemName,
      externalEventId: payload.external_id,
      occurredAt: payload.occurred_at ? new Date(payload.occurred_at) : new Date(),
      receivedAt: new Date(),
      employee: {
        id: employee.id,
        externalId: employee.externalId,
      },
      tenantId: this.config!.tenantId,
      status: 'pending' as const,
      retryCount: 0,
      rawPayload: payload,
    };
    
    switch (eventType) {
      case 'employee.created':
        return {
          ...baseEvent,
          eventType: 'employee.created',
          payload: { employee },
        } as EmployeeCreatedEvent;
        
      case 'employee.terminated':
        return {
          ...baseEvent,
          eventType: 'employee.terminated',
          payload: {
            employee,
            terminationDate: new Date(payload.termination_date),
            reason: payload.reason,
          },
        } as EmployeeTerminatedEvent;
        
      case 'employee.job_changed':
        return {
          ...baseEvent,
          eventType: 'employee.job_changed',
          payload: {
            employee,
            previousJob: {
              title: payload.previous_job_title,
              departmentId: payload.previous_department_id,
            },
            newJob: {
              title: payload.new_job_title,
              departmentId: payload.new_department_id,
            },
            effectiveDate: new Date(payload.effective_date),
          },
        } as EmployeeJobChangedEvent;
        
      default:
        this.log('warn', `Unsupported event type: ${eventType}`);
        return null;
    }
  }
  
  mapToUniversal(sourceData: any): UniversalEmployee {
    return {
      id: sourceData.id || `emp_${Date.now()}`,
      externalId: sourceData.external_id || sourceData.id,
      sourceSystem: this.systemName,
      tenantId: this.config!.tenantId,
      
      personalInfo: {
        firstName: sourceData.first_name,
        lastName: sourceData.last_name,
        preferredName: sourceData.preferred_name,
        email: sourceData.email,
        personalEmail: sourceData.personal_email,
        phone: sourceData.phone,
        mobile: sourceData.mobile,
        dateOfBirth: sourceData.date_of_birth ? new Date(sourceData.date_of_birth) : undefined,
        nationality: sourceData.nationality,
        gender: sourceData.gender,
      },
      
      employment: {
        employeeNumber: sourceData.employee_number,
        hireDate: new Date(sourceData.hire_date),
        terminationDate: sourceData.termination_date ? new Date(sourceData.termination_date) : undefined,
        status: sourceData.employment_status || 'active',
        type: sourceData.employment_type || 'full_time',
      },
      
      job: {
        title: sourceData.job_title,
        jobId: sourceData.job_id,
        departmentId: sourceData.department_id,
        locationId: sourceData.location_id,
        managerId: sourceData.manager_id,
      },
      
      contract: {
        type: sourceData.contract_type || 'permanent',
        startDate: new Date(sourceData.contract_start_date || sourceData.hire_date),
        endDate: sourceData.contract_end_date ? new Date(sourceData.contract_end_date) : undefined,
      },
      
      metadata: {
        createdAt: sourceData.created_at ? new Date(sourceData.created_at) : new Date(),
        updatedAt: sourceData.updated_at ? new Date(sourceData.updated_at) : new Date(),
        syncedAt: new Date(),
      },
      
      rawData: sourceData,
    };
  }
  
  mapFromUniversal(employee: UniversalEmployee): any {
    return {
      id: employee.id,
      external_id: employee.externalId,
      first_name: employee.personalInfo.firstName,
      last_name: employee.personalInfo.lastName,
      email: employee.personalInfo.email,
      // ... map other fields as needed
    };
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    // Mock connector is always healthy
    return {
      status: 'healthy',
      latency: 50,
      message: 'Mock HRIS connector is operational',
      checkedAt: new Date(),
    };
  }
  
  /**
   * Generate mock employee data for testing
   */
  private getMockEmployees(): UniversalEmployee[] {
    const now = new Date();
    
    return [
      {
        id: 'emp_001',
        externalId: 'mock_emp_001',
        sourceSystem: this.systemName,
        tenantId: this.config!.tenantId,
        
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          phone: '+1234567890',
        },
        
        employment: {
          employeeNumber: 'EMP001',
          hireDate: new Date('2024-01-15'),
          status: 'active',
          type: 'full_time',
        },
        
        job: {
          title: 'Software Engineer',
          departmentId: 'dept_engineering',
          locationId: 'loc_hq',
        },
        
        contract: {
          type: 'permanent',
          startDate: new Date('2024-01-15'),
        },
        
        metadata: {
          createdAt: now,
          updatedAt: now,
          syncedAt: now,
        },
        
        rawData: {},
      },
      {
        id: 'emp_002',
        externalId: 'mock_emp_002',
        sourceSystem: this.systemName,
        tenantId: this.config!.tenantId,
        
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@company.com',
          phone: '+1234567891',
        },
        
        employment: {
          employeeNumber: 'EMP002',
          hireDate: new Date('2023-06-01'),
          status: 'active',
          type: 'full_time',
        },
        
        job: {
          title: 'Product Manager',
          departmentId: 'dept_product',
          locationId: 'loc_hq',
        },
        
        contract: {
          type: 'permanent',
          startDate: new Date('2023-06-01'),
        },
        
        metadata: {
          createdAt: now,
          updatedAt: now,
          syncedAt: now,
        },
        
        rawData: {},
      },
    ];
  }
}
