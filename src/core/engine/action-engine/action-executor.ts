/**
 * Action Executor
 * Executes individual actions using the appropriate connectors
 */

import { BaseAction, ActionResult, ActionStatus } from '@/core/domain/actions/base-action';
import { ActionConnector } from '@/connectors/interfaces/action-connector.interface';

export class ActionExecutor {
  private connectors: Map<string, ActionConnector> = new Map();
  
  /**
   * Register an action connector
   */
  registerConnector(connector: ActionConnector): void {
    this.connectors.set(connector.systemName, connector);
    console.log(`Registered connector: ${connector.systemName}`);
  }
  
  /**
   * Get a connector by system name
   */
  getConnector(systemName: string): ActionConnector | undefined {
    return this.connectors.get(systemName);
  }
  
  /**
   * Execute an action
   */
  async executeAction(action: BaseAction): Promise<ActionResult> {
    console.log('Executing action:', {
      id: action.id,
      type: action.actionType,
      system: action.actionSystem,
    });
    
    // Get appropriate connector
    const connector = this.getConnector(action.actionSystem);
    
    if (!connector) {
      return {
        success: false,
        error: {
          code: 'CONNECTOR_NOT_FOUND',
          message: `No connector registered for system: ${action.actionSystem}`,
        },
      };
    }
    
    // Check if connector supports this action
    if (!connector.supportsAction(action.actionType)) {
      return {
        success: false,
        error: {
          code: 'ACTION_NOT_SUPPORTED',
          message: `Connector ${action.actionSystem} does not support action type: ${action.actionType}`,
        },
      };
    }
    
    try {
      // Execute the action
      const result = await connector.executeAction(action);
      
      console.log('Action executed:', {
        id: action.id,
        success: result.success,
        executionTime: result.metadata?.executionTime,
      });
      
      return result;
    } catch (error: any) {
      console.error('Action execution failed:', {
        id: action.id,
        error: error.message,
      });
      
      return {
        success: false,
        error: {
          code: 'EXECUTION_ERROR',
          message: error.message,
          details: error,
        },
        metadata: {
          executionTime: 0,
          retryable: true,
        },
      };
    }
  }
  
  /**
   * Execute multiple actions in parallel
   */
  async executeActionsParallel(actions: BaseAction[]): Promise<ActionResult[]> {
    console.log(`Executing ${actions.length} actions in parallel`);
    
    const promises = actions.map(action => this.executeAction(action));
    return Promise.all(promises);
  }
  
  /**
   * Execute multiple actions sequentially
   */
  async executeActionsSequential(actions: BaseAction[]): Promise<ActionResult[]> {
    console.log(`Executing ${actions.length} actions sequentially`);
    
    const results: ActionResult[] = [];
    
    for (const action of actions) {
      const result = await this.executeAction(action);
      results.push(result);
      
      // Stop on first failure in sequential mode
      if (!result.success) {
        console.warn('Sequential execution stopped due to failure');
        break;
      }
    }
    
    return results;
  }
}
