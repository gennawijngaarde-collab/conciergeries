/**
 * Event Receiver
 * Receives events from webhooks or sync operations
 */

import { BaseEvent } from '@/core/domain/events/base-event';

export class EventReceiver {
  /**
   * Receive and validate an event
   */
  async receiveEvent(event: BaseEvent): Promise<void> {
    // Validate event structure
    this.validateEvent(event);
    
    // Log event reception
    console.log('Event received:', {
      id: event.id,
      type: event.eventType,
      source: event.eventSource,
      tenantId: event.tenantId,
      receivedAt: event.receivedAt,
    });
    
    // Event will be persisted by the caller
  }
  
  private validateEvent(event: BaseEvent): void {
    if (!event.id) {
      throw new Error('Event must have an ID');
    }
    
    if (!event.eventType) {
      throw new Error('Event must have a type');
    }
    
    if (!event.tenantId) {
      throw new Error('Event must have a tenant ID');
    }
    
    if (!event.employee) {
      throw new Error('Event must have an employee reference');
    }
  }
}
