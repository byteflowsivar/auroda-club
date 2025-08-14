/**
 * Public API exports para el cliente HTTP refactorizado
 * 
 * Esta es la única importación necesaria para usar el cliente API:
 * import { apiClient, ApiClient, ValidationError } from '@/lib/api';
 */

// =============================================================================
// CLIENTE API PRINCIPAL
// =============================================================================

import { ApiClient } from './client/api-client';

// Instancia singleton del cliente API con configuración por defecto
export const apiClient = new ApiClient();

// Exportar clase para casos de uso específicos
export { ApiClient };

// =============================================================================
// CLASES DE ERROR
// =============================================================================

export { ApiClientError } from './errors/api-client-error';
export { AuthenticationError } from './errors/authentication-error';
export { AuthorizationError } from './errors/authorization-error';
export { ValidationError } from './errors/validation-error';
export { NetworkError } from './errors/network-error';

// =============================================================================
// TYPES E INTERFACES
// =============================================================================

export type {
  ApiErrorCode,
  ApiErrorData,
  ApiErrorResponse,
  ValidationErrorDetail,
  ErrorDetails,
} from './types/api-error';

export type {
  ApiClientConfig,
  RequestConfig,
  HttpMethod,
} from './types/api-config';

export type {
  QueryParams,
  QueryParamValue,
  QueryParamArrayValue,
  QueryParamPrimitive,
} from './types/query-params';

// =============================================================================
// UTILIDADES
// =============================================================================

export { UrlBuilder } from './client/url-builder';
export { DEFAULT_CONFIG } from './types/api-config';
export { 
  formatQueryParam, 
  isValidQueryParam 
} from './types/query-params';

// =============================================================================
// COMPATIBILIDAD CON ARCHIVO ANTERIOR
// =============================================================================

// Export por defecto para compatibilidad
export default apiClient;