/**
 * Módulo de autenticación refactorizado
 * Exporta las funcionalidades principales de forma organizada
 */

// Configuración principal
export { authOptions, validateAuthConfiguration, getAuthConfigDebugInfo } from './auth-config';

// Handlers de JWT y Session
export { jwtCallback, isTokenValid, getTokenDebugInfo } from './jwt-handlers';
export { sessionCallback, isSessionValid, getSessionDebugInfo } from './session-handlers';

// Utilidades de tokens
export { 
  refreshAccessToken, 
  shouldRefreshToken, 
  createErrorToken,
  type RefreshTokenResult,
  type RefreshTokenError 
} from './token-refresh';

// Utilidades de JWT
export {
  decodeJWTPayload,
  extractRolesFromPayload,
  extractUserInfoFromPayload,
  isJWTExpired,
  type JWTPayload
} from './jwt-decoder';

// Re-exportar tipos importantes
export type { JWT } from "next-auth/jwt";
export type { Session, User, Account } from "next-auth";