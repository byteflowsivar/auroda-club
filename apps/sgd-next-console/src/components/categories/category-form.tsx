"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, X, Target } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import type { CategoryResponse, CategoryCreateRequest, CategoryUpdateRequest, SportResponse } from '@/types/api';

// Esquema de validación Zod basado en OpenAPI
const categoryFormSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres')
    .regex(/\S/, 'El nombre no puede estar vacío'),
  
  
  sportId: z.number({
    error: 'Debe seleccionar un deporte',
  }).int().positive('ID de deporte inválido'),
  
  minAge: z.number({
    error: 'La edad mínima es requerida',
  }).int()
    .min(4, 'La edad mínima debe ser al menos 4 años')
    .max(65, 'La edad mínima no puede exceder 65 años'),
  
  maxAge: z.number({
    error: 'La edad máxima es requerida',
  }).int()
    .min(4, 'La edad máxima debe ser al menos 4 años')
    .max(65, 'La edad máxima no puede exceder 65 años'),
  
  ageRange: z.string()
    .min(1, 'El rango de edad es requerido')
    .max(50, 'El rango de edad no puede exceder 50 caracteres'),
  
}).refine((data) => data.maxAge >= data.minAge, {
  message: 'La edad máxima debe ser mayor o igual a la edad mínima',
  path: ['maxAge'],
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  /** ID de la categoría para edición (opcional) */
  categoryId?: number;
  
  /** ID del deporte (requerido para crear categoría) */
  sportId?: number;
  
  /** Nombre del deporte (opcional, para mostrar cuando sportId está presente) */
  sportName?: string;

  /** Callback al guardar exitosamente */
  onSave?: (category: CategoryResponse) => void;
  
  /** Callback al cancelar */
  onCancel?: () => void;
  
  /** Modo del formulario */
  mode?: 'create' | 'edit';
}

export function CategoryForm({ 
  categoryId, 
  sportId,
  sportName,
  onSave, 
  onCancel,
  mode = categoryId ? 'edit' : 'create'
}: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(!!categoryId);
  const [sports, setSports] = useState<SportResponse[]>([]);
  const [loadingSports, setLoadingSports] = useState(true);
  
  const { showSuccess, showError } = useErrorHandler();

  // Configurar formulario con validación
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      sportId: sportId,
      minAge: 6,
      maxAge: 18,
      ageRange: '',
    },
  });

  const { watch, setValue } = form;
  const minAge = watch('minAge');
  const maxAge = watch('maxAge');

  // Auto-generar ageRange cuando cambian las edades
  useEffect(() => {
    if (minAge && maxAge && minAge <= maxAge) {
      const range = minAge === maxAge ? `${minAge} años` : `${minAge}-${maxAge} años`;
      setValue('ageRange', range, { shouldValidate: true });
    }
  }, [minAge, maxAge, setValue]);

  // Cargar deportes disponibles
  useEffect(() => {
    const loadSports = async () => {
      // No cargar deportes si ya tenemos un sportId
      if (sportId) {
        setLoadingSports(false);
        return;
      }
      try {
        setLoadingSports(true);
        const sportsData = await apiClient.getSports({ includeCategories: false });
        setSports(sportsData.filter(sport => sport.active));
      } catch (error) {
        console.error('Error loading sports:', error);
        showError('No se pudieron cargar los deportes');
      } finally {
        setLoadingSports(false);
      }
    };

    loadSports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportId]);

  // Cargar datos de la categoría si está en modo edición
  useEffect(() => {
    if (!categoryId) return;

    const loadCategory = async () => {
      try {
        setLoadingCategory(true);
        const category = await apiClient.getCategory(categoryId);
        
        form.reset({
          name: category.name,
          sportId: category.sport?.id,
          minAge: category.minAge,
          maxAge: category.maxAge,
          ageRange: category.ageRange,
        });
      } catch (error) {
        console.error('Error loading category:', error);
        showError('No se pudo cargar la categoría');
      } finally {
        setLoadingCategory(false);
      }
    };

    loadCategory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  // Manejar envío del formulario
  const handleSubmit = async (data: CategoryFormData) => {
    try {
      setLoading(true);

      let result: CategoryResponse;

      if (mode === 'create') {
        const createData: CategoryCreateRequest = {
          name: data.name,
          sportId: data.sportId,
          minAge: data.minAge,
          maxAge: data.maxAge,
          ageRange: data.ageRange
        };
        result = await apiClient.createCategory(createData);
        showSuccess('Categoría creada exitosamente');
      } else {
        const updateData: CategoryUpdateRequest = {
          name: data.name,
          sportId: data.sportId,
          minAge: data.minAge,
          maxAge: data.maxAge,
          ageRange: data.ageRange
        };
        result = await apiClient.updateCategory(categoryId!, updateData);
        showSuccess('Categoría actualizada exitosamente');
      }

      onSave?.(result);

    } catch (error) {
      console.error('Error saving category:', error);
      showError(
        mode === 'create' 
          ? 'Error al crear la categoría' 
          : 'Error al actualizar la categoría'
      );
    } finally {
      setLoading(false);
    }
  };

  // Mostrar cargando si está cargando los datos iniciales
  if (loadingCategory || loadingSports) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {mode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                <div className="h-10 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {mode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Nombre de la categoría */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre de la Categoría <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Sub-18, Juvenil, Senior..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Nombre identificativo de la categoría (2-255 caracteres)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Deporte */}
            {sportId ? (
              <FormItem>
                <FormLabel>Deporte</FormLabel>
                <FormControl>
                  <Input 
                    value={sportName || `ID: ${sportId}`} 
                    disabled 
                    className="bg-muted"
                  />
                </FormControl>
                <FormDescription>
                  {mode === 'edit' 
                    ? 'El deporte de una categoría no se puede cambiar.'
                    : 'Creando categoría para este deporte.'
                  }
                </FormDescription>
              </FormItem>
            ) : (
              <FormField
                control={form.control}
                name="sportId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Deporte <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      disabled={mode === 'edit'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar deporte" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sports.map((sport) => (
                          <SelectItem key={sport.id} value={sport.id.toString()}>
                            {sport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecciona el deporte para esta categoría
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Edades mínima y máxima */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Edad Mínima <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={4}
                        max={65}
                        placeholder="6"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Edad mínima en años (4-65)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Edad Máxima <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={4}
                        max={65}
                        placeholder="18"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Edad máxima en años (4-65)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Rango de edad (auto-generado) */}
            <FormField
              control={form.control}
              name="ageRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Rango de Edad <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Se genera automáticamente..."
                      {...field}
                      readOnly
                      className="bg-muted"
                    />
                  </FormControl>
                  <FormDescription>
                    Se genera automáticamente basado en las edades mínima y máxima
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              )}
              
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {mode === 'create' ? 'Crear Categoría' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}