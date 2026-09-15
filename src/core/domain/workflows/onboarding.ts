/**
 * Onboarding Workflow
 * Standard employee onboarding workflow
 */

import { WorkflowDefinition } from './base-workflow';

export const createOnboardingWorkflow = (tenantId: string, createdBy: string): WorkflowDefinition => ({
  id: 'wf_onboarding',
  tenantId,
  name: 'Standard Employee Onboarding',
  description: 'Creates accounts, assigns licenses, and configures access for new employees',
  type: 'onboarding',
  version: 1,
  enabled: true,
  
  steps: [
    {
      id: 'step_1_create_identity',
      name: 'Create Identity',
      description: 'Create user account in Microsoft Entra ID',
      type: 'sequential',
      actions: [
        {
          id: 'action_create_entra_account',
          actionType: 'create_account',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            displayName: '{{employee.firstName}} {{employee.lastName}}',
            givenName: '{{employee.firstName}}',
            surname: '{{employee.lastName}}',
            mailNickname: '{{employee.mailNickname}}',
            accountEnabled: true,
            usageLocation: '{{employee.location.country}}',
            department: '{{employee.department.name}}',
            jobTitle: '{{employee.jobTitle}}',
            manager: '{{employee.manager.email}}',
          },
          verification: {
            strategy: 'api_check',
            maxWaitTimeSeconds: 300,
            checkIntervalSeconds: 10,
          },
          retryPolicy: {
            maxAttempts: 3,
            backoffMultiplier: 2,
            initialDelaySeconds: 10,
            maxDelaySeconds: 300,
          },
        },
      ],
    },
    {
      id: 'step_2_assign_licenses_and_groups',
      name: 'Assign Licenses and Groups',
      description: 'Assign Microsoft 365 licenses and add to department groups',
      type: 'parallel',
      dependsOn: ['step_1_create_identity'],
      actions: [
        {
          id: 'action_assign_m365_license',
          actionType: 'assign_license',
          actionSystem: 'microsoft_365',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            skuIds: ['{{config.defaultLicenseSKU}}'],
          },
          verification: {
            strategy: 'api_check',
            maxWaitTimeSeconds: 180,
          },
        },
        {
          id: 'action_add_to_department_group',
          actionType: 'add_to_group',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            groupId: '{{employee.department.entraGroupId}}',
          },
        },
        {
          id: 'action_add_to_all_employees_group',
          actionType: 'add_to_group',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            groupId: '{{config.allEmployeesGroupId}}',
          },
        },
      ],
    },
    {
      id: 'step_3_send_welcome_notification',
      name: 'Send Welcome Notification',
      description: 'Notify team about new hire',
      type: 'sequential',
      dependsOn: ['step_2_assign_licenses_and_groups'],
      delaySeconds: 60, // Wait 1 minute to ensure everything is synced
      actions: [
        {
          id: 'action_send_slack_notification',
          actionType: 'send_notification',
          actionSystem: 'slack',
          parameters: {
            channel: '{{config.newHiresChannel}}',
            message: '🎉 Welcome {{employee.firstName}} {{employee.lastName}} to the {{employee.department.name}} team!',
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
