import { Router } from 'express';
import { CheckoutController } from './CheckoutController.js';
import { CheckoutService } from '../application/CheckoutService.js';
import { PrismaCheckoutRepository } from '../infrastructure/PrismaCheckoutRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createCheckoutRoutes(): Router {
  const router = Router();
  const repo = new PrismaCheckoutRepository();
  const service = new CheckoutService(repo);
  const controller = new CheckoutController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
