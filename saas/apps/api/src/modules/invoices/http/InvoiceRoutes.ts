import { Router } from 'express';
import { InvoiceController } from './InvoiceController.js';
import { InvoiceService } from '../application/InvoiceService.js';
import { PrismaInvoiceRepository } from '../infrastructure/PrismaInvoiceRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createInvoiceRoutes(): Router {
  const router = Router();
  const repo = new PrismaInvoiceRepository();
  const service = new InvoiceService(repo);
  const controller = new InvoiceController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
