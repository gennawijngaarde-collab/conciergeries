/**
 * Employee Contract Changed Event
 */

import { BaseEvent } from './base-event';
import { UniversalEmployee } from '../models/employee';
import { ContractType } from '../models/contract';

export interface EmployeeContractChangedEvent extends BaseEvent {
  eventType: 'employee.contract_changed';
  payload: {
    employee: UniversalEmployee;
    previousContract: {
      type: ContractType;
      startDate: Date;
      endDate?: Date;
    };
    newContract: {
      type: ContractType;
      startDate: Date;
      endDate?: Date;
    };
    effectiveDate: Date;
  };
}
