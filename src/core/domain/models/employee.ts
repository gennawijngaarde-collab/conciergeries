/**
 * Universal Employee Model
 * 
 * This is the canonical representation of an employee,
 * normalized from various HRIS systems.
 */

export type HRISSystem = 
  | 'mock' 
  | 'lucca' 
  | 'sap' 
  | 'workday' 
  | 'personio' 
  | 'bamboohr'
  | 'cegid'
  | 'sage';

export type EmploymentStatus = 
  | 'active' 
  | 'inactive' 
  | 'terminated' 
  | 'on_leave';

export type EmploymentType = 
  | 'full_time' 
  | 'part_time' 
  | 'contractor' 
  | 'intern' 
  | 'temporary';

export type ContractType = 
  | 'permanent' 
  | 'fixed_term' 
  | 'contractor' 
  | 'temporary';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  personalEmail?: string;
  phone?: string;
  mobile?: string;
  dateOfBirth?: Date;
  nationality?: string;
  gender?: string;
}

export interface EmploymentInfo {
  employeeNumber?: string;
  hireDate: Date;
  terminationDate?: Date;
  status: EmploymentStatus;
  type: EmploymentType;
}

export interface JobInfo {
  title: string;
  jobId?: string;
  departmentId?: string;
  locationId?: string;
  managerId?: string;
}

export interface ContractInfo {
  type: ContractType;
  startDate: Date;
  endDate?: Date;
}

export interface EmployeeMetadata {
  createdAt: Date;
  updatedAt: Date;
  syncedAt: Date;
}

/**
 * Universal Employee representation
 * All HRIS connectors must map to this structure
 */
export interface UniversalEmployee {
  // Identity
  id: string;
  externalId: string;
  sourceSystem: HRISSystem;
  tenantId: string;
  
  // Personal information
  personalInfo: PersonalInfo;
  
  // Employment information
  employment: EmploymentInfo;
  
  // Job information
  job: JobInfo;
  
  // Contract information
  contract: ContractInfo;
  
  // Metadata
  metadata: EmployeeMetadata;
  
  // Raw data preservation (for debugging and audit)
  rawData: Record<string, any>;
}

/**
 * Manager reference
 */
export interface ManagerReference {
  id: string;
  externalId: string;
  name: string;
  email: string;
}
