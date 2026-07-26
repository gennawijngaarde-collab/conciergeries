export type CleaningTaskStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'INSPECTED'
  | 'FAILED'
  | 'CANCELLED';

export interface CleaningTask {
  id: string;
  organizationId: string;
  propertyId: string;
  reservationId: string | null;
  status: CleaningTaskStatus;
  scheduledAt: Date | null;
  notes: string | null;
  propertyName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
