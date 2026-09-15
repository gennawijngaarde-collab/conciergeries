/**
 * Sage HR Connector
 * 
 * Sage (formerly Sage Business Cloud People) is a comprehensive HR and payroll solution.
 * API Documentation: https://developers.sage.com/
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

interface SageConfig {
  apiUrl: string; // Default: "https://api.sage.hr/v2.0"
  clientId: string;
  clientSecret: string;
  companyId: string;
  webhookSecret?: string;
}

interface SageAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface SageEmployee {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone?: string;
  date_of_birth?: string;
  start_date: string; // Hire date
  leaving_date?: string; // Termination date
  employment_status: 'active' | 'terminated' | 'on_leave';
  employment_type: string; // "permanent", "fixed_term", "contractor", "intern"
  job_title: string;
  department_id: string;
  department_name: string;
  location_id: string;
  manager_id?: string;
  contract_type: string;
  contract_start_date: string;
  contract_end_date?: string;
}

export class SageConnector extends BaseHRISConnector implements HRISConnector {
  readonly systemName: HRISSystem = 'sage';
  readonly version: string = '1.0.0';
  
  private sageConfig?: SageConfig;
  private accessToken?: string;
  private tokenExpiresAt?: number;
  
  async configure(config: ConnectorConfig): Promise<void> {
    await super.configure(config);
    
    // Decrypt and parse Sage-specific config
    this.sageConfig = config.settings as SageConfig;
    
    this.log('info', 'Sage connector configured', { 
      apiUrl: this.sageConfig.apiUrl,
      companyId: this.sageConfig.companyId,
    });
    
    // Get initial access token
    await this.refreshAccessToken();
  }
  
  async validateConfig(config: ConnectorConfig): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const sageConfig = config.settings as SageConfig;
    
    if (!sageConfig.apiUrl) {
      sageConfig.apiUrl = 'https://api.sage.hr/v2.0';
      warnings.push('URL API par défaut utilisée: https://api.sage.hr/v2.0');
    }
    
    if (!sageConfig.clientId) {
      errors.push('Le Client ID OAuth Sage est obligatoire');
    }
    
    if (!sageConfig.clientSecret) {
      errors.push('Le Client Secret OAuth Sage est obligatoire');
    }
    
    if (!sageConfig.companyId) {
      errors.push('L\'identifiant entreprise Sage est obligatoire');
    }
    
    if (!sageConfig.webhookSecret) {
      warnings.push('Aucun secret webhook configuré');
    }
    
    // Test OAuth authentication
    if (sageConfig.apiUrl && sageConfig.clientId && sageConfig.clientSecret) {
      try {
        const tokenResponse = await fetch(`${sageConfig.apiUrl}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: sageConfig.clientId,
            client_secret: sageConfig.clientSecret,
          }),
        });
        
        if (!tokenResponse.ok) {
          errors.push(`Échec de l'authentification OAuth Sage: ${tokenResponse.status}`);
        }
      } catch (error) {
        errors.push(`Erreur de connexion à Sage: ${error}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }
  
  async syncEmployees(): Promise<UniversalEmployee[]> {
    this.ensureConfigured();
    await this.ensureValidToken();
    
    this.log('info', 'Syncing employees from Sage');
    
    const employees: UniversalEmployee[] = [];
    let page = 1;
    const pageSize = 100;
    let hasMore = true;
    
    while (hasMore) {
      const response = await fetch(
        `${this.sageConfig!.apiUrl}/companies/${this.sageConfig!.companyId}/employees?page=${page}&per_page=${pageSize}`,
        {
          headers: await this.getHeaders(),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur Sage API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const sageEmployees = data.employees as SageEmployee[];
      
      for (const sageEmployee of sageEmployees) {
        employees.push(this.mapToUniversal(sageEmployee));
      }
      
      hasMore = sageEmployees.length === pageSize;
      page++;
    }
    
    this.log('info', `Synced ${employees.length} employees from Sage`);
    return employees;
  }
  
  async syncEmployee(externalId: string): Promise<UniversalEmployee> {
    this.ensureConfigured();
    await this.ensureValidToken();
    
    this.log('info', `Syncing employee ${externalId} from Sage`);
    
    const response = await fetch(
      `${this.sageConfig!.apiUrl}/companies/${this.sageConfig!.companyId}/employees/${externalId}`,
      {
        headers: await this.getHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Employee ${externalId} not found in Sage`);
    }
    
    const data = await response.json();
    return this.mapToUniversal(data.employee);
  }
  
  async handleWebhook(payload: any, headers?: Record<string, string>): Promise<BaseEvent | null> {
    this.ensureConfigured();
    this.log('info', 'Handling webhook from Sage', { payload });
    
    // Sage webhook format:
    // {
    //   "event": "employee.hired" | "employee.terminated" | "employee.updated",
    //   "company_id": "12345",
    //   "employee_id": "EMP001",
    //   "timestamp": "2024-01-15T10:30:00Z",
    //   "data": { ... employee data ... },
    //   "changes": ["department", "job_title"] // For update events
    // }
    
    if (payload.company_id !== this.sageConfig!.companyId) {
      this.log('warn', 'Webhook company ID mismatch', { 
        expected: this.sageConfig!.companyId, 
        received: payload.company_id 
      });
      return null;
    }
    
    const eventType = payload.event;
    const employeeData = payload.data;
    
    if (!eventType || !employeeData) {
      this.log('warn', 'Invalid Sage webhook payload', { payload });
      return null;
    }
    
    const employee = this.mapToUniversal(employeeData);
    
    const baseEvent = {
      id: `evt_sage_${payload.employee_id}_${Date.now()}`,
      eventSource: this.systemName,
      externalEventId: payload.event_id || `${payload.employee_id}_${payload.timestamp}`,
      occurredAt: new Date(payload.timestamp),
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
      case 'employee.hired':
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
            terminationDate: new Date(employeeData.leaving_date || payload.timestamp),
            reason: payload.termination_reason || 'Non spécifié',
          },
        } as EmployeeTerminatedEvent;
        
      case 'employee.updated':
        // Check if job-related fields changed
        const changes = payload.changes || [];
        if (changes.includes('department') || changes.includes('job_title')) {
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
                title: employeeData.job_title,
                departmentId: employeeData.department_id,
              },
              effectiveDate: new Date(payload.effective_date || payload.timestamp),
            },
          } as EmployeeJobChangedEvent;
        }
        // Ignore other updates
        return null;
        
      default:
        this.log('warn', `Unsupported Sage event type: ${eventType}`);
        return null;
    }
  }
  
  validateWebhookSignature(payload: any, signature: string): boolean {
    // Implement HMAC signature validation if needed
    return true;
  }
  
  mapToUniversal(sourceData: SageEmployee): UniversalEmployee {
    return {
      id: `sage_${sourceData.id}`,
      externalId: sourceData.id,
      sourceSystem: this.systemName,
      tenantId: this.config!.tenantId,
      
      personalInfo: {
        firstName: sourceData.first_name,
        lastName: sourceData.last_name,
        email: sourceData.email,
        mobile: sourceData.mobile_phone,
        dateOfBirth: sourceData.date_of_birth ? new Date(sourceData.date_of_birth) : undefined,
      },
      
      employment: {
        employeeNumber: sourceData.employee_number,
        hireDate: new Date(sourceData.start_date),
        terminationDate: sourceData.leaving_date ? new Date(sourceData.leaving_date) : undefined,
        status: this.mapEmploymentStatus(sourceData.employment_status),
        type: this.mapEmploymentType(sourceData.employment_type),
      },
      
      job: {
        title: sourceData.job_title,
        departmentId: sourceData.department_id,
        locationId: sourceData.location_id,
        managerId: sourceData.manager_id,
      },
      
      contract: {
        type: this.mapContractType(sourceData.contract_type),
        startDate: new Date(sourceData.contract_start_date || sourceData.start_date),
        endDate: sourceData.contract_end_date ? new Date(sourceData.contract_end_date) : undefined,
      },
      
      metadata: {
        createdAt: new Date(sourceData.start_date),
        updatedAt: new Date(),
        syncedAt: new Date(),
      },
      
      rawData: sourceData,
    };
  }
  
  mapFromUniversal(employee: UniversalEmployee): any {
    return {
      id: employee.externalId,
      employee_number: employee.employment.employeeNumber,
      first_name: employee.personalInfo.firstName,
      last_name: employee.personalInfo.lastName,
      email: employee.personalInfo.email,
      start_date: employee.employment.hireDate.toISOString().split('T')[0],
    };
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    if (!this.sageConfig) {
      return {
        status: 'down',
        message: 'Sage connector not configured',
        checkedAt: new Date(),
      };
    }
    
    const startTime = Date.now();
    
    try {
      await this.ensureValidToken();
      
      const response = await fetch(
        `${this.sageConfig.apiUrl}/companies/${this.sageConfig.companyId}/employees?page=1&per_page=1`,
        {
          headers: await this.getHeaders(),
        }
      );
      
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        return {
          status: 'healthy',
          latency,
          message: 'Connected to Sage API',
          checkedAt: new Date(),
        };
      } else {
        return {
          status: 'degraded',
          latency,
          message: `Sage API returned ${response.status}`,
          checkedAt: new Date(),
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        message: `Cannot reach Sage API: ${error}`,
        checkedAt: new Date(),
      };
    }
  }
  
  getSupportedEventTypes(): string[] {
    return [
      'employee.hired',
      'employee.terminated',
      'employee.updated',
    ];
  }
  
  private async refreshAccessToken(): Promise<void> {
    if (!this.sageConfig) {
      throw new Error('Sage connector not configured');
    }
    
    const response = await fetch(`${this.sageConfig.apiUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.sageConfig.clientId,
        client_secret: this.sageConfig.clientSecret,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to obtain Sage access token: ${response.status}`);
    }
    
    const tokenData: SageAccessToken = await response.json();
    this.accessToken = tokenData.access_token;
    this.tokenExpiresAt = Date.now() + (tokenData.expires_in * 1000) - 60000; // Refresh 1 min before expiry
    
    this.log('info', 'Sage access token refreshed');
  }
  
  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiresAt || Date.now() >= this.tokenExpiresAt) {
      await this.refreshAccessToken();
    }
  }
  
  private async getHeaders(): Promise<HeadersInit> {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }
  
  private mapEmploymentStatus(sageStatus: string): 'active' | 'terminated' | 'suspended' {
    const mapping: Record<string, 'active' | 'terminated' | 'suspended'> = {
      'active': 'active',
      'terminated': 'terminated',
      'on_leave': 'suspended',
    };
    return mapping[sageStatus] || 'active';
  }
  
  private mapEmploymentType(sageType: string): 'full_time' | 'part_time' | 'contractor' | 'intern' {
    const mapping: Record<string, 'full_time' | 'part_time' | 'contractor' | 'intern'> = {
      'permanent': 'full_time',
      'fixed_term': 'full_time',
      'part_time': 'part_time',
      'contractor': 'contractor',
      'intern': 'intern',
    };
    return mapping[sageType] || 'full_time';
  }
  
  private mapContractType(sageType: string): 'permanent' | 'fixed_term' | 'internship' | 'freelance' {
    const mapping: Record<string, 'permanent' | 'fixed_term' | 'internship' | 'freelance'> = {
      'permanent': 'permanent',
      'fixed_term': 'fixed_term',
      'internship': 'internship',
      'freelance': 'freelance',
      'CDI': 'permanent',
      'CDD': 'fixed_term',
    };
    return mapping[sageType] || 'permanent';
  }
}
