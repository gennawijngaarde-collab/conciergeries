/**
 * Employee Terminated Event
 * Triggered when an employee's employment is terminated
 */

import { BaseEvent } from './base-event';
import { UniversalEmployee } from '../models/employee';

export interface EmployeeTerminatedEvent extends BaseEvent {
  eventType: 'employee.terminated';
  payload: {
    employee: UniversalEmployee;
    terminationDate: Date;
    reason?: string;
  };
}
