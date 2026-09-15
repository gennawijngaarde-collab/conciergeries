/**
 * Action Repository
 * Data access layer for actions
 */

import { supabase } from '../supabase-client';
import { BaseAction } from '@/core/domain/actions/base-action';

export class ActionRepository {
  /**
   * Create a new action
   */
  async create(action: BaseAction): Promise<BaseAction> {
    const { data, error } = await supabase
      .from('actions')
      .insert({
        id: action.id,
        tenant_id: action.tenantId,
        workflow_execution_id: action.workflowExecutionId,
        action_type: action.actionType,
        action_system: action.actionSystem,
        parameters: action.parameters,
        status: action.status,
        attempt_count: action.attemptCount,
        max_attempts: action.maxAttempts,
        scheduled_at: action.scheduledAt,
        created_at: action.createdAt,
        updated_at: action.updatedAt,
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create action: ${error.message}`);
    }
    
    return action;
  }
  
  /**
   * Update action
   */
  async update(action: BaseAction): Promise<BaseAction> {
    const { error } = await supabase
      .from('actions')
      .update({
        status: action.status,
        attempt_count: action.attemptCount,
        result: action.result,
        error_message: action.errorMessage,
        verification_status: action.verificationStatus,
        verification_result: action.verificationResult,
        verified_at: action.verifiedAt,
        started_at: action.startedAt,
        completed_at: action.completedAt,
        next_retry_at: action.nextRetryAt,
        updated_at: action.updatedAt,
      })
      .eq('id', action.id);
    
    if (error) {
      throw new Error(`Failed to update action: ${error.message}`);
    }
    
    return action;
  }
  
  /**
   * Get action by ID
   */
  async findById(id: string): Promise<BaseAction | null> {
    const { data, error } = await supabase
      .from('actions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return this.mapToAction(data);
  }
  
  /**
   * Get actions by workflow execution ID
   */
  async findByWorkflowExecution(executionId: string): Promise<BaseAction[]> {
    const { data, error } = await supabase
      .from('actions')
      .select('*')
      .eq('workflow_execution_id', executionId)
      .order('created_at', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch actions: ${error.message}`);
    }
    
    return data.map(row => this.mapToAction(row));
  }
  
  /**
   * Get actions ready for retry
   */
  async findReadyForRetry(tenantId: string, limit: number = 100): Promise<BaseAction[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('actions')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'retrying')
      .lte('next_retry_at', now)
      .order('next_retry_at', { ascending: true })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch retry-ready actions: ${error.message}`);
    }
    
    return data.map(row => this.mapToAction(row));
  }
  
  /**
   * Get actions pending verification
   */
  async findPendingVerification(tenantId: string, limit: number = 100): Promise<BaseAction[]> {
    const { data, error } = await supabase
      .from('actions')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'completed')
      .eq('verification_status', 'pending')
      .order('completed_at', { ascending: true })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch pending verification actions: ${error.message}`);
    }
    
    return data.map(row => this.mapToAction(row));
  }
  
  private mapToAction(row: any): BaseAction {
    return {
      id: row.id,
      actionType: row.action_type,
      actionSystem: row.action_system,
      workflowExecutionId: row.workflow_execution_id,
      tenantId: row.tenant_id,
      parameters: row.parameters,
      status: row.status,
      attemptCount: row.attempt_count,
      maxAttempts: row.max_attempts,
      result: row.result,
      errorMessage: row.error_message,
      verificationStatus: row.verification_status,
      verificationResult: row.verification_result,
      verifiedAt: row.verified_at ? new Date(row.verified_at) : undefined,
      scheduledAt: row.scheduled_at ? new Date(row.scheduled_at) : undefined,
      startedAt: row.started_at ? new Date(row.started_at) : undefined,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      nextRetryAt: row.next_retry_at ? new Date(row.next_retry_at) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
