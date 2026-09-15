# HR SyncGuard AI

> **International HR/IT Process Orchestration Platform**

HR SyncGuard AI is an event-driven, multi-tenant B2B SaaS platform that orchestrates HR processes across heterogeneous HRIS and action systems. The platform connects HRIS systems (Lucca, SAP SuccessFactors, Workday, etc.) with action systems (Microsoft Entra ID, Microsoft 365, Google Workspace, etc.) through a universal HR data model.

## 🎯 Core Concept

When an HR event occurs (employee created, terminated, job changed, etc.):

1. **Receive** the event from any HRIS system
2. **Normalize** it into a universal HR data model
3. **Evaluate** rules to select the appropriate workflow
4. **Execute** actions across connected systems
5. **Verify** that each action succeeded
6. **Retry** failed actions automatically
7. **Create exceptions** when automatic recovery fails
8. **Maintain** complete audit trail

## 🏗️ Architecture

```
HRIS (Lucca, SAP, etc.)
        ↓
   Connector Interface
        ↓
Universal HR Data Model
        ↓
    Event Engine
        ↓
    Rule Engine
        ↓
  Workflow Engine
        ↓
  Action Connectors
        ↓
Action Systems (Entra, M365, etc.)
```

### Key Architectural Principles

1. **HRIS Independence**: Core application is completely independent of specific HRIS implementations
2. **Universal Model**: All HR data is normalized to a canonical format
3. **Event-Driven**: Asynchronous processing with retry and verification
4. **Multi-Tenant**: Complete tenant isolation with row-level security
5. **Connector-Based**: New integrations via standardized interfaces

## 📁 Project Structure

```
hr-syncguard/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth routes
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   └── api/                      # API routes & webhooks
│   │
│   ├── core/                         # Core Domain Logic (HRIS-agnostic)
│   │   ├── domain/                   # Universal models, events, actions
│   │   │   ├── models/               # Employee, Department, Job, Location
│   │   │   ├── events/               # Event definitions
│   │   │   ├── actions/              # Action definitions
│   │   │   └── workflows/            # Workflow definitions
│   │   ├── engine/                   # Core engines
│   │   │   ├── event-engine/         # Event processing
│   │   │   ├── rule-engine/          # Rule evaluation
│   │   │   ├── workflow-engine/      # Workflow orchestration
│   │   │   ├── action-engine/        # Action execution
│   │   │   ├── verification-engine/  # Action verification
│   │   │   └── retry-engine/         # Retry with backoff
│   │   └── exceptions/               # Exception management
│   │
│   ├── connectors/                   # Integration Adapters
│   │   ├── interfaces/               # Connector contracts
│   │   ├── hris/                     # HRIS adapters
│   │   │   ├── mock-hris/            # ✅ Mock HRIS (MVP)
│   │   │   ├── lucca/                # 🔜 Lucca (future)
│   │   │   ├── sap-successfactors/   # 🔜 SAP (future)
│   │   │   └── workday/              # 🔜 Workday (future)
│   │   └── actions/                  # Action system adapters
│   │       ├── microsoft-entra/      # ✅ Entra ID (MVP mock)
│   │       ├── microsoft-365/        # ✅ M365 (MVP mock)
│   │       ├── google-workspace/     # 🔜 Google (future)
│   │       └── okta/                 # 🔜 Okta (future)
│   │
│   ├── infrastructure/               # Infrastructure services
│   │   ├── database/                 # Supabase & repositories
│   │   ├── queue/                    # Event queue
│   │   ├── security/                 # Encryption, RBAC, audit
│   │   └── notifications/            # Notification service
│   │
│   └── components/                   # React UI components
│
├── supabase/
│   └── migrations/                   # Database migrations
│
└── docs/
    └── HR_SYNCGUARD_ARCHITECTURE.md  # Detailed architecture doc
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Supabase account
- PostgreSQL (via Supabase)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd hr-syncguard
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

4. **Run database migrations**

```bash
npm run db:push
```

5. **Start development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The system uses a comprehensive PostgreSQL schema with:

- **Multi-tenancy**: All tables are tenant-scoped with RLS
- **Universal HR Model**: Employees, Departments, Jobs, Locations
- **Event System**: Event storage and processing
- **Workflow System**: Workflow definitions and executions
- **Action System**: Action tracking with verification
- **Audit & Exceptions**: Complete audit trail and exception management

See `supabase/migrations/20260915000000_initial_schema.sql` for the complete schema.

## 🔌 Connectors

### HRIS Connectors

- ✅ **Mock HRIS** (MVP) - For testing without real HRIS
- 🔜 **Lucca** - French HRIS system
- 🔜 **SAP SuccessFactors** - Enterprise HCM
- 🔜 **Workday** - Cloud HCM
- 🔜 **Personio** - European HRIS
- 🔜 **BambooHR** - SMB HRIS

### Action Connectors

- ✅ **Microsoft Entra ID** (MVP mock) - Identity management
- ✅ **Microsoft 365** (MVP mock) - License management
- 🔜 **Google Workspace** - Google identity & licenses
- 🔜 **Okta** - Identity platform
- 🔜 **Slack** - Notifications
- 🔜 **ServiceNow** - Ticket creation

## 🎬 Workflows

### MVP Workflows

1. **Onboarding** - New employee setup
   - Create Entra ID account
   - Assign M365 licenses
   - Add to groups
   - Send welcome notification

2. **Offboarding** - Employee departure
   - Revoke licenses
   - Remove from groups
   - Disable account
   - Send notification

3. **Job Change** - Role/department change
   - Update account information
   - Update group memberships
   - Send notification

## 🔐 Security

- **Multi-tenant isolation** - Row-Level Security (RLS)
- **RBAC** - Owner, Admin, Member, Viewer roles
- **Encrypted credentials** - AES-256-GCM encryption
- **Audit logging** - Complete activity trail
- **GDPR-ready** - Data minimization, right to erasure

## 📡 API Endpoints

### Webhooks

- `POST /api/webhooks/hris/mock` - Mock HRIS webhook
- `POST /api/webhooks/hris/lucca` - Lucca webhook (future)
- `POST /api/webhooks/hris/sap` - SAP webhook (future)

### Management APIs

- `/api/events` - Event management
- `/api/workflows` - Workflow management
- `/api/rules` - Rule configuration
- `/api/connectors` - Connector configuration

## 🧪 Testing

### Mock HRIS Events

Send a test event to the mock HRIS webhook:

```bash
curl -X POST http://localhost:3000/api/webhooks/hris/mock \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "employee.created",
    "tenant_id": "test_tenant",
    "employee": {
      "id": "emp_001",
      "external_id": "mock_emp_001",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@company.com",
      "hire_date": "2024-01-15",
      "job_title": "Software Engineer",
      "employment_status": "active"
    }
  }'
```

## 📈 Monitoring

The system provides comprehensive monitoring:

- **Event processing** - Track event status and processing time
- **Workflow executions** - Monitor workflow progress and success rate
- **Action execution** - Track individual action success/failure
- **Exception management** - Review and resolve exceptions
- **Audit trail** - Complete history of all operations

## 🛠️ Development

### Adding a New HRIS Connector

1. Create a new directory in `src/connectors/hris/`
2. Implement the `HRISConnector` interface
3. Implement data mapping to/from Universal HR Model
4. Add webhook handler
5. Add tests

### Adding a New Action Connector

1. Create a new directory in `src/connectors/actions/`
2. Implement the `ActionConnector` interface
3. Implement action execution methods
4. Implement verification logic
5. Add tests

## 📚 Documentation

- [Architecture Document](./docs/HR_SYNCGUARD_ARCHITECTURE.md) - Comprehensive architecture details
- [HRIS Connector Guide](./docs/connectors/hris-connector-guide.md) - How to build HRIS connectors
- [Action Connector Guide](./docs/connectors/action-connector-guide.md) - How to build action connectors

## 🤝 Contributing

This is a proprietary B2B SaaS platform. Contributions are managed internally.

## 📄 License

Proprietary - All rights reserved

## 🔗 Links

- **Documentation**: [Architecture](./docs/HR_SYNCGUARD_ARCHITECTURE.md)
- **Supabase**: Configure at [https://supabase.com](https://supabase.com)
- **Support**: contact@hrsyncguard.ai (example)

---

Built with ❤️ using Next.js 14, TypeScript, PostgreSQL, and Supabase
