/**
 * Assign License Action
 * Assigns licenses/subscriptions to a user
 */

import { BaseAction } from './base-action';

export interface AssignLicenseAction extends BaseAction {
  actionType: 'assign_license';
  actionSystem: 'microsoft_365' | 'google_workspace';
  parameters: {
    userPrincipalName: string;
    userId?: string;
    skuIds?: string[]; // Microsoft 365 SKU IDs
    licenses?: string[]; // Google Workspace licenses
  };
}
