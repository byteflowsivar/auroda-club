/**
 * Interfaces para manejo tipado de errores de la API
 */

export interface ValidationErrorDetail {
  field: string;
  message: string;
  rejectedValue?: string | number | boolean | null;
}

export interface ApiErrorData {
  message?: string;
  status?: number;
  timestamp?: string;
  path?: string;
  details?: string;
  errors?: ValidationErrorDetail[];
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  path: string;
  details?: string;
  errors?: ValidationErrorDetail[];
}

export type ApiErrorCode = 
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR' 
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface ErrorDetails {
  code: ApiErrorCode;
  context?: string;
  originalError?: Error;
  retryable?: boolean;
}