import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { ApiResponse } from '../http/ApiResponse.js';
import pino from 'pino';

const logger = pino({ name: 'errorHandler' });

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err }, err.message);
    }
    ApiResponse.error(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  logger.error({ err }, 'Unhandled error');
  ApiResponse.error(res, 500, 'INTERNAL', 'Internal server error');
}
