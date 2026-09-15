/**
 * Exception Repository
 * Data access layer for exceptions
 */

import { supabase } from '../supabase-client';
import { Exception } from '@/core/exceptions/exception-handler';

export class ExceptionRepository {
  /**
   * Create an exception
   */
  async create(exception: Exception): Promise<Exception> {
    const { data, error } = await supabase
      .from('exceptions')
      .insert({
        id: exception.id,
        tenant_id: exception.tenantId,
        exception_type: exception.exceptionType,
        severity: exception.severity,
        workflow_execution_id: exception.workflowExecutionId,
        action_id: exception.actionId,
        event_id: exception.eventId,
        employee_id: exception.employeeId,
        title: exception.title,
        description: exception.description,
        error_details: exception.errorDetails,
        status: exception.status,
        assigned_to: exception.assignedTo,
        created_at: exception.createdAt,
        updated_at: exception.updatedAt,
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create exception: ${error.message}`);
    }
    
    return exception;
  }
  
  /**
   * Update exception
   */
  async update(exception: Exception): Promise<Exception> {
    const { error } = await supabase
      .from('exceptions')
      .update({
        status: exception.status,
        assigned_to: exception.assignedTo,
        resolution_notes: exception.resolutionNotes,
        resolved_at: exception.resolvedAt,
        resolved_by: exception.resolvedBy,
        updated_at: exception.updatedAt,
      })
      .eq('id', exception.id);
    
    if (error) {
      throw new Error(`Failed to update exception: ${error.message}`);
    }
    
    return exception;
  }
  
  /**
   * Get exception by ID
   */
  async findById(id: string): Promise<Exception | null> {
    const { data, error } = await supabase
      .from('exceptions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return this.mapToException(data);
  }
  
  /**
   * Get open exceptions for a tenant
   */
  async findOpen(tenantId: string, limit: number = 100): Promise<Exception[]> {
    const { data, error } = await supabase
      .from('exceptions')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'open')
      .order('severity', { ascending: true }) // critical first
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch open exceptions: ${error.message}`);
    }
    
    return data.map(row => this.mapToException(row));
  }
  
  /**
   * Get exceptions by workflow execution
   */
  async findByWorkflowExecution(executionId: string): Promise<Exception[]> {
    const { data, error } = await supabase
      .from('exceptions')
      .select('*')
      .eq('workflow_execution_id', executionId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch exceptions: ${error.message}`);
    }
    
    return data.map(row => this.mapToException(row));
  }
  
  private mapToException(row: any): Exception {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      exceptionType: row.exception_type,
      severity: row.severity,
      workflowExecutionId: row.workflow_execution_id,
      actionId: row.action_id,
      eventId: row.event_id,
      employeeId: row.employee_id,
      title: row.title,
      description: row.description,
      errorDetails: row.error_details,
      status: row.status,
      assignedTo: row.assigned_to,
      resolutionNotes: row.resolution_notes,
      resolvedAt: row.resolved_at ? new Date(row.resolved_at) : undefined,
      resolvedBy: row.resolved_by,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
