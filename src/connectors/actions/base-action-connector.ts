/**
 * Base Action Connector
 * Provides common functionality for all action connectors
 */

import { 
  ActionConnector, 
} from '../interfaces/action-connector.interface';
import { ConnectorConfig, ValidationResult } from '../interfaces/hris-connector.interface';
import { ActionSystem, ActionType } from '@/core/domain/actions/base-action';

export abstract class BaseActionConnector implements Partial<ActionConnector> {
  abstract readonly systemName: ActionSystem;
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
   * Check if a specific action type is supported
   */
  supportsAction(actionType: ActionType): boolean {
    return this.getSupportedActions().includes(actionType);
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
  
  abstract getSupportedActions(): ActionType[];
}
