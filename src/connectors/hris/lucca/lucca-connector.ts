/**
 * Lucca HRIS Connector
 * 
 * Lucca is a popular French HRIS system for HR management, time tracking, and leave management.
 * API Documentation: https://developers.lucca.fr/
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

interface LuccaConfig {
  domain: string; // e.g., "mycompany.ilucca.net"
  apiToken: string; // Authorization token
  webhookSecret?: string; // For webhook signature validation
}

interface LuccaEmployee {
  id: number;
  dtContractStart: string; // Date format: "YYYY-MM-DD"
  dtContractEnd?: string;
  firstName: string;
  lastName: string;
  mail: string;
  employeeNumber: string;
  legalEntityID: number;
  departmentID: number;
  managerID?: number;
  jobTitle: string;
  employmentType: string; // "CDI", "CDD", "Stage", "Apprenti"
  isActive: boolean;
}

export class LuccaConnector extends BaseHRISConnector implements HRISConnector {
  readonly systemName: HRISSystem = 'lucca';
  readonly version: string = '1.0.0';
  
  private luccaConfig?: LuccaConfig;
  private baseUrl?: string;
  
  async configure(config: ConnectorConfig): Promise<void> {
    await super.configure(config);
    
    // Decrypt and parse Lucca-specific config
    // In production, decrypt config.credentials.encrypted
    this.luccaConfig = config.settings as LuccaConfig;
    this.baseUrl = `https://${this.luccaConfig.domain}/api/v3`;
    
    this.log('info', 'Lucca connector configured', { 
      domain: this.luccaConfig.domain 
    });
  }
  
  async validateConfig(config: ConnectorConfig): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const luccaConfig = config.settings as LuccaConfig;
    
    if (!luccaConfig.domain) {
      errors.push('Le domaine Lucca est obligatoire (ex: mycompany.ilucca.net)');
    }
    
    if (!luccaConfig.apiToken) {
      errors.push('Le token API Lucca est obligatoire');
    }
    
    if (!luccaConfig.webhookSecret) {
      warnings.push('Aucun secret webhook configuré - la validation des webhooks sera désactivée');
    }
    
    // Test API connectivity
    if (luccaConfig.domain && luccaConfig.apiToken) {
      try {
        const response = await fetch(`https://${luccaConfig.domain}/api/v3/users?limit=1`, {
          headers: {
            'Authorization': `lucca application=${luccaConfig.apiToken}`,
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          errors.push(`Impossible de se connecter à Lucca: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        errors.push(`Erreur de connexion à Lucca: ${error}`);
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
    this.log('info', 'Syncing employees from Lucca');
    
    const employees: UniversalEmployee[] = [];
    let page = 0;
    const pageSize = 100;
    let hasMore = true;
    
    while (hasMore) {
      const response = await fetch(
        `${this.baseUrl}/users?paging=${page * pageSize},${pageSize}&fields=id,dtContractStart,dtContractEnd,firstName,lastName,mail,employeeNumber,legalEntityID,departmentID,managerID,jobTitle,employmentType,isActive`,
        {
          headers: this.getHeaders(),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur Lucca API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const luccaEmployees = data.data.items as LuccaEmployee[];
      
      for (const luccaEmployee of luccaEmployees) {
        employees.push(this.mapToUniversal(luccaEmployee));
      }
      
      hasMore = luccaEmployees.length === pageSize;
      page++;
    }
    
    this.log('info', `Synced ${employees.length} employees from Lucca`);
    return employees;
  }
  
  async syncEmployee(externalId: string): Promise<UniversalEmployee> {
    this.ensureConfigured();
    this.log('info', `Syncing employee ${externalId} from Lucca`);
    
    const response = await fetch(
      `${this.baseUrl}/users/${externalId}?fields=id,dtContractStart,dtContractEnd,firstName,lastName,mail,employeeNumber,legalEntityID,departmentID,managerID,jobTitle,employmentType,isActive`,
      {
        headers: this.getHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Employee ${externalId} not found in Lucca`);
    }
    
    const data = await response.json();
    return this.mapToUniversal(data.data);
  }
  
  async handleWebhook(payload: any, headers?: Record<string, string>): Promise<BaseEvent | null> {
    this.ensureConfigured();
    this.log('info', 'Handling webhook from Lucca', { payload });
    
    // Lucca webhook format:
    // {
    //   "eventType": "user.created" | "user.updated" | "user.terminated",
    //   "user": { ... user data ... },
    //   "timestamp": "2024-01-15T10:30:00Z"
    // }
    
    const eventType = payload.eventType;
    const userData = payload.user;
    
    if (!eventType || !userData) {
      this.log('warn', 'Invalid Lucca webhook payload', { payload });
      return null;
    }
    
    const employee = this.mapToUniversal(userData);
    
    const baseEvent = {
      id: `evt_lucca_${userData.id}_${Date.now()}`,
      eventSource: this.systemName,
      externalEventId: payload.eventId || `${userData.id}_${payload.timestamp}`,
      occurredAt: payload.timestamp ? new Date(payload.timestamp) : new Date(),
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
      case 'user.created':
        return {
          ...baseEvent,
          eventType: 'employee.created',
          payload: { employee },
        } as EmployeeCreatedEvent;
        
      case 'user.terminated':
        return {
          ...baseEvent,
          eventType: 'employee.terminated',
          payload: {
            employee,
            terminationDate: new Date(userData.dtContractEnd || new Date()),
            reason: payload.reason || 'Non spécifié',
          },
        } as EmployeeTerminatedEvent;
        
      case 'user.updated':
        // Check if job changed
        if (payload.changes?.includes('departmentID') || payload.changes?.includes('jobTitle')) {
          return {
            ...baseEvent,
            eventType: 'employee.job_changed',
            payload: {
              employee,
              previousJob: {
                title: payload.previousJobTitle,
                departmentId: payload.previousDepartmentID?.toString(),
              },
              newJob: {
                title: userData.jobTitle,
                departmentId: userData.departmentID?.toString(),
              },
              effectiveDate: new Date(payload.effectiveDate || new Date()),
            },
          } as EmployeeJobChangedEvent;
        }
        // Ignore other updates
        return null;
        
      default:
        this.log('warn', `Unsupported Lucca event type: ${eventType}`);
        return null;
    }
  }
  
  validateWebhookSignature(payload: any, signature: string): boolean {
    if (!this.luccaConfig?.webhookSecret) {
      this.log('warn', 'No webhook secret configured, skipping signature validation');
      return true;
    }
    
    // Implement HMAC SHA256 signature validation
    // const crypto = require('crypto');
    // const expectedSignature = crypto
    //   .createHmac('sha256', this.luccaConfig.webhookSecret)
    //   .update(JSON.stringify(payload))
    //   .digest('hex');
    // return signature === expectedSignature;
    
    return true; // Placeholder
  }
  
  mapToUniversal(sourceData: LuccaEmployee): UniversalEmployee {
    return {
      id: `lucca_${sourceData.id}`,
      externalId: sourceData.id.toString(),
      sourceSystem: this.systemName,
      tenantId: this.config!.tenantId,
      
      personalInfo: {
        firstName: sourceData.firstName,
        lastName: sourceData.lastName,
        email: sourceData.mail,
      },
      
      employment: {
        employeeNumber: sourceData.employeeNumber,
        hireDate: new Date(sourceData.dtContractStart),
        terminationDate: sourceData.dtContractEnd ? new Date(sourceData.dtContractEnd) : undefined,
        status: sourceData.isActive ? 'active' : 'terminated',
        type: this.mapEmploymentType(sourceData.employmentType),
      },
      
      job: {
        title: sourceData.jobTitle,
        departmentId: sourceData.departmentID?.toString(),
        managerId: sourceData.managerID?.toString(),
      },
      
      contract: {
        type: this.mapContractType(sourceData.employmentType),
        startDate: new Date(sourceData.dtContractStart),
        endDate: sourceData.dtContractEnd ? new Date(sourceData.dtContractEnd) : undefined,
      },
      
      metadata: {
        createdAt: new Date(sourceData.dtContractStart),
        updatedAt: new Date(),
        syncedAt: new Date(),
      },
      
      rawData: sourceData,
    };
  }
  
  mapFromUniversal(employee: UniversalEmployee): any {
    return {
      id: parseInt(employee.externalId),
      firstName: employee.personalInfo.firstName,
      lastName: employee.personalInfo.lastName,
      mail: employee.personalInfo.email,
      employeeNumber: employee.employment.employeeNumber,
      dtContractStart: employee.employment.hireDate.toISOString().split('T')[0],
      dtContractEnd: employee.employment.terminationDate?.toISOString().split('T')[0],
      isActive: employee.employment.status === 'active',
    };
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    if (!this.luccaConfig) {
      return {
        status: 'down',
        message: 'Lucca connector not configured',
        checkedAt: new Date(),
      };
    }
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/users?limit=1`, {
        headers: this.getHeaders(),
      });
      
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        return {
          status: 'healthy',
          latency,
          message: 'Connected to Lucca API',
          checkedAt: new Date(),
        };
      } else {
        return {
          status: 'degraded',
          latency,
          message: `Lucca API returned ${response.status}`,
          checkedAt: new Date(),
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        message: `Cannot reach Lucca API: ${error}`,
        checkedAt: new Date(),
      };
    }
  }
  
  getSupportedEventTypes(): string[] {
    return [
      'user.created',
      'user.updated',
      'user.terminated',
    ];
  }
  
  private getHeaders(): HeadersInit {
    return {
      'Authorization': `lucca application=${this.luccaConfig!.apiToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }
  
  private mapEmploymentType(luccaType: string): 'full_time' | 'part_time' | 'contractor' | 'intern' {
    const mapping: Record<string, 'full_time' | 'part_time' | 'contractor' | 'intern'> = {
      'CDI': 'full_time',
      'CDD': 'full_time',
      'Stage': 'intern',
      'Apprenti': 'intern',
      'Freelance': 'contractor',
    };
    return mapping[luccaType] || 'full_time';
  }
  
  private mapContractType(luccaType: string): 'permanent' | 'fixed_term' | 'internship' | 'freelance' {
    const mapping: Record<string, 'permanent' | 'fixed_term' | 'internship' | 'freelance'> = {
      'CDI': 'permanent',
      'CDD': 'fixed_term',
      'Stage': 'internship',
      'Apprenti': 'internship',
      'Freelance': 'freelance',
    };
    return mapping[luccaType] || 'permanent';
  }
}
