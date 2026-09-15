/**
 * Employee Department Changed Event
 */

import { BaseEvent } from './base-event';
import { UniversalEmployee } from '../models/employee';

export interface EmployeeDepartmentChangedEvent extends BaseEvent {
  eventType: 'employee.department_changed';
  payload: {
    employee: UniversalEmployee;
    previousDepartmentId?: string;
    newDepartmentId?: string;
    effectiveDate: Date;
  };
}
