"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Trophy,
  Target,
  Users,
  Calendar,
  MoreHorizontal,
  Copy,
  Activity,
  FileText,
  TrendingUp,
  Info,
  Edit,
  Trash2,
  Plus,
  Pencil
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import { CategoryForm } from '@/components/categories/category-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import type { SportResponse, CategoryInfo1 } from '@/types/api';

interface SportsDetailProps {
  /** ID del deporte */
  sportId: number;
}

export function SportsDetail({ sportId }: SportsDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { showSuccess } = useErrorHandler();

  // Estados locales
  const [sport, setSport] = useState<SportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo1 | null>(null);

  // Cargar datos del deporte
  useEffect(() => {
    const loadSportData = async () => {
      try {
        setLoading(true);
        const sportData = await apiClient.getSport(sportId);
        setSport(sportData);
      } catch (error) {
        console.error('Error loading sport:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSportData();
  }, [sportId]);

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handler para copiar información
  const handleCopyInfo = () => {
    if (!sport) return;
    
    const info = `
Deporte: ${sport.name}
Descripción: ${sport.description}
Categorías: ${sport.categories?.length || 0}
Estado: ${sport.active ? 'Activo' : 'Inactivo'}
Creado: ${formatDate(sport.createdAt)}
    `.trim();
    
    navigator.clipboard.writeText(info);
    showSuccess('Información copiada al portapapeles');
  };

  // Calcular estadísticas
  const getStats = () => {
    if (!sport?.categories) return { total: 0, active: 0, ageRange: null };
    
    const activeCategories = sport.categories.filter(cat => cat.active);
    const ages = sport.categories.map(cat => [cat.minAge, cat.maxAge]).flat();
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    
    return {
      total: sport.categories.length,
      active: activeCategories.length,
      ageRange: ages.length > 0 ? `${minAge}-${maxAge} años` : null
    };
  };

  const stats = getStats();

  // Verificar permisos
  const canEdit = session?.user?.roles?.includes('ADMIN_GENERAL') || false;
  const canDelete = session?.user?.roles?.includes('ADMIN_GENERAL') || false;

  // Handlers de navegación
  const handleEdit = () => {
    router.push(`/admin/config/sports/${sportId}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/config/sports');
  };

  // Handlers para gestión de categorías
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: CategoryInfo1) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleCategorySaved = async () => {
    setCategoryDialogOpen(false);
    setEditingCategory(null);
    
    // Recargar datos del deporte para actualizar categorías
    try {
      const updatedSport = await apiClient.getSport(sportId);
      setSport(updatedSport);
    } catch (error) {
      console.error('Error reloading sport data:', error);
    }
  };

  const handleDeleteCategory = async (category: CategoryInfo1) => {
    try {
      await apiClient.deleteCategory(category.id);
      showSuccess('Categoría eliminada exitosamente');
      
      // Recargar datos del deporte
      const updatedSport = await apiClient.getSport(sportId);
      setSport(updatedSport);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="h-8 bg-muted rounded animate-pulse mb-2" style={{ width: '200px' }} />
              <div className="h-4 bg-muted rounded animate-pulse" style={{ width: '100px' }} />
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!sport) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Deporte no encontrado</h3>
        <p className="text-muted-foreground mb-4">
          No se pudo cargar la información del deporte.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Trophy className="h-8 w-8 text-blue-600" />
              {sport.name}
            </h1>
            <p className="text-muted-foreground">
              {sport.categories?.length || 0} categoría{sport.categories?.length !== 1 ? 's' : ''} registrada{sport.categories?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleCopyInfo}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Información
              </DropdownMenuItem>
              {canEdit && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Deporte
                  </DropdownMenuItem>
                </>
              )}
              {canDelete && sport.categories?.length === 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Estado del deporte */}
      <div className="flex items-center gap-2">
        <Badge 
          variant={sport.active ? "default" : "secondary"}
          className={sport.active ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {sport.active ? 'Activo' : 'Inactivo'}
        </Badge>
        {stats.total > 0 && (
          <Badge variant="outline">
            <Target className="h-3 w-3 mr-1" />
            {stats.total} categoría{stats.total !== 1 ? 's' : ''}
          </Badge>
        )}
        {stats.ageRange && (
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            {stats.ageRange}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información del Deporte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información del Deporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{sport.name}</h3>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Creado {formatDate(sport.createdAt)}
              </div>
            </div>

            <Separator />

            <div>
              <span className="text-sm font-medium">Descripción:</span>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {sport.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Categorías</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-xs text-muted-foreground">Activas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Estadísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total categorías:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categorías activas:</span>
                <span className={`font-medium ${stats.active > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  {stats.active}
                </span>
              </div>

              {stats.ageRange && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rango de edades:</span>
                  <span className="font-medium">{stats.ageRange}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <span className={`font-medium ${sport.active ? 'text-green-600' : 'text-gray-500'}`}>
                  {sport.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            {stats.total > 0 && (
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground mb-2">Distribución de categorías:</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(stats.active / stats.total) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((stats.active / stats.total) * 100).toFixed(0)}% activas
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categorías */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Categorías del Deporte
                  <Badge variant="secondary">{sport.categories?.length || 0}</Badge>
                </CardTitle>
                <CardDescription>
                  {sport.categories && sport.categories.length > 0 
                    ? `Categorías de edad definidas para ${sport.name}`
                    : 'Este deporte no tiene categorías definidas'
                  }
                </CardDescription>
              </div>
              
              {canEdit && (
                <Button onClick={handleCreateCategory} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Categoría
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!sport.categories || sport.categories.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay categorías definidas para este deporte
                </p>
                {canEdit ? (
                  <div className="mt-4">
                    <Button onClick={handleCreateCategory} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primera Categoría
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    Las categorías se configuran desde el sistema administrativo
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {sport.categories
                  .sort((a, b) => a.minAge - b.minAge)
                  .map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{category.name}</span>
                          <Badge 
                            variant={category.active ? "default" : "secondary"}
                            className={category.active ? "bg-green-500 hover:bg-green-600 text-xs" : "text-xs"}
                          >
                            {category.active ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Edades: {category.minAge} - {category.maxAge} años
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rango: {category.ageRange}
                        </div>
                      </div>
                    </div>
                    
                    {canEdit && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
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
                              <AlertDialogTitle>¿Eliminar Categoría?</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Está seguro de que desea eliminar la categoría &quot;{category.name}&quot;? 
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCategory(category)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Creado:</span>
                <span>{formatDate(sport.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Última actualización:</span>
                <span>{formatDate(sport.updatedAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID del sistema:</span>
                <span className="font-mono text-xs">{sport.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información sobre permisos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Permisos y Operaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              {canEdit ? (
                <>
                  <p>
                    <strong>Permisos disponibles:</strong> Puede editar y gestionar este deporte.
                  </p>
                  <p>
                    Las categorías del deporte se configuran desde el módulo de categorías.
                  </p>
                  {canDelete && sport.categories?.length === 0 && (
                    <p className="text-red-600">
                      <strong>Eliminar:</strong> Este deporte puede ser eliminado porque no tiene categorías asociadas.
                    </p>
                  )}
                  {sport.categories && sport.categories.length > 0 && (
                    <p className="text-amber-600">
                      <strong>Nota:</strong> No se puede eliminar este deporte porque tiene categorías asociadas.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p>
                    <strong>Modo de solo lectura:</strong> No tiene permisos para modificar este deporte.
                  </p>
                  <p>
                    Para realizar cambios, contacte a un administrador del sistema.
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para crear/editar categorías */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? `Modificar la categoría "${editingCategory.name}" del deporte ${sport.name}`
                : `Crear una nueva categoría para el deporte ${sport.name}`
              }
            </DialogDescription>
          </DialogHeader>
          
          <CategoryForm
            categoryId={editingCategory?.id}
            sportId={sport.id}
            sportName={sport.name}
            mode={editingCategory ? 'edit' : 'create'}
            onSave={handleCategorySaved}
            onCancel={() => {
              setCategoryDialogOpen(false);
              setEditingCategory(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}