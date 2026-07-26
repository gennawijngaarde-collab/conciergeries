import { Router } from 'express';
import { PropertyController } from './PropertyController.js';
import { PropertyService } from '../application/PropertyService.js';
import { createPropertyRepository } from '../infrastructure/createPropertyRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createPropertyRoutes(): Router {
  const router = Router();
  const repo = createPropertyRepository();
  const service = new PropertyService(repo);
  const controller = new PropertyController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
