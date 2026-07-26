import { Router } from 'express';
import { EmployeeController } from './EmployeeController.js';
import { EmployeeService } from '../application/EmployeeService.js';
import { PrismaEmployeeRepository } from '../infrastructure/PrismaEmployeeRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';

export function createEmployeeRoutes(): Router {
  const router = Router();
  const repo = new PrismaEmployeeRepository();
  const service = new EmployeeService(repo);
  const controller = new EmployeeController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
