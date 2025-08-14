/**
 * Mensajes de error tipados para mostrar al usuario
 * Centralizados y configurables según el contexto
 */

import { ValidationError, ApiClientError } from '../api';
import type { ClassifiedErrorType } from './error-classifier';

/**
 * Configuración de mensajes de error por tipo
 */
interface ErrorMessageConfig {
  title: string;
  description: string;
  duration?: number;
  actionLabel?: string;
}

/**
 * Mensajes base por tipo de error
 */
const ERROR_MESSAGES: Record<ClassifiedErrorType, ErrorMessageConfig> = {
  validation: {
    title: 'Error de Validación',
    description: 'Los datos proporcionados no son válidos',
    duration: 5000,
  },
  authentication: {
    title: 'Sesión Expirada',
    description: 'Tu sesión ha expirado. Serás redirigido al login.',
    duration: 6000,
  },
  authorization: {
    title: 'Acceso Denegado',
    description: 'No tienes permisos para realizar esta acción.',
    duration: 5000,
  },
  network: {
    title: 'Error de Conexión',
    description: 'No se pudo conectar con el servidor. Verifica tu conexión.',
    duration: 6000,
    actionLabel: 'Reintentar',
  },
  api_client: {
    title: 'Error del Servidor',
    description: 'Ocurrió un error en el servidor. Inténtalo de nuevo.',
    duration: 5000,
  },
  generic: {
    title: 'Error Inesperado',
    description: 'Ocurrió un error inesperado. Por favor inténtalo de nuevo.',
    duration: 5000,
  },
};

/**
 * Obtiene el mensaje apropiado para un tipo de error
 */
export function getErrorMessage(
  type: ClassifiedErrorType,
  customMessage?: string
): ErrorMessageConfig {
  const baseMessage = ERROR_MESSAGES[type];
  
  if (customMessage) {
    return {
      ...baseMessage,
      description: customMessage,
    };
  }

  return baseMessage;
}

/**
 * Genera mensaje específico para errores de validación
 */
export function getValidationErrorMessage(error: ValidationError): ErrorMessageConfig {
  if (error.validationErrors && error.validationErrors.length > 0) {
    const firstError = error.validationErrors[0];
    const message = firstError.message || 'Datos inválidos';
    const field = firstError.field ? ` en ${firstError.field}` : '';
    
    return getErrorMessage('validation', `${message}${field}`);
  }

  return getErrorMessage('validation', error.message);
}

/**
 * Genera mensaje específico para errores de API client
 */
export function getApiClientErrorMessage(error: ApiClientError): ErrorMessageConfig {
  let title = 'Error del Servidor';
  let description = error.message;

  switch (error.status) {
    case 404:
      title = 'No Encontrado';
      description = 'El recurso solicitado no existe.';
      break;
    case 409:
      title = 'Conflicto';
      description = 'El recurso ya existe o hay un conflicto con el estado actual.';
      break;
    case 422:
      title = 'Datos Inválidos';
      description = 'Los datos enviados no pudieron ser procesados.';
      break;
    case 500:
      title = 'Error Interno';
      description = 'Error interno del servidor. Inténtalo más tarde.';
      break;
    case 503:
      title = 'Servicio No Disponible';
      description = 'El servidor está temporalmente no disponible.';
      break;
  }

  return {
    title,
    description,
    duration: 5000,
  };
}

/**
 * Mensajes específicos por contexto de operación
 */
const CONTEXT_MESSAGES: Record<string, Partial<ErrorMessageConfig>> = {
  'athlete_create': {
    title: 'Error al Crear Atleta',
    description: 'No se pudo crear el atleta. Verifica los datos e inténtalo de nuevo.',
  },
  'athlete_update': {
    title: 'Error al Actualizar Atleta',
    description: 'No se pudo actualizar la información del atleta.',
  },
  'athlete_delete': {
    title: 'Error al Eliminar Atleta',
    description: 'No se pudo eliminar el atleta. Inténtalo de nuevo.',
  },
  'guardian_create': {
    title: 'Error al Crear Tutor',
    description: 'No se pudo crear el tutor. Verifica los datos e inténtalo de nuevo.',
  },
  'data_fetch': {
    title: 'Error al Cargar Datos',
    description: 'No se pudieron cargar los datos solicitados.',
  },
  'form_submission': {
    title: 'Error en Formulario',
    description: 'No se pudo enviar el formulario. Revisa los datos e inténtalo de nuevo.',
  },
};

/**
 * Obtiene mensaje personalizado según el contexto
 */
export function getContextualErrorMessage(
  type: ClassifiedErrorType,
  context?: string
): ErrorMessageConfig {
  const baseMessage = getErrorMessage(type);
  
  if (context && CONTEXT_MESSAGES[context]) {
    const contextMessage = CONTEXT_MESSAGES[context];
    return {
      ...baseMessage,
      ...contextMessage,
    };
  }

  return baseMessage;
}