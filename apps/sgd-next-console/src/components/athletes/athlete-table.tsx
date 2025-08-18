"use client";

import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { useListApi } from '@/hooks/use-api';
import type { AthleteListParams } from '@/types/api';

// Hooks personalizados
import { useAthleteFilters } from './hooks/useAthleteFilters';
import { useAthletePermissions } from './hooks/useAthletePermissions';
import { useAthleteActions } from './hooks/useAthleteActions';

// Componentes de presentación
import { AthleteTableHeader } from './components/AthleteTableHeader';
import { AthleteTableFilters } from './components/AthleteTableFilters';
import { AthleteTableRow } from './components/AthleteTableRow';
import { AthleteEmptyState } from './components/AthleteEmptyState';
import { AthleteDeleteDialog } from './components/AthleteDeleteDialog';

interface AthleteTableProps {
  /** Filtros iniciales */
  initialFilters?: Partial<AthleteListParams>;
  /** Si mostrar botón de crear */
  showCreateButton?: boolean;
  /** Si es solo lectura (para rol PROFESOR) */
  readOnly?: boolean;
  /** Título personalizado */
  title?: string;
  /** Descripción personalizada */
  description?: string;
}

export function AthleteTable({
  initialFilters = {},
  showCreateButton = true,
  readOnly = false,
}: AthleteTableProps) {
  
  // Hooks personalizados para lógica de negocio
  const filters = useAthleteFilters(initialFilters);
  const permissions = useAthletePermissions(readOnly);
  const actions = useAthleteActions();

  // Hook para manejo de la lista con API
  const {
    data: athletes,
    pagination,
    loading,
    refresh,
    reset
  } = useListApi({
    fetchFn: apiClient.getAthletes,
    params: filters.getApiParams(),
    dependencies: [
      filters.searchQuery, 
      filters.selectedSport, 
      filters.selectedVenue, 
      filters.selectedCategory, 
      filters.activeFilter
    ]
  });

  // Solo activar búsqueda cuando filtros estén cargados
  useEffect(() => {
    if (!filters.filtersLoading) {
      // La búsqueda se activará automáticamente por useListApi
    }
  }, [
    filters.filtersLoading, 
    filters.searchQuery, 
    filters.selectedSport, 
    filters.selectedVenue, 
    filters.selectedCategory, 
    filters.activeFilter
  ]);

  // Handlers combinados
  const handleClearFilters = () => {
    filters.handleClearFilters();
    reset();
  };

  const handleDeleteConfirm = () => {
    if (actions.deleteAthleteId) {
      actions.handleDelete(actions.deleteAthleteId, refresh);
    }
  };

  const canCreate = showCreateButton && permissions.canCreate;

  return (
    <div className="space-y-6">
      <Card>
        <AthleteTableHeader
          totalElements={pagination.totalElements}
          loading={loading}
          canCreate={canCreate}
          onRefresh={refresh}
          onCreate={actions.handleCreate}
        />
        
        <CardContent className="space-y-4">
          <AthleteTableFilters
            searchQuery={filters.searchQuery}
            selectedSport={filters.selectedSport}
            selectedVenue={filters.selectedVenue}
            activeFilter={filters.activeFilter}
            sports={filters.filterOptions.sports}
            venues={filters.filterOptions.venues}
            filtersLoading={filters.filtersLoading}
            onSearchChange={filters.handleSearch}
            onSportChange={filters.setSelectedSport}
            onVenueChange={filters.setSelectedVenue}
            onActiveFilterChange={filters.setActiveFilter}
            onClearFilters={handleClearFilters}
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atleta</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Deporte</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Sede</TableHead>
                  <TableHead>Tutores</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AthleteEmptyState
                  loading={loading}
                  hasAthletes={athletes?.length > 0}
                  canCreate={canCreate}
                  searchQuery={filters.searchQuery}
                  selectedSport={filters.selectedSport}
                  selectedVenue={filters.selectedVenue}
                  selectedCategory={filters.selectedCategory}
                  onCreate={actions.handleCreate}
                />
                
                {athletes?.map((athlete) => (
                  <AthleteTableRow
                    key={athlete.id}
                    athlete={athlete}
                    canEdit={permissions.canEdit}
                    canDelete={permissions.canDelete}
                    onView={actions.handleView}
                    onEdit={actions.handleEdit}
                    onDelete={actions.setDeleteAthleteId}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AthleteDeleteDialog
        open={actions.deleteAthleteId !== null}
        onOpenChange={(open) => !open && actions.setDeleteAthleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}