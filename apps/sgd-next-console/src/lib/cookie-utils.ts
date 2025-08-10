// Utilidades para manejo de cookies centralizadas
import { COOKIE_CONFIG } from './constants'

export interface CookieSetting {
  name: string
  value: string
  expires: Date
  path: string
  httpOnly: boolean
  secure: boolean
  sameSite: 'lax' | 'strict' | 'none'
}

/**
 * Genera configuración para limpiar cookies de NextAuth
 */
export function getClearCookieSettings(): CookieSetting[] {
  const cookieNames = [
    COOKIE_CONFIG.NAMES.SESSION_TOKEN,
    COOKIE_CONFIG.NAMES.SECURE_SESSION_TOKEN,
    COOKIE_CONFIG.NAMES.CSRF_TOKEN,
    COOKIE_CONFIG.NAMES.SECURE_CSRF_TOKEN,
    COOKIE_CONFIG.NAMES.CALLBACK_URL,
    COOKIE_CONFIG.NAMES.SECURE_CALLBACK_URL,
    // Cookies chunked
    `${COOKIE_CONFIG.NAMES.SESSION_TOKEN}.0`,
    `${COOKIE_CONFIG.NAMES.SESSION_TOKEN}.1`,
    `${COOKIE_CONFIG.NAMES.SESSION_TOKEN}.2`,
    `${COOKIE_CONFIG.NAMES.SECURE_SESSION_TOKEN}.0`,
    `${COOKIE_CONFIG.NAMES.SECURE_SESSION_TOKEN}.1`,
    `${COOKIE_CONFIG.NAMES.SECURE_SESSION_TOKEN}.2`,
  ]

  return cookieNames.map(cookieName => ({
    name: cookieName,
    value: '',
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  }))
}

/**
 * Aplica configuración de cookies a una respuesta NextResponse
 */
export function applyCookieSettings(
  response: { cookies: { set: (name: string, value: string, options: {
    expires?: Date
    path?: string
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'lax' | 'strict' | 'none'
  }) => void } },
  cookieSettings: CookieSetting[]
): void {
  cookieSettings.forEach(cookie => {
    response.cookies.set(cookie.name, cookie.value, {
      expires: cookie.expires,
      path: cookie.path,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
    })
  })
}