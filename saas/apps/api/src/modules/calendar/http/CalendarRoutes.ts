import { Router } from 'express';
import { CalendarController } from './CalendarController.js';
import { CalendarService } from '../application/CalendarService.js';
import { createCalendarRepository } from '../infrastructure/createCalendarRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createCalendarRoutes(): Router {
  const router = Router();
  const repo = createCalendarRepository();
  const service = new CalendarService(repo);
  const controller = new CalendarController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.listEvents);
  router.get('/events', controller.listEvents);
  router.post('/blocks', controller.createBlock);
  router.patch('/blocks/:id', controller.updateBlock);
  router.delete('/blocks/:id', controller.removeBlock);

  // Legacy CRUD stubs → block operations
  router.get('/:id', controller.getById);
  router.post('/', controller.createBlock);
  router.patch('/:id', controller.updateBlock);
  router.delete('/:id', controller.removeBlock);

  return router;
}
