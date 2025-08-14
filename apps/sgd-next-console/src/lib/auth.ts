/**
 * Configuración de autenticación NextAuth
 * Este archivo mantiene compatibilidad con el código existente
 * La implementación ha sido refactorizada en módulos separados en /lib/auth/
 */

import { authOptions, validateAuthConfiguration } from './auth/auth-config';

// Re-exportar la configuración principal para mantener compatibilidad
export { authOptions };

// Exportar funciones de utilidad adicionales
export { validateAuthConfiguration };

// Re-exportar tipos importantes (evitar import circular)
export type { JWT } from "next-auth/jwt";
export type { Session, User, Account } from "next-auth";
export type { JWTPayload } from './auth/jwt-decoder';
export type { RefreshTokenResult, RefreshTokenError } from './auth/token-refresh';

/**
 * NOTA DE MIGRACIÓN:
 * 
 * La lógica de autenticación ha sido refactorizada en módulos especializados:
 * 
 * - /lib/auth/auth-config.ts      - Configuración principal de NextAuth
 * - /lib/auth/jwt-handlers.ts     - Manejo de callbacks JWT
 * - /lib/auth/session-handlers.ts - Manejo de callbacks de sesión  
 * - /lib/auth/token-refresh.ts    - Lógica de refresh de tokens
 * - /lib/auth/jwt-decoder.ts      - Decodificación segura de JWT
 * 
 * Para funciones de utilidad de autenticación:
 * - /lib/auth-utils.ts (funciones helper de roles y logout)
 * - /lib/constants.ts (constantes centralizadas)
 * - /types/auth.ts (interfaces TypeScript)
 * 
 * Esta refactorización mejora:
 * ✅ Separación de responsabilidades
 * ✅ Testabilidad de cada módulo
 * ✅ Reutilización de lógica
 * ✅ Mantenibilidad del código
 * ✅ Eliminación de console.log en producción
 * ✅ Validación robusta de JWT
 */