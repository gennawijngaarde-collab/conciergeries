/**
 * Revoke License Action
 * Revokes licenses/subscriptions from a user
 */

import { BaseAction } from './base-action';

export interface RevokeLicenseAction extends BaseAction {
  actionType: 'revoke_license';
  actionSystem: 'microsoft_365' | 'google_workspace';
  parameters: {
    userPrincipalName: string;
    userId?: string;
    skuIds?: string[]; // Microsoft 365 SKU IDs
    licenses?: string[]; // Google Workspace licenses
  };
}
