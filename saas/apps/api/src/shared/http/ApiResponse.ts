import type { Response } from 'express';

export interface ApiSuccessBody<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const ApiResponse = {
  ok<T>(res: Response, data: T, meta?: Record<string, unknown>): void {
    const body: ApiSuccessBody<T> = { success: true, data };
    if (meta !== undefined) {
      body.meta = meta;
    }
    res.status(200).json(body);
  },

  created<T>(res: Response, data: T): void {
    const body: ApiSuccessBody<T> = { success: true, data };
    res.status(201).json(body);
  },

  noContent(res: Response): void {
    res.status(204).send();
  },

  error(
    res: Response,
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
  ): void {
    const error: ApiErrorBody['error'] = { code, message };
    if (details !== undefined) {
      error.details = details;
    }
    const body: ApiErrorBody = {
      success: false,
      error,
    };
    res.status(statusCode).json(body);
  },
};
