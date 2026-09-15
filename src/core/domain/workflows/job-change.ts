/**
 * Job Change Workflow
 * Workflow for handling job title and department changes
 */

import { WorkflowDefinition } from './base-workflow';

export const createJobChangeWorkflow = (tenantId: string, createdBy: string): WorkflowDefinition => ({
  id: 'wf_job_change',
  tenantId,
  name: 'Job Change Workflow',
  description: 'Updates account information and group memberships when an employee changes jobs',
  type: 'job_change',
  version: 1,
  enabled: true,
  
  steps: [
    {
      id: 'step_1_update_account',
      name: 'Update Account Information',
      description: 'Update job title and department in Microsoft Entra ID',
      type: 'sequential',
      actions: [
        {
          id: 'action_update_entra_account',
          actionType: 'update_account',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            jobTitle: '{{employee.newJobTitle}}',
            department: '{{employee.newDepartment.name}}',
            manager: '{{employee.newManager.email}}',
          },
          verification: {
            strategy: 'api_check',
            maxWaitTimeSeconds: 120,
          },
        },
      ],
    },
    {
      id: 'step_2_update_group_memberships',
      name: 'Update Group Memberships',
      description: 'Remove from old department group and add to new department group',
      type: 'parallel',
      dependsOn: ['step_1_update_account'],
      actions: [
        {
          id: 'action_remove_from_old_department',
          actionType: 'remove_from_group',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            groupId: '{{employee.previousDepartment.entraGroupId}}',
          },
          condition: {
            field: 'employee.departmentChanged',
            operator: 'equals',
            value: true,
          },
        },
        {
          id: 'action_add_to_new_department',
          actionType: 'add_to_group',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            groupId: '{{employee.newDepartment.entraGroupId}}',
          },
          condition: {
            field: 'employee.departmentChanged',
            operator: 'equals',
            value: true,
          },
        },
      ],
    },
    {
      id: 'step_3_send_job_change_notification',
      name: 'Send Job Change Notification',
      description: 'Notify relevant teams about the job change',
      type: 'sequential',
      dependsOn: ['step_2_update_group_memberships'],
      actions: [
        {
          id: 'action_send_slack_notification',
          actionType: 'send_notification',
          actionSystem: 'slack',
          parameters: {
            channel: '{{config.hrOpsChannel}}',
            message: '📢 {{employee.firstName}} {{employee.lastName}} has moved to {{employee.newDepartment.name}} as {{employee.newJobTitle}}',
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
