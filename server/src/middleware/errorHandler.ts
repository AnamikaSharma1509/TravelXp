import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error('Unhandled Server Exception:', {
    message: err?.message,
    stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An internal server error occurred.';
  const code = err.code || 'INTERNAL_ERROR';

  return sendError(res, message, statusCode, code);
}
