/**
 * Verification Engine
 * Verifies that actions completed successfully by checking the target system
 */

import { BaseAction, VerificationResult, VerificationStatus } from '@/core/domain/actions/base-action';
import { ActionConnector } from '@/connectors/interfaces/action-connector.interface';
import { VerificationConfig } from '@/core/domain/workflows/base-workflow';

export class Verifier {
  private connectors: Map<string, ActionConnector> = new Map();
  
  /**
   * Register an action connector for verification
   */
  registerConnector(connector: ActionConnector): void {
    this.connectors.set(connector.systemName, connector);
  }
  
  /**
   * Verify an action
   */
  async verifyAction(
    action: BaseAction,
    verificationConfig?: VerificationConfig
  ): Promise<VerificationResult> {
    console.log('Verifying action:', {
      id: action.id,
      type: action.actionType,
      system: action.actionSystem,
    });
    
    // Get appropriate connector
    const connector = this.connectors.get(action.actionSystem);
    
    if (!connector) {
      return {
        verified: false,
        details: {
          error: `No connector registered for system: ${action.actionSystem}`,
        },
        checkedAt: new Date(),
      };
    }
    
    try {
      // Use verification config if provided
      const config = verificationConfig || {
        strategy: 'api_check' as const,
        maxWaitTimeSeconds: 60,
        checkIntervalSeconds: 5,
      };
      
      // Perform verification based on strategy
      switch (config.strategy) {
        case 'api_check':
          return await this.verifyViaAPI(action, connector, config);
        
        case 'webhook':
          return await this.verifyViaWebhook(action, config);
        
        case 'manual':
          return await this.verifyManually(action);
        
        default:
          return {
            verified: false,
            details: {
              error: `Unknown verification strategy: ${config.strategy}`,
            },
            checkedAt: new Date(),
          };
      }
    } catch (error: any) {
      console.error('Verification failed:', {
        id: action.id,
        error: error.message,
      });
      
      return {
        verified: false,
        details: {
          error: error.message,
        },
        checkedAt: new Date(),
      };
    }
  }
  
  /**
   * Verify via API check
   */
  private async verifyViaAPI(
    action: BaseAction,
    connector: ActionConnector,
    config: VerificationConfig
  ): Promise<VerificationResult> {
    const startTime = Date.now();
    const maxWaitTime = config.maxWaitTimeSeconds * 1000;
    const checkInterval = (config.checkIntervalSeconds || 5) * 1000;
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const result = await connector.verifyAction(action);
        
        if (result.verified) {
          console.log('Action verified successfully:', { id: action.id });
          return result;
        }
        
        // Wait before next check
        await this.delay(checkInterval);
      } catch (error: any) {
        // Continue checking on error
        console.warn('Verification check failed, retrying:', {
          id: action.id,
          error: error.message,
        });
        await this.delay(checkInterval);
      }
    }
    
    // Timeout
    return {
      verified: false,
      details: {
        error: 'Verification timed out',
        maxWaitTime: config.maxWaitTimeSeconds,
      },
      checkedAt: new Date(),
    };
  }
  
  /**
   * Verify via webhook (wait for confirmation webhook)
   */
  private async verifyViaWebhook(
    action: BaseAction,
    config: VerificationConfig
  ): Promise<VerificationResult> {
    // This would integrate with a webhook receiver system
    // For MVP, we'll mark as pending and rely on external verification
    
    return {
      verified: false,
      details: {
        strategy: 'webhook',
        status: 'pending',
        message: 'Waiting for webhook confirmation',
      },
      checkedAt: new Date(),
    };
  }
  
  /**
   * Mark for manual verification
   */
  private async verifyManually(action: BaseAction): Promise<VerificationResult> {
    return {
      verified: false,
      details: {
        strategy: 'manual',
        status: 'pending',
        message: 'Requires manual verification',
      },
      checkedAt: new Date(),
    };
  }
  
  /**
   * Update action verification status
   */
  updateActionVerificationStatus(
    action: BaseAction,
    verificationResult: VerificationResult
  ): BaseAction {
    return {
      ...action,
      verificationStatus: verificationResult.verified ? 'verified' : 'failed',
      verificationResult,
      verifiedAt: verificationResult.verified ? new Date() : undefined,
      updatedAt: new Date(),
    };
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
