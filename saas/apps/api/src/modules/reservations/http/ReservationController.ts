import type { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../application/ReservationService.js';
import { ApiResponse } from '../../../shared/http/ApiResponse.js';
import { paramId } from '../../../shared/http/params.js';
import {
  parseBody,
  reservationCreateSchema,
  reservationUpdateSchema,
} from '../../../shared/http/validation.js';

export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      const data = await this.service.list(organizationId);
      ApiResponse.ok(res, data);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      const data = await this.service.getById(organizationId, paramId(req.params.id));
      ApiResponse.ok(res, data);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      const body = parseBody(reservationCreateSchema, req.body);
      const data = await this.service.create(organizationId, body);
      ApiResponse.created(res, data);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      const body = parseBody(reservationUpdateSchema, req.body);
      const data = await this.service.update(organizationId, paramId(req.params.id), body);
      ApiResponse.ok(res, data);
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      await this.service.remove(organizationId, paramId(req.params.id));
      ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
