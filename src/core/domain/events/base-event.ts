/**
 * Base Event Types
 * All HR events extend from BaseEvent
 */

import { HRISSystem } from '../models/employee';

export type EventType =
  | 'employee.created'
  | 'employee.terminated'
  | 'employee.job_changed'
  | 'employee.department_changed'
  | 'employee.manager_changed'
  | 'employee.location_changed'
  | 'employee.contract_changed';

export type EventStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed';

export interface BaseEvent {
  // Event Identity
  id: string;
  eventType: EventType;
  eventSource: HRISSystem;
  externalEventId?: string;
  
  // Timing
  occurredAt: Date;
  receivedAt: Date;
  
  // Subject
  employee: {
    id: string;
    externalId: string;
  };
  
  // Tenant context
  tenantId: string;
  
  // Processing
  status: EventStatus;
  processedAt?: Date;
  errorMessage?: string;
  retryCount: number;
  
  // Workflow context
  workflowExecutionId?: string;
  
  // Raw data
  rawPayload: Record<string, any>;
}
