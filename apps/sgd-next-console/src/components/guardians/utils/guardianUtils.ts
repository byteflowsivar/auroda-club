/**
 * Utilidades puras para manejo de datos de tutores
 * Funciones sin efectos secundarios, fáciles de testear
 */

/**
 * Genera las iniciales del nombre completo
 */
export const getNameInitials = (fullName: string): string => {
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
};

/**
 * Formatea el número de atletas con pluralización
 */
export const formatAthletesCount = (count: number): string => {
  return `${count} atleta${count !== 1 ? 's' : ''}`;
};

/**
 * Verifica si hay filtros activos (diferentes al estado por defecto)
 */
export const hasActiveFilters = (
  searchTerm: string,
  activeFilter: string
): boolean => {
  return !!(
    searchTerm.trim() ||
    activeFilter !== 'all'
  );
};

/**
 * Resetea filtros a valores por defecto
 */
export const getDefaultFilters = () => ({
  searchTerm: '',
  activeFilter: 'all' as 'all' | 'active' | 'inactive'
});

/**
 * Formatea información de contacto del tutor
 */
export const formatContactInfo = (email?: string, phone?: string): string => {
  if (email && phone) return email;
  if (email) return email;
  if (phone) return phone;
  return 'Sin contacto';
};