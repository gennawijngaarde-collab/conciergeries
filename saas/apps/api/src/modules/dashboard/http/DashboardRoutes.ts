import { Router } from 'express';
import { DashboardController } from './DashboardController.js';
import { DashboardService } from '../application/DashboardService.js';
import { PrismaDashboardRepository } from '../infrastructure/PrismaDashboardRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';
import { ApiResponse } from '../../../shared/http/ApiResponse.js';
import type { Request, Response, NextFunction } from 'express';

export function createDashboardRoutes(): Router {
  const router = Router();
  const repo = new PrismaDashboardRepository();
  const service = new DashboardService(repo);
  const controller = new DashboardController(service);

  router.use(authMiddleware, tenantMiddleware);

  router.get('/overview', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.getOverview(req.tenant!.organizationId);
      ApiResponse.ok(res, data);
    } catch (err) {
      next(err);
    }
  });

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
