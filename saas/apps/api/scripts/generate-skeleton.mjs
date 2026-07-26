import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.replace(/\n/g, '\r\n').length && process.platform === 'win32' ? content : content, 'utf8');
  console.log('wrote', rel);
}

const modules = [
  { key: 'dashboard', name: 'Dashboard', path: 'dashboard', entity: 'DashboardSnapshot', plural: 'dashboard' },
  { key: 'properties', name: 'Property', path: 'properties', entity: 'Property', plural: 'properties' },
  { key: 'reservations', name: 'Reservation', path: 'reservations', entity: 'Reservation', plural: 'reservations' },
  { key: 'calendar', name: 'Calendar', path: 'calendar', entity: 'CalendarEvent', plural: 'calendar' },
  { key: 'guests', name: 'Guest', path: 'guests', entity: 'Guest', plural: 'guests' },
  { key: 'payments', name: 'Payment', path: 'payments', entity: 'Payment', plural: 'payments' },
  { key: 'invoices', name: 'Invoice', path: 'invoices', entity: 'Invoice', plural: 'invoices' },
  { key: 'contracts', name: 'Contract', path: 'contracts', entity: 'Contract', plural: 'contracts' },
  { key: 'employees', name: 'Employee', path: 'employees', entity: 'Employee', plural: 'employees' },
  { key: 'cleaning', name: 'Cleaning', path: 'cleaning', entity: 'CleaningTask', plural: 'cleaning' },
  { key: 'maintenance', name: 'Maintenance', path: 'maintenance', entity: 'MaintenanceTicket', plural: 'maintenance' },
  { key: 'checkin', name: 'Checkin', path: 'checkin', entity: 'CheckinSession', plural: 'checkin' },
  { key: 'checkout', name: 'Checkout', path: 'checkout', entity: 'CheckoutSession', plural: 'checkout' },
  { key: 'inventory', name: 'Inventory', path: 'inventory', entity: 'InventoryItem', plural: 'inventory' },
  { key: 'messages', name: 'Message', path: 'messages', entity: 'MessageThread', plural: 'messages' },
  { key: 'reports', name: 'Report', path: 'reports', entity: 'Report', plural: 'reports' },
  { key: 'settings', name: 'Settings', path: 'settings', entity: 'OrgSettings', plural: 'settings' },
  { key: 'pricing', name: 'Pricing', path: 'pricing', entity: 'PricingRule', plural: 'pricing' },
  { key: 'automations', name: 'Automation', path: 'automations', entity: 'AutomationRule', plural: 'automations' },
  { key: 'crm', name: 'Crm', path: 'crm', entity: 'CrmLead', plural: 'crm' },
  { key: 'ai', name: 'Ai', path: 'ai', entity: 'AiJob', plural: 'ai' },
  { key: 'auth', name: 'Auth', path: 'auth', entity: 'AuthSession', plural: 'auth' },
  { key: 'channels', name: 'Channel', path: 'channels', entity: 'ChannelConnection', plural: 'channels' },
];

function pascal(s) {
  return s;
}

for (const m of modules) {
  const base = `src/modules/${m.path}`;
  const service = `${m.name}Service`;
  const repo = `${m.name}Repository`;
  const controller = `${m.name}Controller`;
  const routes = `${m.name}Routes`;
  const port = `I${m.name}Repository`;

  // domain types
  write(
    `${base}/domain/${m.entity}.ts`,
    `export interface ${m.entity} {
  id: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}
`,
  );

  write(
    `${base}/domain/${port}.ts`,
    `import type { ${m.entity} } from './${m.entity}.js';

export interface ${port} {
  findById(organizationId: string, id: string): Promise<${m.entity} | null>;
  list(organizationId: string): Promise<${m.entity}[]>;
  create(organizationId: string, data: Partial<${m.entity}>): Promise<${m.entity}>;
  update(organizationId: string, id: string, data: Partial<${m.entity}>): Promise<${m.entity}>;
  delete(organizationId: string, id: string): Promise<void>;
}
`,
  );

  // application service (special modules get richer files later)
  if (!['pricing', 'automations', 'channels', 'dashboard'].includes(m.path)) {
    write(
      `${base}/application/${service}.ts`,
      `import { AppError } from '../../../shared/errors/AppError.js';
import type { ${m.entity} } from '../domain/${m.entity}.js';
import type { ${port} } from '../domain/${port}.js';

export class ${service} {
  constructor(private readonly repo: ${port}) {}

  async list(organizationId: string): Promise<${m.entity}[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<${m.entity}> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('${m.entity}', id);
    return item;
  }

  async create(organizationId: string, data: Partial<${m.entity}>): Promise<${m.entity}> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<${m.entity}>): Promise<${m.entity}> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
`,
    );
  }

  // infrastructure prisma stub
  write(
    `${base}/infrastructure/Prisma${repo}.ts`,
    `import type { ${m.entity} } from '../domain/${m.entity}.js';
import type { ${port} } from '../domain/${port}.js';
import { AppError } from '../../../shared/errors/AppError.js';

/**
 * Prisma-backed repository stub for ${m.entity}.
 * Wire prisma client methods when schema models are ready.
 */
export class Prisma${repo} implements ${port} {
  async findById(_organizationId: string, _id: string): Promise<${m.entity} | null> {
    throw AppError.notImplemented('${repo}.findById');
  }

  async list(organizationId: string): Promise<${m.entity}[]> {
    // Stub mock so list endpoints compile & respond
    return [
      {
        id: 'stub-${m.path}-1',
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async create(organizationId: string, data: Partial<${m.entity}>): Promise<${m.entity}> {
    return {
      id: \`stub-\${Date.now()}\`,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as ${m.entity};
  }

  async update(_organizationId: string, id: string, data: Partial<${m.entity}>): Promise<${m.entity}> {
    return {
      id,
      organizationId: _organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as ${m.entity};
  }

  async delete(_organizationId: string, _id: string): Promise<void> {
    // no-op stub
  }
}
`,
  );

  // controller
  write(
    `${base}/http/${controller}.ts`,
    `import type { Request, Response, NextFunction } from 'express';
import { ${service} } from '../application/${service}.js';
import { ApiResponse } from '../../../shared/http/ApiResponse.js';

export class ${controller} {
  constructor(private readonly service: ${service}) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      const data = await this.service.list(organizationId);
      ApiResponse.ok(res, data);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      const data = await this.service.getById(organizationId, req.params.id!);
      ApiResponse.ok(res, data);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      const data = await this.service.create(organizationId, req.body);
      ApiResponse.created(res, data);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      const data = await this.service.update(organizationId, req.params.id!, req.body);
      ApiResponse.ok(res, data);
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      await this.service.remove(organizationId, req.params.id!);
      ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
`,
  );

  // routes — channels customized later
  if (m.path !== 'channels') {
    write(
      `${base}/http/${routes}.ts`,
      `import { Router } from 'express';
import { ${controller} } from './${controller}.js';
import { ${service} } from '../application/${service}.js';
import { Prisma${repo} } from '../infrastructure/Prisma${repo}.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function create${m.name}Routes(): Router {
  const router = Router();
  const repo = new Prisma${repo}();
  const service = new ${service}(repo);
  const controller = new ${controller}(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
`,
    );
  }
}

console.log('Module stubs generated:', modules.length);
