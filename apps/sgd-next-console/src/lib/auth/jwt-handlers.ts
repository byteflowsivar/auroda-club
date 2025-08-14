import { JWT } from "next-auth/jwt";
import { Account, User } from "next-auth";
import { decodeJWTPayload, extractUserInfoFromPayload } from './jwt-decoder';
import { refreshAccessToken, shouldRefreshToken, createErrorToken } from './token-refresh';

/**
 * Maneja la creación inicial del JWT cuando el usuario se autentica
 */
export async function handleInitialToken(
  token: JWT,
  user: User,
  account: Account
): Promise<JWT> {
  // Extraer roles del access token
  const payload = decodeJWTPayload(account.access_token || '');
  const userInfo = extractUserInfoFromPayload(payload);

  // Log de debug solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('Creating initial JWT token for user:', userInfo.id);
    console.log('User roles:', userInfo.roles);
  }

  return {
    ...token,
    id: user.id || userInfo.id || 'unknown',
    roles: userInfo.roles,
    clubId: userInfo.clubId,
    venueIds: userInfo.venueIds,
    sportIds: userInfo.sportIds,
    accessToken: account.access_token,
    refreshToken: account.refresh_token,
    accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
    idToken: account.id_token, // Para logout de Keycloak
  } as JWT;
}

/**
 * Maneja la validación y refresh de tokens existentes
 */
export async function handleTokenRefresh(token: JWT): Promise<JWT> {
  // Si el token no necesita refresh, devolverlo tal como está
  if (!shouldRefreshToken(token)) {
    return token;
  }

  // Intentar refrescar el token
  const refreshResult = await refreshAccessToken(token);

  if (!refreshResult.success) {
    // Log apropiado según el contexto
    if (refreshResult.error === 'invalid_grant') {
      if (process.env.NODE_ENV === 'development') {
        console.log("Token refresh failed - initiating re-authentication flow");
      }
    } else {
      console.error("Token refresh failed with error:", refreshResult.error);
    }

    // Retornar token de error para forzar re-autenticación
    return createErrorToken(token);
  }

  return refreshResult.token!;
}

/**
 * Callback principal de JWT que maneja tanto creación como refresh
 */
export async function jwtCallback({
  token,
  user,
  account
}: {
  token: JWT;
  user?: User;
  account?: Account | null;
}): Promise<JWT> {
  // Caso 1: Usuario acaba de autenticarse (account y user están disponibles)
  if (account && user) {
    return handleInitialToken(token, user, account);
  }

  // Caso 2: Token existente que puede necesitar refresh
  return handleTokenRefresh(token);
}

/**
 * Valida que un token tiene los datos mínimos necesarios
 */
export function isTokenValid(token: JWT): boolean {
  return !!(token.accessToken && token.id && !token.error);
}

/**
 * Extrae información de debug del token (solo desarrollo)
 */
export function getTokenDebugInfo(token: JWT) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return {
    hasAccessToken: !!token.accessToken,
    hasRefreshToken: !!token.refreshToken,
    hasError: !!token.error,
    expiresAt: token.accessTokenExpires ? new Date(token.accessTokenExpires) : null,
    userId: token.id,
    roles: token.roles,
  };
}