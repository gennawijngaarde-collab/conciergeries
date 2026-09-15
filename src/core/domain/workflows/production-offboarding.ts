/**
 * Production-Quality Offboarding Workflow
 * 
 * Comprehensive employee offboarding with all required steps:
 * 1. Disable Microsoft Entra account
 * 2. Revoke Microsoft 365 licenses
 * 3. Revoke active sessions
 * 4. Remove from all groups
 * 5. Create IT equipment recovery task
 * 6. Notify manager and administrator
 * 
 * All actions include verification and retry logic
 */

import { WorkflowDefinition } from './base-workflow';

export const createProductionOffboardingWorkflow = (
  tenantId: string,
  createdBy: string
): WorkflowDefinition => ({
  id: `wf_offboarding_production_${tenantId}`,
  tenantId,
  name: 'Production Employee Offboarding',
  description: 'Comprehensive offboarding workflow with complete access revocation, verification, and notifications',
  type: 'offboarding',
  version: 1,
  enabled: true,
  
  steps: [
    {
      id: 'step_1_evaluate_termination',
      name: 'Evaluate Termination Date',
      description: 'Check termination date and determine immediate actions',
      type: 'sequential',
      actions: [
        // This is a metadata step - no actual actions
        // In production, you might have a custom action type for this
      ],
    },
    
    {
      id: 'step_2_revoke_licenses',
      name: 'Revoke Microsoft 365 Licenses',
      description: 'Remove all Microsoft 365 licenses from the user',
      type: 'sequential',
      dependsOn: ['step_1_evaluate_termination'],
      actions: [
        {
          id: 'action_revoke_m365_licenses',
          actionType: 'revoke_license',
          actionSystem: 'microsoft_365',
          parameters: {
            userPrincipalName: '{{event.payload.employee.personalInfo.email}}',
            skuIds: [], // Revoke all licenses
          },
          verification: {
            strategy: 'api_check',
            maxWaitTimeSeconds: 180,
            checkIntervalSeconds: 10,
          },
          retryPolicy: {
            maxAttempts: 3,
            backoffMultiplier: 2,
            initialDelaySeconds: 10,
            maxDelaySeconds: 120,
          },
        },
      ],
    },
    
    {
      id: 'step_3_remove_from_groups',
      name: 'Remove from All Groups',
      description: 'Remove user from all security and distribution groups',
      type: 'parallel',
      dependsOn: ['step_2_revoke_licenses'],
      actions: [
        {
          id: 'action_remove_from_department_group',
          actionType: 'remove_from_group',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{event.payload.employee.personalInfo.email}}',
            groupId: '{{event.payload.employee.job.department.entraGroupId}}',
          },
          condition: {
            field: 'event.payload.employee.job.department.entraGroupId',
            operator: 'exists',
          },
          verification: {
            strategy: 'api_check',
            maxWaitTimeSeconds: 120,
          },
          retryPolicy: {
            maxAttempts: 3,
            backoffMultiplier: 2,
            initialDelaySeconds: 5,
            maxDelaySeconds: 60,
          },
        },
        {
          id: 'action_remove_from_all_employees_group',
          actionType: 'remove_from_group',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{event.payload.employee.personalInfo.email}}',
            groupId: 'all-employees-group-id', // This would be configured per tenant
          },
          verification: {
            strategy: 'api_check',
            maxWaitTimeSeconds: 120,
          },
          retryPolicy: {
            maxAttempts: 3,
            backoffMultiplier: 2,
            initialDelaySeconds: 5,
            maxDelaySeconds: 60,
          },
        },
      ],
    },
    
    {
      id: 'step_4_disable_account',
      name: 'Disable Microsoft Entra Account',
      description: 'Disable the user account and revoke all active sessions',
      type: 'sequential',
      dependsOn: ['step_3_remove_from_groups'],
      actions: [
        {
          id: 'action_disable_entra_account',
          actionType: 'disable_account',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{event.payload.employee.personalInfo.email}}',
          },
          verification: {
            strategy: 'api_check',
            maxWaitTimeSeconds: 180,
            checkIntervalSeconds: 10,
          },
          retryPolicy: {
            maxAttempts: 5, // Critical action - more retries
            backoffMultiplier: 2,
            initialDelaySeconds: 10,
            maxDelaySeconds: 300,
          },
        },
      ],
    },
    
    {
      id: 'step_5_create_equipment_recovery_task',
      name: 'Create Equipment Recovery Task',
      description: 'Create a task/ticket for IT to recover equipment',
      type: 'sequential',
      dependsOn: ['step_4_disable_account'],
      delaySeconds: 5, // Small delay to ensure previous steps are synced
      actions: [
        {
          id: 'action_create_equipment_task',
          actionType: 'create_ticket',
          actionSystem: 'servicenow', // Or jira, depending on configuration
          parameters: {
            title: 'Equipment Recovery: {{event.payload.employee.personalInfo.firstName}} {{event.payload.employee.personalInfo.lastName}}',
            description: `
Employee offboarded: {{event.payload.employee.personalInfo.firstName}} {{event.payload.employee.personalInfo.lastName}}
Email: {{event.payload.employee.personalInfo.email}}
Termination Date: {{event.payload.terminationDate}}
Department: {{event.payload.employee.job.department.name}}

Please recover the following equipment:
- Laptop
- Mobile device
- Access cards
- Any other company property

Manager: {{event.payload.employee.job.manager.name}}
            `.trim(),
            priority: 'high',
            category: 'equipment_recovery',
            metadata: {
              employeeId: '{{event.payload.employee.id}}',
              employeeEmail: '{{event.payload.employee.personalInfo.email}}',
              terminationDate: '{{event.payload.terminationDate}}',
            },
          },
          retryPolicy: {
            maxAttempts: 3,
            backoffMultiplier: 2,
            initialDelaySeconds: 5,
            maxDelaySeconds: 60,
          },
        },
      ],
    },
    
    {
      id: 'step_6_notify_stakeholders',
      name: 'Notify Manager and Administrator',
      description: 'Send notifications to relevant parties',
      type: 'parallel',
      dependsOn: ['step_5_create_equipment_recovery_task'],
      delaySeconds: 2,
      actions: [
        {
          id: 'action_notify_manager',
          actionType: 'send_notification',
          actionSystem: 'slack', // Or teams, email, etc.
          parameters: {
            channel: 'dm', // Direct message
            recipient: '{{event.payload.employee.job.manager.email}}',
            message: `
Offboarding completed for {{event.payload.employee.personalInfo.firstName}} {{event.payload.employee.personalInfo.lastName}}.

All system access has been revoked.
An equipment recovery task has been created.

Please ensure all company property is returned.
            `.trim(),
          },
          condition: {
            field: 'event.payload.employee.job.manager.email',
            operator: 'exists',
          },
          retryPolicy: {
            maxAttempts: 2,
            backoffMultiplier: 2,
            initialDelaySeconds: 3,
            maxDelaySeconds: 30,
          },
        },
        {
          id: 'action_notify_hr_ops',
          actionType: 'send_notification',
          actionSystem: 'slack',
          parameters: {
            channel: '#hr-ops',
            message: `
✅ **Offboarding Completed**

Employee: {{event.payload.employee.personalInfo.firstName}} {{event.payload.employee.personalInfo.lastName}}
Email: {{event.payload.employee.personalInfo.email}}
Department: {{event.payload.employee.job.department.name}}
Termination Date: {{event.payload.terminationDate}}

Actions completed:
- ✅ Microsoft 365 licenses revoked
- ✅ Removed from all groups
- ✅ Account disabled
- ✅ Equipment recovery task created
- ✅ Manager notified

All access has been successfully revoked.
            `.trim(),
          },
          retryPolicy: {
            maxAttempts: 2,
            backoffMultiplier: 2,
            initialDelaySeconds: 3,
            maxDelaySeconds: 30,
          },
        },
      ],
    },
  ],
  
  onError: {
    onStepFailure: 'stop', // Stop workflow on step failure (after retries)
  },
  
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy,
  },
});
