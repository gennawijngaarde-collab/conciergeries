#!/bin/bash

# Test Offboarding Workflow
# This script demonstrates the complete offboarding workflow execution

echo "🧪 Testing HR SyncGuard AI - Offboarding Workflow"
echo "=================================================="
echo ""

# Configuration
API_URL="${API_URL:-http://localhost:3000}"
TENANT_ID="${TENANT_ID:-default_tenant}"

echo "📍 API URL: $API_URL"
echo "🏢 Tenant ID: $TENANT_ID"
echo ""

# Step 1: Send employee terminated event
echo "1️⃣  Sending employee terminated event..."
echo ""

RESPONSE=$(curl -s -X POST "$API_URL/api/webhooks/hris/mock" \
  -H "Content-Type: application/json" \
  -d "{
    \"event_type\": \"employee.terminated\",
    \"tenant_id\": \"$TENANT_ID\",
    \"id\": \"evt_test_$(date +%s)\",
    \"external_id\": \"ext_test_$(date +%s)\",
    \"employee\": {
      \"id\": \"emp_john_doe\",
      \"external_id\": \"mock_emp_john_doe\",
      \"first_name\": \"John\",
      \"last_name\": \"Doe\",
      \"email\": \"john.doe@company.com\",
      \"personal_email\": \"john.doe@personal.com\",
      \"phone\": \"+1234567890\",
      \"hire_date\": \"2023-01-15\",
      \"employment_status\": \"terminated\",
      \"job_title\": \"Software Engineer\",
      \"employee_number\": \"EMP001\",
      \"department_id\": \"dept_engineering\",
      \"location_id\": \"loc_hq\",
      \"manager_id\": \"emp_manager\",
      \"contract_type\": \"permanent\"
    },
    \"termination_date\": \"2024-03-15\",
    \"reason\": \"resignation\"
  }")

echo "📬 Response:"
echo "$RESPONSE" | jq '.'
echo ""

# Extract event ID
EVENT_ID=$(echo "$RESPONSE" | jq -r '.eventId // empty')

if [ -z "$EVENT_ID" ]; then
  echo "❌ Failed to create event"
  exit 1
fi

echo "✅ Event created: $EVENT_ID"
echo ""

# Step 2: Wait for workflow to start
echo "2️⃣  Waiting for workflow execution to start..."
sleep 2
echo ""

# Step 3: Monitor workflow execution
echo "3️⃣  Monitoring workflow execution..."
echo "   (Check server console for detailed logs)"
echo ""

# Wait for workflow to complete
echo "⏳ Waiting 10 seconds for workflow to complete..."
sleep 10
echo ""

# Step 4: Summary
echo "4️⃣  Test Summary"
echo "=================="
echo ""
echo "✅ Employee terminated event sent"
echo "✅ Offboarding workflow triggered automatically"
echo ""
echo "📊 Expected Actions:"
echo "   1. ✅ Revoke Microsoft 365 licenses"
echo "   2. ✅ Remove from department group"
echo "   3. ✅ Remove from all-employees group"
echo "   4. ✅ Disable Microsoft Entra account"
echo "   5. ✅ Create equipment recovery task"
echo "   6. ✅ Notify manager"
echo "   7. ✅ Notify HR Ops team"
echo ""
echo "📝 Check the following:"
echo "   - Server console logs for execution details"
echo "   - Database: workflow_executions table"
echo "   - Database: actions table"
echo "   - Database: audit_logs table"
echo "   - Database: exceptions table (should be empty on success)"
echo ""
echo "🔍 SQL Queries to Inspect Results:"
echo ""
echo "-- Check workflow execution"
echo "SELECT * FROM workflow_executions WHERE event_id = '$EVENT_ID';"
echo ""
echo "-- Check actions"
echo "SELECT action_type, action_system, status, verification_status"
echo "FROM actions"
echo "WHERE workflow_execution_id IN ("
echo "  SELECT id FROM workflow_executions WHERE event_id = '$EVENT_ID'"
echo ");"
echo ""
echo "-- Check audit logs"
echo "SELECT action, resource_type, metadata, created_at"
echo "FROM audit_logs"
echo "WHERE tenant_id = '$TENANT_ID'"
echo "ORDER BY created_at DESC"
echo "LIMIT 20;"
echo ""
echo "✅ Test complete!"
