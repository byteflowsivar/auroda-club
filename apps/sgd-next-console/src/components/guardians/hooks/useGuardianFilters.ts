import { useState, useCallback } from 'react';
import { getDefaultFilters } from '../utils/guardianUtils';
import type { GuardianListParams } from '@/types/api';

interface UseGuardianFiltersReturn {
  // Estados de filtros
  searchTerm: string;
  activeFilter: 'all' | 'active' | 'inactive';
  
  // Handlers
  handleSearch: (value: string) => void;
  setActiveFilter: (value: 'all' | 'active' | 'inactive') => void;
  handleClearFilters: () => void;
  
  // Params para API
  getApiParams: () => Partial<GuardianListParams>;
}

export const useGuardianFilters = (
  initialFilters: Partial<GuardianListParams> = {}
): UseGuardianFiltersReturn => {
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>(
    initialFilters.active === undefined ? 'all' :
    initialFilters.active ? 'active' : 'inactive'
  );

  // Handler de búsqueda memoizado
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Handler para limpiar filtros
  const handleClearFilters = useCallback(() => {
    const defaults = getDefaultFilters();
    setSearchTerm(defaults.searchTerm);
    setActiveFilter(defaults.activeFilter);
  }, []);

  // Generar parámetros para API
  const getApiParams = useCallback((): Partial<GuardianListParams> => ({
    search: searchTerm || undefined,
    active: activeFilter === 'all' ? undefined : activeFilter === 'active'
  }), [searchTerm, activeFilter]);

  return {
    // Estados
    searchTerm,
    activeFilter,
    
    // Handlers
    handleSearch,
    setActiveFilter,
    handleClearFilters,
    
    // API params
    getApiParams
  };
};