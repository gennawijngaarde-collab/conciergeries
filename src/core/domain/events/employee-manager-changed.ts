/**
 * Employee Manager Changed Event
 */

import { BaseEvent } from './base-event';
import { UniversalEmployee } from '../models/employee';

export interface EmployeeManagerChangedEvent extends BaseEvent {
  eventType: 'employee.manager_changed';
  payload: {
    employee: UniversalEmployee;
    previousManagerId?: string;
    newManagerId?: string;
    effectiveDate: Date;
  };
}
