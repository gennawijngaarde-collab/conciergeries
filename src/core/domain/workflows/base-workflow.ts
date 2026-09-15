/**
 * Workflow Models
 * Defines how workflows are structured and executed
 */

import { ActionType, ActionSystem } from '../actions/base-action';

export type WorkflowType = 
  | 'onboarding' 
  | 'offboarding' 
  | 'job_change' 
  | 'department_change' 
  | 'custom';

export type StepType = 
  | 'parallel' 
  | 'sequential' 
  | 'conditional';

export type WorkflowStatus = 
  | 'pending' 
  | 'running' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

export interface Condition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'exists' | 'not_exists';
  value?: any;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelaySeconds: number;
  maxDelaySeconds: number;
}

export interface VerificationConfig {
  strategy: 'api_check' | 'webhook' | 'manual';
  maxWaitTimeSeconds: number;
  checkIntervalSeconds?: number;
}

export interface ActionDefinition {
  id: string;
  actionType: ActionType;
  actionSystem: ActionSystem;
  parameters: Record<string, any>; // Can include template variables like {{employee.email}}
  verification?: VerificationConfig;
  retryPolicy?: RetryPolicy;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  type: StepType;
  
  // Actions to execute
  actions: ActionDefinition[];
  
  // Dependencies (step IDs that must complete first)
  dependsOn?: string[];
  
  // Conditions for execution
  condition?: Condition;
  
  // Timing
  delaySeconds?: number; // Delay before executing
}

export interface ErrorHandler {
  onStepFailure?: 'continue' | 'stop' | 'retry';
  compensatingActions?: ActionDefinition[];
}

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  type: WorkflowType;
  version: number;
  enabled: boolean;
  
  // Workflow steps
  steps: WorkflowStep[];
  
  // Error handling
  onError?: ErrorHandler;
  
  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
  };
}

export interface WorkflowExecution {
  id: string;
  tenantId: string;
  workflowId: string;
  eventId?: string;
  employeeId?: string;
  
  // Execution state
  status: WorkflowStatus;
  currentStep: number;
  
  // Context (variables available to all steps)
  context: Record<string, any>;
  
  // Timing
  startedAt?: Date;
  completedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
