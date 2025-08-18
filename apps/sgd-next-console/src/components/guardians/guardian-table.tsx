"use client";

import React, { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

import { apiClient } from "@/lib/api";
import { GuardianPageResponse, GuardianResponse, } from "@/types/api";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/auth/loading-spinner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { GuardianDeleteDialog } from "./components/GuardianDeleteDialog";
import { GuardianEmptyState } from "./components/GuardianEmptyState";
import { GuardianTableFilters } from "./components/GuardianTableFilters";
import { GuardianTableHeader } from "./components/GuardianTableHeader";
import { GuardianTableRow } from "./components/GuardianTableRow";

import { useGuardianActions } from "./hooks/useGuardianActions";
import { useGuardianFilters } from "./hooks/useGuardianFilters";
import { useGuardianPermissions } from "./hooks/useGuardianPermissions";

// Simple useDebounce hook (can be moved to a shared hooks file if needed)
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface GuardianTableProps {
  selectionMode?: boolean;
  onSelect?: (guardian: GuardianResponse) => void;
  selectedId?: number;
}

export function GuardianTable({
  selectionMode = false,
  onSelect,
  selectedId,
}: GuardianTableProps) {

  const { canEdit, canDelete, canCreate } = useGuardianPermissions();
  const {
    searchTerm,
    activeFilter,
    handleSearch,
    setActiveFilter,
    handleClearFilters,
    getApiParams,
  } = useGuardianFilters();
  const {
    deleteGuardianId,
    setDeleteGuardianId,
    handleView,
    handleEdit,
    handleCreate,
    handleDelete,
  } = useGuardianActions();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetcher = useCallback(
    async () => {
      const params = getApiParams();
      return await apiClient.getGuardians({
        ...params,
        search: debouncedSearchTerm || undefined, // Use debounced search term
        page,
        size: pageSize,
      });
    },
    [page, pageSize, getApiParams, debouncedSearchTerm]
  );

  const { data, error, isLoading, mutate } = useSWR<GuardianPageResponse>(
    `/api/guardians?page=${page}&size=${pageSize}&search=${debouncedSearchTerm}&active=${activeFilter}`,
    fetcher
  );

  const onDeleteConfirmed = useCallback(
    async (id: number) => {
      await handleDelete(id, () => {
        mutate(); // Re-fetch data after successful deletion
      });
    },
    [handleDelete, mutate]
  );

  const handlePageSizeChange = useCallback((newSize: string) => {
    setPageSize(Number(newSize));
    setPage(0); // Reset to first page when page size changes
  }, []);

  const totalElements = data?.pagination.totalElements || 0;
  const currentPage = data?.pagination.page || 0;
  const currentSize = data?.pagination.size || pageSize;
  const totalPages = data?.pagination.totalPages || 0;

  const startItem = totalElements === 0 ? 0 : currentPage * currentSize + 1;
  const endItem = Math.min((currentPage + 1) * currentSize, totalElements);

  return (
    <Card>
      <GuardianTableHeader
        totalElements={totalElements}
        loading={isLoading}
        canCreate={canCreate}
        selectionMode={selectionMode}
        onRefresh={() => mutate()}
        onCreate={handleCreate}
      />
      <CardContent>
        <GuardianTableFilters
          searchTerm={searchTerm}
          activeFilter={activeFilter}
          onSearchChange={handleSearch} // This will update the searchTerm state
          onActiveFilterChange={setActiveFilter}
          onClearFilters={handleClearFilters}
        />

        {isLoading && <LoadingSpinner />}
        {error && (
          <p className="text-red-500 mt-4">
            Error al cargar tutores: {error.message}
          </p>
        )}

        {!isLoading && !error && (!data || data.content.length === 0) ? (
          <GuardianEmptyState
            canCreate={canCreate}
            onCreateClick={handleCreate}
          />
        ) : (
          <div className="rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Atletas</TableHead>
                  <TableHead>Estado</TableHead>
                  {!selectionMode && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.content.map((guardian) => (
                  <GuardianTableRow
                    key={guardian.id}
                    guardian={guardian}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    selectionMode={selectionMode}
                    selectedId={selectedId}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteGuardianId(id)} // Set ID for dialog
                    onSelect={onSelect}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalElements > 0 && (
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Mostrando {startItem} a {endItem} de {totalElements} tutores
              </p>
              <Select
                value={currentSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(0)}
                disabled={currentPage === 0}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                      className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {/* Simple page number display: current page and total pages */}
                  <span className="flex items-center gap-1 px-2 text-sm">
                    Página {currentPage + 1} de {totalPages}
                  </span>

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((prev) =>
                          Math.min(totalPages - 1, prev + 1)
                        )
                      }
                      className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <GuardianDeleteDialog
        open={!!deleteGuardianId}
        onOpenChange={(open) => {
          if (!open) setDeleteGuardianId(null);
        }}
        onConfirm={() => onDeleteConfirmed(deleteGuardianId!)}
        guardianName={
          data?.content.find((g) => g.id === deleteGuardianId)?.fullName
        }
      />
    </Card>
  );
}
