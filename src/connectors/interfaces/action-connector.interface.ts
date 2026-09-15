/**
 * Action Connector Interface
 * 
 * All action system connectors MUST implement this interface.
 * This ensures consistent action execution regardless of the target system.
 */

import { 
  BaseAction, 
  ActionType, 
  ActionSystem, 
  ActionResult, 
  VerificationResult 
} from '@/core/domain/actions/base-action';
import { ConnectorConfig, ValidationResult, HealthCheckResult } from './hris-connector.interface';

/**
 * Action Connector Interface
 * Every action system adapter must implement these methods
 */
export interface ActionConnector {
  // Identity
  readonly systemName: ActionSystem;
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
   * Execute an action on the target system
   */
  executeAction(action: BaseAction): Promise<ActionResult>;
  
  /**
   * Verify that an action completed successfully
   * This is called after action execution to ensure it took effect
   */
  verifyAction(action: BaseAction): Promise<VerificationResult>;
  
  /**
   * Get list of action types supported by this connector
   */
  getSupportedActions(): ActionType[];
  
  /**
   * Check if the connector is healthy and can communicate with the action system
   */
  healthCheck(): Promise<HealthCheckResult>;
  
  /**
   * Check if a specific action type is supported
   */
  supportsAction(actionType: ActionType): boolean;
}
