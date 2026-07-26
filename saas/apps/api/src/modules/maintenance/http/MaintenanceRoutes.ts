import { Router } from 'express';
import { MaintenanceController } from './MaintenanceController.js';
import { MaintenanceService } from '../application/MaintenanceService.js';
import { PrismaMaintenanceRepository } from '../infrastructure/PrismaMaintenanceRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createMaintenanceRoutes(): Router {
  const router = Router();
  const repo = new PrismaMaintenanceRepository();
  const service = new MaintenanceService(repo);
  const controller = new MaintenanceController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
