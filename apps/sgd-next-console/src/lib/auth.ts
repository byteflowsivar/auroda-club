import { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import KeycloakProvider from "next-auth/providers/keycloak"
import { ROUTES, SESSION_CONFIG } from './constants'

// Los tipos están definidos en /types/auth.ts

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
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
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Guardar el token de acceso y refresh token cuando se inicia sesión
      if (account && user) {
        // Decodificar el ID token para obtener los roles
        let roles: string[] = []
        if (account.access_token) {
          try {
            // Decodificar el JWT sin verificar (solo para extraer claims)
            const base64Payload = account.access_token.split('.')[1]
            const decodedPayload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())
            console.log('Decoded ID Token:', decodedPayload)
            roles = decodedPayload.realm_access?.roles || []
          } catch (error) {
            console.error('Error decoding ID token:', error)
            roles = []
          }
        }

        return {
          ...token,
          id: user.id,
          roles: roles,
          clubId: user.clubId,
          venueIds: user.venueIds,
          sportIds: user.sportIds,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
          idToken: account.id_token, // Guardar el ID token para logout
        }
      }

      // Retornar token previo si el token de acceso no ha expirado
      if (Date.now() < (token.accessTokenExpires ?? 0)) {
        return token
      }

      // Token de acceso ha expirado, intentar refrescarlo
      const refreshedToken = await refreshAccessToken(token)

      // Si el refresh falló, limpiar la sesión
      if (refreshedToken.error === "RefreshAccessTokenError") {
        console.log("Token refresh failed - initiating re-authentication flow")
        // Retornar token vacío para forzar re-autenticación
        return {
          ...token,
          accessToken: undefined,
          refreshToken: undefined,
          accessTokenExpires: 0,
          error: "RefreshAccessTokenError",
        }
      }

      return refreshedToken
    },
    async session({ session, token }) {
      // Si el token tiene error de refresh, no devolver sesión válida
      if (token.error === "RefreshAccessTokenError") {
        console.log("Session callback detected invalid token - session will be invalidated")
        throw new Error("Session invalidated due to refresh token failure")
      }

      // Validar que el token tenga los datos mínimos necesarios
      if (!token.accessToken || !token.id) {
        console.log("Session callback detected incomplete token - session will be invalidated")
        throw new Error("Session invalidated due to incomplete token")
      }

      // Enviar propiedades al cliente (sin id_token para reducir tamaño de cookie)
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          roles: token.roles || [],
          clubId: token.clubId,
          venueIds: token.venueIds,
          sportIds: token.sportIds,
        },
        accessToken: token.accessToken, // Necesario para server-side API routes
        // NO incluir id_token en la sesión del cliente para evitar cookies grandes
      }
    },
    async redirect({ url, baseUrl }) {
      // Si el usuario se autentica exitosamente, redirigir al dashboard
      if (url === baseUrl || url === baseUrl + ROUTES.HOME) {
        return baseUrl + ROUTES.DASHBOARD
      }
      // Si la URL está en el mismo dominio, permitir la redirección
      if (url.startsWith(baseUrl)) {
        return url
      }
      // Para URLs externas, redirigir al dashboard por seguridad
      return baseUrl + ROUTES.DASHBOARD
    },
  },
  pages: {
    // No definir signIn para usar Keycloak hosted login directamente
    error: ROUTES.AUTH_ERROR, // Página de error
  },
  session: {
    strategy: SESSION_CONFIG.STRATEGY,
    maxAge: SESSION_CONFIG.MAX_AGE,
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Permitir chunking de cookies grandes
        domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
}

/**
 * Función para refrescar el token de acceso usando el refresh token
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    // Validar que existe el refresh token
    if (!token.refreshToken) {
      console.error("No refresh token available")
      return {
        ...token,
        error: "RefreshAccessTokenError",
      }
    }

    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`

    console.log("Refreshing access token...")
    console.log("URL:", url)
    console.log("Client ID:", process.env.KEYCLOAK_CLIENT_ID)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      // Distinguir entre errores normales y problemas de configuración
      if (refreshedTokens.error === 'invalid_grant' &&
        refreshedTokens.error_description?.includes('Session not active')) {
        console.log("Session expired naturally - user needs to re-authenticate")
      } else if (refreshedTokens.error === 'invalid_client') {
        console.error("CONFIGURATION ERROR - Check Keycloak client credentials:", {
          status: response.status,
          error: refreshedTokens
        })
      } else {
        console.warn("Token refresh failed:", {
          status: response.status,
          statusText: response.statusText,
          error: refreshedTokens
        })
      }
      throw refreshedTokens
    }

    console.log("Token refreshed successfully")

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Usar nuevo refresh token si existe
      error: undefined, // Limpiar error previo si existía
    }
  } catch (error: unknown) {
    // No mostrar como error si es expiración natural de sesión
    const errorObj = error as { error?: string; error_description?: string }
    if (errorObj?.error === 'invalid_grant' && errorObj?.error_description?.includes('Session not active')) {
      console.log("Natural session expiration - redirecting to login")
    } else {
      console.error("Error refreshing access token:", error)
    }

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

// Las funciones helper y constantes están ahora en:
// - /lib/auth-utils.ts (funciones de utilidad)
// - /lib/constants.ts (constantes y tipos)
// - /types/auth.ts (interfaces y tipos TypeScript)