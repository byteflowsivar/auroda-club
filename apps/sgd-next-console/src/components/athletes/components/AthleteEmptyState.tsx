import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users } from 'lucide-react';
import { hasActiveFilters } from '../utils/athleteUtils';

interface AthleteEmptyStateProps {
  loading: boolean;
  hasAthletes: boolean;
  canCreate: boolean;
  searchQuery: string;
  selectedSport: string;
  selectedVenue: string;
  selectedCategory: string;
  onCreate: () => void;
}

export function AthleteEmptyState({
  loading,
  hasAthletes,
  canCreate,
  searchQuery,
  selectedSport,
  selectedVenue,
  selectedCategory,
  onCreate
}: AthleteEmptyStateProps) {
  const hasFilters = hasActiveFilters(searchQuery, selectedSport, selectedVenue, selectedCategory);

  // Estado de carga
  if (loading && !hasAthletes) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-center py-8">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </TableCell>
      </TableRow>
    );
  }

  // Estado vacío
  if (!hasAthletes) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-center py-8">
          <div className="flex flex-col items-center gap-2">
            <Users className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              {hasFilters ? 'No se encontraron atletas' : 'No hay atletas registrados'}
            </p>
            {canCreate && !hasFilters && (
              <Button onClick={onCreate} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Registrar primer atleta
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return null;
}