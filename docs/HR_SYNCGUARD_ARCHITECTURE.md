# HR SyncGuard AI - System Architecture

## Executive Summary

HR SyncGuard AI is an event-driven, multi-tenant B2B SaaS platform that orchestrates HR processes across heterogeneous HRIS and action systems. The architecture follows clean architecture principles with a clear separation between domain logic, integration adapters, and infrastructure concerns.

## 1. Core Architectural Principles

### 1.1 Abstraction & Independence
The core application is **completely independent** of specific HRIS implementations. All HRIS systems are integrated through:
- **Connector Interface Layer**: Standardized interfaces that HRIS adapters must implement
- **Universal HR Data Model**: Canonical data representation that all connectors map to/from
- **Adapter Pattern**: Each HRIS/action system has its own adapter implementing the interface

### 1.2 Event-Driven Architecture
```
HR Event → Normalization → Event Queue → Rule Evaluation → Workflow Selection → Action Execution → Verification → Audit
```

### 1.3 Multi-Tenancy
- **Tenant Isolation**: All data is partitioned by `tenant_id`
- **Row-Level Security**: PostgreSQL RLS policies enforce tenant boundaries
- **Credential Isolation**: Encrypted credentials stored per tenant
- **Configuration Isolation**: Rules, workflows, and connectors are tenant-specific

### 1.4 Fault Tolerance
- **Idempotency**: All actions can be safely retried
- **Exponential Backoff**: Failed actions retry with increasing delays
- **Circuit Breaker**: Failing connectors are temporarily disabled
- **Dead Letter Queue**: Unrecoverable events are moved to DLQ for manual intervention
- **Compensation**: Partial workflow failures can trigger compensating actions

---

## 2. System Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                          │
│  (Next.js App Router, React Components, API Routes)            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                           │
│  (Event Handlers, Rule Evaluators, Workflow Orchestrator)      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Domain Layer                             │
│  (Universal HR Model, Business Rules, Workflow Definitions)    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Integration Layer                           │
│  (HRIS Connectors, Action Connectors, Webhook Receivers)       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                          │
│  (PostgreSQL, Supabase, Queue, Encryption, Logging)            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```
hr-syncguard/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth routes group
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── events/               # Event log viewer
│   │   │   ├── workflows/            # Workflow management
│   │   │   ├── rules/                # Rule configuration
│   │   │   ├── connectors/           # Connector setup
│   │   │   ├── audit/                # Audit logs
│   │   │   ├── exceptions/           # Exception management
│   │   │   ├── settings/             # Tenant settings
│   │   │   └── layout.tsx
│   │   ├── api/                      # API Routes
│   │   │   ├── webhooks/             # Webhook receivers
│   │   │   │   ├── hris/             # HRIS webhooks
│   │   │   │   │   ├── mock/
│   │   │   │   │   ├── lucca/
│   │   │   │   │   ├── sap/
│   │   │   │   │   └── workday/
│   │   │   │   └── actions/          # Action system webhooks
│   │   │   ├── events/               # Event management
│   │   │   ├── workflows/            # Workflow execution
│   │   │   ├── rules/                # Rule evaluation
│   │   │   └── connectors/           # Connector CRUD
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── core/                         # Core Domain Logic (HRIS-agnostic)
│   │   ├── domain/
│   │   │   ├── models/               # Universal HR Data Model
│   │   │   │   ├── employee.ts       # Canonical Employee model
│   │   │   │   ├── department.ts
│   │   │   │   ├── job.ts
│   │   │   │   ├── contract.ts
│   │   │   │   └── location.ts
│   │   │   ├── events/               # Event definitions
│   │   │   │   ├── base-event.ts
│   │   │   │   ├── employee-created.ts
│   │   │   │   ├── employee-terminated.ts
│   │   │   │   ├── employee-job-changed.ts
│   │   │   │   ├── employee-dept-changed.ts
│   │   │   │   ├── employee-manager-changed.ts
│   │   │   │   ├── employee-location-changed.ts
│   │   │   │   └── employee-contract-changed.ts
│   │   │   ├── actions/              # Action definitions
│   │   │   │   ├── base-action.ts
│   │   │   │   ├── create-account.ts
│   │   │   │   ├── disable-account.ts
│   │   │   │   ├── assign-license.ts
│   │   │   │   ├── revoke-license.ts
│   │   │   │   ├── update-groups.ts
│   │   │   │   ├── send-notification.ts
│   │   │   │   └── create-ticket.ts
│   │   │   └── workflows/            # Workflow definitions
│   │   │       ├── base-workflow.ts
│   │   │       ├── onboarding.ts
│   │   │       ├── offboarding.ts
│   │   │       └── job-change.ts
│   │   │
│   │   ├── engine/                   # Core engines (HRIS-agnostic)
│   │   │   ├── event-engine/
│   │   │   │   ├── event-receiver.ts
│   │   │   │   ├── event-normalizer.ts
│   │   │   │   ├── event-validator.ts
│   │   │   │   └── event-queue.ts
│   │   │   ├── rule-engine/
│   │   │   │   ├── rule-evaluator.ts
│   │   │   │   ├── condition-parser.ts
│   │   │   │   ├── expression-engine.ts
│   │   │   │   └── rule-matcher.ts
│   │   │   ├── workflow-engine/
│   │   │   │   ├── workflow-orchestrator.ts
│   │   │   │   ├── workflow-executor.ts
│   │   │   │   ├── step-processor.ts
│   │   │   │   └── workflow-state-machine.ts
│   │   │   ├── action-engine/
│   │   │   │   ├── action-executor.ts
│   │   │   │   ├── action-dispatcher.ts
│   │   │   │   ├── batch-processor.ts
│   │   │   │   └── action-result.ts
│   │   │   ├── verification-engine/
│   │   │   │   ├── verifier.ts
│   │   │   │   ├── verification-strategies.ts
│   │   │   │   └── verification-result.ts
│   │   │   └── retry-engine/
│   │   │       ├── retry-handler.ts
│   │   │       ├── exponential-backoff.ts
│   │   │       ├── circuit-breaker.ts
│   │   │       └── dead-letter-queue.ts
│   │   │
│   │   └── exceptions/               # Exception management
│   │       ├── exception-handler.ts
│   │       ├── exception-classifier.ts
│   │       └── exception-notifier.ts
│   │
│   ├── connectors/                   # Integration Adapters
│   │   ├── interfaces/               # Connector contracts
│   │   │   ├── hris-connector.interface.ts
│   │   │   ├── action-connector.interface.ts
│   │   │   └── connector-config.interface.ts
│   │   │
│   │   ├── hris/                     # HRIS adapters
│   │   │   ├── mock-hris/
│   │   │   │   ├── mock-hris-connector.ts
│   │   │   │   ├── mock-data-mapper.ts
│   │   │   │   └── mock-webhook-handler.ts
│   │   │   ├── lucca/
│   │   │   │   ├── lucca-connector.ts (future)
│   │   │   │   ├── lucca-data-mapper.ts
│   │   │   │   └── lucca-webhook-handler.ts
│   │   │   ├── sap-successfactors/
│   │   │   │   └── README.md (placeholder)
│   │   │   ├── workday/
│   │   │   │   └── README.md (placeholder)
│   │   │   └── base-hris-connector.ts
│   │   │
│   │   └── actions/                  # Action system adapters
│   │       ├── microsoft-entra/
│   │       │   ├── entra-connector.ts
│   │       │   ├── entra-user-manager.ts
│   │       │   ├── entra-group-manager.ts
│   │       │   └── entra-auth.ts
│   │       ├── microsoft-365/
│   │       │   ├── m365-connector.ts
│   │       │   ├── m365-license-manager.ts
│   │       │   ├── m365-mailbox-manager.ts
│   │       │   └── m365-auth.ts
│   │       ├── google-workspace/
│   │       │   └── README.md (placeholder)
│   │       ├── okta/
│   │       │   └── README.md (placeholder)
│   │       └── base-action-connector.ts
│   │
│   ├── infrastructure/               # Infrastructure services
│   │   ├── database/
│   │   │   ├── supabase-client.ts
│   │   │   ├── repositories/         # Data access layer
│   │   │   │   ├── tenant-repository.ts
│   │   │   │   ├── employee-repository.ts
│   │   │   │   ├── event-repository.ts
│   │   │   │   ├── workflow-repository.ts
│   │   │   │   ├── rule-repository.ts
│   │   │   │   ├── action-repository.ts
│   │   │   │   ├── audit-repository.ts
│   │   │   │   └── exception-repository.ts
│   │   │   └── migrations/
│   │   │
│   │   ├── queue/
│   │   │   ├── queue-service.ts
│   │   │   ├── event-queue.ts
│   │   │   └── dead-letter-queue.ts
│   │   │
│   │   ├── security/
│   │   │   ├── encryption-service.ts
│   │   │   ├── credential-manager.ts
│   │   │   ├── rbac.ts
│   │   │   └── audit-logger.ts
│   │   │
│   │   └── notifications/
│   │       ├── notification-service.ts
│   │       ├── email-provider.ts
│   │       └── slack-provider.ts
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── dashboard/
│   │   ├── events/
│   │   ├── workflows/
│   │   ├── rules/
│   │   ├── connectors/
│   │   ├── audit/
│   │   └── exceptions/
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── utils.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   │
│   └── types/                        # TypeScript types
│       ├── api.ts
│       ├── database.ts
│       └── global.ts
│
├── supabase/
│   ├── migrations/
│   │   └── [timestamp]_initial_schema.sql
│   ├── functions/
│   └── config.toml
│
├── docs/
│   ├── architecture/
│   ├── connectors/
│   │   ├── hris-connector-guide.md
│   │   └── action-connector-guide.md
│   └── workflows/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local
├── .env.example
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. Database Schema

### 4.1 Multi-Tenancy & Core Tables

```sql
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

-- Users (multi-tenant users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant memberships
CREATE TABLE tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member, viewer
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);
CREATE INDEX idx_tenant_memberships_tenant ON tenant_memberships(tenant_id);
CREATE INDEX idx_tenant_memberships_user ON tenant_memberships(user_id);
```

### 4.2 Universal HR Data Model

```sql
-- Employees (canonical representation)
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL, -- ID from source HRIS
  source_system TEXT NOT NULL, -- 'mock', 'lucca', 'sap', etc.
  
  -- Personal information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  personal_email TEXT,
  phone TEXT,
  mobile TEXT,
  date_of_birth DATE,
  
  -- Employment information
  employee_number TEXT,
  hire_date DATE,
  termination_date DATE,
  employment_status TEXT NOT NULL, -- active, inactive, terminated
  employment_type TEXT, -- full_time, part_time, contractor, intern
  
  -- Job information
  job_title TEXT,
  job_id UUID REFERENCES jobs(id),
  department_id UUID REFERENCES departments(id),
  location_id UUID REFERENCES locations(id),
  manager_id UUID REFERENCES employees(id),
  
  -- Contract information
  contract_type TEXT, -- permanent, fixed_term, contractor
  contract_start_date DATE,
  contract_end_date DATE,
  
  -- Raw data from source
  raw_data JSONB, -- Original data from HRIS
  
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

-- Departments
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  external_id TEXT,
  source_system TEXT,
  name TEXT NOT NULL,
  code TEXT,
  parent_id UUID REFERENCES departments(id),
  manager_id UUID REFERENCES employees(id),
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, source_system, external_id)
);
CREATE INDEX idx_departments_tenant ON departments(tenant_id);

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
```

### 4.3 Event System

```sql
-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Event identification
  event_type TEXT NOT NULL, -- employee_created, employee_terminated, etc.
  event_source TEXT NOT NULL, -- Source system (mock, lucca, etc.)
  external_event_id TEXT, -- ID from source system
  
  -- Event payload
  employee_id UUID REFERENCES employees(id),
  payload JSONB NOT NULL, -- Normalized event data
  raw_payload JSONB, -- Original webhook payload
  
  -- Processing status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Workflow context
  workflow_execution_id UUID, -- Link to workflow execution
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_events_tenant ON events(tenant_id);
CREATE INDEX idx_events_status ON events(tenant_id, status);
CREATE INDEX idx_events_type ON events(tenant_id, event_type);
CREATE INDEX idx_events_employee ON events(employee_id);
CREATE INDEX idx_events_created ON events(created_at DESC);
```

### 4.4 Rule Engine

```sql
-- Rules
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Rule configuration
  event_type TEXT NOT NULL, -- Which event triggers this rule
  conditions JSONB NOT NULL, -- Rule conditions (JSON Logic format)
  priority INTEGER DEFAULT 100, -- Lower = higher priority
  
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
```

### 4.5 Workflow System

```sql
-- Workflows
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- onboarding, offboarding, job_change, custom
  
  -- Workflow definition
  definition JSONB NOT NULL, -- Workflow steps as JSON
  
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

-- Workflow executions
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  workflow_id UUID NOT NULL REFERENCES workflows(id),
  event_id UUID REFERENCES events(id),
  employee_id UUID REFERENCES employees(id),
  
  -- Execution state
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed, cancelled
  current_step INTEGER DEFAULT 0,
  
  -- Context
  context JSONB DEFAULT '{}', -- Workflow variables
  
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
```

### 4.6 Action System

```sql
-- Actions
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  workflow_execution_id UUID NOT NULL REFERENCES workflow_executions(id),
  
  -- Action details
  action_type TEXT NOT NULL, -- create_account, disable_account, etc.
  action_system TEXT NOT NULL, -- entra, m365, google_workspace, etc.
  
  -- Action parameters
  parameters JSONB NOT NULL,
  
  -- Execution status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed, retrying
  attempt_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Result
  result JSONB,
  error_message TEXT,
  
  -- Verification
  verification_status TEXT, -- pending, verified, failed
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
```

### 4.7 Connector Configuration

```sql
-- Connectors
CREATE TABLE connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Connector identification
  connector_type TEXT NOT NULL, -- hris, action
  system_name TEXT NOT NULL, -- mock, lucca, sap, entra, m365, etc.
  
  -- Configuration
  config JSONB NOT NULL, -- System-specific configuration
  credentials_encrypted TEXT, -- Encrypted credentials
  
  -- Status
  enabled BOOLEAN DEFAULT TRUE,
  health_status TEXT DEFAULT 'unknown', -- healthy, degraded, down, unknown
  last_health_check TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  UNIQUE(tenant_id, connector_type, system_name)
);
CREATE INDEX idx_connectors_tenant ON connectors(tenant_id);
CREATE INDEX idx_connectors_enabled ON connectors(tenant_id, enabled);
```

### 4.8 Audit & Exceptions

```sql
-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Action tracking
  action TEXT NOT NULL, -- create, update, delete, execute, etc.
  resource_type TEXT NOT NULL, -- employee, event, workflow, action, etc.
  resource_id UUID,
  
  -- Actor
  user_id UUID REFERENCES users(id),
  system_actor TEXT, -- If action performed by system
  
  -- Details
  changes JSONB, -- Before/after for updates
  metadata JSONB,
  
  -- Context
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(tenant_id, created_at DESC);

-- Exceptions
CREATE TABLE exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Exception details
  exception_type TEXT NOT NULL, -- action_failed, verification_failed, etc.
  severity TEXT NOT NULL, -- low, medium, high, critical
  
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
  status TEXT NOT NULL DEFAULT 'open', -- open, acknowledged, resolved, ignored
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
```

### 4.9 Row-Level Security (RLS)

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
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

-- Example policy (repeat pattern for all tables)
CREATE POLICY tenant_isolation_policy ON employees
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

## 5. Universal HR Data Model

### 5.1 Core Employee Model

```typescript
interface UniversalEmployee {
  // Identity
  id: string; // Internal UUID
  externalId: string; // ID from source HRIS
  sourceSystem: HRISSystem; // mock, lucca, sap, etc.
  
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    preferredName?: string;
    email: string;
    personalEmail?: string;
    phone?: string;
    mobile?: string;
    dateOfBirth?: Date;
    nationality?: string;
    gender?: string;
  };
  
  // Employment Information
  employment: {
    employeeNumber?: string;
    hireDate: Date;
    terminationDate?: Date;
    status: EmploymentStatus;
    type: EmploymentType;
  };
  
  // Job Information
  job: {
    title: string;
    jobId?: string;
    department: Department;
    location: Location;
    manager?: ManagerReference;
  };
  
  // Contract Information
  contract: {
    type: ContractType;
    startDate: Date;
    endDate?: Date;
  };
  
  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    syncedAt: Date;
  };
  
  // Raw data preservation
  rawData: Record<string, any>;
}

type EmploymentStatus = 'active' | 'inactive' | 'terminated' | 'on_leave';
type EmploymentType = 'full_time' | 'part_time' | 'contractor' | 'intern' | 'temporary';
type ContractType = 'permanent' | 'fixed_term' | 'contractor' | 'temporary';
type HRISSystem = 'mock' | 'lucca' | 'sap' | 'workday' | 'personio' | 'bamboohr';
```

---

## 6. Event Model

### 6.1 Base Event Structure

```typescript
interface BaseEvent {
  // Event Identity
  id: string;
  eventType: EventType;
  eventSource: HRISSystem;
  externalEventId?: string;
  
  // Timing
  occurredAt: Date;
  receivedAt: Date;
  
  // Subject
  employee: {
    id: string; // Internal employee ID
    externalId: string;
  };
  
  // Tenant context
  tenantId: string;
  
  // Processing
  status: EventStatus;
  processedAt?: Date;
  
  // Raw data
  rawPayload: Record<string, any>;
}

type EventType =
  | 'employee.created'
  | 'employee.terminated'
  | 'employee.job_changed'
  | 'employee.department_changed'
  | 'employee.manager_changed'
  | 'employee.location_changed'
  | 'employee.contract_changed';

type EventStatus = 'pending' | 'processing' | 'completed' | 'failed';
```

### 6.2 Specific Event Types

```typescript
interface EmployeeCreatedEvent extends BaseEvent {
  eventType: 'employee.created';
  payload: {
    employee: UniversalEmployee;
  };
}

interface EmployeeTerminatedEvent extends BaseEvent {
  eventType: 'employee.terminated';
  payload: {
    employee: UniversalEmployee;
    terminationDate: Date;
    reason?: string;
  };
}

interface EmployeeJobChangedEvent extends BaseEvent {
  eventType: 'employee.job_changed';
  payload: {
    employee: UniversalEmployee;
    previousJob: {
      title: string;
      department: Department;
    };
    newJob: {
      title: string;
      department: Department;
    };
    effectiveDate: Date;
  };
}
```

---

## 7. Action Model

### 7.1 Base Action Structure

```typescript
interface BaseAction {
  // Action Identity
  id: string;
  actionType: ActionType;
  actionSystem: ActionSystem;
  
  // Execution Context
  workflowExecutionId: string;
  tenantId: string;
  
  // Parameters (system-specific)
  parameters: Record<string, any>;
  
  // Status
  status: ActionStatus;
  attemptCount: number;
  maxAttempts: number;
  
  // Results
  result?: ActionResult;
  errorMessage?: string;
  
  // Verification
  verificationStatus?: VerificationStatus;
  verificationResult?: VerificationResult;
  
  // Timing
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  nextRetryAt?: Date;
}

type ActionType =
  | 'create_account'
  | 'disable_account'
  | 'enable_account'
  | 'update_account'
  | 'delete_account'
  | 'assign_license'
  | 'revoke_license'
  | 'add_to_group'
  | 'remove_from_group'
  | 'send_notification'
  | 'create_ticket';

type ActionSystem =
  | 'microsoft_entra'
  | 'microsoft_365'
  | 'google_workspace'
  | 'okta'
  | 'slack'
  | 'servicenow'
  | 'jira';

type ActionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'retrying';
type VerificationStatus = 'pending' | 'verified' | 'failed';
```

### 7.2 Specific Actions

```typescript
interface CreateAccountAction extends BaseAction {
  actionType: 'create_account';
  actionSystem: 'microsoft_entra';
  parameters: {
    userPrincipalName: string;
    displayName: string;
    givenName: string;
    surname: string;
    mailNickname: string;
    accountEnabled: boolean;
    usageLocation?: string;
    department?: string;
    jobTitle?: string;
    manager?: string;
  };
}

interface AssignLicenseAction extends BaseAction {
  actionType: 'assign_license';
  actionSystem: 'microsoft_365';
  parameters: {
    userPrincipalName: string;
    skuIds: string[]; // License SKU IDs
  };
}
```

---

## 8. Workflow Model

### 8.1 Workflow Definition

```typescript
interface WorkflowDefinition {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  type: WorkflowType;
  version: number;
  enabled: boolean;
  
  // Workflow steps
  steps: WorkflowStep[];
  
  // Error handling
  onError?: ErrorHandler;
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
}

type WorkflowType = 'onboarding' | 'offboarding' | 'job_change' | 'department_change' | 'custom';

interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  
  // Execution
  actions: ActionDefinition[];
  
  // Dependencies
  dependsOn?: string[]; // Step IDs
  
  // Conditions
  condition?: Condition;
  
  // Timing
  delay?: number; // Delay in seconds before executing
}

type StepType = 'parallel' | 'sequential' | 'conditional';

interface ActionDefinition {
  actionType: ActionType;
  actionSystem: ActionSystem;
  parameters: Record<string, any>; // Can include template variables
  verification?: VerificationConfig;
  retryPolicy?: RetryPolicy;
}
```

### 8.2 Example: Onboarding Workflow

```typescript
const onboardingWorkflow: WorkflowDefinition = {
  id: 'wf_onboarding_001',
  name: 'Standard Employee Onboarding',
  type: 'onboarding',
  version: 1,
  steps: [
    {
      id: 'step_1',
      name: 'Create Identity',
      type: 'sequential',
      actions: [
        {
          actionType: 'create_account',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            displayName: '{{employee.firstName}} {{employee.lastName}}',
            // ...
          },
          verification: {
            strategy: 'api_check',
            maxWaitTime: 300, // 5 minutes
          },
        },
      ],
    },
    {
      id: 'step_2',
      name: 'Assign Licenses and Groups',
      type: 'parallel',
      dependsOn: ['step_1'],
      actions: [
        {
          actionType: 'assign_license',
          actionSystem: 'microsoft_365',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            skuIds: ['{{config.defaultLicenses}}'],
          },
        },
        {
          actionType: 'add_to_group',
          actionSystem: 'microsoft_entra',
          parameters: {
            userPrincipalName: '{{employee.email}}',
            groupId: '{{department.defaultGroup}}',
          },
        },
      ],
    },
    {
      id: 'step_3',
      name: 'Send Welcome Notification',
      type: 'sequential',
      dependsOn: ['step_2'],
      actions: [
        {
          actionType: 'send_notification',
          actionSystem: 'slack',
          parameters: {
            channel: '#new-hires',
            message: 'Welcome {{employee.firstName}} to {{department.name}}!',
          },
        },
      ],
    },
  ],
};
```

---

## 9. Connector Interfaces

### 9.1 HRIS Connector Interface

```typescript
interface HRISConnector {
  // Identity
  readonly systemName: HRISSystem;
  readonly version: string;
  
  // Configuration
  configure(config: ConnectorConfig): Promise<void>;
  validateConfig(config: ConnectorConfig): Promise<ValidationResult>;
  
  // Data synchronization
  syncEmployees(): Promise<UniversalEmployee[]>;
  syncEmployee(externalId: string): Promise<UniversalEmployee>;
  
  // Webhook handling
  handleWebhook(payload: any): Promise<BaseEvent | null>;
  validateWebhookSignature(payload: any, signature: string): boolean;
  
  // Data mapping
  mapToUniversal(sourceData: any): UniversalEmployee;
  mapFromUniversal(employee: UniversalEmployee): any;
  
  // Health check
  healthCheck(): Promise<HealthCheckResult>;
}

interface ConnectorConfig {
  tenantId: string;
  credentials: EncryptedCredentials;
  settings: Record<string, any>;
}

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
  message?: string;
  checkedAt: Date;
}
```

### 9.2 Action Connector Interface

```typescript
interface ActionConnector {
  // Identity
  readonly systemName: ActionSystem;
  readonly version: string;
  
  // Configuration
  configure(config: ConnectorConfig): Promise<void>;
  validateConfig(config: ConnectorConfig): Promise<ValidationResult>;
  
  // Action execution
  executeAction(action: BaseAction): Promise<ActionResult>;
  
  // Verification
  verifyAction(action: BaseAction): Promise<VerificationResult>;
  
  // Supported actions
  getSupportedActions(): ActionType[];
  
  // Health check
  healthCheck(): Promise<HealthCheckResult>;
}

interface ActionResult {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    executionTime: number;
    retryable: boolean;
  };
}

interface VerificationResult {
  verified: boolean;
  details?: any;
  checkedAt: Date;
}
```

---

## 10. Security Model

### 10.1 Multi-Tenant Isolation

```typescript
// Middleware for tenant context
class TenantContext {
  private static tenantId: string | null = null;
  
  static setTenant(tenantId: string): void {
    this.tenantId = tenantId;
    // Set PostgreSQL session variable
    await db.query("SET app.current_tenant_id = $1", [tenantId]);
  }
  
  static getTenant(): string {
    if (!this.tenantId) throw new Error('No tenant context');
    return this.tenantId;
  }
  
  static clear(): void {
    this.tenantId = null;
  }
}
```

### 10.2 Role-Based Access Control (RBAC)

```typescript
enum Permission {
  // Employee data
  EMPLOYEE_READ = 'employee:read',
  EMPLOYEE_WRITE = 'employee:write',
  
  // Events
  EVENT_READ = 'event:read',
  
  // Workflows
  WORKFLOW_READ = 'workflow:read',
  WORKFLOW_WRITE = 'workflow:write',
  WORKFLOW_EXECUTE = 'workflow:execute',
  
  // Rules
  RULE_READ = 'rule:read',
  RULE_WRITE = 'rule:write',
  
  // Connectors
  CONNECTOR_READ = 'connector:read',
  CONNECTOR_WRITE = 'connector:write',
  CONNECTOR_EXECUTE = 'connector:execute',
  
  // Audit
  AUDIT_READ = 'audit:read',
  
  // Exceptions
  EXCEPTION_READ = 'exception:read',
  EXCEPTION_WRITE = 'exception:write',
  
  // Settings
  SETTINGS_READ = 'settings:read',
  SETTINGS_WRITE = 'settings:write',
}

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: [/* all permissions */],
  admin: [
    Permission.EMPLOYEE_READ,
    Permission.EMPLOYEE_WRITE,
    Permission.EVENT_READ,
    Permission.WORKFLOW_READ,
    Permission.WORKFLOW_WRITE,
    Permission.WORKFLOW_EXECUTE,
    // ...
  ],
  member: [
    Permission.EMPLOYEE_READ,
    Permission.EVENT_READ,
    Permission.WORKFLOW_READ,
    // ...
  ],
  viewer: [
    Permission.EMPLOYEE_READ,
    Permission.EVENT_READ,
    Permission.AUDIT_READ,
  ],
};
```

### 10.3 Credential Encryption

```typescript
class CredentialManager {
  private encryptionKey: Buffer;
  
  async encryptCredentials(credentials: any): Promise<string> {
    // AES-256-GCM encryption
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(credentials), 'utf8'),
      cipher.final(),
    ]);
    
    const authTag = cipher.getAuthTag();
    
    return JSON.stringify({
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      data: encrypted.toString('base64'),
    });
  }
  
  async decryptCredentials(encryptedData: string): Promise<any> {
    const { iv, authTag, data } = JSON.parse(encryptedData);
    
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.encryptionKey,
      Buffer.from(iv, 'base64')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(data, 'base64')),
      decipher.final(),
    ]);
    
    return JSON.parse(decrypted.toString('utf8'));
  }
}
```

### 10.4 Audit Logging

```typescript
class AuditLogger {
  async log(params: {
    tenantId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    userId?: string;
    systemActor?: string;
    changes?: any;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await db.insert('audit_logs', {
      ...params,
      created_at: new Date(),
    });
  }
}

// Usage in application
await auditLogger.log({
  tenantId: context.tenantId,
  action: 'workflow.execute',
  resourceType: 'workflow',
  resourceId: workflow.id,
  systemActor: 'event_engine',
  metadata: {
    eventId: event.id,
    eventType: event.eventType,
  },
});
```

---

## 11. MVP Implementation Scope

### Phase 1: Core Infrastructure (Week 1-2)
- ✅ Next.js project setup
- ✅ Database schema (Supabase)
- ✅ Multi-tenant architecture
- ✅ Authentication & RBAC
- ✅ Basic UI (Dashboard, layout)

### Phase 2: Data Layer (Week 2-3)
- ✅ Universal HR data model
- ✅ Employee repository
- ✅ Department/Job/Location repositories
- ✅ Data validation

### Phase 3: Event System (Week 3-4)
- ✅ Event model & storage
- ✅ Event receiver (webhook endpoints)
- ✅ Event normalizer
- ✅ Event queue
- ✅ Mock HRIS connector

### Phase 4: Rule & Workflow Engine (Week 4-5)
- ✅ Rule engine (condition evaluation)
- ✅ Workflow definitions
- ✅ Workflow orchestrator
- ✅ Workflow executor
- ✅ 3 workflows: onboarding, offboarding, job change

### Phase 5: Action System (Week 5-6)
- ✅ Action execution engine
- ✅ Microsoft Entra connector (abstraction/mock)
- ✅ Microsoft 365 connector (abstraction/mock)
- ✅ Action verification
- ✅ Retry mechanism

### Phase 6: Exception & Audit (Week 6-7)
- ✅ Exception detection
- ✅ Exception management UI
- ✅ Audit logging
- ✅ Audit viewer

### Phase 7: UI & Polish (Week 7-8)
- ✅ Event log viewer
- ✅ Workflow execution viewer
- ✅ Rule configuration UI
- ✅ Connector setup UI
- ✅ Dashboard analytics

---

## 12. Key Design Decisions

### 12.1 Why Universal HR Model?
- **Decoupling**: Core logic doesn't know about HRIS specifics
- **Extensibility**: New HRIS systems can be added without touching core
- **Consistency**: All workflows work with the same data structure
- **Testability**: Mock connectors can be easily created

### 12.2 Why Event-Driven?
- **Asynchronous**: Don't block webhook responses
- **Reliable**: Events can be retried
- **Auditable**: Complete history of what happened
- **Scalable**: Events can be processed in parallel

### 12.3 Why Workflow Definitions as Data?
- **Dynamic**: Workflows can be created/modified without code changes
- **Versioning**: Track workflow changes over time
- **Tenant-specific**: Each tenant can have custom workflows
- **Testable**: Workflows can be validated before deployment

### 12.4 Why Connector Interfaces?
- **Standardization**: All connectors follow the same contract
- **Testability**: Mock connectors for testing
- **Extensibility**: New connectors can be added by implementing interface
- **Maintenance**: Changes to one connector don't affect others

---

## 13. Technology Stack Justification

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Next.js 14** | Full-stack framework | App Router, API routes, SSR, type-safety |
| **TypeScript** | Type safety | Critical for complex domain models |
| **PostgreSQL** | Primary database | ACID, RLS, JSONB for flexibility |
| **Supabase** | Backend-as-a-Service | Auth, RLS, real-time, edge functions |
| **Tailwind CSS** | Styling | Rapid UI development, consistency |
| **shadcn/ui** | Component library | Production-ready, accessible components |
| **Zod** | Validation | Type-safe validation for APIs and forms |
| **React Hook Form** | Form management | Performance, validation integration |

---

## 14. Security Considerations

### 14.1 Data Protection
- All credentials encrypted at rest (AES-256-GCM)
- Credentials never logged or exposed in responses
- Tenant data isolation via RLS
- Audit trail for all data access

### 14.2 API Security
- Webhook signature validation
- Rate limiting on all endpoints
- CORS policies
- API key rotation support

### 14.3 GDPR Compliance
- Data minimization (only necessary fields)
- Right to erasure (soft delete with purge)
- Data export capability
- Consent management
- EU data residency ready (Supabase region selection)

---

## 15. Monitoring & Observability

### 15.1 Health Checks
- Connector health checks (periodic)
- Database connection monitoring
- Queue depth monitoring
- Workflow execution success rate

### 15.2 Alerting
- Failed actions exceeding threshold
- Workflow execution failures
- Connector health degradation
- Exception creation

### 15.3 Metrics
- Event processing latency
- Action execution latency
- Workflow completion rate
- Exception resolution time
- Connector availability

---

## Summary

This architecture provides:

✅ **Complete HRIS Independence**: Core logic is isolated from HRIS specifics  
✅ **Extensibility**: New integrations via standardized interfaces  
✅ **Reliability**: Event-driven with retry and error handling  
✅ **Multi-Tenancy**: Secure tenant isolation with RLS  
✅ **Auditability**: Complete audit trail of all operations  
✅ **Scalability**: Event queue and parallel action execution  
✅ **Maintainability**: Clean architecture with clear boundaries  
✅ **Security**: Encrypted credentials, RBAC, GDPR-ready  

The MVP implementation will deliver a working system with:
- Mock HRIS connector
- Microsoft Entra & M365 connector abstractions
- 3 core workflows (onboarding, offboarding, job change)
- Full event/rule/workflow/action engines
- Complete exception management and audit trail
- Production-ready UI

---

**Next Steps**: 
1. Review this architecture
2. Approve or request modifications
3. Begin implementation starting with database schema and core domain models
