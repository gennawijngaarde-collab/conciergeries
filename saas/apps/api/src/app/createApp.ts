import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './openapi.js';
import { errorHandler } from '../shared/middleware/errorHandler.js';
import { ApiResponse } from '../shared/http/ApiResponse.js';

import { createDashboardRoutes } from '../modules/dashboard/http/DashboardRoutes.js';
import { createPropertyRoutes } from '../modules/properties/http/PropertyRoutes.js';
import { createReservationRoutes } from '../modules/reservations/http/ReservationRoutes.js';
import { createCalendarRoutes } from '../modules/calendar/http/CalendarRoutes.js';
import { createGuestRoutes } from '../modules/guests/http/GuestRoutes.js';
import { createPaymentRoutes } from '../modules/payments/http/PaymentRoutes.js';
import { createInvoiceRoutes } from '../modules/invoices/http/InvoiceRoutes.js';
import { createContractRoutes } from '../modules/contracts/http/ContractRoutes.js';
import { createEmployeeRoutes } from '../modules/employees/http/EmployeeRoutes.js';
import { createCleaningRoutes } from '../modules/cleaning/http/CleaningRoutes.js';
import { createMaintenanceRoutes } from '../modules/maintenance/http/MaintenanceRoutes.js';
import { createCheckinRoutes } from '../modules/checkin/http/CheckinRoutes.js';
import { createCheckoutRoutes } from '../modules/checkout/http/CheckoutRoutes.js';
import { createInventoryRoutes } from '../modules/inventory/http/InventoryRoutes.js';
import { createMessageRoutes } from '../modules/messages/http/MessageRoutes.js';
import { createReportRoutes } from '../modules/reports/http/ReportRoutes.js';
import { createSettingsRoutes } from '../modules/settings/http/SettingsRoutes.js';
import { createPricingRoutes } from '../modules/pricing/http/PricingRoutes.js';
import { createAutomationRoutes } from '../modules/automations/http/AutomationRoutes.js';
import { createCrmRoutes } from '../modules/crm/http/CrmRoutes.js';
import { createAiRoutes } from '../modules/ai/http/AiRoutes.js';
import { createAuthRoutes } from '../modules/auth/http/AuthRoutes.js';
import { createChannelRoutes } from '../modules/channels/http/channelRoutes.js';

const API_PREFIX = '/api/v1';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req: Request, res: Response) => {
    ApiResponse.ok(res, { status: 'ok', service: '@pms/api' });
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.get('/openapi.json', (_req, res) => {
    res.json(openApiSpec);
  });

  app.use(`${API_PREFIX}/auth`, createAuthRoutes());
  app.use(`${API_PREFIX}/dashboard`, createDashboardRoutes());
  app.use(`${API_PREFIX}/properties`, createPropertyRoutes());
  app.use(`${API_PREFIX}/reservations`, createReservationRoutes());
  app.use(`${API_PREFIX}/calendar`, createCalendarRoutes());
  app.use(`${API_PREFIX}/guests`, createGuestRoutes());
  app.use(`${API_PREFIX}/payments`, createPaymentRoutes());
  app.use(`${API_PREFIX}/invoices`, createInvoiceRoutes());
  app.use(`${API_PREFIX}/contracts`, createContractRoutes());
  app.use(`${API_PREFIX}/employees`, createEmployeeRoutes());
  app.use(`${API_PREFIX}/cleaning`, createCleaningRoutes());
  app.use(`${API_PREFIX}/maintenance`, createMaintenanceRoutes());
  app.use(`${API_PREFIX}/checkin`, createCheckinRoutes());
  app.use(`${API_PREFIX}/checkout`, createCheckoutRoutes());
  app.use(`${API_PREFIX}/inventory`, createInventoryRoutes());
  app.use(`${API_PREFIX}/messages`, createMessageRoutes());
  app.use(`${API_PREFIX}/reports`, createReportRoutes());
  app.use(`${API_PREFIX}/settings`, createSettingsRoutes());
  app.use(`${API_PREFIX}/pricing`, createPricingRoutes());
  app.use(`${API_PREFIX}/automations`, createAutomationRoutes());
  app.use(`${API_PREFIX}/crm`, createCrmRoutes());
  app.use(`${API_PREFIX}/ai`, createAiRoutes());
  app.use(`${API_PREFIX}/channels`, createChannelRoutes());

  app.use(errorHandler);

  return app;
}
