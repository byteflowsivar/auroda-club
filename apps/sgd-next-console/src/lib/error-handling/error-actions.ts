import { toast } from 'sonner';
import type { ErrorClassification } from './error-classifier';
import { 
  getValidationErrorMessage,
  getApiClientErrorMessage,
  getContextualErrorMessage 
} from './error-messages';
import { ValidationError, ApiClientError } from '../api';

/**
 * Configuración para las acciones de error
 */
export interface ErrorActionConfig {
  showToast?: boolean;
  redirectTo?: string;
  redirectDelay?: number;
  customAction?: () => void;
  retryAction?: () => void;
}

/**
 * Muestra un toast de error basado en la clasificación
 */
export function showErrorToast(
  classification: ErrorClassification,
  config: ErrorActionConfig = {}
): void {
  if (!config.showToast && !classification.shouldShowToast) {
    return;
  }

  const messageConfig = getSpecificErrorMessage(classification);

  // Configurar acción si es retriable
  const action = classification.isRetriable && config.retryAction ? {
    label: messageConfig.actionLabel || 'Reintentar',
    onClick: config.retryAction,
  } : undefined;

  toast.error(messageConfig.title, {
    description: messageConfig.description,
    duration: messageConfig.duration,
    action,
  });
}

/**
 * Obtiene el mensaje específico según el tipo de error
 */
function getSpecificErrorMessage(classification: ErrorClassification) {
  const { type, error, context } = classification;

  switch (type) {
    case 'validation':
      return getValidationErrorMessage(error as ValidationError);
    
    case 'api_client':
      return getApiClientErrorMessage(error as ApiClientError);
    
    default:
      return getContextualErrorMessage(type, context);
  }
}

/**
 * Ejecuta redirect después de mostrar error
 */
export function handleErrorRedirect(
  redirectTo: string,
  delay: number = 2000
): void {
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
  }, delay);
}

/**
 * Maneja errores de autenticación con redirect automático
 */
export function handleAuthenticationError(
  classification: ErrorClassification,
  config: ErrorActionConfig = {}
): void {
  showErrorToast(classification, config);

  // Redirect al login por defecto
  const redirectTo = config.redirectTo || '/';
  const delay = config.redirectDelay || 2000;
  
  handleErrorRedirect(redirectTo, delay);
}

/**
 * Maneja errores de autorización 
 */
export function handleAuthorizationError(
  classification: ErrorClassification,
  config: ErrorActionConfig = {}
): void {
  showErrorToast(classification, config);

  // Opcional: redirect a página de acceso denegado
  if (config.redirectTo) {
    const delay = config.redirectDelay || 3000;
    handleErrorRedirect(config.redirectTo, delay);
  }
}

/**
 * Maneja errores de red con opción de retry
 */
export function handleNetworkError(
  classification: ErrorClassification,
  config: ErrorActionConfig = {}
): void {
  // Si no hay acción de retry, usar reload de página por defecto
  const retryAction = config.retryAction || (() => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  });

  showErrorToast(classification, {
    ...config,
    retryAction,
  });
}

/**
 * Maneja errores de validación (solo toast, sin acciones adicionales)
 */
export function handleValidationError(
  classification: ErrorClassification,
  config: ErrorActionConfig = {}
): void {
  showErrorToast(classification, config);
}

/**
 * Maneja errores genéricos
 */
export function handleGenericError(
  classification: ErrorClassification,
  config: ErrorActionConfig = {}
): void {
  showErrorToast(classification, config);

  // Ejecutar acción personalizada si está definida
  if (config.customAction) {
    config.customAction();
  }
}

/**
 * Router principal de acciones según el tipo de error
 */
export function executeErrorAction(
  classification: ErrorClassification,
  config: ErrorActionConfig = {}
): void {
  switch (classification.type) {
    case 'authentication':
      handleAuthenticationError(classification, config);
      break;
    
    case 'authorization':
      handleAuthorizationError(classification, config);
      break;
    
    case 'network':
      handleNetworkError(classification, config);
      break;
    
    case 'validation':
      handleValidationError(classification, config);
      break;
    
    case 'api_client':
    case 'generic':
    default:
      handleGenericError(classification, config);
      break;
  }
}