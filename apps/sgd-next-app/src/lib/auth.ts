import { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import KeycloakProvider from "next-auth/providers/keycloak"

// Extender los tipos de NextAuth para incluir nuestros campos personalizados
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      roles: string[]
      clubId?: string | null
      venueIds?: string[] | null
      sportIds?: string[] | null
    }
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    roles: string[]
    clubId?: string | null
    venueIds?: string[] | null
    sportIds?: string[] | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    roles: string[]
    clubId?: string | null
    venueIds?: string[] | null
    sportIds?: string[] | null
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name || profile.preferred_username,
          roles: profile.realm_access?.roles || [],
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
        return {
          ...token,
          id: user.id,
          roles: user.roles,
          clubId: user.clubId,
          venueIds: user.venueIds,
          sportIds: user.sportIds,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
        }
      }

      // Retornar token previo si el token de acceso no ha expirado
      if (Date.now() < (token.accessTokenExpires ?? 0)) {
        return token
      }

      // Token de acceso ha expirado, intentar refrescarlo
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      // Enviar propiedades al cliente
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          roles: token.roles,
          clubId: token.clubId,
          venueIds: token.venueIds,
          sportIds: token.sportIds,
        },
      }
    },
  },
  pages: {
    // No definir signIn para usar Keycloak hosted login directamente
    error: "/auth/error", // Página de error
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  debug: process.env.NODE_ENV === "development",
}

/**
 * Función para refrescar el token de acceso usando el refresh token
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Usar nuevo refresh token si existe
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

/**
 * Función helper para verificar si el usuario tiene alguno de los roles especificados
 */
export function hasAnyRole(userRoles: string[], allowedRoles: string[]): boolean {
  return allowedRoles.some(role => userRoles.includes(role))
}

/**
 * Función helper para verificar si el usuario tiene un rol específico
 */
export function hasRole(userRoles: string[], role: string): boolean {
  return userRoles.includes(role)
}

/**
 * Tipos de roles del sistema
 */
export const ROLES = {
  ADMIN_GENERAL: "ADMIN_GENERAL",
  ADMIN_CLUB: "ADMIN_CLUB", 
  PROFESOR: "PROFESOR",
} as const

export type Role = typeof ROLES[keyof typeof ROLES]