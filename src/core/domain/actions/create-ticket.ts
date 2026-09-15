/**
 * Create Ticket Action
 * Creates tickets in ITSM systems
 */

import { BaseAction } from './base-action';

export interface CreateTicketAction extends BaseAction {
  actionType: 'create_ticket';
  actionSystem: 'servicenow' | 'jira';
  parameters: {
    title: string;
    description: string;
    priority?: string;
    assignee?: string;
    category?: string;
    metadata?: Record<string, any>;
  };
}
