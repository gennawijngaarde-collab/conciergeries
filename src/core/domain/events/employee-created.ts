/**
 * Employee Created Event
 * Triggered when a new employee is added to the HRIS
 */

import { BaseEvent } from './base-event';
import { UniversalEmployee } from '../models/employee';

export interface EmployeeCreatedEvent extends BaseEvent {
  eventType: 'employee.created';
  payload: {
    employee: UniversalEmployee;
  };
}
