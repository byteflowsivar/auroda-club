import { classifyError, shouldLogError, extractErrorInfo } from './error-classifier';
import { executeErrorAction, type ErrorActionConfig } from './error-actions';
import { mapValidationErrorsToForm } from './form-error-mapper';

/**
 * Configuración del manejador de errores
 */
interface ErrorHandlerConfig extends ErrorActionConfig {
  logError?: boolean;
  context?: string;
}

/**
 * Interfaz para logging de errores
 */
interface ErrorLogger {
  error: Error;
  context?: string;
  userId?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  additionalData?: Record<string, unknown>;
}

/**
 * Maneja un error de forma integral
 * Esta es la función principal que debe usarse en la aplicación
 */
export function handleError(
  error: Error,
  config: ErrorHandlerConfig = {}
): void {
  const {
    logError = true,
    context,
    ...actionConfig
  } = config;

  // Clasificar el error
  const classification = classifyError(error, context);

  // Loggear si es necesario
  if (logError && shouldLogError(classification)) {
    logErrorToConsole(error, context);
  }

  // Ejecutar acciones apropiadas (toast, redirect, etc.)
  executeErrorAction(classification, actionConfig);
}

/**
 * Función específica para manejo de errores de API
 * Wrapper con configuración predeterminada para operaciones de API
 */
export function handleApiError(
  error: Error,
  context?: string,
  config: Partial<ErrorActionConfig> = {}
): void {
  handleError(error, {
    logError: true,
    context: context || 'API Operation',
    ...config,
  });
}

/**
 * Función específica para manejo de errores de formulario
 * Retorna también el mapeo de errores para usar en forms
 */
export function handleFormError(
  error: Error,
  config: Partial<ErrorActionConfig> = {}
): Record<string, string> {
  handleError(error, {
    logError: true,
    context: 'Form Submission',
    showToast: true,
    ...config,
  });

  return mapValidationErrorsToForm(error);
}

/**
 * Función silenciosa que solo loggea sin mostrar UI
 * Útil para errores de background o debug
 */
export function logError(
  error: Error,
  context?: string,
  additionalData?: Record<string, unknown>
): void {
  handleError(error, {
    logError: true,
    showToast: false,
    context,
  });

  // Log adicional si se proporciona
  if (additionalData && process.env.NODE_ENV === 'development') {
    console.log('Additional error data:', additionalData);
  }
}

/**
 * Logger de errores a consola con formato estructurado
 */
function logErrorToConsole(error: Error, context?: string): void {
  const errorInfo = extractErrorInfo(error);
  const logData: ErrorLogger = {
    error,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
  };

  // En desarrollo, mostrar información detallada
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error ${context ? `[${context}]` : ''}`);
    console.error('Error:', errorInfo.name);
    console.error('Message:', errorInfo.message);
    console.error('Status:', errorInfo.status);
    console.error('Code:', errorInfo.code);
    console.error('Stack:', errorInfo.stack);
    console.error('Full Data:', logData);
    console.groupEnd();
  } else {
    // En producción, log más limpio
    console.error(`Error ${context ? `[${context}]` : ''}:`, {
      name: errorInfo.name,
      message: errorInfo.message,
      status: errorInfo.status,
      timestamp: logData.timestamp,
    });
  }
}

/**
 * Hook personalizado para usar en React components
 * Proporciona funciones de manejo de errores con contexto automático
 */
export function useErrorHandler(defaultContext?: string) {
  const handleErrorWithContext = (error: Error, config: Partial<ErrorHandlerConfig> = {}) => {
    return handleError(error, {
      context: defaultContext,
      ...config,
    });
  };

  const handleApiErrorWithContext = (error: Error, context?: string, config: Partial<ErrorActionConfig> = {}) => {
    return handleApiError(error, context || defaultContext, config);
  };

  const handleFormErrorWithContext = (error: Error, config: Partial<ErrorActionConfig> = {}) => {
    return handleFormError(error, config);
  };

  const showSuccess = (message: string) => {
    // Importar toast dinámicamente para evitar dependencias en server-side
    if (typeof window !== 'undefined') {
      import('sonner').then(({ toast }) => {
        toast.success(message);
      });
    }
  };

  const showError = (message: string) => {
    // Importar toast dinámicamente para evitar dependencias en server-side
    if (typeof window !== 'undefined') {
      import('sonner').then(({ toast }) => {
        toast.error(message);
      });
    }
  };

  return {
    handleError: handleErrorWithContext,
    handleApiError: handleApiErrorWithContext,
    handleFormError: handleFormErrorWithContext,
    showSuccess,
    showError,
  };
}