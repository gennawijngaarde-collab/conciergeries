import { Router } from 'express';
import { CleaningController } from './CleaningController.js';
import { CleaningService } from '../application/CleaningService.js';
import { createCleaningRepository } from '../infrastructure/createCleaningRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createCleaningRoutes(): Router {
  const router = Router();
  const repo = createCleaningRepository();
  const service = new CleaningService(repo);
  const controller = new CleaningController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id/status', controller.updateStatus);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
