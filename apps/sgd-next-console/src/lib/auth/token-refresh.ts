import { JWT } from "next-auth/jwt";
import { ERROR_MESSAGES } from '../constants';

/**
 * Configuración para el refresh de tokens
 */
interface RefreshTokenConfig {
  keycloakIssuer: string;
  clientId: string;
  clientSecret: string;
}

/**
 * Tipos de error específicos para refresh de tokens
 */
export type RefreshTokenError = 
  | 'invalid_grant'
  | 'invalid_client' 
  | 'network_error'
  | 'unknown_error';

/**
 * Resultado del refresh de token
 */
export interface RefreshTokenResult {
  success: boolean;
  token?: JWT;
  error?: RefreshTokenError;
  errorDescription?: string;
}

/**
 * Obtiene la configuración de refresh desde variables de entorno
 */
function getRefreshConfig(): RefreshTokenConfig {
  const keycloakIssuer = process.env.KEYCLOAK_ISSUER;
  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

  if (!keycloakIssuer || !clientId || !clientSecret) {
    throw new Error('Missing required Keycloak environment variables');
  }

  return {
    keycloakIssuer,
    clientId,
    clientSecret,
  };
}

/**
 * Construye la URL del endpoint de token de Keycloak
 */
function getTokenEndpointURL(keycloakIssuer: string): string {
  return `${keycloakIssuer}/protocol/openid-connect/token`;
}

/**
 * Construye el cuerpo de la petición para refresh token
 */
function buildRefreshTokenRequestBody(config: RefreshTokenConfig, refreshToken: string): URLSearchParams {
  return new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}

/**
 * Clasifica el tipo de error basado en la respuesta
 */
function classifyRefreshError(errorData: unknown): {
  type: RefreshTokenError;
  isNormalExpiration: boolean;
  shouldLog: boolean;
} {
  const errorObj = errorData as { error?: string; error_description?: string } | null;
  const error = errorObj?.error;
  const description = errorObj?.error_description;

  // Expiración natural de sesión - comportamiento normal
  if (error === 'invalid_grant' && description?.includes('Session not active')) {
    return {
      type: 'invalid_grant',
      isNormalExpiration: true,
      shouldLog: false, // No loggear como error
    };
  }

  // Error de configuración - crítico
  if (error === 'invalid_client') {
    return {
      type: 'invalid_client',
      isNormalExpiration: false,
      shouldLog: true,
    };
  }

  // Otros errores de grant
  if (error === 'invalid_grant') {
    return {
      type: 'invalid_grant',
      isNormalExpiration: false,
      shouldLog: true,
    };
  }

  // Error desconocido
  return {
    type: 'unknown_error',
    isNormalExpiration: false,
    shouldLog: true,
  };
}

/**
 * Refresca un token de acceso usando el refresh token
 */
export async function refreshAccessToken(token: JWT): Promise<RefreshTokenResult> {
  try {
    // Validar que existe el refresh token
    if (!token.refreshToken) {
      return {
        success: false,
        error: 'invalid_grant',
        errorDescription: ERROR_MESSAGES.NO_REFRESH_TOKEN,
      };
    }

    const config = getRefreshConfig();
    const url = getTokenEndpointURL(config.keycloakIssuer);
    const body = buildRefreshTokenRequestBody(config, token.refreshToken);

    // Log de debug solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log("Refreshing access token...");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorInfo = classifyRefreshError(responseData);

      // Log apropiado según el tipo de error
      if (errorInfo.shouldLog) {
        if (errorInfo.type === 'invalid_client') {
          console.error("CONFIGURATION ERROR - Check Keycloak client credentials:", {
            status: response.status,
            error: responseData
          });
        } else {
          console.warn("Token refresh failed:", {
            status: response.status,
            statusText: response.statusText,
            error: responseData
          });
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.log("Session expired naturally - user needs to re-authenticate");
      }

      return {
        success: false,
        error: errorInfo.type,
        errorDescription: responseData?.error_description,
      };
    }

    // Éxito - construir nuevo token
    if (process.env.NODE_ENV === 'development') {
      console.log("Token refreshed successfully");
    }

    const refreshedToken: JWT = {
      ...token,
      accessToken: responseData.access_token,
      accessTokenExpires: Date.now() + responseData.expires_in * 1000,
      refreshToken: responseData.refresh_token ?? token.refreshToken,
      error: undefined,
    };

    return {
      success: true,
      token: refreshedToken,
    };

  } catch (error) {
    console.error("Network error during token refresh:", error);
    
    return {
      success: false,
      error: 'network_error',
      errorDescription: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Determina si un token necesita ser refrescado
 * Incluye un buffer de tiempo para evitar tokens que expiren durante la petición
 */
export function shouldRefreshToken(token: JWT, bufferSeconds = 60): boolean {
  const expiresAt = token.accessTokenExpires ?? 0;
  const now = Date.now();
  const bufferMs = bufferSeconds * 1000;
  
  return now >= (expiresAt - bufferMs);
}

/**
 * Crea un token de error para forzar re-autenticación
 */
export function createErrorToken(token: JWT): JWT {
  return {
    ...token,
    accessToken: undefined,
    refreshToken: undefined,
    accessTokenExpires: 0,
    error: ERROR_MESSAGES.REFRESH_TOKEN_ERROR,
  };
}