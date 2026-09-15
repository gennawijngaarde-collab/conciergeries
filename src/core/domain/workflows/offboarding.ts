/**
 * Offboarding Workflow
 * Standard employee offboarding workflow
 */

import { WorkflowDefinition } from './base-workflow';

export const createOffboardingWorkflow = (tenantId: string, createdBy: string): WorkflowDefinition => ({
  id: 'wf_offboarding',
  tenantId,
  name: 'Standard Employee Offboarding',
  description: 'Revokes licenses, removes access, and disables accounts for departing employees',
  type: 'offboarding',
  version: 1,
  enabled: true,
  
  steps: [
    {
      id: 'step_1_revoke_licenses',
      name: 'Revoke Licenses',
      description: 'Remove Microsoft 365 licenses',
      type: 'sequential',
      actions: [
        {
          id: 'action_revoke_m365_license',
          actionType: 'revoke_license',
          actionSystem: 'microsoft_365',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            skuIds: ['{{config.allLicenseSKUs}}'],
          },
          verification: {
            strategy: 'api_check',
            maxWaitTimeSeconds: 180,
          },
        },
      ],
    },
    {
      id: 'step_2_remove_from_groups',
      name: 'Remove from Groups',
      description: 'Remove user from all groups except archival groups',
      type: 'parallel',
      dependsOn: ['step_1_revoke_licenses'],
      actions: [
        {
          id: 'action_remove_from_department_group',
          actionType: 'remove_from_group',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            groupId: '{{employee.department.entraGroupId}}',
          },
        },
      ],
    },
    {
      id: 'step_3_disable_account',
      name: 'Disable Account',
      description: 'Disable user account in Microsoft Entra ID',
      type: 'sequential',
      dependsOn: ['step_2_remove_from_groups'],
      actions: [
        {
          id: 'action_disable_entra_account',
          actionType: 'disable_account',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{employee.email}}',
          },
          verification: {
            strategy: 'api_check',
            maxWaitTimeSeconds: 120,
          },
        },
      ],
    },
    {
      id: 'step_4_send_offboarding_notification',
      name: 'Send Offboarding Notification',
      description: 'Notify relevant teams',
      type: 'sequential',
      dependsOn: ['step_3_disable_account'],
      actions: [
        {
          id: 'action_send_slack_notification',
          actionType: 'send_notification',
          actionSystem: 'slack',
          parameters: {
            channel: '{{config.hrOpsChannel}}',
            message: '✅ Offboarding completed for {{employee.firstName}} {{employee.lastName}}',
          },
        },
      ],
    },
  ],
  
  onError: {
    onStepFailure: 'stop',
  },
  
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy,
  },
});
