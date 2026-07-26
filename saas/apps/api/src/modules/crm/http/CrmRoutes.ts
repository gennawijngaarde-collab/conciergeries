import { Router } from 'express';
import { CrmController } from './CrmController.js';
import { CrmService } from '../application/CrmService.js';
import { PrismaCrmRepository } from '../infrastructure/PrismaCrmRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createCrmRoutes(): Router {
  const router = Router();
  const repo = new PrismaCrmRepository();
  const service = new CrmService(repo);
  const controller = new CrmController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
