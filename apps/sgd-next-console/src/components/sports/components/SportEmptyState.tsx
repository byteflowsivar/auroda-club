import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trophy } from 'lucide-react';
import { hasActiveFilters } from '../utils/sportUtils'; // Assuming sportUtils.ts is created

interface SportEmptyStateProps {
  loading: boolean;
  hasSports: boolean;
  canCreate: boolean;
  searchTerm: string;
  activeFilter: 'all' | 'active' | 'inactive';
  includeCategories: boolean;
  selectionMode: boolean;
  onCreate: () => void;
}

export function SportEmptyState({
  loading,
  hasSports,
  canCreate,
  searchTerm,
  activeFilter,
  includeCategories,
  selectionMode,
  onCreate
}: SportEmptyStateProps) {
  const hasFilters = hasActiveFilters(searchTerm, activeFilter, includeCategories);

  // Estado de carga
  if (loading && !hasSports) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8">
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
  if (!hasSports) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8">
          <div className="flex flex-col items-center gap-2">
            <Trophy className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              {hasFilters ? 'No se encontraron deportes' : 'No hay deportes registrados'}
            </p>
            {!selectionMode && canCreate && !hasFilters && (
              <Button onClick={onCreate} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Crear primer deporte
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return null;
}