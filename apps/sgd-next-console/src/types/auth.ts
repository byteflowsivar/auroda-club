// Tipos y interfaces relacionadas con autenticación y sesiones

export interface SGDUser {
  id: string
  email?: string | null
  name?: string | null
  image?: string | null
  roles: string[]
  clubId?: string | null
  venueIds?: string[] | null
  sportIds?: string[] | null
}

export interface SGDSession {
  user: SGDUser
  id_token?: string
}

export interface SGDJWT {
  id: string
  roles: string[]
  clubId?: string | null
  venueIds?: string[] | null
  sportIds?: string[] | null
  accessToken?: string
  refreshToken?: string
  accessTokenExpires?: number
  idToken?: string
  error?: string
}

// Extensiones de tipos de NextAuth
declare module "next-auth" {
  interface Session {
    user: SGDUser
    id_token?: string
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
    idToken?: string
    error?: string
  }
}

export type Role = typeof ROLES[keyof typeof ROLES]

export const ROLES = {
  ADMIN_GENERAL: "ADMIN_GENERAL",
  ADMIN_CLUB: "ADMIN_CLUB",
  PROFESOR: "PROFESOR",
} as const

// Tipos para componentes de autenticación
export interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallback?: React.ReactNode
}

export interface LoginButtonProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}