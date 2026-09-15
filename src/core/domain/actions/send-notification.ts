/**
 * Send Notification Action
 * Sends notifications via various channels
 */

import { BaseAction } from './base-action';

export interface SendNotificationAction extends BaseAction {
  actionType: 'send_notification';
  actionSystem: 'slack' | 'teams';
  parameters: {
    channel?: string; // Slack channel or Teams channel ID
    recipient?: string; // Direct message recipient
    message: string;
    attachments?: any[];
    metadata?: Record<string, any>;
  };
}
