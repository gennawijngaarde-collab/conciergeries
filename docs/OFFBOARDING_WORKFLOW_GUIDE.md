# Production Offboarding Workflow - Implementation Guide

## Overview

The production-quality employee offboarding workflow is a comprehensive, configurable workflow stored in PostgreSQL that handles all aspects of employee termination with verification, retry, exception handling, and complete audit trails.

## Architecture

```
Employee Terminated Event
        ↓
   Event Receiver
        ↓
  Workflow Executor
        ↓
   Rule Evaluation
        ↓
  Workflow Selection (Offboarding)
        ↓
   Step Execution
        ├─ Generate Actions
        ├─ Execute Actions (with retry)
        ├─ Verify Actions
        ├─ Create Exceptions (on failure)
        └─ Send Notifications
        ↓
    Audit Trail
```

## Workflow Steps

### 1. **Evaluate Termination Date**
- Check termination date
- Determine immediate vs. scheduled actions

### 2. **Revoke Microsoft 365 Licenses**
- Remove all M365 licenses
- Verification: API check
- Retry: 3 attempts with exponential backoff

### 3. **Remove from All Groups** (Parallel)
- Remove from department group
- Remove from all-employees group
- Verification: API check per group
- Retry: 3 attempts per action

### 4. **Disable Microsoft Entra Account**
- Disable user account
- Revoke all active sessions
- Verification: API check
- Retry: 5 attempts (critical action)

### 5. **Create Equipment Recovery Task**
- Create ServiceNow/Jira ticket
- Include employee details and manager
- Retry: 3 attempts

### 6. **Notify Stakeholders** (Parallel)
- Notify manager (direct message)
- Notify HR Ops team (channel)
- Retry: 2 attempts per notification

## Features

### ✅ Configurable
- Stored in PostgreSQL `workflows` table
- Can be updated without code changes
- Version tracking
- Enable/disable per tenant

### ✅ Complete Verification
- Each action is verified after execution
- API checks to confirm completion
- Configurable verification strategies
- Verification results stored in database

### ✅ Automatic Retry
- Exponential backoff (10s, 20s, 40s, etc.)
- Configurable max attempts per action
- Different retry policies per action type
- Circuit breaker to prevent infinite loops

### ✅ Exception Management
- Automatic exception creation on failure
- Severity classification (low/medium/high/critical)
- Assigned for manual resolution
- Complete error details captured

### ✅ Notifications
- Workflow failure notifications
- Action failure warnings
- Exception created alerts
- Completion confirmations
- Multiple channels (email, Slack, Teams)

### ✅ Complete Audit Trail
- Every action logged
- Workflow state changes tracked
- User/system actor attribution
- Timestamp for all operations
- Full context preservation

## Setup Instructions

### 1. Run Database Migrations

```bash
npm run db:push
```

### 2. Seed Offboarding Workflow

```bash
npm run seed:offboarding [tenant_id]
```

Example:
```bash
npm run seed:offboarding default_tenant
```

This creates the workflow in the database with ID: `wf_offboarding_production_{tenant_id}`

### 3. Verify Workflow Created

Check your `workflows` table:
```sql
SELECT id, name, type, enabled, version 
FROM workflows 
WHERE tenant_id = 'default_tenant';
```

## Testing the Workflow

### Test 1: Send Employee Terminated Event

```bash
curl -X POST http://localhost:3000/api/webhooks/hris/mock \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "employee.terminated",
    "tenant_id": "default_tenant",
    "id": "evt_test_001",
    "external_id": "ext_test_001",
    "employee": {
      "id": "emp_test_001",
      "external_id": "mock_emp_test_001",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@company.com",
      "hire_date": "2023-01-15",
      "employment_status": "terminated",
      "job_title": "Software Engineer",
      "department_id": "dept_engineering",
      "location_id": "loc_hq"
    },
    "termination_date": "2024-03-15",
    "reason": "resignation"
  }'
```

### Test 2: Check Workflow Execution Status

Get the execution ID from the webhook response, then:

```bash
curl -X GET "http://localhost:3000/api/workflows/execute?executionId=wfex_..."
```

### Test 3: Manually Trigger Workflow

```bash
curl -X POST http://localhost:3000/api/workflows/execute \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "evt_test_001",
    "workflowType": "offboarding",
    "tenantId": "default_tenant"
  }'
```

## Monitoring

### Check Workflow Executions

```sql
SELECT 
  we.id,
  we.status,
  we.current_step,
  we.started_at,
  we.completed_at,
  w.name as workflow_name
FROM workflow_executions we
JOIN workflows w ON we.workflow_id = w.id
WHERE we.tenant_id = 'default_tenant'
ORDER BY we.created_at DESC
LIMIT 10;
```

### Check Actions

```sql
SELECT 
  a.id,
  a.action_type,
  a.action_system,
  a.status,
  a.attempt_count,
  a.verification_status,
  a.error_message
FROM actions a
WHERE a.workflow_execution_id = 'wfex_...'
ORDER BY a.created_at;
```

### Check Exceptions

```sql
SELECT 
  e.id,
  e.exception_type,
  e.severity,
  e.status,
  e.title,
  e.description
FROM exceptions e
WHERE e.tenant_id = 'default_tenant'
  AND e.status = 'open'
ORDER BY e.severity, e.created_at DESC;
```

### Check Audit Logs

```sql
SELECT 
  al.action,
  al.resource_type,
  al.system_actor,
  al.metadata,
  al.created_at
FROM audit_logs al
WHERE al.tenant_id = 'default_tenant'
  AND al.resource_id = 'wfex_...'
ORDER BY al.created_at DESC;
```

## Expected Output

### Console Logs

```
🚀 Starting workflow execution: wf_offboarding_production_default_tenant
📋 Executing step: Evaluate Termination Date
📋 Executing step: Revoke Microsoft 365 Licenses
📝 Created action: revoke_license on microsoft_365
🔄 Executing action (attempt 1/3): revoke_license
✅ Action succeeded: revoke_license
🔍 Verifying action: revoke_license
✅ Action verified: revoke_license
📋 Executing step: Remove from All Groups
📝 Created action: remove_from_group on microsoft_entra
📝 Created action: remove_from_group on microsoft_entra
🔄 Executing action (attempt 1/3): remove_from_group
🔄 Executing action (attempt 1/3): remove_from_group
✅ Action succeeded: remove_from_group
✅ Action succeeded: remove_from_group
🔍 Verifying action: remove_from_group
🔍 Verifying action: remove_from_group
✅ Action verified: remove_from_group
✅ Action verified: remove_from_group
📋 Executing step: Disable Microsoft Entra Account
📝 Created action: disable_account on microsoft_entra
🔄 Executing action (attempt 1/5): disable_account
✅ Action succeeded: disable_account
🔍 Verifying action: disable_account
✅ Action verified: disable_account
📋 Executing step: Create Equipment Recovery Task
📝 Created action: create_ticket on servicenow
🔄 Executing action (attempt 1/3): create_ticket
✅ Action succeeded: create_ticket
📋 Executing step: Notify Stakeholders
📝 Created action: send_notification on slack
📝 Created action: send_notification on slack
🔄 Executing action (attempt 1/2): send_notification
🔄 Executing action (attempt 1/2): send_notification
✅ Action succeeded: send_notification
✅ Action succeeded: send_notification
✅ Workflow completed successfully: wfex_...
📧 Sending notification: Offboarding Complete: John Doe
```

### Notifications Sent

1. **Workflow Started** (Audit)
2. **Step Completed** (per step)
3. **Action Completed** (per action)
4. **Offboarding Complete** (to manager and HR Ops)

### Database Records Created

- 1 workflow execution
- 7 actions (across 6 steps)
- 7 verification records
- 15+ audit log entries
- 0 exceptions (on success)

## Failure Scenarios

### Action Fails After Retries

1. Action retried 3 times (or configured max)
2. Exception created automatically
3. Administrator notified
4. Workflow stops (based on `onError` policy)
5. Exception can be resolved manually
6. Workflow can be resumed (future feature)

### Verification Fails

1. Action completes but verification fails
2. Action retried
3. If still fails after retries:
   - Exception created
   - Administrator notified
   - Marked for manual review

### Network/API Errors

1. Exponential backoff applied
2. Retry with increasing delays
3. Circuit breaker prevents overload
4. Eventually creates exception if unrecoverable

## Customization

### Modify Workflow

1. Edit `src/core/domain/workflows/production-offboarding.ts`
2. Run `npm run seed:offboarding [tenant_id]` to update
3. Increment version number for tracking
4. Test with mock events

### Add New Actions

1. Define action in step definition
2. Ensure connector supports action type
3. Configure verification strategy
4. Set retry policy
5. Test thoroughly

### Change Notification Recipients

Edit notification parameters in step 6:
```typescript
{
  channel: '#your-channel',
  recipient: 'your-email@company.com',
}
```

### Adjust Retry Policies

Per action:
```typescript
retryPolicy: {
  maxAttempts: 5,        // Increase for critical actions
  backoffMultiplier: 2,  // Double delay each time
  initialDelaySeconds: 10,
  maxDelaySeconds: 300,  // Cap at 5 minutes
}
```

## Production Checklist

- [ ] Database migrations applied
- [ ] Workflow seeded for all tenants
- [ ] Real connector credentials configured
- [ ] Notification channels configured
- [ ] Exception assignment rules set
- [ ] Monitoring dashboards set up
- [ ] Alert thresholds configured
- [ ] Documentation updated
- [ ] Team trained on exception resolution
- [ ] Rollback procedure documented

## Troubleshooting

### Workflow Not Triggering

1. Check event was created: `SELECT * FROM events WHERE id = '...'`
2. Check workflow exists and is enabled: `SELECT * FROM workflows WHERE type = 'offboarding'`
3. Check API logs for errors
4. Verify webhook endpoint is accessible

### Actions Failing

1. Check connector configuration
2. Verify credentials are valid
3. Check target system API status
4. Review error messages in `actions` table
5. Check retry count and next retry time

### Verifications Timing Out

1. Increase `maxWaitTimeSeconds` in verification config
2. Check target system API latency
3. Verify action actually completed
4. Review verification strategy (API vs webhook)

## Security Considerations

- Credentials encrypted at rest
- Audit trail for compliance
- RBAC for exception access
- Sensitive data in encrypted parameters
- Webhook signature validation (production)
- API rate limiting (production)

## Performance

- Actions execute in parallel when possible
- Database queries optimized with indexes
- Workflow context kept minimal
- Async notification delivery
- Background job processor (future)

---

## Support

For issues or questions:
1. Check audit logs for details
2. Review exception descriptions
3. Check connector health status
4. Contact HR SyncGuard support

**Status**: ✅ Production-ready MVP implementation
**Version**: 1.0.0
**Last Updated**: 2026-09-15
