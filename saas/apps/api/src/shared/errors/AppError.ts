export type AppErrorCode =
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'NOT_IMPLEMENTED'
  | 'INTERNAL';

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: AppErrorCode;
  readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code: AppErrorCode,
    details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static notFound(resource: string, id?: string): AppError {
    const suffix = id ? ` (${id})` : '';
    return new AppError(`${resource} not found${suffix}`, 404, 'NOT_FOUND');
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden'): AppError {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static validation(message: string, details?: unknown): AppError {
    return new AppError(message, 400, 'VALIDATION', details);
  }

  static conflict(message: string): AppError {
    return new AppError(message, 409, 'CONFLICT');
  }

  static notImplemented(feature: string): AppError {
    return new AppError(`${feature} is not implemented yet`, 501, 'NOT_IMPLEMENTED');
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(message, 500, 'INTERNAL');
  }
}
