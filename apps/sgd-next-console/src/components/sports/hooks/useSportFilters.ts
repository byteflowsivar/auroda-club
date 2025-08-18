import { useState, useCallback, useMemo } from 'react';
import type { SportResponse, SportListParams } from '@/types/api';
import { getDefaultFilters } from '../utils/sportUtils';

interface UseSportFiltersReturn {
  // Estados de filtros
  searchTerm: string;
  activeFilter: 'all' | 'active' | 'inactive';
  includeCategories: boolean;

  // Handlers
  handleSearch: (value: string) => void;
  setActiveFilter: (value: 'all' | 'active' | 'inactive') => void;
  setIncludeCategories: (value: boolean) => void;
  handleClearFilters: () => void;

  // Datos filtrados (localmente)
  filteredSports: SportResponse[];

  // Parámetros para API (solo los que afectan la llamada inicial)
  getApiParams: () => SportListParams;
}

export const useSportFilters = (
  initialSports: SportResponse[]
): UseSportFiltersReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [includeCategories, setIncludeCategories] = useState(true);

  // Filtrar deportes localmente
  const filteredSports = useMemo(() => {
    let filtered = initialSports;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(sport => 
        sport.name.toLowerCase().includes(search) ||
        (sport.description && sport.description.toLowerCase().includes(search))
      );
    }

    // Filtro por estado
    if (activeFilter !== 'all') {
      filtered = filtered.filter(sport => 
        activeFilter === 'active' ? sport.active : !sport.active
      );
    }

    return filtered;
  }, [initialSports, searchTerm, activeFilter]);

  // Handlers
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleClearFilters = useCallback(() => {
    const defaults = getDefaultFilters();
    setSearchTerm(defaults.searchTerm);
    setActiveFilter(defaults.activeFilter);
    setIncludeCategories(defaults.includeCategories);
  }, []);

  // Parámetros para API (solo los que afectan la llamada inicial, como includeCategories)
  const getApiParams = useCallback((): SportListParams => ({
    includeCategories
  }), [includeCategories]);

  return {
    searchTerm,
    activeFilter,
    includeCategories,
    handleSearch,
    setActiveFilter,
    setIncludeCategories,
    handleClearFilters,
    filteredSports,
    getApiParams
  };
};