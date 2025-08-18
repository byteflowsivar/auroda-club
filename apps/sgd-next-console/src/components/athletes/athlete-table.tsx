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
  const { showSuccess } = useErrorHandler();
  
  // Estados locales
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [selectedSport, setSelectedSport] = useState<string>(initialFilters.sportId?.toString() || 'all');
  const [selectedVenue, setSelectedVenue] = useState<string>(initialFilters.venueId?.toString() || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilters.categoryId?.toString() || 'all');
  const [activeFilter, setActiveFilter] = useState<boolean>(initialFilters.active ?? true);
  const [deleteAthleteId, setDeleteAthleteId] = useState<number | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sports: [],
    venues: [],
    categories: []
  });
  const [filtersLoading, setFiltersLoading] = useState(true);

  // Hook para gestión de lista con paginación
  const {
    items: athletes,
    pagination,
    loading,
    fetchList,
    changePage,
    changePageSize,
    reset
  } = useListApi<AthleteResponse, AthleteListParams>();

  // Cargar opciones de filtros - sin useCallback
  const loadFilterOptions = async () => {
    try {
      setFiltersLoading(true);
      const [sportsData, venuesData] = await Promise.all([
        apiClient.getSports({ includeCategories: true }),
        apiClient.getVenues()
      ]);
      
      // Extraer categorías de todos los deportes
      const allCategories: CategoryResponse[] = sportsData.flatMap(sport => 
        sport.categories.map(cat => ({
          ...cat,
          sport: { id: sport.id, name: sport.name, description: sport.description, active: sport.active },
          createdAt: new Date().toISOString(), // Valor por defecto
          updatedAt: new Date().toISOString()  // Valor por defecto
        }))
      );

      setFilterOptions({
        sports: sportsData,
        venues: venuesData,
        categories: allCategories
      });
    } catch (error) {
      console.error('Error loading filter options:', error);
    } finally {
      setFiltersLoading(false);
    }
  };

  // Cargar atletas - sin usar useCallback para evitar dependencias complejas
  const loadAthletes = async (resetPage = false) => {
    const params: AthleteListParams = {
      ...initialFilters,
      active: activeFilter
    };

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    if (selectedSport && selectedSport !== 'all') {
      params.sportId = parseInt(selectedSport);
    }
    if (selectedVenue && selectedVenue !== 'all') {
      params.venueId = parseInt(selectedVenue);
    }
    if (selectedCategory && selectedCategory !== 'all') {
      params.categoryId = parseInt(selectedCategory);
    }

    await fetchList(
      (searchParams) => apiClient.getAthletes(searchParams),
      params,
      resetPage
    );
  };

  // Efectos
  useEffect(() => {
    loadFilterOptions();
  }, []); // Solo cargar opciones una vez al montar

  useEffect(() => {
    if (!filtersLoading) {
      loadAthletes(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      await loadAthletes(false);
      setDeleteAthleteId(null);
    } catch (error) {
      // Error manejado por useErrorHandler
      console.error('Error deleting athlete:', error);
    }
  };

  const handleRefresh = () => {
    loadAthletes(false);
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          {showCreateButton && canEdit && (
            <Button onClick={handleCreateAthlete}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Atleta
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre del atleta..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Deporte */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Deporte</label>
              <Select value={selectedSport} onValueChange={setSelectedSport} disabled={filtersLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los deportes" />
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
            </div>

            {/* Sede */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sede</label>
              <Select value={selectedVenue} onValueChange={setSelectedVenue} disabled={filtersLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las sedes" />
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
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={filtersLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {filterOptions.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name} ({category.ageRange})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select 
                value={activeFilter ? 'true' : 'false'} 
                onValueChange={(value) => setActiveFilter(value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activos</SelectItem>
                  <SelectItem value="false">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && athletes.length === 0 ? (
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
          ) : athletes.length === 0 ? (
            <div className="text-center py-8">
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
            </div>
          ) : (
            <div className="space-y-4">
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
                    {athletes.map((athlete) => (
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewAthlete(athlete.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              {canEdit && (
                                <DropdownMenuItem onClick={() => handleEditAthlete(athlete.id)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {canDelete && (
                                <DropdownMenuItem 
                                  onClick={() => setDeleteAthleteId(athlete.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {athletes.length} de {pagination.totalElements} atletas
                  </p>
                  <Select
                    value={pagination.size.toString()}
                    onValueChange={(value) => changePageSize(parseInt(value))}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page === 0 || loading}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm">
                    {pagination.page + 1} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1 || loading}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          )}
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