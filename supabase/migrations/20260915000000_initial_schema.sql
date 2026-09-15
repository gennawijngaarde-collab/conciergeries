-- HR SyncGuard AI - Initial Database Schema
-- Multi-tenant HR process orchestration platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CORE TABLES: Tenants & Users
-- ============================================================================

-- Tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  subscription_status TEXT NOT NULL DEFAULT 'trial',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (authentication managed by Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant memberships (multi-tenant user associations)
CREATE TABLE tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX idx_tenant_memberships_tenant ON tenant_memberships(tenant_id);
CREATE INDEX idx_tenant_memberships_user ON tenant_memberships(user_id);

-- ============================================================================
-- UNIVERSAL HR DATA MODEL
-- ============================================================================

-- Departments
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  external_id TEXT,
  source_system TEXT,
  name TEXT NOT NULL,
  code TEXT,
  parent_id UUID REFERENCES departments(id),
  manager_id UUID,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, source_system, external_id)
);

CREATE INDEX idx_departments_tenant ON departments(tenant_id);
CREATE INDEX idx_departments_parent ON departments(parent_id);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  external_id TEXT,
  source_system TEXT,
  title TEXT NOT NULL,
  code TEXT,
  level TEXT,
  category TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, source_system, external_id)
);

CREATE INDEX idx_jobs_tenant ON jobs(tenant_id);

-- Locations
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  external_id TEXT,
  source_system TEXT,
  name TEXT NOT NULL,
  code TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  timezone TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, source_system, external_id)
);

CREATE INDEX idx_locations_tenant ON locations(tenant_id);

-- Employees (canonical representation)
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  source_system TEXT NOT NULL,
  
  -- Personal information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  email TEXT NOT NULL,
  personal_email TEXT,
  phone TEXT,
  mobile TEXT,
  date_of_birth DATE,
  nationality TEXT,
  gender TEXT,
  
  -- Employment information
  employee_number TEXT,
  hire_date DATE,
  termination_date DATE,
  employment_status TEXT NOT NULL DEFAULT 'active',
  employment_type TEXT,
  
  -- Job information
  job_title TEXT,
  job_id UUID REFERENCES jobs(id),
  department_id UUID REFERENCES departments(id),
  location_id UUID REFERENCES locations(id),
  manager_id UUID REFERENCES employees(id),
  
  -- Contract information
  contract_type TEXT,
  contract_start_date DATE,
  contract_end_date DATE,
  
  -- Raw data from source
  raw_data JSONB,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, source_system, external_id)
);

CREATE INDEX idx_employees_tenant ON employees(tenant_id);
CREATE INDEX idx_employees_email ON employees(tenant_id, email);
CREATE INDEX idx_employees_status ON employees(tenant_id, employment_status);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_job ON employees(job_id);
CREATE INDEX idx_employees_location ON employees(location_id);

-- Add foreign key for department manager after employees table exists
ALTER TABLE departments ADD CONSTRAINT fk_departments_manager 
  FOREIGN KEY (manager_id) REFERENCES employees(id);

-- ============================================================================
-- EVENT SYSTEM
-- ============================================================================

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Event identification
  event_type TEXT NOT NULL,
  event_source TEXT NOT NULL,
  external_event_id TEXT,
  
  -- Event payload
  employee_id UUID REFERENCES employees(id),
  payload JSONB NOT NULL,
  raw_payload JSONB,
  
  -- Processing status
  status TEXT NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Workflow context
  workflow_execution_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_tenant ON events(tenant_id);
CREATE INDEX idx_events_status ON events(tenant_id, status);
CREATE INDEX idx_events_type ON events(tenant_id, event_type);
CREATE INDEX idx_events_employee ON events(employee_id);
CREATE INDEX idx_events_created ON events(created_at DESC);

-- ============================================================================
-- WORKFLOW SYSTEM
-- ============================================================================

-- Workflows
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  
  -- Workflow definition
  definition JSONB NOT NULL,
  
  -- Status
  enabled BOOLEAN DEFAULT TRUE,
  version INTEGER DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_workflows_tenant ON workflows(tenant_id);
CREATE INDEX idx_workflows_type ON workflows(tenant_id, type);
CREATE INDEX idx_workflows_enabled ON workflows(tenant_id, enabled);

-- Workflow executions
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  workflow_id UUID NOT NULL REFERENCES workflows(id),
  event_id UUID REFERENCES events(id),
  employee_id UUID REFERENCES employees(id),
  
  -- Execution state
  status TEXT NOT NULL DEFAULT 'pending',
  current_step INTEGER DEFAULT 0,
  
  -- Context
  context JSONB DEFAULT '{}',
  
  -- Timing
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflow_executions_tenant ON workflow_executions(tenant_id);
CREATE INDEX idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(tenant_id, status);
CREATE INDEX idx_workflow_executions_employee ON workflow_executions(employee_id);
CREATE INDEX idx_workflow_executions_event ON workflow_executions(event_id);

-- ============================================================================
-- RULE ENGINE
-- ============================================================================

-- Rules
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Rule configuration
  event_type TEXT NOT NULL,
  conditions JSONB NOT NULL,
  priority INTEGER DEFAULT 100,
  
  -- Workflow mapping
  workflow_id UUID NOT NULL REFERENCES workflows(id),
  
  -- Status
  enabled BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_rules_tenant ON rules(tenant_id);
CREATE INDEX idx_rules_event_type ON rules(tenant_id, event_type, enabled);
CREATE INDEX idx_rules_workflow ON rules(workflow_id);

-- ============================================================================
-- ACTION SYSTEM
-- ============================================================================

-- Actions
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  workflow_execution_id UUID NOT NULL REFERENCES workflow_executions(id),
  
  -- Action details
  action_type TEXT NOT NULL,
  action_system TEXT NOT NULL,
  
  -- Action parameters
  parameters JSONB NOT NULL,
  
  -- Execution status
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Result
  result JSONB,
  error_message TEXT,
  
  -- Verification
  verification_status TEXT,
  verification_result JSONB,
  verified_at TIMESTAMPTZ,
  
  -- Timing
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  next_retry_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_actions_tenant ON actions(tenant_id);
CREATE INDEX idx_actions_workflow_execution ON actions(workflow_execution_id);
CREATE INDEX idx_actions_status ON actions(tenant_id, status);
CREATE INDEX idx_actions_retry ON actions(tenant_id, next_retry_at) WHERE status = 'retrying';
CREATE INDEX idx_actions_verification ON actions(tenant_id, verification_status);

-- ============================================================================
-- CONNECTOR CONFIGURATION
-- ============================================================================

-- Connectors
CREATE TABLE connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Connector identification
  connector_type TEXT NOT NULL,
  system_name TEXT NOT NULL,
  
  -- Configuration
  config JSONB NOT NULL,
  credentials_encrypted TEXT,
  
  -- Status
  enabled BOOLEAN DEFAULT TRUE,
  health_status TEXT DEFAULT 'unknown',
  last_health_check TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  UNIQUE(tenant_id, connector_type, system_name)
);

CREATE INDEX idx_connectors_tenant ON connectors(tenant_id);
CREATE INDEX idx_connectors_enabled ON connectors(tenant_id, enabled);
CREATE INDEX idx_connectors_health ON connectors(tenant_id, health_status);

-- ============================================================================
-- AUDIT & EXCEPTIONS
-- ============================================================================

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Action tracking
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  
  -- Actor
  user_id UUID REFERENCES users(id),
  system_actor TEXT,
  
  -- Details
  changes JSONB,
  metadata JSONB,
  
  -- Context
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);

-- Exceptions
CREATE TABLE exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Exception details
  exception_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  
  -- Context
  workflow_execution_id UUID REFERENCES workflow_executions(id),
  action_id UUID REFERENCES actions(id),
  event_id UUID REFERENCES events(id),
  employee_id UUID REFERENCES employees(id),
  
  -- Description
  title TEXT NOT NULL,
  description TEXT,
  error_details JSONB,
  
  -- Resolution
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES users(id),
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_exceptions_tenant ON exceptions(tenant_id);
CREATE INDEX idx_exceptions_status ON exceptions(tenant_id, status);
CREATE INDEX idx_exceptions_severity ON exceptions(tenant_id, severity);
CREATE INDEX idx_exceptions_assigned ON exceptions(assigned_to);
CREATE INDEX idx_exceptions_workflow ON exceptions(workflow_execution_id);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exceptions ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies
-- These policies ensure users can only access data from their own tenant(s)

CREATE POLICY tenant_isolation_policy ON tenants
  FOR ALL
  USING (
    id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON employees
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON departments
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON jobs
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON locations
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON events
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON rules
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON workflows
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON workflow_executions
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON actions
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON connectors
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON audit_logs
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_isolation_policy ON exceptions
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY tenant_memberships_policy ON tenant_memberships
  FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to all relevant tables
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_executions_updated_at BEFORE UPDATE ON workflow_executions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON actions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connectors_updated_at BEFORE UPDATE ON connectors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exceptions_updated_at BEFORE UPDATE ON exceptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
