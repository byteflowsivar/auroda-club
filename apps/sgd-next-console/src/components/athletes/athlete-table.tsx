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
import { useListApi } from '@/hooks/use-api';
import type { AthleteListParams, AthleteResponse } from '@/types/api';

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
import apiClient from "@/lib/api";

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
    items: athletes,
    pagination,
    loading,
    fetchList: refresh,
    reset
  } = useListApi();

  // Cargar datos inicial y cuando cambien los filtros
  useEffect(() => {
    if (!filters.filtersLoading) {
      console.log('🔄 Cargando atletas con filtros:', {
        searchQuery: filters.searchQuery,
        selectedSport: filters.selectedSport,
        selectedVenue: filters.selectedVenue,
        selectedCategory: filters.selectedCategory,
        activeFilter: filters.activeFilter
      });
      
      // Usar getApiParams() para construir parámetros correctamente
      const apiParams = filters.getApiParams();
      const params: AthleteListParams = {
        page: 0,
        size: 20,
        ...apiParams,
      };
      
      // Ejecutar consulta directamente
      refresh(
        async (apiParams) => {
          console.log('📡 Llamando API con parámetros:', apiParams);
          const response = await apiClient.getAthletes(apiParams as AthleteListParams);
          console.log('📦 Respuesta recibida:', response);
          
          return {
            content: response.content,
            pagination: response.pagination
          };
        },
        params,
        true
      ).catch(console.error);
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
      actions.handleDelete(actions.deleteAthleteId, () => {
        // Recargar la lista después de eliminar
        const apiParams = filters.getApiParams();
        const currentParams: AthleteListParams = {
          page: 0,
          size: 20,
          ...apiParams,
        };
        
        refresh(
          async (apiParams) => {
            const response = await apiClient.getAthletes(apiParams as AthleteListParams);
            return {
              content: response.content,
              pagination: response.pagination
            };
          },
          currentParams,
          false
        );
      }).then();
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
          onRefresh={() => {
            const apiParams = filters.getApiParams();
            const currentParams: AthleteListParams = {
              page: 0,
              size: 20,
              ...apiParams,
            };
            
            refresh(
              async (apiParams) => {
                const response = await apiClient.getAthletes(apiParams as AthleteListParams);
                return {
                  content: response.content,
                  pagination: response.pagination
                };
              },
              currentParams,
              false
            );
          }}
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
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading || (athletes && athletes.length === 0) ? (
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
                ) : (
                  (athletes as AthleteResponse[])?.map((athlete: AthleteResponse) => (
                    <AthleteTableRow
                      key={athlete.id}
                      athlete={athlete}
                      canEdit={permissions.canEdit}
                      canDelete={permissions.canDelete}
                      onView={actions.handleView}
                      onEdit={actions.handleEdit}
                      onDelete={actions.setDeleteAthleteId}
                    />
                  ))
                )}
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