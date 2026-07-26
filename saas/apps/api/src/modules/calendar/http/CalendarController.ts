import type { Request, Response, NextFunction } from 'express';
import { CalendarService } from '../application/CalendarService.js';
import { ApiResponse } from '../../../shared/http/ApiResponse.js';
import { paramId } from '../../../shared/http/params.js';
import {
  calendarBlockCreateSchema,
  calendarBlockUpdateSchema,
  parseBody,
} from '../../../shared/http/validation.js';

export class CalendarController {
  constructor(private readonly service: CalendarService) {}

  listEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      const from = typeof req.query.from === 'string' ? req.query.from : undefined;
      const to = typeof req.query.to === 'string' ? req.query.to : undefined;
      const propertyId =
        typeof req.query.propertyId === 'string' ? req.query.propertyId : undefined;
      const data = await this.service.listEvents(organizationId, {
        from,
        to,
        propertyId,
      });
      ApiResponse.ok(res, data);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return this.listEvents(req, res, next);
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

  createBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      const body = parseBody(calendarBlockCreateSchema, req.body);
      const data = await this.service.createBlock(organizationId, body);
      ApiResponse.created(res, data);
    } catch (err) {
      next(err);
    }
  };

  updateBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      const body = parseBody(calendarBlockUpdateSchema, req.body);
      const data = await this.service.updateBlock(
        organizationId,
        paramId(req.params.id),
        body,
      );
      ApiResponse.ok(res, data);
    } catch (err) {
      next(err);
    }
  };

  removeBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.tenant!.organizationId;
      await this.service.removeBlock(organizationId, paramId(req.params.id));
      ApiResponse.noContent(res);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return this.createBlock(req, res, next);
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return this.updateBlock(req, res, next);
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return this.removeBlock(req, res, next);
  };
}
