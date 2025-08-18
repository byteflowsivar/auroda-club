"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, X, Building, Calendar, User } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import { ClubUtils } from '@/lib/config';
import { VenueResponse, VenueUpdateRequest } from '@/types';
import { Badge } from "@/components/ui/badge";

const venueFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(255),
  code: z.string().min(3, 'El código debe tener al menos 3 caracteres').max(50),
  address: z.string().optional(),
  phone: z.string().optional(),
  active: z.boolean().default(true),
});

type VenueFormData = z.infer<typeof venueFormSchema>;

interface VenueFormProps {
  venueId?: number;
  onSuccess?: (venue: VenueResponse) => void;
  onCancel?: () => void;
}

export function VenueForm({ venueId, onSuccess, onCancel }: VenueFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useErrorHandler();

  const [loading, setLoading] = useState(!!venueId);
  const [submitting, setSubmitting] = useState(false);
  const [venue, setVenue] = useState<VenueResponse | null>(null);

  const isEditMode = !!venueId;

  const form = useForm<VenueFormData>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      name: '',
      code: '',
      address: '',
      phone: '',
      active: true,
    },
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        if (isEditMode && venueId) {
          setLoading(true);
          const venueData = await apiClient.getVenue(venueId);
          setVenue(venueData);
          form.reset({
            name: venueData.name,
            code: venueData.code,
            address: venueData.address || '',
            phone: venueData.phone || '',
            active: venueData.active,
          });
        }
      } catch (error) {
        console.error("Error loading venue data:", error);
        showError('No se pudieron cargar los datos de la sede.');
        router.push('/admin/config/venues');
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId, isEditMode]);

  const onSubmit = async (data: VenueFormData) => {
    setSubmitting(true);
    try {
      let result: VenueResponse;
      if (isEditMode && venueId) {
        const updateData: VenueUpdateRequest = {
            name: data.name,
            address: data.address,
            phone: data.phone,
            active: data.active,
        };
        result = await apiClient.updateVenue(venueId, updateData);
        showSuccess(`Sede "${result.name}" actualizada exitosamente`);
      } else {
        const createData = {
            name: data.name,
            code: data.code,
            address: data.address,
            phone: data.phone,
        };
        result = await apiClient.createVenue(createData);
        showSuccess(`Sede "${result.name}" creada exitosamente`);
      }
      
      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push('/admin/config/venues');
      }
    } catch (error) {
        const action = isEditMode ? 'actualizar' : 'crear';
        console.error(`Error al ${action} la sede:`, error);
        showError(`Error al ${action} la sede`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/admin/config/venues');
    }
  };
  
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div>Cargando formulario...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-6 w-6" />
          {isEditMode ? 'Editar Sede' : 'Nueva Sede'}
        </CardTitle>
        <CardDescription>
          {isEditMode ? 'Modifica la información de la sede.' : 'Ingresa los datos para una nueva sede deportiva.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Sede *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Estadio Cuscatlán" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: EST-CUS" {...field} disabled={isEditMode} />
                  </FormControl>
                  <FormDescription>El código no se puede cambiar una vez creado.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Club información (solo lectura) */}
            <FormItem>
              <FormLabel>Club</FormLabel>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{ClubUtils.getCurrentClub().name}</span>
                <Badge variant="outline" className="text-xs">Instancia actual</Badge>
              </div>
              <FormDescription>
                Esta sede pertenece automáticamente al club de esta instancia.
              </FormDescription>
            </FormItem>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección completa de la sede" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+503 2222-2222" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditMode && (
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Sede Activa</FormLabel>
                      <FormDescription>
                        Las sedes inactivas no se mostrarán para nuevas inscripciones.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            {isEditMode && venue && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Información Adicional</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold">Club: </span> {ClubUtils.getCurrentClub().name}
                        </div>
                        <div>
                            <span className="font-semibold">Estado: </span> 
                            <Badge variant={venue.active ? 'default' : 'secondary'}>{venue.active ? 'Activa' : 'Inactiva'}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4"/>
                            <div><span className="font-semibold">Creada: </span> {formatDate(venue.createdAt)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4"/>
                            <div><span className="font-semibold">Actualizada: </span> {formatDate(venue.updatedAt)}</div>
                        </div>
                    </div>
                  </div>
                </>
            )}

            <Separator />
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {isEditMode ? 'Guardar Cambios' : 'Crear Sede'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}