/**
 * Base Action Types
 * All actions executed by the system extend from BaseAction
 */

export type ActionType =
  | 'create_account'
  | 'disable_account'
  | 'enable_account'
  | 'update_account'
  | 'delete_account'
  | 'assign_license'
  | 'revoke_license'
  | 'add_to_group'
  | 'remove_from_group'
  | 'send_notification'
  | 'create_ticket';

export type ActionSystem =
  | 'microsoft_entra'
  | 'microsoft_365'
  | 'google_workspace'
  | 'okta'
  | 'slack'
  | 'teams'
  | 'servicenow'
  | 'jira';

export type ActionStatus = 
  | 'pending' 
  | 'running' 
  | 'completed' 
  | 'failed' 
  | 'retrying';

export type VerificationStatus = 
  | 'pending' 
  | 'verified' 
  | 'failed';

export interface ActionResult {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    executionTime: number;
    retryable: boolean;
  };
}

export interface VerificationResult {
  verified: boolean;
  details?: any;
  checkedAt: Date;
}

export interface BaseAction {
  // Action Identity
  id: string;
  actionType: ActionType;
  actionSystem: ActionSystem;
  
  // Execution Context
  workflowExecutionId: string;
  tenantId: string;
  
  // Parameters (system-specific)
  parameters: Record<string, any>;
  
  // Status
  status: ActionStatus;
  attemptCount: number;
  maxAttempts: number;
  
  // Results
  result?: ActionResult;
  errorMessage?: string;
  
  // Verification
  verificationStatus?: VerificationStatus;
  verificationResult?: VerificationResult;
  
  // Timing
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  nextRetryAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
