/**
 * Create Account Action
 * Creates a user account in an identity system
 */

import { BaseAction } from './base-action';

export interface CreateAccountAction extends BaseAction {
  actionType: 'create_account';
  actionSystem: 'microsoft_entra' | 'google_workspace' | 'okta';
  parameters: {
    userPrincipalName: string;
    displayName: string;
    givenName: string;
    surname: string;
    mailNickname: string;
    accountEnabled: boolean;
    usageLocation?: string;
    department?: string;
    jobTitle?: string;
    manager?: string;
    password?: string; // Temporary password
  };
}
