import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { isTokenValid } from './jwt-handlers';

/**
 * Maneja la creación de la sesión del usuario a partir del JWT
 */
export async function sessionCallback({
  session,
  token
}: {
  session: Session;
  token: JWT;
}): Promise<Session> {
  // Validar que el token es válido antes de crear la sesión
  if (!isTokenValid(token)) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Session callback detected invalid token - session will be invalidated");
    }
    
    // Lanzar error para forzar invalidación de la sesión
    throw new Error("Session invalidated due to invalid or expired token");
  }

  // Crear sesión enriquecida con datos del usuario
  const enrichedSession: Session = {
    ...session,
    user: {
      ...session.user,
      id: token.id as string,
      roles: (token.roles as string[]) || [],
      clubId: token.clubId as number | null,
      venueIds: token.venueIds as number[] | null,
      sportIds: token.sportIds as number[] | null,
    },
    accessToken: token.accessToken as string,
    // NO incluir idToken para reducir tamaño de cookie
  } as Session;

  return enrichedSession;
}

/**
 * Valida que una sesión tiene los datos mínimos necesarios
 */
export function isSessionValid(session: Session): boolean {
  return !!(
    session.user?.id &&
    session.accessToken &&
    Array.isArray(session.user.roles)
  );
}

/**
 * Extrae información de debug de la sesión (solo desarrollo)
 */
export function getSessionDebugInfo(session: Session) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return {
    hasAccessToken: !!session.accessToken,
    userId: session.user?.id,
    userEmail: session.user?.email,
    userRoles: session.user?.roles,
    userClubId: session.user?.clubId,
    isValid: isSessionValid(session),
  };
}