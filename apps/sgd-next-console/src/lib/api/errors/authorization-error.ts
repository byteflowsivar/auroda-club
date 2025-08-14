import { ApiClientError } from './api-client-error';
import type { ErrorDetails } from '../types/api-error';

/**
 * Error lanzado cuando el usuario no tiene permisos suficientes (403)
 */
export class AuthorizationError extends ApiClientError {
  public readonly name = 'AuthorizationError';

  constructor(
    message = 'Insufficient permissions',
    details?: Partial<ErrorDetails>
  ) {
    super(
      message,
      403,
      'AUTHORIZATION_ERROR',
      {
        code: 'AUTHORIZATION_ERROR',
        retryable: false,
        context: 'User lacks required permissions',
        ...details,
      }
    );
  }
}