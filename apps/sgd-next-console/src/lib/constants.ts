// Constantes centralizadas de la aplicación SGD

// Roles del sistema
export const ROLES = {
  ADMIN_GENERAL: "ADMIN_GENERAL",
  ADMIN_CLUB: "ADMIN_CLUB",
  PROFESOR: "PROFESOR",
} as const

// URLs y rutas principales
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/admin/dashboard",
  ATHLETES: "/admin/athletes",
  GUARDIANS: "/admin/guardians",
  CONFIG: "/admin/config",
  AUTH_ERROR: "/auth/error",
  UNAUTHORIZED: "/unauthorized",

  // API Routes
  API: {
    LOGOUT_KEYCLOAK: "/api/auth/logout-keycloak",
    LOGOUT_LOCAL: "/api/auth/logout-local",
    NEXTAUTH: "/api/auth",
  }
} as const

// Configuración de sesión
export const SESSION_CONFIG = {
  MAX_AGE: 1 * 24 * 60 * 60, // 1 día en segundos
  STRATEGY: "jwt" as const,
} as const

// Configuración de cookies
export const COOKIE_CONFIG = {
  MAX_SIZE: 4096, // bytes
  NAMES: {
    SESSION_TOKEN: "next-auth.session-token",
    SECURE_SESSION_TOKEN: "__Secure-next-auth.session-token",
    CSRF_TOKEN: "next-auth.csrf-token",
    SECURE_CSRF_TOKEN: "__Secure-next-auth.csrf-token",
    CALLBACK_URL: "next-auth.callback-url",
    SECURE_CALLBACK_URL: "__Secure-next-auth.callback-url",
  }
} as const

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  REFRESH_TOKEN_ERROR: "RefreshAccessTokenError",
  SESSION_EXPIRED: "Session expired naturally - user needs to re-authenticate",
  INVALID_CLIENT: "CONFIGURATION ERROR - Check Keycloak client credentials",
  SESSION_NOT_ACTIVE: "Session not active",
  NO_REFRESH_TOKEN: "No refresh token available",
} as const

// Configuración de timeouts
export const TIMEOUTS = {
  SEARCH_DEBOUNCE: 300, // ms
  REQUEST_TIMEOUT: 30000, // ms
} as const

// Breakpoints responsive
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
} as const