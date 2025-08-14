import { toast } from 'sonner';
import {
  ApiClientError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NetworkError
} from './api';

// Tipos para logging
interface ErrorLogData {
  error: Error;
  context?: string;
  userId?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  additionalData?: Record<string, unknown>;
}

// Configuración de manejo de errores
interface ErrorHandlerConfig {
  showToast?: boolean;
  logError?: boolean;
  retryable?: boolean;
  context?: string;
}

// Clase para manejo centralizado de errores
export class ErrorHandler {
  private static instance: ErrorHandler;
  
  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Maneja errores de API y muestra toasts apropiados
   */
  handleApiError(
    error: Error,
    config: ErrorHandlerConfig = {}
  ): void {
    const {
      showToast = true,
      logError = true,
      context = 'API Operation'
    } = config;

    if (logError) {
      this.logError(error, context);
    }

    if (!showToast) {
      return;
    }

    if (error instanceof ValidationError) {
      this.handleValidationError(error);
    } else if (error instanceof AuthenticationError) {
      this.handleAuthenticationError(error);
    } else if (error instanceof AuthorizationError) {
      this.handleAuthorizationError(error);
    } else if (error instanceof NetworkError) {
      this.handleNetworkError(error);
    } else if (error instanceof ApiClientError) {
      this.handleApiClientError(error);
    } else {
      this.handleGenericError(error, context);
    }
  }

  /**
   * Maneja errores de validación con detalles específicos
   */
  private handleValidationError(error: ValidationError): void {
    if (error.details && Array.isArray(error.details) && error.details.length > 0) {
      // Mostrar el primer error de validación de forma clara
      const firstError = error.details[0];
      const message = firstError.message || 'Datos inválidos';
      const field = firstError.field ? ` en ${firstError.field}` : '';
      
      toast.error('Error de Validación', {
        description: `${message}${field}`,
        duration: 5000,
      });
    } else {
      toast.error('Error de Validación', {
        description: error.message || 'Los datos proporcionados no son válidos',
        duration: 5000,
      });
    }
  }

  /**
   * Maneja errores de autenticación
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleAuthenticationError(_error: AuthenticationError): void {
    toast.error('Sesión Expirada', {
      description: 'Tu sesión ha expirado. Serás redirigido al login.',
      duration: 6000,
    });

    // Opcional: redirigir al login después de un delay
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }

  /**
   * Maneja errores de autorización
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleAuthorizationError(_error: AuthorizationError): void {
    toast.error('Acceso Denegado', {
      description: 'No tienes permisos para realizar esta acción.',
      duration: 5000,
    });
  }

  /**
   * Maneja errores de red
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleNetworkError(_error: NetworkError): void {
    toast.error('Error de Conexión', {
      description: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      duration: 6000,
      action: {
        label: 'Reintentar',
        onClick: () => window.location.reload(),
      },
    });
  }

  /**
   * Maneja otros errores de API
   */
  private handleApiClientError(error: ApiClientError): void {
    let title = 'Error del Servidor';
    let description = error.message;

    switch (error.status) {
      case 404:
        title = 'No Encontrado';
        description = 'El recurso solicitado no existe.';
        break;
      case 409:
        title = 'Conflicto';
        description = error.message || 'Ya existe un registro con estos datos.';
        break;
      case 429:
        title = 'Demasiadas Peticiones';
        description = 'Has excedido el límite de peticiones. Inténtalo más tarde.';
        break;
      case 500:
        title = 'Error del Servidor';
        description = 'Ocurrió un error interno. Inténtalo más tarde.';
        break;
      case 503:
        title = 'Servicio No Disponible';
        description = 'El servicio está temporalmente no disponible.';
        break;
      default:
        description = error.message || 'Ocurrió un error inesperado.';
    }

    toast.error(title, {
      description,
      duration: 5000,
    });
  }

  /**
   * Maneja errores genéricos
   */
  private handleGenericError(error: Error, context: string): void {
    toast.error('Error Inesperado', {
      description: `Ocurrió un error durante: ${context}`,
      duration: 5000,
    });
  }

  /**
   * Muestra toast de éxito
   */
  showSuccess(message: string, description?: string): void {
    toast.success(message, {
      description,
      duration: 4000,
    });
  }

  /**
   * Muestra toast de información
   */
  showInfo(message: string, description?: string): void {
    toast.info(message, {
      description,
      duration: 4000,
    });
  }

  /**
   * Muestra toast de advertencia
   */
  showWarning(message: string, description?: string): void {
    toast.warning(message, {
      description,
      duration: 5000,
    });
  }

  /**
   * Registra errores para debugging/monitoring
   */
  private logError(error: Error, context: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _logData: ErrorLogData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } as Error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    };

    // En desarrollo, mostrar en consola
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Handler - ${context}`);
      console.error('Error:', error);
      console.table({
        Type: error.constructor.name,
        Message: error.message,
        Status: (error as { status?: number }).status || 'N/A',
        Code: (error as { code?: string }).code || 'N/A',
      });
      console.groupEnd();
    }

    // En producción, podrías enviar a un servicio de monitoring
    if (process.env.NODE_ENV === 'production') {
      // Ejemplo: enviar a Sentry, LogRocket, etc.
      // sentryLogger.captureException(error, { context: logData });
    }
  }

  /**
   * Maneja errores de componentes React (para Error Boundaries)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleComponentError(error: Error, _errorInfo: unknown): void {
    this.logError(error, 'Component Error');
    
    toast.error('Error de la Aplicación', {
      description: 'Se produjo un error en la aplicación. La página se recargará automáticamente.',
      duration: 5000,
    });

    // Recargar la página después de un delay
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
}

// Instancia singleton
export const errorHandler = ErrorHandler.getInstance();

// Hooks para usar en componentes React
import { useCallback } from 'react';

export function useErrorHandler() {
  const handleError = useCallback((error: Error, config?: ErrorHandlerConfig) => {
    errorHandler.handleApiError(error, config);
  }, []);

  const showSuccess = useCallback((message: string, description?: string) => {
    errorHandler.showSuccess(message, description);
  }, []);

  const showInfo = useCallback((message: string, description?: string) => {
    errorHandler.showInfo(message, description);
  }, []);

  const showWarning = useCallback((message: string, description?: string) => {
    errorHandler.showWarning(message, description);
  }, []);

  return {
    handleError,
    showSuccess,
    showInfo,
    showWarning,
  };
}

// Wrapper para funciones async que maneja errores automáticamente
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context: string = 'Operation'
) {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.handleApiError(error as Error, { context });
      return undefined;
    }
  };
}

// Utility para manejar errores en formularios
export function handleFormError(error: Error): Record<string, string> {
  if (error instanceof ValidationError && error.validationErrors) {
    const fieldErrors: Record<string, string> = {};
    
    error.validationErrors.forEach((validationError) => {
      if (validationError.field) {
        fieldErrors[validationError.field] = validationError.message || 'Invalid value';
      }
    });
    
    return fieldErrors;
  }
  
  return {};
}