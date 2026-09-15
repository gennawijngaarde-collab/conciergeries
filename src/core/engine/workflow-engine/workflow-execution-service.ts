/**
 * Workflow Execution Service
 * Orchestrates complete workflow execution with all steps:
 * - Action generation
 * - Action execution
 * - Verification
 * - Retry on failure
 * - Exception creation
 * - Notifications
 * - Audit trail
 */

import { WorkflowOrchestrator } from './workflow-orchestrator';
import { ActionExecutor } from '../action-engine/action-executor';
import { Verifier } from '../verification-engine/verifier';
import { RetryHandler } from '../retry-engine/retry-handler';
import { ExceptionHandler } from '@/core/exceptions/exception-handler';
import { WorkflowRepository } from '@/infrastructure/database/repositories/workflow-repository';
import { ActionRepository } from '@/infrastructure/database/repositories/action-repository';
import { AuditRepository } from '@/infrastructure/database/repositories/audit-repository';
import { ExceptionRepository } from '@/infrastructure/database/repositories/exception-repository';
import { NotificationService } from '@/infrastructure/notifications/notification-service';
import { WorkflowDefinition, WorkflowExecution, WorkflowStep } from '@/core/domain/workflows/base-workflow';
import { BaseEvent } from '@/core/domain/events/base-event';
import { BaseAction, ActionStatus } from '@/core/domain/actions/base-action';

export class WorkflowExecutionService {
  private orchestrator: WorkflowOrchestrator;
  private actionExecutor: ActionExecutor;
  private verifier: Verifier;
  private retryHandler: RetryHandler;
  private exceptionHandler: ExceptionHandler;
  private workflowRepo: WorkflowRepository;
  private actionRepo: ActionRepository;
  private auditRepo: AuditRepository;
  private exceptionRepo: ExceptionRepository;
  private notificationService: NotificationService;
  
  constructor(
    actionExecutor: ActionExecutor,
    verifier: Verifier
  ) {
    this.orchestrator = new WorkflowOrchestrator();
    this.actionExecutor = actionExecutor;
    this.verifier = verifier;
    this.retryHandler = new RetryHandler();
    this.exceptionHandler = new ExceptionHandler();
    this.workflowRepo = new WorkflowRepository();
    this.actionRepo = new ActionRepository();
    this.auditRepo = new AuditRepository();
    this.exceptionRepo = new ExceptionRepository();
    this.notificationService = new NotificationService();
    
    // Register connectors with verifier
    actionExecutor.getConnector('microsoft_entra') && 
      this.verifier.registerConnector(actionExecutor.getConnector('microsoft_entra')!);
    actionExecutor.getConnector('microsoft_365') && 
      this.verifier.registerConnector(actionExecutor.getConnector('microsoft_365')!);
  }
  
  /**
   * Execute a workflow for an event
   */
  async executeWorkflow(
    workflow: WorkflowDefinition,
    event: BaseEvent,
    context: Record<string, any> = {}
  ): Promise<WorkflowExecution> {
    console.log('🚀 Starting workflow execution:', {
      workflowId: workflow.id,
      workflowName: workflow.name,
      eventId: event.id,
      eventType: event.eventType,
    });
    
    // 1. Start workflow execution
    let execution = await this.orchestrator.startWorkflow(workflow, event, context);
    execution = await this.workflowRepo.createExecution(execution);
    await this.workflowRepo.linkExecutionToEvent(execution.id, event.id);
    
    // Audit: Workflow started
    await this.auditRepo.create({
      tenantId: workflow.tenantId,
      action: 'workflow.started',
      resourceType: 'workflow_execution',
      resourceId: execution.id,
      systemActor: 'workflow_engine',
      metadata: {
        workflowId: workflow.id,
        workflowName: workflow.name,
        eventId: event.id,
        eventType: event.eventType,
      },
    });
    
    try {
      // Update status to running
      execution = await this.orchestrator.updateExecutionStatus(execution, 'running');
      await this.workflowRepo.updateExecution(execution);
      
      // 2. Execute workflow steps
      const completedStepIds: string[] = [];
      let currentStepIndex = 0;
      
      while (!this.orchestrator.isWorkflowComplete(workflow, completedStepIds)) {
        // Get next executable steps
        const nextSteps = this.orchestrator.getNextSteps(workflow, execution, completedStepIds);
        
        if (nextSteps.length === 0) {
          // No more steps can execute (might be waiting on dependencies)
          console.warn('No executable steps found, but workflow not complete');
          break;
        }
        
        console.log(`Executing ${nextSteps.length} step(s):`, nextSteps.map(s => s.name));
        
        // Execute steps (steps with no inter-dependencies can run in parallel)
        for (const step of nextSteps) {
          const stepSuccess = await this.executeStep(step, workflow, execution);
          
          if (stepSuccess) {
            completedStepIds.push(step.id);
            currentStepIndex++;
          } else {
            // Step failed after retries
            throw new Error(`Step ${step.name} failed after all retries`);
          }
        }
        
        // Update current step
        execution.currentStep = currentStepIndex;
        await this.workflowRepo.updateExecution(execution);
      }
      
      // 3. Workflow completed successfully
      execution = await this.orchestrator.updateExecutionStatus(execution, 'completed');
      await this.workflowRepo.updateExecution(execution);
      
      console.log('✅ Workflow completed successfully:', execution.id);
      
      // Audit: Workflow completed
      await this.auditRepo.create({
        tenantId: workflow.tenantId,
        action: 'workflow.completed',
        resourceType: 'workflow_execution',
        resourceId: execution.id,
        systemActor: 'workflow_engine',
        metadata: {
          workflowId: workflow.id,
          workflowName: workflow.name,
          stepsCompleted: completedStepIds.length,
          duration: execution.completedAt && execution.startedAt 
            ? execution.completedAt.getTime() - execution.startedAt.getTime()
            : null,
        },
      });
      
      // Send completion notification
      await this.sendCompletionNotification(workflow, execution, event);
      
      return execution;
      
    } catch (error: any) {
      console.error('❌ Workflow execution failed:', error);
      
      // Update status to failed
      execution = await this.orchestrator.updateExecutionStatus(execution, 'failed');
      await this.workflowRepo.updateExecution(execution);
      
      // Audit: Workflow failed
      await this.auditRepo.create({
        tenantId: workflow.tenantId,
        action: 'workflow.failed',
        resourceType: 'workflow_execution',
        resourceId: execution.id,
        systemActor: 'workflow_engine',
        metadata: {
          workflowId: workflow.id,
          workflowName: workflow.name,
          error: error.message,
        },
      });
      
      // Create exception
      const exception = await this.exceptionHandler.createWorkflowException({
        tenantId: workflow.tenantId,
        workflowExecutionId: execution.id,
        workflowName: workflow.name,
        eventId: event.id,
        employeeId: event.employee.id,
        errorMessage: error.message,
        errorDetails: {
          error: error.message,
          stack: error.stack,
        },
      });
      
      await this.exceptionRepo.create(exception);
      
      // Notify administrators
      await this.notificationService.notifyWorkflowFailure({
        tenantId: workflow.tenantId,
        workflowName: workflow.name,
        workflowExecutionId: execution.id,
        employeeName: execution.context?.event?.payload?.employee?.personalInfo?.firstName || 'Unknown',
        errorMessage: error.message,
      });
      
      await this.notificationService.notifyExceptionCreated({
        tenantId: workflow.tenantId,
        exceptionId: exception.id,
        exceptionType: exception.exceptionType,
        severity: exception.severity,
        title: exception.title,
        description: exception.description,
      });
      
      return execution;
    }
  }
  
  /**
   * Execute a single workflow step
   */
  private async executeStep(
    step: WorkflowStep,
    workflow: WorkflowDefinition,
    execution: WorkflowExecution
  ): Promise<boolean> {
    console.log(`📋 Executing step: ${step.name}`);
    
    // Audit: Step started
    await this.auditRepo.create({
      tenantId: workflow.tenantId,
      action: 'workflow.step.started',
      resourceType: 'workflow_execution',
      resourceId: execution.id,
      systemActor: 'workflow_engine',
      metadata: {
        stepId: step.id,
        stepName: step.name,
        stepType: step.type,
      },
    });
    
    // Check step condition
    if (!this.orchestrator.evaluateStepCondition(step, execution.context)) {
      console.log(`⏭️  Skipping step ${step.name} (condition not met)`);
      return true; // Step is considered successful if skipped
    }
    
    // Apply delay if specified
    if (step.delaySeconds) {
      console.log(`⏱️  Waiting ${step.delaySeconds}s before executing step`);
      await this.delay(step.delaySeconds * 1000);
    }
    
    // Generate actions from step definition
    const actions = await this.generateActionsForStep(step, workflow, execution);
    
    // Execute actions based on step type
    let allActionsSucceeded = true;
    
    if (step.type === 'parallel') {
      allActionsSucceeded = await this.executeActionsParallel(actions, workflow, execution);
    } else {
      allActionsSucceeded = await this.executeActionsSequential(actions, workflow, execution);
    }
    
    // Audit: Step completed
    await this.auditRepo.create({
      tenantId: workflow.tenantId,
      action: allActionsSucceeded ? 'workflow.step.completed' : 'workflow.step.failed',
      resourceType: 'workflow_execution',
      resourceId: execution.id,
      systemActor: 'workflow_engine',
      metadata: {
        stepId: step.id,
        stepName: step.name,
        actionsCount: actions.length,
        success: allActionsSucceeded,
      },
    });
    
    return allActionsSucceeded;
  }
  
  /**
   * Generate actions from step definition
   */
  private async generateActionsForStep(
    step: WorkflowStep,
    workflow: WorkflowDefinition,
    execution: WorkflowExecution
  ): Promise<BaseAction[]> {
    const actions: BaseAction[] = [];
    
    for (const actionDef of step.actions) {
      // Substitute template variables in parameters
      const parameters = this.orchestrator.substituteVariables(
        actionDef.parameters,
        execution.context
      );
      
      const action: BaseAction = {
        id: `act_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        actionType: actionDef.actionType,
        actionSystem: actionDef.actionSystem,
        workflowExecutionId: execution.id,
        tenantId: workflow.tenantId,
        parameters,
        status: 'pending',
        attemptCount: 0,
        maxAttempts: actionDef.retryPolicy?.maxAttempts || 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Save action to database
      await this.actionRepo.create(action);
      actions.push(action);
      
      console.log(`📝 Created action: ${action.actionType} on ${action.actionSystem}`);
    }
    
    return actions;
  }
  
  /**
   * Execute actions in parallel
   */
  private async executeActionsParallel(
    actions: BaseAction[],
    workflow: WorkflowDefinition,
    execution: WorkflowExecution
  ): Promise<boolean> {
    const results = await Promise.all(
      actions.map(action => this.executeActionWithRetry(action, workflow, execution))
    );
    
    return results.every(result => result);
  }
  
  /**
   * Execute actions sequentially
   */
  private async executeActionsSequential(
    actions: BaseAction[],
    workflow: WorkflowDefinition,
    execution: WorkflowExecution
  ): Promise<boolean> {
    for (const action of actions) {
      const success = await this.executeActionWithRetry(action, workflow, execution);
      if (!success) {
        return false; // Stop on first failure in sequential mode
      }
    }
    return true;
  }
  
  /**
   * Execute a single action with retry logic
   */
  private async executeActionWithRetry(
    action: BaseAction,
    workflow: WorkflowDefinition,
    execution: WorkflowExecution
  ): Promise<boolean> {
    let currentAction = action;
    
    while (currentAction.attemptCount < currentAction.maxAttempts) {
      // Execute action
      currentAction.status = 'running';
      currentAction.startedAt = new Date();
      currentAction.attemptCount++;
      await this.actionRepo.update(currentAction);
      
      console.log(`🔄 Executing action (attempt ${currentAction.attemptCount}/${currentAction.maxAttempts}):`, 
        currentAction.actionType);
      
      const result = await this.actionExecutor.executeAction(currentAction);
      
      currentAction.result = result;
      currentAction.completedAt = new Date();
      
      if (result.success) {
        // Action succeeded
        currentAction.status = 'completed';
        await this.actionRepo.update(currentAction);
        
        console.log(`✅ Action succeeded: ${currentAction.actionType}`);
        
        // Verify action
        const verified = await this.verifyAction(currentAction, workflow);
        
        if (verified) {
          // Audit: Action succeeded
          await this.auditRepo.create({
            tenantId: workflow.tenantId,
            action: 'action.completed',
            resourceType: 'action',
            resourceId: currentAction.id,
            systemActor: 'action_engine',
            metadata: {
              actionType: currentAction.actionType,
              actionSystem: currentAction.actionSystem,
              attemptCount: currentAction.attemptCount,
              verified: true,
            },
          });
          
          return true;
        } else {
          console.warn(`⚠️  Action verification failed: ${currentAction.actionType}`);
          // Continue to retry
        }
      } else {
        // Action failed
        currentAction.errorMessage = result.error?.message;
        console.error(`❌ Action failed: ${currentAction.actionType}`, result.error);
        
        // Check if should retry
        if (this.retryHandler.shouldRetry(currentAction, result)) {
          currentAction = this.retryHandler.prepareForRetry(currentAction, result);
          await this.actionRepo.update(currentAction);
          
          console.log(`🔁 Scheduling retry for action at ${currentAction.nextRetryAt}`);
          
          // Wait for retry time
          if (currentAction.nextRetryAt) {
            const waitTime = currentAction.nextRetryAt.getTime() - Date.now();
            if (waitTime > 0) {
              await this.delay(waitTime);
            }
          }
        } else {
          // No more retries
          currentAction.status = 'failed';
          await this.actionRepo.update(currentAction);
          break;
        }
      }
    }
    
    // All retries exhausted
    console.error(`💥 Action failed after ${currentAction.attemptCount} attempts: ${currentAction.actionType}`);
    
    // Audit: Action failed
    await this.auditRepo.create({
      tenantId: workflow.tenantId,
      action: 'action.failed',
      resourceType: 'action',
      resourceId: currentAction.id,
      systemActor: 'action_engine',
      metadata: {
        actionType: currentAction.actionType,
        actionSystem: currentAction.actionSystem,
        attemptCount: currentAction.attemptCount,
        error: currentAction.errorMessage,
      },
    });
    
    // Create exception
    const exception = await this.exceptionHandler.createActionException({
      tenantId: workflow.tenantId,
      workflowExecutionId: execution.id,
      actionId: currentAction.id,
      actionType: currentAction.actionType,
      actionSystem: currentAction.actionSystem,
      employeeId: execution.employeeId,
      errorMessage: currentAction.errorMessage || 'Action failed',
      errorDetails: currentAction.result || {},
    });
    
    await this.exceptionRepo.create(exception);
    
    // Notify administrators
    await this.notificationService.notifyActionFailure({
      tenantId: workflow.tenantId,
      actionType: currentAction.actionType,
      actionSystem: currentAction.actionSystem,
      employeeName: execution.context?.event?.payload?.employee?.personalInfo?.firstName || 'Unknown',
      errorMessage: currentAction.errorMessage || 'Action failed',
    });
    
    await this.notificationService.notifyExceptionCreated({
      tenantId: workflow.tenantId,
      exceptionId: exception.id,
      exceptionType: exception.exceptionType,
      severity: exception.severity,
      title: exception.title,
      description: exception.description,
    });
    
    return false;
  }
  
  /**
   * Verify an action
   */
  private async verifyAction(
    action: BaseAction,
    workflow: WorkflowDefinition
  ): Promise<boolean> {
    console.log(`🔍 Verifying action: ${action.actionType}`);
    
    action.verificationStatus = 'pending';
    await this.actionRepo.update(action);
    
    const verificationResult = await this.verifier.verifyAction(action);
    
    action.verificationResult = verificationResult;
    action.verificationStatus = verificationResult.verified ? 'verified' : 'failed';
    action.verifiedAt = verificationResult.verified ? new Date() : undefined;
    await this.actionRepo.update(action);
    
    if (verificationResult.verified) {
      console.log(`✅ Action verified: ${action.actionType}`);
    } else {
      console.warn(`❌ Action verification failed: ${action.actionType}`);
      
      // Audit: Verification failed
      await this.auditRepo.create({
        tenantId: workflow.tenantId,
        action: 'action.verification_failed',
        resourceType: 'action',
        resourceId: action.id,
        systemActor: 'verification_engine',
        metadata: {
          actionType: action.actionType,
          actionSystem: action.actionSystem,
          verificationResult,
        },
      });
    }
    
    return verificationResult.verified;
  }
  
  /**
   * Send completion notification
   */
  private async sendCompletionNotification(
    workflow: WorkflowDefinition,
    execution: WorkflowExecution,
    event: BaseEvent
  ): Promise<void> {
    if (workflow.type === 'offboarding') {
      const actions = await this.actionRepo.findByWorkflowExecution(execution.id);
      const completedActions = actions.filter(a => a.status === 'completed').length;
      
      await this.notificationService.notifyOffboardingComplete({
        tenantId: workflow.tenantId,
        employeeName: `${event.payload.employee?.personalInfo?.firstName || ''} ${event.payload.employee?.personalInfo?.lastName || ''}`.trim(),
        employeeEmail: event.payload.employee?.personalInfo?.email || '',
        actionsCompleted: completedActions,
      });
    }
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
