import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { logger } from '../logger';
import { env } from '../../config/env';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = (req.headers['x-request-id'] as string) || undefined;

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, requestId, path: req.path }, err.message);
    } else {
      logger.warn({ code: err.code, statusCode: err.statusCode, path: req.path, requestId }, err.message);
    }

    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId,
      },
    });
    return;
  }

  logger.error({ err, requestId, path: req.path }, 'Unhandled exception');

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
      requestId,
    },
  });
}
