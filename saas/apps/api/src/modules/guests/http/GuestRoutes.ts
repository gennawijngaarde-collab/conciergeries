import { Router } from 'express';
import { GuestController } from './GuestController.js';
import { GuestService } from '../application/GuestService.js';
import { PrismaGuestRepository } from '../infrastructure/PrismaGuestRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createGuestRoutes(): Router {
  const router = Router();
  const repo = new PrismaGuestRepository();
  const service = new GuestService(repo);
  const controller = new GuestController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
