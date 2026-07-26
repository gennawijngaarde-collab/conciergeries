import { Router } from 'express';
import { ReportController } from './ReportController.js';
import { ReportService } from '../application/ReportService.js';
import { PrismaReportRepository } from '../infrastructure/PrismaReportRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createReportRoutes(): Router {
  const router = Router();
  const repo = new PrismaReportRepository();
  const service = new ReportService(repo);
  const controller = new ReportController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
