import {
  ApiClientError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NetworkError
} from '../api';

/**
 * Tipos de errores clasificados por el sistema
 */
export type ClassifiedErrorType = 
  | 'validation'
  | 'authentication' 
  | 'authorization'
  | 'network'
  | 'api_client'
  | 'generic';

/**
 * Información sobre el error clasificado
 */
export interface ErrorClassification {
  type: ClassifiedErrorType;
  error: Error;
  isRetriable: boolean;
  shouldShowToast: boolean;
  context?: string;
}

/**
 * Clasifica un error según su tipo y características
 */
export function classifyError(
  error: Error,
  context?: string
): ErrorClassification {
  let type: ClassifiedErrorType;
  let isRetriable = false;
  let shouldShowToast = true;

  if (error instanceof ValidationError) {
    type = 'validation';
    isRetriable = false;
    shouldShowToast = true;
  } else if (error instanceof AuthenticationError) {
    type = 'authentication';
    isRetriable = false; // Usuario necesita re-autenticarse
    shouldShowToast = true;
  } else if (error instanceof AuthorizationError) {
    type = 'authorization';
    isRetriable = false; // Usuario no tiene permisos
    shouldShowToast = true;
  } else if (error instanceof NetworkError) {
    type = 'network';
    isRetriable = error.isRetriable ? error.isRetriable() : true;
    shouldShowToast = true;
  } else if (error instanceof ApiClientError) {
    type = 'api_client';
    isRetriable = error.isRetriable ? error.isRetriable() : false;
    shouldShowToast = true;
  } else {
    type = 'generic';
    isRetriable = false;
    shouldShowToast = true;
  }

  return {
    type,
    error,
    isRetriable,
    shouldShowToast,
    context,
  };
}

/**
 * Determina si un error debe ser loggeado según su clasificación
 */
export function shouldLogError(classification: ErrorClassification): boolean {
  // Siempre loggear errores críticos
  if (classification.type === 'api_client' || classification.type === 'network') {
    return true;
  }

  // Loggear errores de autenticación solo si no son normales
  if (classification.type === 'authentication') {
    return true; // El handler específico decidirá si mostrar o no
  }

  // Para otros tipos, loggear siempre
  return true;
}

/**
 * Extrae información útil de un error para logging
 */
export function extractErrorInfo(error: Error): {
  name: string;
  message: string;
  stack?: string;
  code?: string;
  status?: number;
} {
  const baseInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };

  if (error instanceof ApiClientError) {
    return {
      ...baseInfo,
      code: error.code,
      status: error.status,
    };
  }

  return baseInfo;
}