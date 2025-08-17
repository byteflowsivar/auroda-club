"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Building,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import type { VenueResponse } from '@/types/api';
import { ROLES } from '@/lib/constants';

export function VenuesTable() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showSuccess, showError } = useErrorHandler();

  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deletingVenue, setDeletingVenue] = useState<VenueResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canCreate = session?.user?.roles?.includes(ROLES.ADMIN_GENERAL);
  const canEdit = session?.user?.roles?.includes(ROLES.ADMIN_GENERAL);
  const canDelete = session?.user?.roles?.includes(ROLES.ADMIN_GENERAL);

  const filteredVenues = useMemo(() => {
    let filtered = venues;

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(search) ||
        venue.code.toLowerCase().includes(search) ||
        venue.address?.toLowerCase().includes(search) ||
        venue.club.name.toLowerCase().includes(search)
      );
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter(venue =>
        activeFilter === 'active' ? venue.active : !venue.active
      );
    }

    return filtered;
  }, [venues, searchTerm, activeFilter]);

  const loadVenues = async (showSpinner = true) => {
    try {
      if (showSpinner) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      const venuesData = await apiClient.getVenues();
      setVenues(venuesData);
    } catch (error) {
      console.error("Error loading venues:", error);
      showError('No se pudieron cargar las sedes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!deletingVenue) return;
    setIsDeleting(true);
    try {
      await apiClient.deleteVenue(deletingVenue.id);
      showSuccess('Sede eliminada exitosamente');
      await loadVenues(false); // Recargar la lista
    } catch (error) {
      console.error("Error deleting venue:", error);
      showError('Error al eliminar la sede');
    } finally {
      setIsDeleting(false);
      setDeletingVenue(null);
    }
  };
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Gestión de Sedes
              </CardTitle>
              <CardDescription>
                {filteredVenues.length} sedes registradas
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => loadVenues(false)}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              {canCreate && (
                <Button onClick={() => router.push('/admin/config/venues/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Sede
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, código, dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={activeFilter} onValueChange={(value: typeof activeFilter) => setActiveFilter(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sede</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Creada</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVenues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No se encontraron sedes.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVenues.map((venue) => (
                    <TableRow key={venue.id}>
                      <TableCell>
                        <div className="font-medium">{venue.name}</div>
                        <div className="text-sm text-muted-foreground">{venue.code}</div>
                      </TableCell>
                      <TableCell>{venue.club.name}</TableCell>
                      <TableCell>{venue.address}</TableCell>
                      <TableCell>
                        <Badge variant={venue.active ? 'default' : 'secondary'}>
                          {venue.active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(venue.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            {canEdit && (
                                <DropdownMenuItem onClick={() => router.push(`/admin/config/venues/${venue.id}/edit`)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setDeletingVenue(venue)} className="text-red-600">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Eliminar
                                    </DropdownMenuItem>
                                </> 
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingVenue} onOpenChange={() => setDeletingVenue(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Sede?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará la sede &quot;{deletingVenue?.name}&quot; como inactiva. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? 'Eliminando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}