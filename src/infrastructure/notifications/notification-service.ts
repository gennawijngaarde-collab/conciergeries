/**
 * Notification Service
 * Sends notifications to administrators and users
 */

export interface NotificationRecipient {
  email?: string;
  userId?: string;
  name?: string;
}

export interface Notification {
  subject: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  recipients: NotificationRecipient[];
  metadata?: Record<string, any>;
}

export class NotificationService {
  /**
   * Send a notification
   */
  async send(notification: Notification): Promise<void> {
    console.log('📧 Sending notification:', {
      subject: notification.subject,
      severity: notification.severity,
      recipients: notification.recipients.map(r => r.email || r.userId),
    });
    
    // In production, this would integrate with:
    // - Email service (SendGrid, AWS SES, etc.)
    // - Slack API
    // - Microsoft Teams webhook
    // - In-app notification system
    
    // For MVP, we'll log the notification
    console.log('Notification details:', {
      ...notification,
      timestamp: new Date().toISOString(),
    });
    
    // Simulate async delivery
    await this.delay(100);
  }
  
  /**
   * Send workflow failure notification
   */
  async notifyWorkflowFailure(params: {
    tenantId: string;
    workflowName: string;
    workflowExecutionId: string;
    employeeName: string;
    errorMessage: string;
    adminEmail?: string;
  }): Promise<void> {
    await this.send({
      subject: `Workflow Failed: ${params.workflowName}`,
      message: `
The ${params.workflowName} workflow failed for employee ${params.employeeName}.

Workflow Execution ID: ${params.workflowExecutionId}
Error: ${params.errorMessage}

Please review the exception and take appropriate action.
      `.trim(),
      severity: 'critical',
      recipients: [
        { email: params.adminEmail || 'admin@company.com' },
      ],
      metadata: {
        tenantId: params.tenantId,
        workflowExecutionId: params.workflowExecutionId,
        type: 'workflow_failure',
      },
    });
  }
  
  /**
   * Send action failure notification
   */
  async notifyActionFailure(params: {
    tenantId: string;
    actionType: string;
    actionSystem: string;
    employeeName: string;
    errorMessage: string;
    adminEmail?: string;
  }): Promise<void> {
    await this.send({
      subject: `Action Failed: ${params.actionType}`,
      message: `
An action failed during workflow execution for employee ${params.employeeName}.

Action: ${params.actionType}
System: ${params.actionSystem}
Error: ${params.errorMessage}

The action will be retried automatically. If retries fail, an exception will be created.
      `.trim(),
      severity: 'warning',
      recipients: [
        { email: params.adminEmail || 'admin@company.com' },
      ],
      metadata: {
        tenantId: params.tenantId,
        type: 'action_failure',
      },
    });
  }
  
  /**
   * Send exception created notification
   */
  async notifyExceptionCreated(params: {
    tenantId: string;
    exceptionId: string;
    exceptionType: string;
    severity: string;
    title: string;
    description: string;
    adminEmail?: string;
  }): Promise<void> {
    await this.send({
      subject: `Exception Created: ${params.title}`,
      message: `
A new exception requires your attention.

Type: ${params.exceptionType}
Severity: ${params.severity}
Description: ${params.description}

Please review and resolve this exception in the HR SyncGuard dashboard.
Exception ID: ${params.exceptionId}
      `.trim(),
      severity: params.severity === 'critical' ? 'critical' : 'error',
      recipients: [
        { email: params.adminEmail || 'admin@company.com' },
      ],
      metadata: {
        tenantId: params.tenantId,
        exceptionId: params.exceptionId,
        type: 'exception_created',
      },
    });
  }
  
  /**
   * Send offboarding completion notification
   */
  async notifyOffboardingComplete(params: {
    tenantId: string;
    employeeName: string;
    employeeEmail: string;
    managerEmail?: string;
    adminEmail?: string;
    actionsCompleted: number;
  }): Promise<void> {
    const recipients: NotificationRecipient[] = [
      { email: params.adminEmail || 'admin@company.com' },
    ];
    
    if (params.managerEmail) {
      recipients.push({ email: params.managerEmail });
    }
    
    await this.send({
      subject: `Offboarding Complete: ${params.employeeName}`,
      message: `
Employee offboarding has been successfully completed.

Employee: ${params.employeeName} (${params.employeeEmail})
Actions Completed: ${params.actionsCompleted}

All access has been revoked and accounts have been disabled.
      `.trim(),
      severity: 'info',
      recipients,
      metadata: {
        tenantId: params.tenantId,
        type: 'offboarding_complete',
      },
    });
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
