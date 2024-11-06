import { Response } from 'express';
import logger from './logger';

export interface ApiResponse {
  status: boolean;
  message: string;
  data: any | null;
}

export function handleResponse(
  res: Response,
  statusCode: number,
  message: string,
  data: any = null
): Response<ApiResponse> {
  return res.status(statusCode).json({
    status: statusCode < 400,
    message,
    data,
  });
}

export function handleError(res: Response, error: any): Response<ApiResponse> {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  if (statusCode === 500) {
    logger.error('Error:', error);
  }

  return handleResponse(res, statusCode, message, null);
}