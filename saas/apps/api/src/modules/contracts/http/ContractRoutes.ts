import { Router } from 'express';
import { ContractController } from './ContractController.js';
import { ContractService } from '../application/ContractService.js';
import { PrismaContractRepository } from '../infrastructure/PrismaContractRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createContractRoutes(): Router {
  const router = Router();
  const repo = new PrismaContractRepository();
  const service = new ContractService(repo);
  const controller = new ContractController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
