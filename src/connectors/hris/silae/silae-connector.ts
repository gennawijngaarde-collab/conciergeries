/**
 * Silae Payroll Connector
 * 
 * Silae is a leading French payroll and HR management system.
 * API Documentation: https://www.silae.fr/documentation-api
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

interface SilaeConfig {
  apiUrl: string; // Default: "https://api.silae.fr/v1"
  apiKey: string;
  dossierCode: string; // Silae company file code
  webhookSecret?: string;
}

interface SilaeEmploye {
  Matricule: string; // Employee number
  Nom: string;
  Prenom: string;
  Email: string;
  TelephoneMobile?: string;
  DateNaissance?: string;
  DateEntree: string; // Hire date
  DateSortie?: string; // Termination date
  Statut: string; // "Actif", "Sorti", "Suspendu"
  TypeContrat: string; // "CDI", "CDD", "Stage", "Apprentissage"
  Poste: string;
  Service: string;
  Etablissement: string;
  NumeroSecuriteSociale?: string;
  DateDebutContrat: string;
  DateFinContrat?: string;
}

export class SilaeConnector extends BaseHRISConnector implements HRISConnector {
  readonly systemName: HRISSystem = 'silae';
  readonly version: string = '1.0.0';
  
  private silaeConfig?: SilaeConfig;
  
  async configure(config: ConnectorConfig): Promise<void> {
    await super.configure(config);
    
    // Decrypt and parse Silae-specific config
    this.silaeConfig = config.settings as SilaeConfig;
    
    this.log('info', 'Silae connector configured', { 
      apiUrl: this.silaeConfig.apiUrl,
      dossierCode: this.silaeConfig.dossierCode,
    });
  }
  
  async validateConfig(config: ConnectorConfig): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const silaeConfig = config.settings as SilaeConfig;
    
    if (!silaeConfig.apiUrl) {
      silaeConfig.apiUrl = 'https://api.silae.fr/v1';
      warnings.push('URL API par défaut utilisée: https://api.silae.fr/v1');
    }
    
    if (!silaeConfig.apiKey) {
      errors.push('La clé API Silae est obligatoire');
    }
    
    if (!silaeConfig.dossierCode) {
      errors.push('Le code dossier Silae est obligatoire');
    }
    
    if (!silaeConfig.webhookSecret) {
      warnings.push('Aucun secret webhook configuré');
    }
    
    // Test API connectivity
    if (silaeConfig.apiUrl && silaeConfig.apiKey && silaeConfig.dossierCode) {
      try {
        const response = await fetch(
          `${silaeConfig.apiUrl}/dossiers/${silaeConfig.dossierCode}/employes?limite=1`,
          {
            headers: {
              'Authorization': `Bearer ${silaeConfig.apiKey}`,
              'Accept': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          errors.push(`Impossible de se connecter à Silae: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        errors.push(`Erreur de connexion à Silae: ${error}`);
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
    this.log('info', 'Syncing employees from Silae');
    
    const response = await fetch(
      `${this.silaeConfig!.apiUrl}/dossiers/${this.silaeConfig!.dossierCode}/employes`,
      {
        headers: this.getHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erreur Silae API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const silaeEmployees = data.employes as SilaeEmploye[];
    
    const employees = silaeEmployees.map(emp => this.mapToUniversal(emp));
    
    this.log('info', `Synced ${employees.length} employees from Silae`);
    return employees;
  }
  
  async syncEmployee(externalId: string): Promise<UniversalEmployee> {
    this.ensureConfigured();
    this.log('info', `Syncing employee ${externalId} from Silae`);
    
    const response = await fetch(
      `${this.silaeConfig!.apiUrl}/dossiers/${this.silaeConfig!.dossierCode}/employes/${externalId}`,
      {
        headers: this.getHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Employee ${externalId} not found in Silae`);
    }
    
    const employee = await response.json();
    return this.mapToUniversal(employee);
  }
  
  async handleWebhook(payload: any, headers?: Record<string, string>): Promise<BaseEvent | null> {
    this.ensureConfigured();
    this.log('info', 'Handling webhook from Silae', { payload });
    
    // Silae webhook format:
    // {
    //   "TypeEvenement": "EMBAUCHE" | "SORTIE" | "MODIFICATION",
    //   "DossierCode": "COMPANY001",
    //   "Matricule": "EMP001",
    //   "DateEvenement": "2024-01-15",
    //   "Donnees": { ... employee data ... }
    // }
    
    if (payload.DossierCode !== this.silaeConfig!.dossierCode) {
      this.log('warn', 'Webhook dossier code mismatch', { 
        expected: this.silaeConfig!.dossierCode, 
        received: payload.DossierCode 
      });
      return null;
    }
    
    const eventType = payload.TypeEvenement;
    const employeeData = payload.Donnees;
    
    if (!eventType || !employeeData) {
      this.log('warn', 'Invalid Silae webhook payload', { payload });
      return null;
    }
    
    const employee = this.mapToUniversal(employeeData);
    
    const baseEvent = {
      id: `evt_silae_${payload.Matricule}_${Date.now()}`,
      eventSource: this.systemName,
      externalEventId: `${payload.Matricule}_${payload.DateEvenement}`,
      occurredAt: new Date(payload.DateEvenement),
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
      case 'EMBAUCHE':
        return {
          ...baseEvent,
          eventType: 'employee.created',
          payload: { employee },
        } as EmployeeCreatedEvent;
        
      case 'SORTIE':
        return {
          ...baseEvent,
          eventType: 'employee.terminated',
          payload: {
            employee,
            terminationDate: new Date(employeeData.DateSortie || payload.DateEvenement),
            reason: payload.MotifSortie || 'Non spécifié',
          },
        } as EmployeeTerminatedEvent;
        
      case 'MODIFICATION':
        // Silae doesn't send detailed change info in webhooks
        // We would need to fetch the full employee record to determine what changed
        this.log('info', 'Employee modification event received from Silae - ignoring for now');
        return null;
        
      default:
        this.log('warn', `Unsupported Silae event type: ${eventType}`);
        return null;
    }
  }
  
  validateWebhookSignature(payload: any, signature: string): boolean {
    // Implement signature validation if needed
    return true;
  }
  
  mapToUniversal(sourceData: SilaeEmploye): UniversalEmployee {
    return {
      id: `silae_${sourceData.Matricule}`,
      externalId: sourceData.Matricule,
      sourceSystem: this.systemName,
      tenantId: this.config!.tenantId,
      
      personalInfo: {
        firstName: sourceData.Prenom,
        lastName: sourceData.Nom,
        email: sourceData.Email,
        mobile: sourceData.TelephoneMobile,
        dateOfBirth: sourceData.DateNaissance ? new Date(sourceData.DateNaissance) : undefined,
      },
      
      employment: {
        employeeNumber: sourceData.Matricule,
        hireDate: new Date(sourceData.DateEntree),
        terminationDate: sourceData.DateSortie ? new Date(sourceData.DateSortie) : undefined,
        status: this.mapEmploymentStatus(sourceData.Statut),
        type: this.mapEmploymentType(sourceData.TypeContrat),
      },
      
      job: {
        title: sourceData.Poste,
        departmentId: sourceData.Service,
        locationId: sourceData.Etablissement,
      },
      
      contract: {
        type: this.mapContractType(sourceData.TypeContrat),
        startDate: new Date(sourceData.DateDebutContrat || sourceData.DateEntree),
        endDate: sourceData.DateFinContrat ? new Date(sourceData.DateFinContrat) : undefined,
      },
      
      metadata: {
        createdAt: new Date(sourceData.DateEntree),
        updatedAt: new Date(),
        syncedAt: new Date(),
      },
      
      rawData: sourceData,
    };
  }
  
  mapFromUniversal(employee: UniversalEmployee): any {
    return {
      Matricule: employee.externalId,
      Nom: employee.personalInfo.lastName,
      Prenom: employee.personalInfo.firstName,
      Email: employee.personalInfo.email,
      DateEntree: employee.employment.hireDate.toISOString().split('T')[0],
    };
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    if (!this.silaeConfig) {
      return {
        status: 'down',
        message: 'Silae connector not configured',
        checkedAt: new Date(),
      };
    }
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(
        `${this.silaeConfig.apiUrl}/dossiers/${this.silaeConfig.dossierCode}/employes?limite=1`,
        {
          headers: this.getHeaders(),
        }
      );
      
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        return {
          status: 'healthy',
          latency,
          message: 'Connected to Silae API',
          checkedAt: new Date(),
        };
      } else {
        return {
          status: 'degraded',
          latency,
          message: `Silae API returned ${response.status}`,
          checkedAt: new Date(),
        };
      }
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        message: `Cannot reach Silae API: ${error}`,
        checkedAt: new Date(),
      };
    }
  }
  
  getSupportedEventTypes(): string[] {
    return [
      'EMBAUCHE',
      'SORTIE',
      'MODIFICATION',
    ];
  }
  
  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.silaeConfig!.apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }
  
  private mapEmploymentStatus(silaeStatus: string): 'active' | 'terminated' | 'suspended' {
    const mapping: Record<string, 'active' | 'terminated' | 'suspended'> = {
      'Actif': 'active',
      'Sorti': 'terminated',
      'Suspendu': 'suspended',
    };
    return mapping[silaeStatus] || 'active';
  }
  
  private mapEmploymentType(silaeType: string): 'full_time' | 'part_time' | 'contractor' | 'intern' {
    const mapping: Record<string, 'full_time' | 'part_time' | 'contractor' | 'intern'> = {
      'CDI': 'full_time',
      'CDD': 'full_time',
      'Stage': 'intern',
      'Apprentissage': 'intern',
      'Freelance': 'contractor',
    };
    return mapping[silaeType] || 'full_time';
  }
  
  private mapContractType(silaeType: string): 'permanent' | 'fixed_term' | 'internship' | 'freelance' {
    const mapping: Record<string, 'permanent' | 'fixed_term' | 'internship' | 'freelance'> = {
      'CDI': 'permanent',
      'CDD': 'fixed_term',
      'Stage': 'internship',
      'Apprentissage': 'internship',
      'Freelance': 'freelance',
    };
    return mapping[silaeType] || 'permanent';
  }
}
