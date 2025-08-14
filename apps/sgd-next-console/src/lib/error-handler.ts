/**
 * Manejador de errores principal
 * Este archivo mantiene compatibilidad con el código existente
 * La implementación ha sido refactorizada en módulos separados en /lib/error-handling/
 */

import { 
  handleError as handleErrorNew,
  handleApiError as handleApiErrorNew,
  handleFormError as handleFormErrorNew,
  useErrorHandler as useErrorHandlerNew,
  logError as logErrorNew
} from './error-handling';

// Re-exportar las funciones principales manteniendo compatibilidad
export const handleApiError = handleApiErrorNew;
export const handleFormError = handleFormErrorNew;
export const useErrorHandler = useErrorHandlerNew;
export const logError = logErrorNew;

// Función legacy que mantiene la interfaz anterior
export const handleError = handleErrorNew;

// Funciones legacy para compatibilidad hacia atrás
export function findActionCallback(context?: string): (() => void) | undefined {
  const actionMap: Record<string, () => void> = {
    'athlete_create': () => console.log('Retry athlete creation'),
    'athlete_update': () => console.log('Retry athlete update'),
    'data_fetch': () => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },
  };

  return context && actionMap[context] ? actionMap[context] : undefined;
}

/**
 * NOTA DE MIGRACIÓN:
 * 
 * El manejo de errores ha sido refactorizado en módulos especializados:
 * 
 * - /lib/error-handling/error-handler.ts      - Manejador principal
 * - /lib/error-handling/error-classifier.ts   - Clasificación de errores
 * - /lib/error-handling/error-messages.ts     - Mensajes tipados
 * - /lib/error-handling/error-actions.ts      - Acciones (toast, redirect)
 * - /lib/error-handling/form-error-mapper.ts  - Mapeo de errores de formulario
 * 
 * Esta refactorización mejora:
 * ✅ Separación de UI de lógica de negocio
 * ✅ Funciones puras vs side effects
 * ✅ Mensajes tipados y configurables
 * ✅ Testabilidad individual de módulos
 * ✅ Elimina singleton antipattern
 * ✅ Mejor integración con formularios
 * ✅ Logging contextual estructurado
 */

// Re-exportar tipos importantes
export type {
  ErrorActionConfig,
  ClassifiedErrorType,
  ErrorClassification,
  FormErrorMap,
  FieldError
} from './error-handling';