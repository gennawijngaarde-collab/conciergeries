/**
 * Employee Job Changed Event
 * Triggered when an employee's job or department changes
 */

import { BaseEvent } from './base-event';
import { UniversalEmployee } from '../models/employee';
import { Department } from '../models/department';

export interface EmployeeJobChangedEvent extends BaseEvent {
  eventType: 'employee.job_changed';
  payload: {
    employee: UniversalEmployee;
    previousJob: {
      title: string;
      departmentId?: string;
    };
    newJob: {
      title: string;
      departmentId?: string;
    };
    effectiveDate: Date;
  };
}
