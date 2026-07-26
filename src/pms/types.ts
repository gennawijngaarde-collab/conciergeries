export type PmsCleaningStatus = 'pending' | 'in_progress' | 'done' | 'cancelled';

export type PmsProperty = {
  id: string;
  name: string;
  address: string;
  icalUrl: string;
  createdAt: string;
};

export type PmsCleaning = {
  id: string;
  propertyId: string;
  propertyName: string;
  cleaningDate: string;
  status: PmsCleaningStatus;
  notes: string;
  createdAt: string;
};

export type PmsProfile = {
  businessName: string;
  email: string;
  onboarded: boolean;
  onboardedAt?: string;
};
