/**
 * Base HRIS Connector
 * Provides common functionality for all HRIS connectors
 */

import { HRISConnector, ConnectorConfig, ValidationResult } from '../interfaces/hris-connector.interface';
import { HRISSystem } from '@/core/domain/models/employee';

export abstract class BaseHRISConnector implements Partial<HRISConnector> {
  abstract readonly systemName: HRISSystem;
  abstract readonly version: string;
  
  protected config?: ConnectorConfig;
  protected isConfigured: boolean = false;
  
  async configure(config: ConnectorConfig): Promise<void> {
    const validation = await this.validateConfig(config);
    
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors?.join(', ')}`);
    }
    
    this.config = config;
    this.isConfigured = true;
  }
  
  abstract validateConfig(config: ConnectorConfig): Promise<ValidationResult>;
  
  protected ensureConfigured(): void {
    if (!this.isConfigured || !this.config) {
      throw new Error('Connector not configured. Call configure() first.');
    }
  }
  
  /**
   * Helper method to log connector activity
   */
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const logData = {
      connector: this.systemName,
      version: this.version,
      tenantId: this.config?.tenantId,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    
    console[level](JSON.stringify(logData));
  }
  
  /**
   * Default webhook signature validation (override if HRIS supports it)
   */
  validateWebhookSignature(payload: any, signature: string): boolean {
    // Default: no signature validation
    // Override this method in specific connectors that support webhook signatures
    return true;
  }
  
  /**
   * Get supported event types (default list, override in specific connectors)
   */
  getSupportedEventTypes(): string[] {
    return [
      'employee.created',
      'employee.terminated',
      'employee.job_changed',
      'employee.department_changed',
      'employee.manager_changed',
      'employee.location_changed',
      'employee.contract_changed',
    ];
  }
}
