"use client";

import { useState, useEffect, useCallback } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Filter,
  Download,
  RefreshCw,
  Users,
  MapPin,
  Calendar
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useListApi } from '@/hooks/use-api';
import { useErrorHandler } from '@/lib/error-handler';
import type { 
  AthleteResponse, 
  AthleteListParams,
  SportResponse,
  VenueResponse,
  CategoryResponse
} from '@/types/api';

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

interface FilterOptions {
  sports: SportResponse[];
  venues: VenueResponse[];
  categories: CategoryResponse[];
}

export function AthleteTable({
  initialFilters = {},
  showCreateButton = true,
  readOnly = false,
  title = "Gestión de Atletas",
  description = "Lista de atletas registrados en el sistema"
}: AthleteTableProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { showSuccess, showError } = useErrorHandler();

  // Estados para filtros y datos
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [selectedSport, setSelectedSport] = useState<string>(initialFilters.sportId?.toString() || 'all');
  const [selectedVenue, setSelectedVenue] = useState<string>(initialFilters.venueId?.toString() || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilters.categoryId?.toString() || 'all');
  const [activeFilter, setActiveFilter] = useState<boolean>(initialFilters.active ?? true);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sports: [],
    venues: [],
    categories: []
  });
  const [filtersLoading, setFiltersLoading] = useState(true);

  // Estado para eliminación
  const [deleteAthleteId, setDeleteAthleteId] = useState<number | null>(null);

  // Hook para manejo de la lista
  const {
    data: athletes,
    pagination,
    loading,
    error,
    refresh,
    changePage,
    changePageSize,
    reset
  } = useListApi({
    fetchFn: apiClient.getAthletes,
    params: {
      search: searchQuery || undefined,
      sportId: selectedSport !== 'all' ? Number(selectedSport) : undefined,
      venueId: selectedVenue !== 'all' ? Number(selectedVenue) : undefined,
      categoryId: selectedCategory !== 'all' ? Number(selectedCategory) : undefined,
      active: activeFilter
    },
    dependencies: [searchQuery, selectedSport, selectedVenue, selectedCategory, activeFilter]
  });

  // Cargar opciones de filtros - sin useCallback
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

  // Efecto para cargar las opciones cuando el componente se monta
  useEffect(() => {
    loadFilterOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Solo activar la búsqueda cuando no se estén cargando los filtros
  useEffect(() => {
    if (!filtersLoading) {
      // La búsqueda se activará automáticamente por el hook useListApi
    }
  }, [filtersLoading, searchQuery, selectedSport, selectedVenue, selectedCategory, activeFilter]); // Re-cargar cuando cambien los filtros

  // Handlers
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleCreateAthlete = () => {
    router.push('/admin/athletes/new');
  };

  const handleViewAthlete = (id: number) => {
    router.push(`/admin/athletes/${id}`);
  };

  const handleEditAthlete = (id: number) => {
    router.push(`/admin/athletes/${id}/edit`);
  };

  const handleDeleteAthlete = async (id: number) => {
    try {
      await apiClient.deleteAthlete(id);
      showSuccess('Atleta eliminado exitosamente');
      await refresh();
      setDeleteAthleteId(null);
    } catch (error) {
      // Error manejado por useErrorHandler
      console.error('Error deleting athlete:', error);
    }
  };

  const handleRefresh = () => {
    refresh();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSport('all');
    setSelectedVenue('all');
    setSelectedCategory('all');
    setActiveFilter(true);
    reset();
  };

  // Calcular edad desde fecha de nacimiento
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Determinar permisos basados en rol
  const canEdit = !readOnly && (
    session?.user?.roles?.includes('ADMIN_GENERAL') || 
    session?.user?.roles?.includes('ADMIN_CLUB')
  );
  const canDelete = !readOnly && session?.user?.roles?.includes('ADMIN_GENERAL');

  // Render del componente
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestión de Atletas
              </CardTitle>
              <CardDescription>
                {pagination.totalElements} atletas registrados
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              {showCreateButton && canEdit && (
                <Button onClick={handleCreateAthlete}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Atleta
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o documento..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedSport} onValueChange={setSelectedSport} disabled={filtersLoading}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Deporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los deportes</SelectItem>
                {filterOptions.sports.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id.toString()}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedVenue} onValueChange={setSelectedVenue} disabled={filtersLoading}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las sedes</SelectItem>
                {filterOptions.venues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id.toString()}>
                    {venue.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={activeFilter ? 'true' : 'false'} 
              onValueChange={(value) => setActiveFilter(value === 'true')}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Activos</SelectItem>
                <SelectItem value="false">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleClearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          </div>

          {/* Tabla */}
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
                {loading && athletes.length === 0 ? (
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
                ) : athletes?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchQuery || selectedSport !== 'all' || selectedVenue !== 'all' || selectedCategory !== 'all' 
                            ? 'No se encontraron atletas' : 'No hay atletas registrados'}
                        </p>
                        {canEdit && !searchQuery && selectedSport === 'all' && selectedVenue === 'all' && selectedCategory === 'all' && (
                          <Button onClick={handleCreateAthlete} className="mt-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Registrar primer atleta
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  athletes?.map((athlete) => (
                    <TableRow key={athlete.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {athlete.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{athlete.fullName}</div>
                            <div className="text-sm text-muted-foreground">
                              {athlete.email || 'Sin email'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {calculateAge(athlete.birthDate)} años
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {athlete.sport.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {athlete.category.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {athlete.venue.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {athlete.guardians.length} tutor{athlete.guardians.length !== 1 ? 'es' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={athlete.active ? "default" : "secondary"}
                          className={athlete.active ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {athlete.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAthlete(athlete.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAthlete(athlete.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteAthleteId(athlete.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteAthleteId !== null} onOpenChange={() => setDeleteAthleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar atleta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará el atleta como inactivo. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAthleteId && handleDeleteAthlete(deleteAthleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}