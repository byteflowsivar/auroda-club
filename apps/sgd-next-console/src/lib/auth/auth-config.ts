import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { ROUTES, SESSION_CONFIG } from '../constants';
import { jwtCallback } from './jwt-handlers';
import { sessionCallback } from './session-handlers';

/**
 * Configuración del proveedor Keycloak
 */
function createKeycloakProvider() {
  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
  const issuer = process.env.KEYCLOAK_ISSUER;

  if (!clientId || !clientSecret || !issuer) {
    throw new Error('Missing required Keycloak environment variables');
  }

  return KeycloakProvider({
    clientId,
    clientSecret,
    issuer,
    profile(profile) {
      return {
        id: profile.sub,
        email: profile.email,
        name: profile.name || profile.preferred_username,
        // Los roles se extraerán del JWT en el callback jwt()
        roles: [],
        clubId: profile.club_id || null,
        venueIds: profile.venue_ids || null,
        sportIds: profile.sport_ids || null,
      };
    },
  });
}

/**
 * Configuración de callbacks de NextAuth
 */
const callbacks = {
  jwt: jwtCallback,
  session: sessionCallback,
  async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
    // Si el usuario se autentica exitosamente, redirigir al dashboard
    if (url === baseUrl || url === baseUrl + ROUTES.HOME) {
      return baseUrl + ROUTES.DASHBOARD;
    }
    
    // Si la URL está en el mismo dominio, permitir la redirección
    if (url.startsWith(baseUrl)) {
      return url;
    }
    
    // Para URLs externas, redirigir al dashboard por seguridad
    return baseUrl + ROUTES.DASHBOARD;
  },
};

/**
 * Configuración de páginas personalizadas
 */
const pages = {
  // No definir signIn para usar Keycloak hosted login directamente
  error: ROUTES.AUTH_ERROR,
};

/**
 * Configuración de sesión
 */
const session = {
  strategy: SESSION_CONFIG.STRATEGY,
  maxAge: SESSION_CONFIG.MAX_AGE,
};

/**
 * Configuración de cookies optimizada
 */
const cookies = {
  sessionToken: {
    name: process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token',
    options: {
      httpOnly: true,
      sameSite: 'lax' as const,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      // Configurar dominio solo en producción
      domain: process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_DOMAIN 
        : undefined,
    }
  }
};

/**
 * Configuración principal de NextAuth
 */
export const authOptions: NextAuthOptions = {
  providers: [createKeycloakProvider()],
  callbacks,
  pages,
  session,
  cookies,
  debug: process.env.NODE_ENV === "development",
};

/**
 * Validación de configuración de entorno
 */
export function validateAuthConfiguration(): {
  isValid: boolean;
  missingVars: string[];
} {
  const requiredVars = [
    'KEYCLOAK_CLIENT_ID',
    'KEYCLOAK_CLIENT_SECRET', 
    'KEYCLOAK_ISSUER',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

/**
 * Información de debug de la configuración (solo desarrollo)
 */
export function getAuthConfigDebugInfo() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const validation = validateAuthConfiguration();
  
  return {
    isConfigValid: validation.isValid,
    missingEnvVars: validation.missingVars,
    keycloakIssuer: process.env.KEYCLOAK_ISSUER,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  };
}