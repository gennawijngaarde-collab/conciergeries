/**
 * Workflow Orchestrator
 * Coordinates workflow execution, step processing, and state management
 */

import { 
  WorkflowDefinition, 
  WorkflowExecution, 
  WorkflowStep,
  WorkflowStatus,
} from '@/core/domain/workflows/base-workflow';
import { BaseEvent } from '@/core/domain/events/base-event';
import { BaseAction } from '@/core/domain/actions/base-action';

export class WorkflowOrchestrator {
  /**
   * Start a workflow execution
   */
  async startWorkflow(
    workflow: WorkflowDefinition,
    event: BaseEvent,
    context: Record<string, any> = {}
  ): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      id: `wfex_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      tenantId: workflow.tenantId,
      workflowId: workflow.id,
      eventId: event.id,
      employeeId: event.employee.id,
      status: 'pending',
      currentStep: 0,
      context: {
        ...context,
        event,
        startedBy: 'system',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log('Workflow execution started:', {
      executionId: execution.id,
      workflowId: workflow.id,
      eventId: event.id,
    });
    
    return execution;
  }
  
  /**
   * Get next executable steps
   * Returns steps that have no unsatisfied dependencies
   */
  getNextSteps(workflow: WorkflowDefinition, execution: WorkflowExecution, completedStepIds: string[]): WorkflowStep[] {
    const allSteps = workflow.steps;
    const remainingSteps = allSteps.filter(step => !completedStepIds.includes(step.id));
    
    // Find steps with all dependencies satisfied
    const executableSteps = remainingSteps.filter(step => {
      if (!step.dependsOn || step.dependsOn.length === 0) {
        return true; // No dependencies
      }
      
      // Check if all dependencies are completed
      return step.dependsOn.every(depId => completedStepIds.includes(depId));
    });
    
    return executableSteps;
  }
  
  /**
   * Check if a step's condition is met
   */
  evaluateStepCondition(step: WorkflowStep, context: Record<string, any>): boolean {
    if (!step.condition) {
      return true; // No condition, always execute
    }
    
    const { field, operator, value } = step.condition;
    const fieldValue = this.getContextValue(field, context);
    
    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(String(value));
      case 'not_contains':
        return typeof fieldValue === 'string' && !fieldValue.includes(String(value));
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      case 'not_exists':
        return fieldValue === undefined || fieldValue === null;
      default:
        return true;
    }
  }
  
  /**
   * Get value from context using dot notation
   */
  private getContextValue(field: string, context: any): any {
    const parts = field.split('.');
    let value = context;
    
    for (const part of parts) {
      if (value === undefined || value === null) {
        return undefined;
      }
      value = value[part];
    }
    
    return value;
  }
  
  /**
   * Substitute template variables in action parameters
   * Example: "{{employee.email}}" -> "john.doe@company.com"
   */
  substituteVariables(parameters: Record<string, any>, context: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(parameters)) {
      if (typeof value === 'string') {
        result[key] = this.substituteString(value, context);
      } else if (Array.isArray(value)) {
        result[key] = value.map(item => 
          typeof item === 'string' ? this.substituteString(item, context) : item
        );
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }
  
  /**
   * Substitute template variables in a string
   */
  private substituteString(template: string, context: any): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = this.getContextValue(path.trim(), context);
      return value !== undefined ? String(value) : match;
    });
  }
  
  /**
   * Update workflow execution status
   */
  async updateExecutionStatus(
    execution: WorkflowExecution,
    status: WorkflowStatus,
    currentStep?: number
  ): Promise<WorkflowExecution> {
    execution.status = status;
    execution.updatedAt = new Date();
    
    if (currentStep !== undefined) {
      execution.currentStep = currentStep;
    }
    
    if (status === 'running' && !execution.startedAt) {
      execution.startedAt = new Date();
    }
    
    if (status === 'completed' || status === 'failed' || status === 'cancelled') {
      execution.completedAt = new Date();
    }
    
    return execution;
  }
  
  /**
   * Check if workflow is complete
   */
  isWorkflowComplete(workflow: WorkflowDefinition, completedStepIds: string[]): boolean {
    const allStepIds = workflow.steps.map(s => s.id);
    return allStepIds.every(id => completedStepIds.includes(id));
  }
}
