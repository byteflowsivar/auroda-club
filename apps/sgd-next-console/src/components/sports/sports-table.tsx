"use client";

import { useState, useEffect, useMemo } from 'react';
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
import { useErrorHandler } from '@/lib/error-handler';
import type { SportListParams, SportResponse } from '@/types/api';

// Extracted Components
import { SportTableHeader } from './components/SportTableHeader';
import { SportTableFilters } from './components/SportTableFilters';
import { SportTableRow } from './components/SportTableRow';
import { SportEmptyState } from './components/SportEmptyState';
import { SportDeleteDialog } from './components/SportDeleteDialog';

// Extracted Hooks
import { useSportPermissions } from './hooks/useSportPermissions';
import { useSportActions } from './hooks/useSportActions';
import { useSportFilters } from './hooks/useSportFilters';

interface SportsTableProps {
  /** Modo de selección para asociar deportes */
  selectionMode?: boolean;
  /** ID de deporte seleccionado */
  selectedId?: number;
  /** Callback cuando se selecciona un deporte */
  onSelect?: (sport: SportResponse) => void;
}

export function SportsTable({
  selectionMode = false,
  selectedId,
  onSelect
}: SportsTableProps) {
  const { showError } = useErrorHandler();

  // Original states for data and loading
  const [sports, setSports] = useState<SportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Use extracted hooks
  const permissions = useSportPermissions();
  const actions = useSportActions(onSelect);
  const filters = useSportFilters(sports); // Pass sports data to filters hook

  // Original searchParams and filteredSports logic
  const searchParams = useMemo((): SportListParams => {
    return {
      includeCategories: filters.includeCategories // Use includeCategories from filters hook
    };
  }, [filters.includeCategories]);

  // Use filteredSports from filters hook
  const filteredSports = filters.filteredSports;

  // Original loadSports function
  const loadSports = async (showSpinner = true) => {
    try {
      if (showSpinner) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await apiClient.getSports(searchParams);
      setSports(response);
    } catch (error) {
      console.error('Error loading sports:', error);
      showError('Error al cargar deportes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Original useEffect for data loading
  useEffect(() => {
    loadSports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Handlers from actions hook
  const handleView = actions.handleView;
  const handleEdit = actions.handleEdit;
  const handleCreate = actions.handleCreate;
  const handleDelete = actions.handleDelete;
  const handleSelection = actions.handleSelection;

  // Reset filters from filters hook
  const resetFilters = filters.handleClearFilters;

  return (
    <div className="space-y-6">
      <Card>
        <SportTableHeader
          totalElements={filteredSports.length}
          loading={loading || refreshing} // Use combined loading state
          canCreate={permissions.canCreate}
          selectionMode={selectionMode}
          onRefresh={() => loadSports(false)}
          onCreate={handleCreate}
        />
        <CardContent className="space-y-4">
          <SportTableFilters
            searchTerm={filters.searchTerm}
            activeFilter={filters.activeFilter}
            includeCategories={filters.includeCategories}
            onSearchChange={filters.handleSearch}
            onActiveFilterChange={filters.setActiveFilter}
            onIncludeCategoriesChange={filters.setIncludeCategories}
            onClearFilters={resetFilters}
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deporte</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Categorías</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <SportEmptyState
                    loading={true}
                    hasSports={false}
                    canCreate={permissions.canCreate}
                    searchTerm={filters.searchTerm}
                    activeFilter={filters.activeFilter}
                    includeCategories={filters.includeCategories}
                    selectionMode={selectionMode}
                    onCreate={handleCreate}
                  />
                ) : filteredSports.length === 0 ? (
                  <SportEmptyState
                    loading={false}
                    hasSports={false}
                    canCreate={permissions.canCreate}
                    searchTerm={filters.searchTerm}
                    activeFilter={filters.activeFilter}
                    includeCategories={filters.includeCategories}
                    selectionMode={selectionMode}
                    onCreate={handleCreate}
                  />
                ) : (
                  filteredSports.map((sport) => (
                    <SportTableRow
                      key={sport.id}
                      sport={sport}
                      canEdit={permissions.canEdit}
                      canDelete={permissions.canDelete}
                      selectionMode={selectionMode}
                      selectedId={selectedId}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={actions.setDeletingSport}
                      onSelect={handleSelection}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmación para eliminar */}
      <SportDeleteDialog
        open={!!actions.deletingSport}
        onOpenChange={() => actions.setDeletingSport(null)}
        onConfirm={() => handleDelete(actions.deletingSport!, () => loadSports(false))}
        sport={actions.deletingSport}
        deleting={actions.deleting}
      />
    </div>
  );
}