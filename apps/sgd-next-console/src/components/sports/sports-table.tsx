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
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Trophy,
  RefreshCw,
  Plus,
  Users,
  Target,
  Calendar
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import type { 
  SportResponse,
  SportListParams
} from '@/types/api';

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
  const router = useRouter();
  const { data: session } = useSession();
  const { showSuccess, showError } = useErrorHandler();

  // Estados para datos
  const [sports, setSports] = useState<SportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [includeCategories, setIncludeCategories] = useState(true);

  // Estados para acciones
  const [deletingSport, setDeletingSport] = useState<SportResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Verificar permisos (actualmente solo lectura desde backend)
  const canCreate = false; // Backend no implementa POST /sports
  const canEdit = false;   // Backend no implementa PUT /sports
  const canDelete = false; // Backend no implementa DELETE /sports

  // Construir parámetros de búsqueda
  const searchParams = useMemo((): SportListParams => {
    const params: SportListParams = {
      includeCategories
    };

    return params;
  }, [includeCategories]);

  // Filtrar deportes localmente
  const filteredSports = useMemo(() => {
    let filtered = sports;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(sport => 
        sport.name.toLowerCase().includes(search) ||
        sport.description.toLowerCase().includes(search)
      );
    }

    // Filtro por estado
    if (activeFilter !== 'all') {
      filtered = filtered.filter(sport => 
        activeFilter === 'active' ? sport.active : !sport.active
      );
    }

    return filtered;
  }, [sports, searchTerm, activeFilter]);

  // Cargar deportes
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

  // Cargar datos al inicio y cambiar parámetros
  useEffect(() => {
    loadSports();
  }, [searchParams]);

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handlers de navegación
  const handleView = (sport: SportResponse) => {
    router.push(`/admin/config/sports/${sport.id}`);
  };

  const handleEdit = (sport: SportResponse) => {
    router.push(`/admin/config/sports/${sport.id}/edit`);
  };

  const handleCreate = () => {
    router.push('/admin/config/sports/new');
  };

  // Handler para eliminar (actualmente no disponible en backend)
  const handleDelete = async (sport: SportResponse) => {
    showError('La eliminación de deportes no está disponible actualmente');
  };

  // Handler de selección (modo selección)
  const handleSelection = (sport: SportResponse) => {
    onSelect?.(sport);
  };

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
    setIncludeCategories(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="h-7 bg-muted rounded animate-pulse mb-2" style={{ width: '150px' }} />
              <div className="h-4 bg-muted rounded animate-pulse" style={{ width: '300px' }} />
            </div>
            <div className="h-10 bg-muted rounded animate-pulse" style={{ width: '120px' }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {selectionMode ? 'Seleccionar Deporte' : 'Gestión de Deportes'}
              </CardTitle>
              <CardDescription>
                {selectionMode 
                  ? 'Seleccione un deporte para configurar'
                  : `${filteredSports.length} deportes registrados`
                }
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => loadSports(false)}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              {!selectionMode && canCreate && (
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Deporte
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
                  placeholder="Buscar por nombre o descripción..."
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
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          </div>

          {/* Opciones */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeCategories}
                onChange={(e) => setIncludeCategories(e.target.checked)}
                className="rounded"
              />
              Incluir categorías
            </label>
          </div>

          {/* Tabla */}
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
                {filteredSports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Trophy className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm ? 'No se encontraron deportes' : 'No hay deportes registrados'}
                        </p>
                        {!selectionMode && canCreate && !searchTerm && (
                          <Button onClick={handleCreate} className="mt-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Crear primer deporte
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSports.map((sport) => (
                    <TableRow 
                      key={sport.id}
                      className={`${selectionMode ? 'cursor-pointer hover:bg-muted/50' : ''} ${selectedId === sport.id ? 'bg-blue-50' : ''}`}
                      onClick={selectionMode ? () => handleSelection(sport) : undefined}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                            <Trophy className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{sport.name}</span>
                              {selectionMode && selectedId === sport.id && (
                                <Badge variant="default" className="text-xs">
                                  Seleccionado
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                          {sport.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span className="text-sm font-medium">
                            {sport.categories?.length || 0}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            categoría{sport.categories?.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {sport.categories && sport.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {sport.categories.slice(0, 2).map((category) => (
                              <Badge key={category.id} variant="outline" className="text-xs">
                                {category.name}
                              </Badge>
                            ))}
                            {sport.categories.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{sport.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={sport.active ? "default" : "secondary"}
                          className={sport.active ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {sport.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(sport.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {!selectionMode && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleView(sport)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalles
                              </DropdownMenuItem>
                              {canEdit && (
                                <DropdownMenuItem onClick={() => handleEdit(sport)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                              )}
                              {canDelete && sport.categories?.length === 0 && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => setDeletingSport(sport)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
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
      <AlertDialog open={!!deletingSport} onOpenChange={() => setDeletingSport(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar deporte?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el deporte <strong>{deletingSport?.name}</strong> 
              y todos sus datos asociados.
              {deletingSport?.categories && deletingSport.categories.length > 0 ? (
                <>
                  <br /><br />
                  <strong>Advertencia:</strong> Este deporte tiene {deletingSport.categories.length}{' '}
                  categoría{deletingSport.categories.length !== 1 ? 's' : ''} asociada{deletingSport.categories.length !== 1 ? 's' : ''}.
                  No se puede eliminar un deporte con categorías activas.
                </>
              ) : (
                <>
                  <br /><br />
                  Esta acción no se puede deshacer.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingSport && handleDelete(deletingSport)}
              disabled={deleting || (deletingSport?.categories?.length || 0) > 0}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}