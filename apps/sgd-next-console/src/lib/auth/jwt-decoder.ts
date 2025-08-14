/**
 * Utilidades seguras para decodificación de JWT tokens
 * Maneja la extracción de claims sin validación criptográfica
 */

export interface JWTPayload {
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  club_id?: number | null;
  venue_ids?: number[] | null;
  sport_ids?: number[] | null;
  realm_access?: {
    roles: string[];
  };
  exp?: number;
  iat?: number;
}

/**
 * Decodifica un JWT token de forma segura sin validación criptográfica
 * Solo para extraer claims, NO para validar la autenticidad del token
 */
export function decodeJWTPayload(token: string): JWTPayload | null {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payloadPart = parts[1];
    if (!payloadPart) {
      return null;
    }

    // Decodificar base64url
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    const decodedPayload = Buffer.from(paddedBase64, 'base64').toString('utf8');
    const payload = JSON.parse(decodedPayload) as JWTPayload;

    return payload;
  } catch (error) {
    console.warn('Failed to decode JWT payload:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Extrae roles del payload JWT de forma segura
 */
export function extractRolesFromPayload(payload: JWTPayload | null): string[] {
  if (!payload?.realm_access?.roles) {
    return [];
  }

  if (!Array.isArray(payload.realm_access.roles)) {
    return [];
  }

  // Filtrar solo strings válidos
  return payload.realm_access.roles.filter(
    (role): role is string => typeof role === 'string' && role.length > 0
  );
}

/**
 * Valida que el token no esté expirado
 */
export function isJWTExpired(payload: JWTPayload | null): boolean {
  if (!payload?.exp) {
    return true; // Si no tiene exp, considerarlo expirado
  }

  const now = Math.floor(Date.now() / 1000);
  return now >= payload.exp;
}

/**
 * Extrae información de usuario del payload JWT
 */
export function extractUserInfoFromPayload(payload: JWTPayload | null) {
  if (!payload) {
    return {
      id: null,
      email: null,
      name: null,
      clubId: null,
      venueIds: null,
      sportIds: null,
      roles: [],
    };
  }

  return {
    id: payload.sub || null,
    email: payload.email || null,
    name: payload.name || payload.preferred_username || null,
    clubId: payload.club_id || null,
    venueIds: payload.venue_ids || null,
    sportIds: payload.sport_ids || null,
    roles: extractRolesFromPayload(payload),
  };
}