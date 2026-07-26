import { Router } from 'express';
import { ReservationController } from './ReservationController.js';
import { ReservationService } from '../application/ReservationService.js';
import { createReservationRepository } from '../infrastructure/createReservationRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createReservationRoutes(): Router {
  const router = Router();
  const repo = createReservationRepository();
  const service = new ReservationService(repo);
  const controller = new ReservationController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
