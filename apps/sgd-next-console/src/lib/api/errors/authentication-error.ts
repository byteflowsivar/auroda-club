import { ApiClientError } from './api-client-error';
import type { ErrorDetails } from '../types/api-error';

/**
 * Error lanzado cuando hay problemas de autenticación (401)
 */
export class AuthenticationError extends ApiClientError {
  public readonly name = 'AuthenticationError';

  constructor(
    message = 'Authentication required',
    details?: Partial<ErrorDetails>
  ) {
    super(
      message, 
      401, 
      'AUTHENTICATION_ERROR',
      {
        code: 'AUTHENTICATION_ERROR',
        retryable: false,
        context: 'User authentication failed',
        ...details,
      }
    );
  }
}