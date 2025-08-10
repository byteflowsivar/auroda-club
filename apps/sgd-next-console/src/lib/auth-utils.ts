// Utilidades de autenticación extraídas de auth.ts
import { ROLES } from './constants'

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
 * Función helper para obtener el rol principal de un usuario (para display)
 */
export function getPrimaryRole(roles: string[]): string {
  if (roles.includes(ROLES.ADMIN_GENERAL)) return "Admin General"
  if (roles.includes(ROLES.ADMIN_CLUB)) return "Admin Club"  
  if (roles.includes(ROLES.PROFESOR)) return "Profesor"
  return "Usuario"
}

/**
 * Función helper para generar iniciales del nombre para avatar fallback
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Función helper para logout completo (NextAuth + Keycloak)
 */
export function signOutCompletely(): void {
  if (typeof window !== 'undefined') {
    // Redirigir directamente al endpoint que manejará limpieza de cookies y logout de Keycloak
    window.location.href = '/api/auth/logout-keycloak'
  }
}

/**
 * Función helper para logout local únicamente (sin Keycloak)
 * Útil cuando hay problemas de conectividad con Keycloak
 */
export function signOutLocalOnly(): void {
  if (typeof window !== 'undefined') {
    // Redirigir al endpoint de logout local únicamente
    window.location.href = '/api/auth/logout-local'
  }
}