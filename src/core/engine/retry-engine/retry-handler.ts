/**
 * Retry Handler
 * Manages retry logic for failed actions with exponential backoff
 */

import { BaseAction, ActionResult } from '@/core/domain/actions/base-action';
import { RetryPolicy } from '@/core/domain/workflows/base-workflow';

export interface RetryContext {
  action: BaseAction;
  retryPolicy: RetryPolicy;
  lastError?: string;
  nextRetryAt?: Date;
}

export class RetryHandler {
  private readonly DEFAULT_RETRY_POLICY: RetryPolicy = {
    maxAttempts: 3,
    backoffMultiplier: 2,
    initialDelaySeconds: 10,
    maxDelaySeconds: 300, // 5 minutes
  };
  
  /**
   * Calculate next retry time using exponential backoff
   */
  calculateNextRetryTime(attemptCount: number, retryPolicy?: RetryPolicy): Date {
    const policy = retryPolicy || this.DEFAULT_RETRY_POLICY;
    
    // Calculate delay: initialDelay * (backoffMultiplier ^ attemptCount)
    const delay = Math.min(
      policy.initialDelaySeconds * Math.pow(policy.backoffMultiplier, attemptCount),
      policy.maxDelaySeconds
    );
    
    const nextRetry = new Date();
    nextRetry.setSeconds(nextRetry.getSeconds() + delay);
    
    return nextRetry;
  }
  
  /**
   * Check if an action should be retried
   */
  shouldRetry(action: BaseAction, result: ActionResult, retryPolicy?: RetryPolicy): boolean {
    const policy = retryPolicy || this.DEFAULT_RETRY_POLICY;
    
    // Don't retry if already exceeded max attempts
    if (action.attemptCount >= policy.maxAttempts) {
      return false;
    }
    
    // Don't retry if action succeeded
    if (result.success) {
      return false;
    }
    
    // Don't retry if error is not retryable
    if (result.metadata && !result.metadata.retryable) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Prepare action for retry
   */
  prepareForRetry(action: BaseAction, result: ActionResult, retryPolicy?: RetryPolicy): BaseAction {
    const policy = retryPolicy || this.DEFAULT_RETRY_POLICY;
    
    return {
      ...action,
      attemptCount: action.attemptCount + 1,
      status: 'retrying',
      errorMessage: result.error?.message,
      nextRetryAt: this.calculateNextRetryTime(action.attemptCount, policy),
      updatedAt: new Date(),
    };
  }
  
  /**
   * Check if it's time to retry an action
   */
  isReadyForRetry(action: BaseAction): boolean {
    if (action.status !== 'retrying') {
      return false;
    }
    
    if (!action.nextRetryAt) {
      return true; // No scheduled time, retry immediately
    }
    
    return new Date() >= action.nextRetryAt;
  }
  
  /**
   * Get actions that are ready for retry
   */
  getActionsReadyForRetry(actions: BaseAction[]): BaseAction[] {
    return actions.filter(action => this.isReadyForRetry(action));
  }
}
