"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Trophy,
  Save,
  ArrowLeft,
  Loader2,
  Target,
  Calendar,
  User,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import type { 
  SportResponse,
  SportCreateRequest,
  SportUpdateRequest
} from '@/types/api';

// Schema de validación basado en OpenAPI
const sportFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres')
    .regex(/\S/, 'El nombre no puede estar vacío'),
  description: z
    .string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
});

type SportFormData = z.infer<typeof sportFormSchema>;

interface SportFormProps {
  /** ID del deporte a editar (opcional, si no se proporciona es modo creación) */
  sportId?: number;
  /** Callback cuando se guarda exitosamente */
  onSuccess?: (sport: SportResponse) => void;
  /** Callback cuando se cancela */
  onCancel?: () => void;
}

export function SportForm({
  sportId,
  onSuccess,
  onCancel
}: SportFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useErrorHandler();

  // Estados
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sport, setSport] = useState<SportResponse | null>(null);

  // Determinar modo
  const isEditMode = !!sportId;
  const pageTitle = isEditMode ? 'Editar Deporte' : 'Nuevo Deporte';
  const submitText = isEditMode ? 'Actualizar Deporte' : 'Crear Deporte';

  // Configurar formulario
  const form = useForm<SportFormData>({
    resolver: zodResolver(sportFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Cargar deporte en modo edición
  useEffect(() => {
    if (isEditMode && sportId) {
      loadSport();
    }
  }, [sportId, isEditMode]);

  const loadSport = async () => {
    if (!sportId) return;

    setLoading(true);
    try {
      const response = await apiClient.getSport(sportId);
      setSport(response);
      
      // Actualizar formulario con datos cargados
      form.reset({
        name: response.name,
        description: response.description || '',
      });
    } catch (error) {
      console.error('Error loading sport:', error);
      showError('Error al cargar el deporte');
      // Redirigir a la lista si hay error cargando
      router.push('/admin/config/sports');
    } finally {
      setLoading(false);
    }
  };

  // Enviar formulario
  const onSubmit = async (data: SportFormData) => {
    setSubmitting(true);
    try {
      let result: SportResponse;

      if (isEditMode && sportId) {
        // Actualizar deporte existente
        const updateData: SportUpdateRequest = {
          name: data.name,
          description: data.description || undefined,
        };
        result = await apiClient.updateSport(sportId, updateData);
        showSuccess(`Deporte "${result.name}" actualizado exitosamente`);
      } else {
        // Crear nuevo deporte
        const createData: SportCreateRequest = {
          name: data.name,
          description: data.description || undefined,
        };
        result = await apiClient.createSport(createData);
        showSuccess(`Deporte "${result.name}" creado exitosamente`);
      }

      // Callback de éxito o navegar
      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push('/admin/config/sports');
      }

    } catch (error) {
      console.error('Error saving sport:', error);
      const action = isEditMode ? 'actualizar' : 'crear';
      showError(`Error al ${action} el deporte`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handler para cancelar
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/admin/config/sports');
    }
  };

  // Formatear fecha para display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-muted rounded animate-pulse" />
            <div className="h-7 bg-muted rounded animate-pulse w-48" />
          </div>
          <div className="h-4 bg-muted rounded animate-pulse w-72" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse w-32" />
            <div className="h-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-muted rounded animate-pulse w-32" />
            <div className="h-10 bg-muted rounded animate-pulse w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">{pageTitle}</CardTitle>
              <CardDescription>
                {isEditMode 
                  ? 'Modifica la información del deporte'
                  : 'Ingresa la información del nuevo deporte'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Información Básica</h3>
                </div>
                
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Deporte *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Fútbol, Baloncesto, Natación..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción del deporte, reglas básicas, equipamiento necesario..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Información del deporte existente */}
              {isEditMode && sport && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <h3 className="text-lg font-medium">Información del Deporte</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Estado
                        </label>
                        <Badge 
                          variant={sport.active ? "default" : "secondary"}
                          className={sport.active ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {sport.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Categorías Asociadas
                        </label>
                        <div className="flex items-center gap-2">
                          <Target className="h-3 w-3" />
                          <span className="text-sm">
                            {sport.categories?.length || 0} categoría{sport.categories?.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Fecha de Creación
                        </label>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3" />
                          {formatDate(sport.createdAt)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Última Actualización
                        </label>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-3 w-3" />
                          {formatDate(sport.updatedAt)}
                        </div>
                      </div>
                    </div>

                    {/* Mostrar categorías si existen */}
                    {sport.categories && sport.categories.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Categorías
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {sport.categories.map((category) => (
                            <Badge key={category.id} variant="outline">
                              {category.name} ({category.minAge}-{category.maxAge} años)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Botones de acción */}
              <Separator />
              <div className="flex items-center justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="min-w-32"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEditMode ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {submitText}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}