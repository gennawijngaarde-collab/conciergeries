import { Router } from 'express';
import { AutomationController } from './AutomationController.js';
import { AutomationService } from '../application/AutomationService.js';
import { PrismaAutomationRepository } from '../infrastructure/PrismaAutomationRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createAutomationRoutes(): Router {
  const router = Router();
  const repo = new PrismaAutomationRepository();
  const service = new AutomationService(repo);
  const controller = new AutomationController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
