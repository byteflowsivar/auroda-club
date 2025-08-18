import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import type { SportResponse, VenueResponse } from '@/types/api';

interface AthleteTableFiltersProps {
  // Valores de filtros
  searchQuery: string;
  selectedSport: string;
  selectedVenue: string;
  activeFilter: boolean;
  
  // Opciones para selects
  sports: SportResponse[];
  venues: VenueResponse[];
  filtersLoading: boolean;
  
  // Handlers
  onSearchChange: (value: string) => void;
  onSportChange: (value: string) => void;
  onVenueChange: (value: string) => void;
  onActiveFilterChange: (value: boolean) => void;
  onClearFilters: () => void;
}

export function AthleteTableFilters({
  searchQuery,
  selectedSport,
  selectedVenue,
  activeFilter,
  sports,
  venues,
  filtersLoading,
  onSearchChange,
  onSportChange,
  onVenueChange,
  onActiveFilterChange,
  onClearFilters
}: AthleteTableFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Búsqueda */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o documento..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      {/* Filtro por deporte */}
      <Select 
        value={selectedSport} 
        onValueChange={onSportChange} 
        disabled={filtersLoading}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Deporte" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los deportes</SelectItem>
          {sports.map((sport) => (
            <SelectItem key={sport.id} value={sport.id.toString()}>
              {sport.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Filtro por sede */}
      <Select 
        value={selectedVenue} 
        onValueChange={onVenueChange} 
        disabled={filtersLoading}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Sede" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las sedes</SelectItem>
          {venues.map((venue) => (
            <SelectItem key={venue.id} value={venue.id.toString()}>
              {venue.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Filtro por estado */}
      <Select 
        value={activeFilter ? 'true' : 'false'} 
        onValueChange={(value) => onActiveFilterChange(value === 'true')}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Activos</SelectItem>
          <SelectItem value="false">Inactivos</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Botón limpiar */}
      <Button variant="outline" onClick={onClearFilters}>
        <Filter className="h-4 w-4 mr-2" />
        Limpiar
      </Button>
    </div>
  );
}