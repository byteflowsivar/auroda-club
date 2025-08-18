/**
 * Single-tenant configuration for SGD Frontend
 * 
 * Esta configuración define los parámetros específicos del club
 * para esta instancia de la aplicación.
 */

export const SINGLE_TENANT_CONFIG = {
  /** ID del club que maneja esta instancia */
  clubId: Number(process.env.CLUB_ID) || 1,
  
  /** Nombre del club para mostrar en la UI */
  clubName: process.env.CLUB_NAME || 'Club Deportivo',
  
  /** URL del logo del club (opcional) */
  clubLogo: process.env.CLUB_LOGO_URL || null,

} as const;

/**
 * Validación de configuración requerida
 */
export function validateSingleTenantConfig() {
  if (!SINGLE_TENANT_CONFIG.clubId || SINGLE_TENANT_CONFIG.clubId <= 0) {
    throw new Error(
      'CLUB_ID is required and must be a positive number. Check your .env configuration.'
    );
  }
  
  if (!SINGLE_TENANT_CONFIG.clubName?.trim()) {
    console.warn('CLUB_NAME not provided, using default name');
  }
}

/**
 * Utilidades para trabajar con el club actual
 */
export const ClubUtils = {
  /** Obtiene la información básica del club actual */
  getCurrentClub() {
    return {
      id: SINGLE_TENANT_CONFIG.clubId,
      name: SINGLE_TENANT_CONFIG.clubName,
      logo: SINGLE_TENANT_CONFIG.clubLogo
    };
  },

  /** Verifica si un clubId corresponde al club actual */
  isCurrentClub(clubId: number): boolean {
    return clubId === SINGLE_TENANT_CONFIG.clubId;
  },

  /** Obtiene el clubId para requests a la API */
  getClubIdForAPI(): number {
    return SINGLE_TENANT_CONFIG.clubId;
  },
};

// Validar configuración al importar el módulo
if (typeof window === 'undefined') {
  // Solo validar en server-side para evitar errores en build
  try {
    validateSingleTenantConfig();
  } catch (error) {
    console.error('Single-tenant configuration error:', error);
  }
}