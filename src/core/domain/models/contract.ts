/**
 * Contract-related models
 */

export type ContractType = 
  | 'permanent' 
  | 'fixed_term' 
  | 'contractor' 
  | 'temporary';

export interface Contract {
  type: ContractType;
  startDate: Date;
  endDate?: Date;
}
