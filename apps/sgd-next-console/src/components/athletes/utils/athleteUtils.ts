/**
 * Utilidades puras para manejo de datos de atletas
 * Funciones sin efectos secundarios, fáciles de testear
 */

/**
 * Calcula la edad en años desde fecha de nacimiento
 */
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Genera las iniciales del nombre completo
 */
export const getNameInitials = (fullName: string): string => {
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
};

/**
 * Formatea el número de tutores con pluralización
 */
export const formatGuardiansCount = (count: number): string => {
  return `${count} tutor${count !== 1 ? 'es' : ''}`;
};

/**
 * Verifica si hay filtros activos (diferentes al estado por defecto)
 */
export const hasActiveFilters = (
  searchQuery: string,
  selectedSport: string,
  selectedVenue: string,
  selectedCategory: string
): boolean => {
  return !!(
    searchQuery.trim() ||
    selectedSport !== 'all' ||
    selectedVenue !== 'all' ||
    selectedCategory !== 'all'
  );
};

/**
 * Resetea filtros a valores por defecto
 */
export const getDefaultFilters = () => ({
  searchQuery: '',
  selectedSport: 'all',
  selectedVenue: 'all',
  selectedCategory: 'all',
  activeFilter: true
});