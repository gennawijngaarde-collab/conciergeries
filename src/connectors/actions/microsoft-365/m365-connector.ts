/**
 * Microsoft 365 Connector
 * 
 * Handles license assignment and management.
 * This is a mock/abstraction implementation for MVP.
 * Real implementation would use Microsoft Graph API.
 */

import { BaseActionConnector } from '../base-action-connector';
import { ActionConnector } from '../../interfaces/action-connector.interface';
import { ConnectorConfig, ValidationResult, HealthCheckResult } from '../../interfaces/hris-connector.interface';
import { 
  BaseAction, 
  ActionType, 
  ActionSystem, 
  ActionResult, 
  VerificationResult 
} from '@/core/domain/actions/base-action';

export class Microsoft365Connector extends BaseActionConnector implements ActionConnector {
  readonly systemName: ActionSystem = 'microsoft_365';
  readonly version: string = '1.0.0';
  
  async validateConfig(config: ConnectorConfig): Promise<ValidationResult> {
    const errors: string[] = [];
    
    if (!config.credentials) {
      errors.push('Credentials are required');
    }
    
    // Real implementation would validate Microsoft 365 admin credentials
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
  
  async executeAction(action: BaseAction): Promise<ActionResult> {
    this.ensureConfigured();
    this.log('info', `Executing ${action.actionType} action`, { actionId: action.id });
    
    const startTime = Date.now();
    
    try {
      switch (action.actionType) {
        case 'assign_license':
          return await this.assignLicense(action);
        case 'revoke_license':
          return await this.revokeLicense(action);
        default:
          return {
            success: false,
            error: {
              code: 'UNSUPPORTED_ACTION',
              message: `Action type ${action.actionType} not supported`,
            },
          };
      }
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      this.log('error', `Action execution failed`, { error: error.message });
      
      return {
        success: false,
        error: {
          code: 'EXECUTION_ERROR',
          message: error.message,
          details: error,
        },
        metadata: {
          executionTime,
          retryable: this.isRetryableError(error),
        },
      };
    }
  }
  
  async verifyAction(action: BaseAction): Promise<VerificationResult> {
    this.ensureConfigured();
    this.log('info', `Verifying ${action.actionType} action`, { actionId: action.id });
    
    // Mock verification
    await this.delay(500);
    
    return {
      verified: true,
      details: {
        method: 'api_check',
        verified_at: new Date(),
      },
      checkedAt: new Date(),
    };
  }
  
  getSupportedActions(): ActionType[] {
    return [
      'assign_license',
      'revoke_license',
    ];
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    return {
      status: 'healthy',
      latency: 150,
      message: 'Microsoft 365 connector is operational (mock)',
      checkedAt: new Date(),
    };
  }
  
  // ========================================================================
  // Private methods (mock implementations)
  // ========================================================================
  
  private async assignLicense(action: BaseAction): Promise<ActionResult> {
    const params = action.parameters;
    
    this.log('info', 'Assigning licenses', { 
      userPrincipalName: params.userPrincipalName,
      skuIds: params.skuIds,
    });
    
    await this.delay(1200);
    
    return {
      success: true,
      data: {
        userPrincipalName: params.userPrincipalName,
        assignedLicenses: params.skuIds || [],
        assignedDateTime: new Date().toISOString(),
      },
      metadata: {
        executionTime: 1200,
        retryable: false,
      },
    };
  }
  
  private async revokeLicense(action: BaseAction): Promise<ActionResult> {
    const params = action.parameters;
    
    this.log('info', 'Revoking licenses', { 
      userPrincipalName: params.userPrincipalName,
      skuIds: params.skuIds,
    });
    
    await this.delay(1000);
    
    return {
      success: true,
      data: {
        userPrincipalName: params.userPrincipalName,
        revokedLicenses: params.skuIds || [],
        revokedDateTime: new Date().toISOString(),
      },
      metadata: {
        executionTime: 1000,
        retryable: false,
      },
    };
  }
  
  private isRetryableError(error: any): boolean {
    return error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET';
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
