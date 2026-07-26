import { Router } from 'express';
import { AuthController } from './AuthController.js';
import { AuthService } from '../application/AuthService.js';
import { AuthBootstrapService } from '../application/AuthBootstrapService.js';
import { PrismaAuthRepository } from '../infrastructure/PrismaAuthRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';
import { ApiResponse } from '../../../shared/http/ApiResponse.js';
import { AppError } from '../../../shared/errors/AppError.js';
import type { Request, Response, NextFunction } from 'express';
import type { RoleCode } from '../../../shared/middleware/authMiddleware.js';

export function createAuthRoutes(): Router {
  const router = Router();
  const repo = new PrismaAuthRepository();
  const service = new AuthService(repo);
  const bootstrapService = new AuthBootstrapService();
  const controller = new AuthController(service);

  /** Public stub — real login goes through Supabase client-side. */
  router.get('/status', (_req: Request, res: Response) => {
    ApiResponse.ok(res, { provider: 'supabase', ready: true });
  });

  const bootstrapHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) throw AppError.unauthorized('Missing user');
      const profile = await bootstrapService.bootstrap(req.user);
      const roleCode = profile.role.code as RoleCode;
      req.user.organizationId = profile.organization.id;
      req.user.role = roleCode;
      req.tenant = {
        organizationId: profile.organization.id,
        role: roleCode,
      };
      ApiResponse.ok(res, profile);
    } catch (err) {
      next(err);
    }
  };

  router.get('/me', authMiddleware, bootstrapHandler);
  router.post('/bootstrap', authMiddleware, bootstrapHandler);

  router.use(authMiddleware, tenantMiddleware);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
