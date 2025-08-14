import { ApiClientError } from './api-client-error';
import type { ErrorDetails, ValidationErrorDetail } from '../types/api-error';

/**
 * Error lanzado cuando hay problemas de validación de datos (400, 422)
 */
export class ValidationError extends ApiClientError {
  public readonly name = 'ValidationError';
  public readonly validationErrors: ValidationErrorDetail[];

  constructor(
    message: string,
    validationErrors: ValidationErrorDetail[] = [],
    details?: Partial<ErrorDetails>
  ) {
    super(
      message,
      validationErrors.length > 0 ? 422 : 400,
      'VALIDATION_ERROR',
      {
        code: 'VALIDATION_ERROR',
        retryable: false,
        context: 'Data validation failed',
        ...details,
      }
    );
    
    this.validationErrors = validationErrors;
  }

  /**
   * Obtiene errores por campo específico
   */
  getErrorsForField(fieldName: string): ValidationErrorDetail[] {
    return this.validationErrors.filter(error => error.field === fieldName);
  }

  /**
   * Obtiene el primer error de un campo específico
   */
  getFirstErrorForField(fieldName: string): string | null {
    const fieldError = this.getErrorsForField(fieldName)[0];
    return fieldError?.message || null;
  }

  /**
   * Convierte errores de validación a un mapa campo -> mensaje
   */
  toFieldErrorMap(): Record<string, string> {
    const errorMap: Record<string, string> = {};
    
    for (const error of this.validationErrors) {
      if (!errorMap[error.field]) {
        errorMap[error.field] = error.message;
      }
    }
    
    return errorMap;
  }

  /**
   * Override para incluir errores de validación en JSON
   */
  toJSON() {
    return {
      ...super.toJSON(),
      validationErrors: this.validationErrors,
    };
  }
}