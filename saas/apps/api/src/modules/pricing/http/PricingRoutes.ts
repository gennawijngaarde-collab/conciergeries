import { Router } from 'express';
import { PricingController } from './PricingController.js';
import { PricingService } from '../application/PricingService.js';
import { PrismaPricingRepository } from '../infrastructure/PrismaPricingRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createPricingRoutes(): Router {
  const router = Router();
  const repo = new PrismaPricingRepository();
  const service = new PricingService(repo);
  const controller = new PricingController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
