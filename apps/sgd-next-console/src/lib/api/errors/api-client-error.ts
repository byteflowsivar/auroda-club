import type { ApiErrorCode, ErrorDetails } from '../types/api-error';

/**
 * Clase base para todos los errores del cliente API
 */
export class ApiClientError extends Error {
  public readonly name: string = 'ApiClientError';
  public readonly status: number;
  public readonly code: ApiErrorCode;
  public readonly details?: ErrorDetails;
  public readonly timestamp: string;

  constructor(
    message: string,
    status: number,
    code: ApiErrorCode,
    details?: ErrorDetails
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Convierte el error a un objeto plano para logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      timestamp: this.timestamp,
      details: this.details,
      stack: this.stack,
    };
  }

  /**
   * Determina si el error es de tipo retriable
   */
  isRetriable(): boolean {
    return this.details?.retryable ?? false;
  }
}