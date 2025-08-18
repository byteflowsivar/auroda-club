import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import { getDefaultFilters } from '../utils/athleteUtils';
import type { 
  AthleteListParams,
  SportResponse,
  VenueResponse,
  CategoryResponse
} from '@/types/api';

interface FilterOptions {
  sports: SportResponse[];
  venues: VenueResponse[];
  categories: CategoryResponse[];
}

interface UseAthleteFiltersReturn {
  // Estados de filtros
  searchQuery: string;
  selectedSport: string;
  selectedVenue: string;
  selectedCategory: string;
  activeFilter: boolean;
  
  // Opciones para selects
  filterOptions: FilterOptions;
  filtersLoading: boolean;
  
  // Handlers
  handleSearch: (value: string) => void;
  setSelectedSport: (value: string) => void;
  setSelectedVenue: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setActiveFilter: (value: boolean) => void;
  handleClearFilters: () => void;
  
  // Params para API
  getApiParams: () => Partial<AthleteListParams>;
}

export const useAthleteFilters = (
  initialFilters: Partial<AthleteListParams> = {}
): UseAthleteFiltersReturn => {
  const { showError } = useErrorHandler();
  
  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [selectedSport, setSelectedSport] = useState<string>(
    initialFilters.sportId?.toString() || 'all'
  );
  const [selectedVenue, setSelectedVenue] = useState<string>(
    initialFilters.venueId?.toString() || 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialFilters.categoryId?.toString() || 'all'
  );
  const [activeFilter, setActiveFilter] = useState<boolean>(
    initialFilters.active ?? true
  );

  // Estados para opciones de filtros
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sports: [],
    venues: [],
    categories: []
  });
  const [filtersLoading, setFiltersLoading] = useState(true);

  // Cargar opciones de filtros
  const loadFilterOptions = async () => {
    try {
      setFiltersLoading(true);
      const [sportsData, venuesData, categoriesData] = await Promise.all([
        apiClient.getSports({ includeCategories: false }),
        apiClient.getVenues(),
        apiClient.getCategories({})
      ]);
      
      setFilterOptions({
        sports: sportsData,
        venues: venuesData,
        categories: categoriesData
      });
    } catch (error) {
      console.error('Error loading filter options:', error);
      showError('Error al cargar opciones de filtro');
    } finally {
      setFiltersLoading(false);
    }
  };

  // Efecto para cargar opciones al montar
  useEffect(() => {
    loadFilterOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler de búsqueda memoizado
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Handler para limpiar filtros
  const handleClearFilters = useCallback(() => {
    const defaults = getDefaultFilters();
    setSearchQuery(defaults.searchQuery);
    setSelectedSport(defaults.selectedSport);
    setSelectedVenue(defaults.selectedVenue);
    setSelectedCategory(defaults.selectedCategory);
    setActiveFilter(defaults.activeFilter);
  }, []);

  // Generar parámetros para API
  const getApiParams = useCallback((): Partial<AthleteListParams> => ({
    search: searchQuery || undefined,
    sportId: selectedSport !== 'all' ? Number(selectedSport) : undefined,
    venueId: selectedVenue !== 'all' ? Number(selectedVenue) : undefined,
    categoryId: selectedCategory !== 'all' ? Number(selectedCategory) : undefined,
    active: activeFilter
  }), [searchQuery, selectedSport, selectedVenue, selectedCategory, activeFilter]);

  return {
    // Estados
    searchQuery,
    selectedSport,
    selectedVenue,
    selectedCategory,
    activeFilter,
    
    // Opciones
    filterOptions,
    filtersLoading,
    
    // Handlers
    handleSearch,
    setSelectedSport,
    setSelectedVenue,
    setSelectedCategory,
    setActiveFilter,
    handleClearFilters,
    
    // API params
    getApiParams
  };
};