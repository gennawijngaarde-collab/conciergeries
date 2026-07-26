import { Router } from 'express';
import { AiController } from './AiController.js';
import { AiService } from '../application/AiService.js';
import { PrismaAiRepository } from '../infrastructure/PrismaAiRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createAiRoutes(): Router {
  const router = Router();
  const repo = new PrismaAiRepository();
  const service = new AiService(repo);
  const controller = new AiController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
