/**
 * Módulo de manejo de errores refactorizado
 * Exporta las funcionalidades principales de forma organizada
 */

// Handler principal (función más importante)
export { 
  handleError,
  handleApiError, 
  handleFormError,
  logError,
  useErrorHandler
} from './error-handler';

// Clasificación de errores
export {
  classifyError,
  shouldLogError,
  extractErrorInfo,
  type ClassifiedErrorType,
  type ErrorClassification
} from './error-classifier';

// Mensajes de error
export {
  getErrorMessage,
  getValidationErrorMessage,
  getApiClientErrorMessage,
  getContextualErrorMessage
} from './error-messages';

// Acciones de error
export {
  showErrorToast,
  handleErrorRedirect,
  executeErrorAction,
  type ErrorActionConfig
} from './error-actions';

// Mapeo de errores de formulario
export {
  mapValidationErrorsToForm,
  getFieldErrors,
  getFirstFieldError,
  hasFieldError,
  getFormErrorSummary,
  getFriendlyFieldName,
  mapValidationErrorsWithFriendlyNames,
  mapToReactHookFormErrors,
  type FormErrorMap,
  type FieldError
} from './form-error-mapper';