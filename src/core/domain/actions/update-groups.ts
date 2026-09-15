/**
 * Update Groups Actions
 * Add/remove users from groups
 */

import { BaseAction } from './base-action';

export interface AddToGroupAction extends BaseAction {
  actionType: 'add_to_group';
  actionSystem: 'microsoft_entra' | 'google_workspace' | 'okta';
  parameters: {
    userPrincipalName: string;
    userId?: string;
    groupId: string;
    groupName?: string;
  };
}

export interface RemoveFromGroupAction extends BaseAction {
  actionType: 'remove_from_group';
  actionSystem: 'microsoft_entra' | 'google_workspace' | 'okta';
  parameters: {
    userPrincipalName: string;
    userId?: string;
    groupId: string;
    groupName?: string;
  };
}
