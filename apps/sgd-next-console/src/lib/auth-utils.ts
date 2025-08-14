// Utilidades de autenticación extraídas de auth.ts
import { ROLES } from './constants';

/**
 * Interface para usuario con roles
 */
interface UserWithRoles {
  roles: readonly string[];
  name?: string | null;
  id?: string | null;
}

/**
 * Función helper para verificar si el usuario tiene alguno de los roles especificados
 */
export function hasAnyRole(
  user: UserWithRoles | null, 
  allowedRoles: readonly string[]
): boolean {
  if (!user?.roles?.length || !allowedRoles.length) {
    return false;
  }
  return allowedRoles.some(role => user.roles.includes(role));
}

/**
 * Función helper para verificar si el usuario tiene un rol específico
 */
export function hasRole(
  user: UserWithRoles | null, 
  role: string
): boolean {
  if (!user?.roles?.length || !role.trim()) {
    return false;
  }
  return user.roles.includes(role);
}

/**
 * Función helper para verificar roles usando arrays legacy (compatibilidad)
 */
export function hasAnyRoleLegacy(userRoles: string[], allowedRoles: string[]): boolean {
  if (!userRoles?.length || !allowedRoles?.length) {
    return false;
  }
  return allowedRoles.some(role => userRoles.includes(role));
}

/**
 * Función helper para obtener el rol principal de un usuario (para display)
 */
export function getPrimaryRole(user: UserWithRoles | null): string {
  if (!user?.roles?.length) {
    return "Usuario";
  }

  // Orden de precedencia de roles (más específico primero)
  const roleHierarchy = [
    { role: ROLES.ADMIN_GENERAL, display: "Admin General" },
    { role: ROLES.ADMIN_CLUB, display: "Admin Club" },
    { role: ROLES.PROFESOR, display: "Profesor" },
  ];

  for (const { role, display } of roleHierarchy) {
    if (user.roles.includes(role)) {
      return display;
    }
  }

  return "Usuario";
}

/**
 * Función helper para obtener el rol principal usando array legacy (compatibilidad)
 */
export function getPrimaryRoleLegacy(roles: string[]): string {
  return getPrimaryRole({ roles });
}

/**
 * Función helper para generar iniciales del nombre para avatar fallback
 * Valida input y maneja casos edge
 */
export function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') {
    return 'U'; // Default para Usuario
  }

  const cleanName = name.trim();
  if (!cleanName) {
    return 'U';
  }

  const words = cleanName
    .split(/\s+/) // Dividir por cualquier cantidad de espacios
    .filter(word => word.length > 0)
    .slice(0, 3); // Máximo 3 palabras

  if (words.length === 0) {
    return 'U';
  }

  // Tomar primera letra de cada palabra, máximo 2
  return words
    .map(word => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

/**
 * Verifica si estamos en el cliente (browser)
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.location !== 'undefined';
}

/**
 * Función helper para logout completo (NextAuth + Keycloak)
 * Incluye validación de entorno y manejo de errores
 */
export function signOutCompletely(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isBrowser()) {
      console.warn('signOutCompletely called on server-side, ignoring');
      resolve(false);
      return;
    }

    try {
      // Redirigir directamente al endpoint que manejará limpieza de cookies y logout de Keycloak
      window.location.href = '/api/auth/logout-keycloak';
      resolve(true);
    } catch (error) {
      console.error('Error during logout redirect:', error);
      resolve(false);
    }
  });
}

/**
 * Función helper para logout local únicamente (sin Keycloak)
 * Útil cuando hay problemas de conectividad con Keycloak
 */
export function signOutLocalOnly(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isBrowser()) {
      console.warn('signOutLocalOnly called on server-side, ignoring');
      resolve(false);
      return;
    }

    try {
      // Redirigir al endpoint de logout local únicamente
      window.location.href = '/api/auth/logout-local';
      resolve(true);
    } catch (error) {
      console.error('Error during local logout redirect:', error);
      resolve(false);
    }
  });
}

/**
 * Función helper avanzada para logout con opciones
 */
interface LogoutOptions {
  forceLocal?: boolean;
  redirectTo?: string;
  timeout?: number;
}

export async function signOut(options: LogoutOptions = {}): Promise<boolean> {
  const { forceLocal = false, redirectTo, timeout = 5000 } = options;

  if (!isBrowser()) {
    return false;
  }

  try {
    const baseUrl = forceLocal ? '/api/auth/logout-local' : '/api/auth/logout-keycloak';
    const url = redirectTo ? `${baseUrl}?redirectTo=${encodeURIComponent(redirectTo)}` : baseUrl;

    // Timeout para evitar que el logout se quede colgado
    const timeoutPromise = new Promise<boolean>((_, reject) => {
      setTimeout(() => reject(new Error('Logout timeout')), timeout);
    });

    const logoutPromise = new Promise<boolean>((resolve) => {
      window.location.href = url;
      resolve(true);
    });

    return await Promise.race([logoutPromise, timeoutPromise]);
  } catch (error) {
    console.error('Error during advanced logout:', error);
    
    // Fallback a logout local si el logout completo falla
    if (!forceLocal) {
      console.log('Falling back to local logout');
      return signOutLocalOnly();
    }
    
    return false;
  }
}

/**
 * Exportar la interface para uso externo
 */
export type { UserWithRoles, LogoutOptions };