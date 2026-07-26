import { Router } from 'express';
import { InventoryController } from './InventoryController.js';
import { InventoryService } from '../application/InventoryService.js';
import { PrismaInventoryRepository } from '../infrastructure/PrismaInventoryRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createInventoryRoutes(): Router {
  const router = Router();
  const repo = new PrismaInventoryRepository();
  const service = new InventoryService(repo);
  const controller = new InventoryController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
