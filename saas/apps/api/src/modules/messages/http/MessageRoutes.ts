import { Router } from 'express';
import { MessageController } from './MessageController.js';
import { MessageService } from '../application/MessageService.js';
import { PrismaMessageRepository } from '../infrastructure/PrismaMessageRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createMessageRoutes(): Router {
  const router = Router();
  const repo = new PrismaMessageRepository();
  const service = new MessageService(repo);
  const controller = new MessageController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
