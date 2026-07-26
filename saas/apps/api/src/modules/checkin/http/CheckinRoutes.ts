import { Router } from 'express';
import { CheckinController } from './CheckinController.js';
import { CheckinService } from '../application/CheckinService.js';
import { PrismaCheckinRepository } from '../infrastructure/PrismaCheckinRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createCheckinRoutes(): Router {
  const router = Router();
  const repo = new PrismaCheckinRepository();
  const service = new CheckinService(repo);
  const controller = new CheckinController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
