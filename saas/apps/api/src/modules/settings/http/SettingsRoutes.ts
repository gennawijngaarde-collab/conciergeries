import { Router } from 'express';
import { SettingsController } from './SettingsController.js';
import { SettingsService } from '../application/SettingsService.js';
import { PrismaSettingsRepository } from '../infrastructure/PrismaSettingsRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createSettingsRoutes(): Router {
  const router = Router();
  const repo = new PrismaSettingsRepository();
  const service = new SettingsService(repo);
  const controller = new SettingsController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
