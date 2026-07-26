import { Router } from 'express';
import { PaymentController } from './PaymentController.js';
import { PaymentService } from '../application/PaymentService.js';
import { PrismaPaymentRepository } from '../infrastructure/PrismaPaymentRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createPaymentRoutes(): Router {
  const router = Router();
  const repo = new PrismaPaymentRepository();
  const service = new PaymentService(repo);
  const controller = new PaymentController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
