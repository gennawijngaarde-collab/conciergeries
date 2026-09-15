/**
 * Workflow Repository
 * Data access layer for workflows and workflow executions
 */

import { supabase } from '../supabase-client';
import { WorkflowDefinition, WorkflowExecution } from '@/core/domain/workflows/base-workflow';

export class WorkflowRepository {
  /**
   * Create a new workflow definition
   */
  async create(workflow: WorkflowDefinition): Promise<WorkflowDefinition> {
    const { data, error } = await supabase
      .from('workflows')
      .insert({
        id: workflow.id,
        tenant_id: workflow.tenantId,
        name: workflow.name,
        description: workflow.description,
        type: workflow.type,
        definition: workflow.steps,
        enabled: workflow.enabled,
        version: workflow.version,
        created_by: workflow.metadata.createdBy,
        created_at: workflow.metadata.createdAt,
        updated_at: workflow.metadata.updatedAt,
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create workflow: ${error.message}`);
    }
    
    return workflow;
  }
  
  /**
   * Get workflow by ID
   */
  async findById(id: string, tenantId: string): Promise<WorkflowDefinition | null> {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return this.mapToWorkflow(data);
  }
  
  /**
   * Get workflow by type
   */
  async findByType(type: string, tenantId: string): Promise<WorkflowDefinition | null> {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('type', type)
      .eq('tenant_id', tenantId)
      .eq('enabled', true)
      .order('version', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return this.mapToWorkflow(data);
  }
  
  /**
   * Create a workflow execution
   */
  async createExecution(execution: WorkflowExecution): Promise<WorkflowExecution> {
    const { data, error } = await supabase
      .from('workflow_executions')
      .insert({
        id: execution.id,
        tenant_id: execution.tenantId,
        workflow_id: execution.workflowId,
        event_id: execution.eventId,
        employee_id: execution.employeeId,
        status: execution.status,
        current_step: execution.currentStep,
        context: execution.context,
        started_at: execution.startedAt,
        created_at: execution.createdAt,
        updated_at: execution.updatedAt,
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create workflow execution: ${error.message}`);
    }
    
    return execution;
  }
  
  /**
   * Update workflow execution
   */
  async updateExecution(execution: WorkflowExecution): Promise<WorkflowExecution> {
    const { error } = await supabase
      .from('workflow_executions')
      .update({
        status: execution.status,
        current_step: execution.currentStep,
        context: execution.context,
        started_at: execution.startedAt,
        completed_at: execution.completedAt,
        updated_at: execution.updatedAt,
      })
      .eq('id', execution.id);
    
    if (error) {
      throw new Error(`Failed to update workflow execution: ${error.message}`);
    }
    
    return execution;
  }
  
  /**
   * Get workflow execution by ID
   */
  async findExecutionById(id: string): Promise<WorkflowExecution | null> {
    const { data, error } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return this.mapToExecution(data);
  }
  
  /**
   * Get all executions for a workflow
   */
  async findExecutionsByWorkflow(workflowId: string, tenantId: string, limit: number = 50): Promise<WorkflowExecution[]> {
    const { data, error } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('workflow_id', workflowId)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch workflow executions: ${error.message}`);
    }
    
    return data.map(row => this.mapToExecution(row));
  }
  
  /**
   * Link execution to event
   */
  async linkExecutionToEvent(executionId: string, eventId: string): Promise<void> {
    // Update event with execution ID
    await supabase
      .from('events')
      .update({ workflow_execution_id: executionId })
      .eq('id', eventId);
    
    // Update execution with event ID (if not already set)
    await supabase
      .from('workflow_executions')
      .update({ event_id: eventId })
      .eq('id', executionId)
      .is('event_id', null);
  }
  
  private mapToWorkflow(row: any): WorkflowDefinition {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      description: row.description,
      type: row.type,
      version: row.version,
      enabled: row.enabled,
      steps: row.definition,
      onError: row.on_error,
      metadata: {
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        createdBy: row.created_by,
        updatedBy: row.updated_by,
      },
    };
  }
  
  private mapToExecution(row: any): WorkflowExecution {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      workflowId: row.workflow_id,
      eventId: row.event_id,
      employeeId: row.employee_id,
      status: row.status,
      currentStep: row.current_step,
      context: row.context || {},
      startedAt: row.started_at ? new Date(row.started_at) : undefined,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
