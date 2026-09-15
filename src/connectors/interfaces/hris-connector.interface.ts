/**
 * HRIS Connector Interface
 * 
 * All HRIS connectors MUST implement this interface.
 * This ensures the core application remains independent of specific HRIS systems.
 */

import { UniversalEmployee, HRISSystem } from '@/core/domain/models/employee';
import { BaseEvent } from '@/core/domain/events/base-event';

export interface ConnectorConfig {
  tenantId: string;
  credentials: EncryptedCredentials;
  settings: Record<string, any>;
}

export interface EncryptedCredentials {
  encrypted: string;
  iv: string;
  authTag: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
  message?: string;
  checkedAt: Date;
}

/**
 * HRIS Connector Interface
 * Every HRIS adapter must implement these methods
 */
export interface HRISConnector {
  // Identity
  readonly systemName: HRISSystem;
  readonly version: string;
  
  /**
   * Configure the connector with credentials and settings
   */
  configure(config: ConnectorConfig): Promise<void>;
  
  /**
   * Validate configuration before saving
   */
  validateConfig(config: ConnectorConfig): Promise<ValidationResult>;
  
  /**
   * Sync all employees from the HRIS
   * Returns array of employees in universal format
   */
  syncEmployees(): Promise<UniversalEmployee[]>;
  
  /**
   * Sync a single employee by external ID
   */
  syncEmployee(externalId: string): Promise<UniversalEmployee>;
  
  /**
   * Handle incoming webhook from the HRIS
   * Returns null if webhook should be ignored
   */
  handleWebhook(payload: any, headers?: Record<string, string>): Promise<BaseEvent | null>;
  
  /**
   * Validate webhook signature (if the HRIS supports it)
   */
  validateWebhookSignature(payload: any, signature: string): boolean;
  
  /**
   * Map source system data to universal employee model
   */
  mapToUniversal(sourceData: any): UniversalEmployee;
  
  /**
   * Map universal employee model back to source system format
   * (Used for updates if supported)
   */
  mapFromUniversal(employee: UniversalEmployee): any;
  
  /**
   * Check if the connector is healthy and can communicate with the HRIS
   */
  healthCheck(): Promise<HealthCheckResult>;
  
  /**
   * Get supported event types
   */
  getSupportedEventTypes(): string[];
}
