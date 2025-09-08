import { Request, Response, NextFunction } from 'express';
import pinoHttp from 'pino-http';
import logger from '../utils/logger';

export const requestLogger = pinoHttp({
  logger,
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: function (req, res) {
    return `${req.method} ${req.url} - ${res.statusCode}`;
  },
  customErrorMessage: function (req, res, err) {
    return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
  }
});

export function enhancedErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error({
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  }, 'Request error');

  if (err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: err.message
      }
    });
  }

  if (err.message.includes('already exists')) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: err.message
      }
    });
  }

  if (err.message.includes('VALIDATION_ERROR')) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message
      }
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}
