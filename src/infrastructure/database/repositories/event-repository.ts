/**
 * Event Repository
 * Data access layer for events
 */

import { supabase } from '../supabase-client';
import { BaseEvent } from '@/core/domain/events/base-event';

export class EventRepository {
  /**
   * Create a new event
   */
  async create(event: BaseEvent): Promise<BaseEvent> {
    const { data, error } = await supabase
      .from('events')
      .insert({
        id: event.id,
        tenant_id: event.tenantId,
        event_type: event.eventType,
        event_source: event.eventSource,
        external_event_id: event.externalEventId,
        employee_id: event.employee.id,
        payload: event,
        raw_payload: event.rawPayload,
        status: event.status,
        retry_count: event.retryCount,
        created_at: event.receivedAt,
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
    
    return event;
  }
  
  /**
   * Get event by ID
   */
  async findById(id: string): Promise<BaseEvent | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return null;
    }
    
    return this.mapToEvent(data);
  }
  
  /**
   * Get pending events
   */
  async findPending(tenantId: string, limit: number = 100): Promise<BaseEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch pending events: ${error.message}`);
    }
    
    return data.map(row => this.mapToEvent(row));
  }
  
  /**
   * Update event status
   */
  async updateStatus(
    id: string,
    status: string,
    errorMessage?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('events')
      .update({
        status,
        error_message: errorMessage,
        processed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to update event status: ${error.message}`);
    }
  }
  
  /**
   * Increment retry count
   */
  async incrementRetryCount(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_event_retry_count', {
      event_id: id,
    });
    
    if (error) {
      // Fallback if function doesn't exist
      const { data: event } = await supabase
        .from('events')
        .select('retry_count')
        .eq('id', id)
        .single();
      
      if (event) {
        await supabase
          .from('events')
          .update({ retry_count: (event.retry_count || 0) + 1 })
          .eq('id', id);
      }
    }
  }
  
  private mapToEvent(row: any): BaseEvent {
    return {
      id: row.id,
      eventType: row.event_type,
      eventSource: row.event_source,
      externalEventId: row.external_event_id,
      occurredAt: new Date(row.created_at),
      receivedAt: new Date(row.created_at),
      employee: {
        id: row.employee_id,
        externalId: row.payload?.employee?.externalId || '',
      },
      tenantId: row.tenant_id,
      status: row.status,
      processedAt: row.processed_at ? new Date(row.processed_at) : undefined,
      errorMessage: row.error_message,
      retryCount: row.retry_count || 0,
      workflowExecutionId: row.workflow_execution_id,
      rawPayload: row.raw_payload,
    };
  }
}
