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

interface GuardianTableFiltersProps {
  // Valores de filtros
  searchTerm: string;
  activeFilter: 'all' | 'active' | 'inactive';
  
  // Handlers
  onSearchChange: (value: string) => void;
  onActiveFilterChange: (value: 'all' | 'active' | 'inactive') => void;
  onClearFilters: () => void;
}

export function GuardianTableFilters({
  searchTerm,
  activeFilter,
  onSearchChange,
  onActiveFilterChange,
  onClearFilters
}: GuardianTableFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Búsqueda */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      {/* Filtro por estado */}
      <Select value={activeFilter} onValueChange={onActiveFilterChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="inactive">Inactivos</SelectItem>
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