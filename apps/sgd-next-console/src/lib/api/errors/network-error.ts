import { ApiClientError } from './api-client-error';
import type { ErrorDetails } from '../types/api-error';

/**
 * Error lanzado cuando hay problemas de red o conectividad
 */
export class NetworkError extends ApiClientError {
  public readonly name = 'NetworkError';

  constructor(
    message = 'Network error occurred',
    details?: Partial<ErrorDetails>
  ) {
    super(
      message,
      0, // Sin status HTTP específico para errores de red
      'NETWORK_ERROR',
      {
        code: 'NETWORK_ERROR',
        retryable: true,
        context: 'Network connectivity issue',
        ...details,
      }
    );
  }

  /**
   * Factory method para crear error de timeout
   */
  static timeout(timeout: number): NetworkError {
    return new NetworkError(
      `Request timeout after ${timeout}ms`,
      {
        code: 'NETWORK_ERROR',
        context: 'Request timeout',
        retryable: true,
      }
    );
  }

  /**
   * Factory method para crear error de conexión
   */
  static connectionFailed(originalError?: Error): NetworkError {
    return new NetworkError(
      'Network connection failed',
      {
        code: 'NETWORK_ERROR',
        context: 'Connection failure',
        originalError,
        retryable: true,
      }
    );
  }

  /**
   * Factory method para crear error genérico de fetch
   */
  static requestFailed(originalError?: Error): NetworkError {
    return new NetworkError(
      'Request failed',
      {
        code: 'NETWORK_ERROR',
        context: 'Request execution failure',
        originalError,
        retryable: true,
      }
    );
  }
}