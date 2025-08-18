/**
 * Utilidades puras para manejo de datos de deportes
 * Funciones sin efectos secundarios, fáciles de testear
 */

/**
 * Formatea fecha
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-SV', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Verifica si hay filtros activos (diferentes al estado por defecto)
 */
export const hasActiveFilters = (
  searchTerm: string,
  activeFilter: string,
  includeCategories: boolean
): boolean => {
  return !!(
    searchTerm.trim() ||
    activeFilter !== 'all' ||
    !includeCategories // Assuming default is true, so if false, it's an active filter
  );
};

/**
 * Resetea filtros a valores por defecto
 */
export const getDefaultFilters = () => ({
  searchTerm: '',
  activeFilter: 'all' as 'all' | 'active' | 'inactive',
  includeCategories: true,
});