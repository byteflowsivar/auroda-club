"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
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
import { AlertTriangle, FileText, Loader2, Mail, MapPin, Phone, Save } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import {
  defaultGuardianFormValues,
  formatSalvadoranPhone,
  type GuardianCreateFormData,
  guardianCreateSchema,
  type GuardianUpdateFormData,
  guardianUpdateSchema,
  transformGuardianFormData
} from '@/lib/validations/guardian';
import type { GuardianCreateRequest, GuardianResponse, GuardianUpdateRequest } from '@/types/api';

interface GuardianFormProps {
  /** Tutor a editar (undefined para crear nuevo) */
  guardian?: GuardianResponse;
  /** Callback cuando se guarda exitosamente */
  onSuccess?: (guardian: GuardianResponse) => void;
  /** Callback cuando se cancela */
  onCancel?: () => void;
}

export function GuardianForm({ guardian, onSuccess, onCancel }: GuardianFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useErrorHandler();
  
  const isEditing = !!guardian;
  const [saving, setSaving] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  // Configurar formulario con el schema apropiado
  const form = useForm<GuardianCreateFormData | GuardianUpdateFormData>({
    resolver: zodResolver(isEditing ? guardianUpdateSchema : guardianCreateSchema),
    defaultValues: isEditing 
      ? {
          fullName: guardian.fullName || '',
          email: guardian.email || '',
          phone: guardian.phone || '',
          secondaryPhone: guardian.secondaryPhone || '',
          address: guardian.address || '',
          identificationNumber: guardian.identificationNumber || ''
        }
      : defaultGuardianFormValues
  });

  const { formState: { isDirty }, watch, setValue } = form;

  // Watch para formateo automático de teléfonos
  const phoneValue = watch('phone');
  const secondaryPhoneValue = watch('secondaryPhone');

  // Auto-formatear teléfono principal
  useEffect(() => {
    if (phoneValue && phoneValue.length >= 8 && !phoneValue.startsWith('+')) {
      const formatted = formatSalvadoranPhone(phoneValue);
      if (formatted !== phoneValue) {
        setValue('phone', formatted, { shouldValidate: true });
      }
    }
  }, [phoneValue, setValue]);

  // Auto-formatear teléfono secundario
  useEffect(() => {
    if (secondaryPhoneValue && secondaryPhoneValue.length >= 8 && !secondaryPhoneValue.startsWith('+')) {
      const formatted = formatSalvadoranPhone(secondaryPhoneValue);
      if (formatted !== secondaryPhoneValue) {
        setValue('secondaryPhone', formatted, { shouldValidate: true });
      }
    }
  }, [secondaryPhoneValue, setValue]);

  // Manejar envío del formulario
  const onSubmit = async (data: GuardianCreateFormData | GuardianUpdateFormData) => {
    try {
      setSaving(true);
      
      const transformedData = transformGuardianFormData(data);
      let result: GuardianResponse;

      if (isEditing) {
        result = await apiClient.updateGuardian(
          guardian.id, 
          transformedData as GuardianUpdateRequest
        );
        showSuccess(`Tutor ${result.fullName} actualizado exitosamente`);
      } else {
        result = await apiClient.createGuardian(transformedData as GuardianCreateRequest);
        showSuccess(`Tutor ${result.fullName} creado exitosamente`);
      }

      onSuccess?.(result);
      
      if (!onSuccess) {
        // Si no hay callback, navegar a la página de detalle
        router.push(`/admin/guardians/${result.id}`);
      }
    } catch (error) {
      console.error('Error saving guardian:', error);
      showError(isEditing ? 'Error al actualizar tutor' : 'Error al crear tutor');
    } finally {
      setSaving(false);
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      performCancel();
    }
  };

  const performCancel = () => {
    setShowCancelDialog(false);
    onCancel?.();
  };

  // Validar formato de teléfonos mientras se escribe
  const validatePhoneInput = (value: string) => {
    if (!value) return true;
    return /^(\+503\s[0-9]{0,4}-?[0-9]{0,4}|[0-9]{0,8})$/.test(value);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Información Personal */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <h3 className="text-lg font-semibold">Información Personal</h3>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: María Elena González"
                            {...field}
                            disabled={saving}
                          />
                        </FormControl>
                        <FormDescription>
                          Nombre completo del tutor responsable
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="identificationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Identificación</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: 12345678-9"
                            {...field}
                            disabled={saving}
                          />
                        </FormControl>
                        <FormDescription>
                          DUI, pasaporte u otro documento de identidad
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Información de Contacto */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <h3 className="text-lg font-semibold">Información de Contacto</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Ej: maria.gonzalez@email.com"
                            {...field}
                            disabled={saving}
                          />
                        </FormControl>
                        <FormDescription>
                          Email principal para comunicaciones
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Teléfono Principal
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: +503 7123-4567"
                            {...field}
                            disabled={saving}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (validatePhoneInput(value)) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Formato: +503 1234-5678
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Teléfono Secundario
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: +503 2123-4567"
                            {...field}
                            disabled={saving}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (validatePhoneInput(value)) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Teléfono alternativo (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Nota informativa sobre contacto */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Importante:</strong> Debe proporcionar al menos un email o teléfono de contacto.
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dirección */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <h3 className="text-lg font-semibold">Dirección</h3>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección Completa</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ej: Colonia Las Flores, Calle Principal #123, San Salvador"
                          className="min-h-[80px]"
                          {...field}
                          disabled={saving}
                        />
                      </FormControl>
                      <FormDescription>
                        Dirección completa incluyendo colonia, ciudad y departamento
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="min-w-[120px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEditing ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? 'Actualizar' : 'Crear Tutor'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Dialog de confirmación para cancelar */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              Hay cambios sin guardar en el formulario. Si continúa, se perderán todos los cambios realizados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={performCancel} className="bg-red-600 hover:bg-red-700">
              Descartar cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}