
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  AlertDialogTrigger,
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
  Users,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import type { 
  GuardianResponse, 
  GuardianListParams,
  GuardianPageResponse,
  PaginationInfo 
} from '@/types/api';

interface GuardianTableProps {
  /** Modo de selección para asociar tutores */
  selectionMode?: boolean;
  /** IDs de tutores ya seleccionados */
  selectedIds?: number[];
  /** Callback cuando se selecciona un tutor */
  onSelect?: (guardian: GuardianResponse) => void;
  /** Callback cuando se deselecciona un tutor */
  onDeselect?: (guardianId: number) => void;
}

export function GuardianTable({
  selectionMode = false,
  selectedIds = [],
  onSelect,
  onDeselect
}: GuardianTableProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { showSuccess, showError } = useErrorHandler();

  // Estados para datos
  const [guardians, setGuardians] = useState<GuardianResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    hasNext: false,
    hasPrevious: false
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [athletesFilter, setAthletesFilter] = useState<'all' | 'with' | 'without'>('all');
  const [sortBy, setSortBy] = useState<'fullName' | 'email' | 'createdAt'>('fullName');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');

  // Verificar permisos
  const canCreate = session?.user?.roles?.includes('ADMIN_GENERAL') || 
                   session?.user?.roles?.includes('ADMIN_CLUB');
  const canEdit = session?.user?.roles?.includes('ADMIN_GENERAL') || 
                 session?.user?.roles?.includes('ADMIN_CLUB');
  const canDelete = session?.user?.roles?.includes('ADMIN_GENERAL');

  // Construir parámetros de búsqueda
  const searchParams = useMemo((): GuardianListParams => {
    const params: GuardianListParams = {
      page: pagination.page,
      size: pagination.size,
      sort: sortBy,
      direction: sortDirection
    };

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    if (activeFilter !== 'all') {
      params.active = activeFilter === 'active';
    }

    if (athletesFilter !== 'all') {
      params.hasAthletes = athletesFilter === 'with';
    }

    return params;
  }, [pagination.page, pagination.size, searchTerm, activeFilter, athletesFilter, sortBy, sortDirection]);

  // Cargar tutores
  const loadGuardians = async (showSpinner = true) => {
    try {
      if (showSpinner) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response: GuardianPageResponse = await apiClient.getGuardians(searchParams);
      setGuardians(response.content);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading guardians:', error);
      showError('Error al cargar tutores');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar datos al cambiar parámetros
  useEffect(() => {
    loadGuardians();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Obtener iniciales del nombre
  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handlers de navegación
  const handleView = (guardian: GuardianResponse) => {
    router.push(`/admin/guardians/${guardian.id}`);
  };

  const handleEdit = (guardian: GuardianResponse) => {
    router.push(`/admin/guardians/${guardian.id}/edit`);
  };

  const handleCreate = () => {
    router.push('/admin/guardians/new');
  };

  // Handler para eliminar
  const handleDelete = async (guardian: GuardianResponse) => {
    try {
      await apiClient.deleteGuardian(guardian.id);
      showSuccess(`Tutor ${guardian.fullName} eliminado exitosamente`);
      setGuardians(guardians.filter(g => g.id !== guardian.id));
    } catch (error) {
      console.error('Error deleting guardian:', error);
      showError('Error al eliminar tutor');
    }
  };

  // Handlers de paginación
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination(prev => ({ ...prev, page: 0, size: newSize }));
  };

  // Handler de selección (modo selección)
  const handleSelection = (guardian: GuardianResponse) => {
    if (selectedIds.includes(guardian.id)) {
      onDeselect?.(guardian.id);
    } else {
      onSelect?.(guardian);
    }
  };

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
    setAthletesFilter('all');
    setSortBy('fullName');
    setSortDirection('ASC');
    setPagination(prev => ({ ...prev, page: 0 }));
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
                <Users className="h-5 w-5" />
                {selectionMode ? 'Seleccionar Tutor' : 'Gestión de Tutores'}
              </CardTitle>
              <CardDescription>
                {selectionMode 
                  ? 'Seleccione un tutor para asociar al atleta'
                  : `${pagination.totalElements} tutores registrados`
                }
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => loadGuardians(false)}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              {!selectionMode && canCreate && (
                <Button onClick={handleCreate}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo Tutor
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
                  placeholder="Buscar por nombre, email o teléfono..."
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
            <Select value={athletesFilter} onValueChange={(value: typeof athletesFilter) => setAthletesFilter(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="with">Con atletas</SelectItem>
                <SelectItem value="without">Sin atletas</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          </div>

          {/* Tabla */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Atletas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Registrado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guardians.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm ? 'No se encontraron tutores' : 'No hay tutores registrados'}
                        </p>
                        {!selectionMode && canCreate && !searchTerm && (
                          <Button onClick={handleCreate} className="mt-2">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Registrar primer tutor
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  guardians.map((guardian) => (
                    <TableRow 
                      key={guardian.id}
                      className={selectionMode ? 'cursor-pointer hover:bg-muted/50' : ''}
                      onClick={selectionMode ? () => handleSelection(guardian) : undefined}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(guardian.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{guardian.fullName}</span>
                              {selectionMode && selectedIds.includes(guardian.id) && (
                                <Badge variant="default" className="text-xs">
                                  Seleccionado
                                </Badge>
                              )}
                            </div>
                            {guardian.identificationNumber && (
                              <p className="text-sm text-muted-foreground">
                                ID: {guardian.identificationNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {guardian.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              <span>{guardian.email}</span>
                            </div>
                          )}
                          {guardian.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              <span>{guardian.phone}</span>
                            </div>
                          )}
                          {!guardian.email && !guardian.phone && (
                            <span className="text-sm text-muted-foreground">Sin contacto</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="text-sm font-medium">
                            {guardian.athletes && guardian.athletes.length > 0
                              ? guardian.athletes.length
                              : 'Ninguno'}
                          </span>
                          {guardian.athletes && guardian.athletes.length > 0 && (
                            <span className="text-sm text-muted-foreground">
                              atleta{guardian.athletes.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={guardian.active ? "default" : "secondary"}
                          className={guardian.active ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {guardian.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(guardian.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {!selectionMode && (
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(guardian)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {canEdit && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(guardian)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {canDelete && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Eliminar tutor?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción marcará el tutor <strong>{guardian.fullName}</strong> como inactivo. Esta acción no se puede deshacer.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(guardian)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Confirmar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {guardians.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Mostrando {pagination.page * pagination.size + 1} a{' '}
                  {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} de{' '}
                  {pagination.totalElements} tutores
                </p>
                <Select
                  value={pagination.size.toString()}
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
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
                  onClick={() => handlePageChange(0)}
                  disabled={pagination.first}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex items-center gap-1 px-2 text-sm">
                  Página {pagination.page + 1} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.totalPages - 1)}
                  disabled={pagination.last}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
