/**
 * Employee Location Changed Event
 */

import { BaseEvent } from './base-event';
import { UniversalEmployee } from '../models/employee';

export interface EmployeeLocationChangedEvent extends BaseEvent {
  eventType: 'employee.location_changed';
  payload: {
    employee: UniversalEmployee;
    previousLocationId?: string;
    newLocationId?: string;
    effectiveDate: Date;
  };
}
