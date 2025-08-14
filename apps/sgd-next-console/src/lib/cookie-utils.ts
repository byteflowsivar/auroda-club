// Utilidades para manejo de cookies centralizadas
import { COOKIE_CONFIG } from './constants';

/**
 * Configuración de cookie mejorada y más flexible
 */
export interface CookieSettings {
  name: string;
  value: string;
  expires: Date;
  path: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
}

/**
 * Opciones para configuración de cookies
 */
export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path?: string;
  maxAge?: number;
  expires?: Date;
}

/**
 * Interface genérica para responses que pueden establecer cookies
 */
export interface ResponseLike {
  cookies: {
    set: (name: string, value: string, options: CookieOptions) => void;
  };
}

/**
 * Genera nombres de cookies chunked de forma configurable
 */
export function generateChunkedCookieNames(
  baseName: string, 
  maxChunks: number = 3
): string[] {
  if (maxChunks <= 0) {
    return [];
  }
  
  return Array.from({ length: maxChunks }, (_, i) => `${baseName}.${i}`);
}

/**
 * Obtiene configuración de entorno para cookies
 */
function getCookieEnvironmentConfig(): {
  isProduction: boolean;
  isSecure: boolean;
} {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    isProduction,
    isSecure: isProduction,
  };
}

/**
 * Genera configuración para limpiar cookies de NextAuth
 */
export function getClearCookieSettings(maxChunks: number = 3): CookieSettings[] {
  const { isSecure } = getCookieEnvironmentConfig();
  
  const baseCookieNames = [
    COOKIE_CONFIG.NAMES.SESSION_TOKEN,
    COOKIE_CONFIG.NAMES.SECURE_SESSION_TOKEN,
    COOKIE_CONFIG.NAMES.CSRF_TOKEN,
    COOKIE_CONFIG.NAMES.SECURE_CSRF_TOKEN,
    COOKIE_CONFIG.NAMES.CALLBACK_URL,
    COOKIE_CONFIG.NAMES.SECURE_CALLBACK_URL,
  ];

  // Generar nombres de cookies chunked para cada cookie base
  const chunkedCookieNames = baseCookieNames.flatMap(baseName => 
    generateChunkedCookieNames(baseName, maxChunks)
  );

  const allCookieNames = [...baseCookieNames, ...chunkedCookieNames];

  return allCookieNames.map(cookieName => ({
    name: cookieName,
    value: '',
    expires: new Date(0), // Fecha muy en el pasado para expirar la cookie
    path: '/',
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax' as const,
  }));
}

/**
 * Aplica configuración de cookies a una respuesta compatible
 */
export function applyCookieSettings(
  response: ResponseLike,
  cookieSettings: CookieSettings[]
): void {
  if (!response?.cookies?.set) {
    console.warn('Response object does not support cookie setting');
    return;
  }

  if (!Array.isArray(cookieSettings)) {
    console.warn('Cookie settings must be an array');
    return;
  }

  cookieSettings.forEach(cookie => {
    try {
      response.cookies.set(cookie.name, cookie.value, {
        expires: cookie.expires,
        path: cookie.path,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
      });
    } catch (error) {
      console.error(`Failed to set cookie ${cookie.name}:`, error);
    }
  });
}

/**
 * Crea una cookie setting individual con valores por defecto
 */
export function createCookieSetting(
  name: string,
  value: string,
  options: Partial<CookieOptions> = {}
): CookieSettings {
  const { isSecure } = getCookieEnvironmentConfig();

  return {
    name,
    value,
    expires: options.expires || new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 días por defecto
    path: options.path || '/',
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? isSecure,
    sameSite: options.sameSite || 'lax',
  };
}

/**
 * Valida que un nombre de cookie sea válido
 */
export function isValidCookieName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }

  // Los nombres de cookies no pueden contener espacios ni caracteres especiales
  const validNameRegex = /^[a-zA-Z0-9_.-]+$/;
  return validNameRegex.test(name);
}

/**
 * Calcula el tamaño aproximado de una cookie en bytes
 */
export function calculateCookieSize(cookieSetting: CookieSettings): number {
  const cookieString = `${cookieSetting.name}=${cookieSetting.value}`;
  return new Blob([cookieString]).size;
}

/**
 * Verifica si una cookie excede el tamaño máximo recomendado
 */
export function isCookieOverLimit(cookieSetting: CookieSettings): boolean {
  const size = calculateCookieSize(cookieSetting);
  return size > COOKIE_CONFIG.MAX_SIZE;
}

/**
 * Limpia todas las cookies de NextAuth de forma batch
 */
export function clearNextAuthCookies(
  response: ResponseLike, 
  maxChunks: number = 5
): boolean {
  try {
    const clearSettings = getClearCookieSettings(maxChunks);
    applyCookieSettings(response, clearSettings);
    return true;
  } catch (error) {
    console.error('Failed to clear NextAuth cookies:', error);
    return false;
  }
}