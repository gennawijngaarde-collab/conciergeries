/**
 * Exception Handler
 * Creates and manages exceptions when automated recovery fails
 */

export type ExceptionType = 
  | 'action_failed'
  | 'verification_failed'
  | 'workflow_failed'
  | 'connector_error'
  | 'configuration_error';

export type ExceptionSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ExceptionStatus = 'open' | 'acknowledged' | 'resolved' | 'ignored';

export interface Exception {
  id: string;
  tenantId: string;
  exceptionType: ExceptionType;
  severity: ExceptionSeverity;
  
  // Context
  workflowExecutionId?: string;
  actionId?: string;
  eventId?: string;
  employeeId?: string;
  
  // Description
  title: string;
  description: string;
  errorDetails: Record<string, any>;
  
  // Resolution
  status: ExceptionStatus;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export class ExceptionHandler {
  /**
   * Create an exception for a failed action
   */
  async createActionException(params: {
    tenantId: string;
    workflowExecutionId: string;
    actionId: string;
    actionType: string;
    actionSystem: string;
    employeeId?: string;
    errorMessage: string;
    errorDetails: any;
  }): Promise<Exception> {
    const severity = this.determineActionFailureSeverity(params.actionType);
    
    return {
      id: `exc_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      tenantId: params.tenantId,
      exceptionType: 'action_failed',
      severity,
      
      workflowExecutionId: params.workflowExecutionId,
      actionId: params.actionId,
      employeeId: params.employeeId,
      
      title: `Action Failed: ${params.actionType}`,
      description: `Failed to execute ${params.actionType} on ${params.actionSystem}: ${params.errorMessage}`,
      errorDetails: {
        actionType: params.actionType,
        actionSystem: params.actionSystem,
        errorMessage: params.errorMessage,
        ...params.errorDetails,
      },
      
      status: 'open',
      
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  /**
   * Create an exception for a failed verification
   */
  async createVerificationException(params: {
    tenantId: string;
    workflowExecutionId: string;
    actionId: string;
    actionType: string;
    employeeId?: string;
    verificationDetails: any;
  }): Promise<Exception> {
    return {
      id: `exc_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      tenantId: params.tenantId,
      exceptionType: 'verification_failed',
      severity: 'high',
      
      workflowExecutionId: params.workflowExecutionId,
      actionId: params.actionId,
      employeeId: params.employeeId,
      
      title: `Verification Failed: ${params.actionType}`,
      description: `Action ${params.actionType} completed but verification failed`,
      errorDetails: {
        actionType: params.actionType,
        verificationDetails: params.verificationDetails,
      },
      
      status: 'open',
      
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  /**
   * Create an exception for a workflow failure
   */
  async createWorkflowException(params: {
    tenantId: string;
    workflowExecutionId: string;
    workflowName: string;
    eventId?: string;
    employeeId?: string;
    errorMessage: string;
    errorDetails: any;
  }): Promise<Exception> {
    return {
      id: `exc_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      tenantId: params.tenantId,
      exceptionType: 'workflow_failed',
      severity: 'critical',
      
      workflowExecutionId: params.workflowExecutionId,
      eventId: params.eventId,
      employeeId: params.employeeId,
      
      title: `Workflow Failed: ${params.workflowName}`,
      description: `Workflow ${params.workflowName} failed to complete: ${params.errorMessage}`,
      errorDetails: {
        workflowName: params.workflowName,
        errorMessage: params.errorMessage,
        ...params.errorDetails,
      },
      
      status: 'open',
      
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  /**
   * Determine severity based on action type
   */
  private determineActionFailureSeverity(actionType: string): ExceptionSeverity {
    switch (actionType) {
      case 'create_account':
      case 'disable_account':
        return 'critical';
      
      case 'assign_license':
      case 'revoke_license':
        return 'high';
      
      case 'add_to_group':
      case 'remove_from_group':
        return 'medium';
      
      case 'send_notification':
        return 'low';
      
      default:
        return 'medium';
    }
  }
  
  /**
   * Acknowledge an exception
   */
  async acknowledgeException(exception: Exception, userId: string): Promise<Exception> {
    return {
      ...exception,
      status: 'acknowledged',
      assignedTo: userId,
      updatedAt: new Date(),
    };
  }
  
  /**
   * Resolve an exception
   */
  async resolveException(
    exception: Exception,
    userId: string,
    resolutionNotes: string
  ): Promise<Exception> {
    return {
      ...exception,
      status: 'resolved',
      resolvedBy: userId,
      resolvedAt: new Date(),
      resolutionNotes,
      updatedAt: new Date(),
    };
  }
}
