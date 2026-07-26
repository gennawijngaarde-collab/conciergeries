/**
 * OpenAPI 3 stub documenting the main PMS API routes.
 */
export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'PMS SaaS API',
    version: '0.1.0',
    description:
      'Seasonal rental Property Management System API. Multi-tenant via x-organization-id + Supabase JWT.',
  },
  servers: [{ url: 'http://localhost:3001', description: 'Local' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    parameters: {
      OrganizationId: {
        name: 'x-organization-id',
        in: 'header',
        required: true,
        schema: { type: 'string', format: 'uuid' },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        security: [],
        summary: 'Health check',
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/v1/dashboard/overview': {
      get: {
        summary: 'Dashboard KPIs overview',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Overview payload' } },
      },
    },
    '/api/v1/properties': {
      get: {
        summary: 'List properties',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Property list' } },
      },
      post: {
        summary: 'Create property',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '201': { description: 'Created' } },
      },
    },
    '/api/v1/reservations': {
      get: {
        summary: 'List reservations',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Reservation list' } },
      },
    },
    '/api/v1/calendar': {
      get: {
        summary: 'List calendar events',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Calendar events' } },
      },
    },
    '/api/v1/guests': {
      get: {
        summary: 'List guests',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Guest list' } },
      },
    },
    '/api/v1/payments': {
      get: {
        summary: 'List payments',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Payment list' } },
      },
    },
    '/api/v1/invoices': {
      get: {
        summary: 'List invoices',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Invoice list' } },
      },
    },
    '/api/v1/contracts': {
      get: {
        summary: 'List contracts',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Contract list' } },
      },
    },
    '/api/v1/employees': {
      get: {
        summary: 'List employees',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Employee list' } },
      },
    },
    '/api/v1/cleaning': {
      get: {
        summary: 'List cleaning tasks',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Cleaning tasks' } },
      },
    },
    '/api/v1/maintenance': {
      get: {
        summary: 'List maintenance tickets',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Maintenance tickets' } },
      },
    },
    '/api/v1/checkin': {
      get: {
        summary: 'List check-in sessions',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Check-in sessions' } },
      },
    },
    '/api/v1/checkout': {
      get: {
        summary: 'List check-out sessions',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Check-out sessions' } },
      },
    },
    '/api/v1/inventory': {
      get: {
        summary: 'List inventory items',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Inventory items' } },
      },
    },
    '/api/v1/messages': {
      get: {
        summary: 'List message threads',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Message threads' } },
      },
    },
    '/api/v1/reports': {
      get: {
        summary: 'List reports',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Reports' } },
      },
    },
    '/api/v1/settings': {
      get: {
        summary: 'Get organization settings',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Settings' } },
      },
    },
    '/api/v1/pricing': {
      get: {
        summary: 'List pricing rules',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Pricing rules' } },
      },
    },
    '/api/v1/automations': {
      get: {
        summary: 'List automation rules',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Automation rules' } },
      },
    },
    '/api/v1/crm': {
      get: {
        summary: 'List CRM leads',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'CRM leads' } },
      },
    },
    '/api/v1/ai': {
      get: {
        summary: 'List AI jobs',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'AI jobs' } },
      },
    },
    '/api/v1/auth': {
      get: {
        summary: 'Auth session stubs',
        responses: { '200': { description: 'Auth resources' } },
      },
    },
    '/api/v1/channels': {
      get: {
        summary: 'List channel connections',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Channel connections' } },
      },
    },
    '/api/v1/channels/providers': {
      get: {
        summary: 'List registered channel providers',
        parameters: [{ $ref: '#/components/parameters/OrganizationId' }],
        responses: { '200': { description: 'Provider names' } },
      },
    },
    '/api/v1/channels/webhooks/{provider}': {
      post: {
        security: [],
        summary: 'Inbound channel webhook',
        parameters: [
          {
            name: 'provider',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              enum: ['booking', 'airbnb', 'vrbo', 'expedia', 'google', 'abritel'],
            },
          },
        ],
        responses: { '200': { description: 'Webhook processed' } },
      },
    },
    '/api/v1/channels/sync/{provider}/reservations': {
      post: {
        summary: 'Sync reservations from a channel',
        parameters: [
          { $ref: '#/components/parameters/OrganizationId' },
          {
            name: 'provider',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: { '200': { description: 'Synced reservations' } },
      },
    },
    '/api/v1/channels/sync/{provider}/calendar': {
      post: {
        summary: 'Sync calendar from a channel',
        parameters: [
          { $ref: '#/components/parameters/OrganizationId' },
          {
            name: 'provider',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: { '200': { description: 'Synced calendar events' } },
      },
    },
  },
} as const;
