/**
 * Cegid (Talentsoft) HRIS Connector
 * 
 * Cegid is a comprehensive French HR suite covering recruitment, performance, learning, and core HR.
 * API Documentation: https://developers.cegid.com/
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

interface CegidConfig {
  instanceUrl: string; // e.g., "https://mycompany.cegid.cloud"
  clientId: string;
  clientSecret: string;
  tenantCode: string; // Cegid tenant identifier
  webhookSecret?: string;
}

interface CegidAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface CegidEmployee {
  employeeId: string;
  personnelNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone?: string;
  dateOfBirth?: string;
  hireDate: string;
  terminationDate?: string;
  employmentStatus: 'Active' | 'Terminated' | 'Suspended';
  employmentType: string; // "Permanent", "Fixed-term", "Intern"
  jobTitle: string;
  departmentCode: string;
  departmentName: string;
  managerEmployeeId?: string;
  locationCode: string;
  contractType: string;
  contractStartDate: string;
  contractEndDate?: string;
}

export class CegidConnector extends BaseHRISConnector implements HRISConnector {
  readonly systemName: HRISSystem = 'cegid';
  readonly version: string = '1.0.0';
  
  private cegidConfig?: CegidConfig;
  private accessToken?: string;
  private tokenExpiresAt?: number;
  
  async configure(config: ConnectorConfig): Promise<void> {
    await super.configure(config);
    
    // Decrypt and parse Cegid-specific config
    this.cegidConfig = config.settings as CegidConfig;
    
    this.log('info', 'Cegid connector configured', { 
      instanceUrl: this.cegidConfig.instanceUrl,
      tenantCode: this.cegidConfig.tenantCode,
    });
    
    // Get initial access token
    await this.refreshAccessToken();
  }
  
  async validateConfig(config: ConnectorConfig): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const cegidConfig = config.settings as CegidConfig;
    
    if (!cegidConfig.instanceUrl) {
      errors.push('L\'URL de l\'instance Cegid est obligatoire');
    }
    
    if (!cegidConfig.clientId) {
      errors.push('Le Client ID OAuth est obligatoire');
    }
    
    if (!cegidConfig.clientSecret) {
      errors.push('Le Client Secret OAuth est obligatoire');
    }
    
    if (!cegidConfig.tenantCode) {
      errors.push('Le code tenant Cegid est obligatoire');
    }
    
    if (!cegidConfig.webhookSecret) {
      warnings.push('Aucun secret webhook configuré');
    }
    
    // Test OAuth authentication
    if (cegidConfig.instanceUrl && cegidConfig.clientId && cegidConfig.clientSecret) {
      try {
        const tokenResponse = await fetch(`${cegidConfig.instanceUrl}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: cegidConfig.clientId,
            client_secret: cegidConfig.clientSecret,
            scope: 'api.read',
          }),
        });
        
        if (!tokenResponse.ok) {
          errors.push(`Échec de l'authentification OAuth Cegid: ${tokenResponse.status}`);
        }
      } catch (error) {
        errors.push(`Erreur de connexion à Cegid: ${error}`);
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
    
    this.log('info', 'Syncing employees from Cegid');
    
    const employees: UniversalEmployee[] = [];
    let page = 0;
    const pageSize = 100;
    let hasMore = true;
    
    while (hasMore) {
      const response = await fetch(
        `${this.cegidConfig!.instanceUrl}/api/v1/tenants/${this.cegidConfig!.tenantCode}/employees?page=${page}&size=${pageSize}`,
        {
          headers: await this.getHeaders(),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur Cegid API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const cegidEmployees = data.content as CegidEmployee[];
      
      for (const cegidEmployee of cegidEmployees) {
        employees.push(this.mapToUniversal(cegidEmployee));
      }
      
      hasMore = !data.last; // Cegid uses Spring Data pagination
      page++;
    }
    
    this.log('info', `Synced ${employees.length} employees from Cegid`);
    return employees;
  }
  
  async syncEmployee(externalId: string): Promise<UniversalEmployee> {
    this.ensureConfigured();
    await this.ensureValidToken();
    
    this.log('info', `Syncing employee ${externalId} from Cegid`);
    
    const response = await fetch(
      `${this.cegidConfig!.instanceUrl}/api/v1/tenants/${this.cegidConfig!.tenantCode}/employees/${externalId}`,
      {
        headers: await this.getHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Employee ${externalId} not found in Cegid`);
    }
    
    const employee = await response.json();
    return this.mapToUniversal(employee);
  }
  
  async handleWebhook(payload: any, headers?: Record<string, string>): Promise<BaseEvent | null> {
    this.ensureConfigured();
    this.log('info', 'Handling webhook from Cegid', { payload });
    
    // Cegid webhook format:
    // {
    //   "eventType": "EMPLOYEE_HIRED" | "EMPLOYEE_TERMINATED" | "EMPLOYEE_TRANSFER",
    //   "tenantCode": "COMPANY001",
    //   "employeeId": "EMP12345",
    //   "timestamp": "2024-01-15T10:30:00Z",
    //   "data": { ... employee data ... }
    // }
    
    if (payload.tenantCode !== this.cegidConfig!.tenantCode) {
      this.log('warn', 'Webhook tenant code mismatch', { 
        expected: this.cegidConfig!.tenantCode, 
        received: payload.tenantCode 
      });
      return null;
    }
    
    const eventType = payload.eventType;
    const employeeData = payload.data;
    
    if (!eventType || !employeeData) {
      this.log('warn', 'Invalid Cegid webhook payload', { payload });
      return null;
    }
    
    const employee = this.mapToUniversal(employeeData);
    
    const baseEvent = {
      id: `evt_cegid_${payload.employeeId}_${Date.now()}`,
      eventSource: this.systemName,
      externalEventId: payload.eventId || `${payload.employeeId}_${payload.timestamp}`,
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
      case 'EMPLOYEE_HIRED':
        return {
          ...baseEvent,
          eventType: 'employee.created',
          payload: { employee },
        } as EmployeeCreatedEvent;
        
      case 'EMPLOYEE_TERMINATED':
        return {
          ...baseEvent,
          eventType: 'employee.terminated',
          payload: {
            employee,
            terminationDate: new Date(employeeData.terminationDate),
            reason: payload.terminationReason || 'Non spécifié',
          },
        } as EmployeeTerminatedEvent;
        
      case 'EMPLOYEE_TRANSFER':
        return {
          ...baseEvent,
          eventType: 'employee.job_changed',
          payload: {
            employee,
            previousJob: {
              title: payload.previousJobTitle,
              departmentId: payload.previousDepartmentCode,
            },
            newJob: {
              title: employeeData.jobTitle,
              departmentId: employeeData.departmentCode,
            },
            effectiveDate: new Date(payload.effectiveDate),
          },
        } as EmployeeJobChangedEvent;
        
      default:
        this.log('warn', `Unsupported Cegid event type: ${eventType}`);
        return null;
    }
  }
  
  validateWebhookSignature(payload: any, signature: string): boolean {
    // Implement signature validation if needed
    return true;
  }
  
  mapToUniversal(sourceData: CegidEmployee): UniversalEmployee {
    return {
      id: `cegid_${sourceData.employeeId}`,
      externalId: sourceData.employeeId,
      sourceSystem: this.systemName,
      tenantId: this.config!.tenantId,
      
      personalInfo: {
        firstName: sourceData.firstName,
        lastName: sourceData.lastName,
        email: sourceData.email,
        mobile: sourceData.mobilePhone,
        dateOfBirth: sourceData.dateOfBirth ? new Date(sourceData.dateOfBirth) : undefined,
      },
      
      employment: {
        employeeNumber: sourceData.personnelNumber,
        hireDate: new Date(sourceData.hireDate),
        terminationDate: sourceData.terminationDate ? new Date(sourceData.terminationDate) : undefined,
        status: this.mapEmploymentStatus(sourceData.employmentStatus),
        type: this.mapEmploymentType(sourceData.employmentType),
      },
      
      job: {
        title: sourceData.jobTitle,
        departmentId: sourceData.departmentCode,
        locationId: sourceData.locationCode,
        managerId: sourceData.managerEmployeeId,
      },
      
      contract: {
        type: this.mapContractType(sourceData.contractType),
        startDate: new Date(sourceData.contractStartDate),
        endDate: sourceData.contractEndDate ? new Date(sourceData.contractEndDate) : undefined,
      },
      
      metadata: {
        createdAt: new Date(sourceData.hireDate),
        updatedAt: new Date(),
        syncedAt: new Date(),
      },
      
      rawData: sourceData,
    };
  }
  
  mapFromUniversal(employee: UniversalEmployee): any {
    return {
      employeeId: employee.externalId,
      firstName: employee.personalInfo.firstName,
      lastName: employee.personalInfo.lastName,
      email: employee.personalInfo.email,
      personnelNumber: employee.employment.employeeNumber,
    };
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    if (!this.cegidConfig) {
      return {
        status: 'down',
        message: 'Cegid connector not configured',
        checkedAt: new Date(),
      };
    }
    
    const startTime = Date.now();
    
    try {
      await this.ensureValidToken();
      
      const response = await fetch(
        `${this.cegidConfig.instanceUrl}/api/v1/tenants/${this.cegidConfig.tenantCode}/employees?page=0&size=1`,
        {
          headers: await this.getHeaders(),
        }
      );
      
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        return {
          status: 'healthy',
          latency,
          message: 'Connected to Cegid API',
          checkedAt: new Date(),
        };
      } else {
        return {
          status: 'degraded',
          latency,
          message: `Cegid API returned ${response.status}`,
          checkedAt: new Date(),
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        message: `Cannot reach Cegid API: ${error}`,
        checkedAt: new Date(),
      };
    }
  }
  
  getSupportedEventTypes(): string[] {
    return [
      'EMPLOYEE_HIRED',
      'EMPLOYEE_TERMINATED',
      'EMPLOYEE_TRANSFER',
      'EMPLOYEE_PROMOTION',
    ];
  }
  
  private async refreshAccessToken(): Promise<void> {
    if (!this.cegidConfig) {
      throw new Error('Cegid connector not configured');
    }
    
    const response = await fetch(`${this.cegidConfig.instanceUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.cegidConfig.clientId,
        client_secret: this.cegidConfig.clientSecret,
        scope: 'api.read api.write',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to obtain Cegid access token: ${response.status}`);
    }
    
    const tokenData: CegidAccessToken = await response.json();
    this.accessToken = tokenData.access_token;
    this.tokenExpiresAt = Date.now() + (tokenData.expires_in * 1000) - 60000; // Refresh 1 min before expiry
    
    this.log('info', 'Cegid access token refreshed');
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
  
  private mapEmploymentStatus(cegidStatus: string): 'active' | 'terminated' | 'suspended' {
    const mapping: Record<string, 'active' | 'terminated' | 'suspended'> = {
      'Active': 'active',
      'Terminated': 'terminated',
      'Suspended': 'suspended',
    };
    return mapping[cegidStatus] || 'active';
  }
  
  private mapEmploymentType(cegidType: string): 'full_time' | 'part_time' | 'contractor' | 'intern' {
    const mapping: Record<string, 'full_time' | 'part_time' | 'contractor' | 'intern'> = {
      'Permanent': 'full_time',
      'Fixed-term': 'full_time',
      'Part-time': 'part_time',
      'Intern': 'intern',
      'Contractor': 'contractor',
    };
    return mapping[cegidType] || 'full_time';
  }
  
  private mapContractType(cegidType: string): 'permanent' | 'fixed_term' | 'internship' | 'freelance' {
    const mapping: Record<string, 'permanent' | 'fixed_term' | 'internship' | 'freelance'> = {
      'CDI': 'permanent',
      'CDD': 'fixed_term',
      'Stage': 'internship',
      'Alternance': 'internship',
      'Freelance': 'freelance',
    };
    return mapping[cegidType] || 'permanent';
  }
}
