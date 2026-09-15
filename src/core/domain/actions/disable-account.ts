/**
 * Disable Account Action
 * Disables a user account in an identity system
 */

import { BaseAction } from './base-action';

export interface DisableAccountAction extends BaseAction {
  actionType: 'disable_account';
  actionSystem: 'microsoft_entra' | 'google_workspace' | 'okta';
  parameters: {
    userPrincipalName: string;
    userId?: string;
  };
}
