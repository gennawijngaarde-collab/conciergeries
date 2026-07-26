import { Router, type Request, type Response, type NextFunction } from 'express';
import { ChannelController } from './ChannelController.js';
import { ChannelService } from '../application/ChannelService.js';
import { PrismaChannelRepository } from '../infrastructure/PrismaChannelRepository.js';
import { authMiddleware } from '../../../shared/middleware/authMiddleware.js';
import { tenantMiddleware } from '../../../shared/middleware/tenantMiddleware.js';
import { ApiResponse } from '../../../shared/http/ApiResponse.js';
import type { ProviderName } from '@pms/providers';

/**
 * Channel manager routes — CRUD + webhook + sync using @pms/providers.
 */
export function createChannelRoutes(): Router {
  const router = Router();
  const repo = new PrismaChannelRepository();
  const service = new ChannelService(repo);
  const controller = new ChannelController(service);

  // Public webhook (provider signature verification lives in adapters)
  router.post(
    '/webhooks/:provider',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const provider = req.params.provider as ProviderName;
        const rawBody =
          typeof req.body === 'string'
            ? req.body
            : JSON.stringify(req.body ?? {});
        const result = await service.handleWebhook(provider, req.headers, rawBody);
        ApiResponse.ok(res, result);
      } catch (err) {
        next(err);
      }
    },
  );

  router.use(authMiddleware, tenantMiddleware);

  router.get('/providers', (_req, res) => {
    ApiResponse.ok(res, service.listProviders());
  });

  router.post(
    '/sync/:provider/reservations',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const organizationId = req.tenant!.organizationId;
        const provider = req.params.provider as ProviderName;
        const propertyId = String(req.body?.propertyId ?? '');
        const data = await service.syncReservations(
          organizationId,
          provider,
          propertyId,
        );
        ApiResponse.ok(res, data);
      } catch (err) {
        next(err);
      }
    },
  );

  router.post(
    '/sync/:provider/calendar',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const organizationId = req.tenant!.organizationId;
        const provider = req.params.provider as ProviderName;
        const propertyId = String(req.body?.propertyId ?? '');
        const data = await service.syncCalendar(
          organizationId,
          provider,
          propertyId,
        );
        ApiResponse.ok(res, data);
      } catch (err) {
        next(err);
      }
    },
  );

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
