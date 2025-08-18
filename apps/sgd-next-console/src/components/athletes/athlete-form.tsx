"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, AlertTriangle, User, MapPin, Phone, Heart, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { CategorySelector } from '@/components/common/category-selector';
import { GuardianSelector } from '@/components/common/guardian-selector';

import { apiClient } from '@/lib/api';
import type { 
  AthleteCreateRequest, 
  AthleteUpdateRequest, 
  AthleteResponse,
  SportResponse,
  VenueResponse,
  GuardianAssociation 
} from '@/types/api';
import { PHONE_PATTERN, PHONE_FORMAT_MESSAGE, MINOR_AGE_LIMIT } from '@/types/api';

// Esquema de validación basado en el OpenAPI spec
const athleteFormSchema = z.object({
  // Datos básicos - requeridos
  fullName: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "El nombre no puede exceder 255 caracteres")
    .refine((val) => val.trim().length > 0, "El nombre es requerido"),
  
  birthDate: z.string()
    .min(1, "La fecha de nacimiento es requerida")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
      return date >= minDate && date <= maxDate;
    }, "La edad debe estar entre 5 y 60 años"),

  venueId: z.number()
    .min(1, "La sede es requerida"),

  sportId: z.number()
    .min(1, "El deporte es requerido"),

  categoryId: z.number()
    .min(1, "La categoría es requerida"),

  // Datos opcionales
  gender: z.enum(['M', 'F']),

  email: z.string()
    .max(255, "El email no puede exceder 255 caracteres")
    .email("Formato de email inválido")
    .optional()
    .or(z.literal('')),

  phone: z.string()
    .max(50, "El teléfono no puede exceder 50 caracteres")
    .regex(PHONE_PATTERN, PHONE_FORMAT_MESSAGE)
    .optional()
    .or(z.literal('')),

  address: z.string()
    .max(1000, "La dirección no puede exceder 1000 caracteres")
    .optional(),

  identificationNumber: z.string()
    .max(50, "El número de identificación no puede exceder 50 caracteres")
    .optional(),

  emergencyContact: z.string()
    .max(255, "El contacto de emergencia no puede exceder 255 caracteres")
    .optional(),

  emergencyPhone: z.string()
    .max(50, "El teléfono de emergencia no puede exceder 50 caracteres")
    .regex(PHONE_PATTERN, PHONE_FORMAT_MESSAGE)
    .optional()
    .or(z.literal('')),

  medicalNotes: z.string()
    .max(2000, "Las notas médicas no pueden exceder 2000 caracteres")
    .optional(),

  // Tutores para menores de edad
  guardians: z.array(z.object({
    guardianId: z.number().min(1),
    relationship: z.string().min(2, "La relación debe tener al menos 2 caracteres").max(50),
    isPrimary: z.boolean().optional()
  })).optional()
});

type AthleteFormData = z.infer<typeof athleteFormSchema>;

interface AthleteFormProps {
  /** Atleta existente para edición (undefined para creación) */
  athlete?: AthleteResponse;
  /** Callback cuando se guarda exitosamente */
  onSave?: (athlete: AthleteResponse) => void;
  /** Callback para cancelar */
  onCancel?: () => void;
  /** Si el formulario está en modo solo lectura */
  readOnly?: boolean;
}

export function AthleteForm({ athlete, onSave, onCancel, readOnly = false }: AthleteFormProps) {
  const isEditing = !!athlete;
  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState<SportResponse[]>([]);
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [athleteAge, setAthleteAge] = useState<number | undefined>();
  const [isMinor, setIsMinor] = useState(false);

  const form = useForm<AthleteFormData>({
    resolver: zodResolver(athleteFormSchema),
    defaultValues: {
      fullName: athlete?.fullName || '',
      birthDate: athlete?.birthDate || '',
      venueId: athlete?.venue?.id || 0,
      sportId: athlete?.sport?.id || 0,
      categoryId: athlete?.category?.id || 0,
      gender: (athlete?.gender as 'M' | 'F') || 'M',
      email: athlete?.email || '',
      phone: athlete?.phone || '',
      address: athlete?.address || '',
      identificationNumber: athlete?.identificationNumber || '',
      emergencyContact: athlete?.emergencyContact || '',
      emergencyPhone: athlete?.emergencyPhone || '',
      medicalNotes: athlete?.medicalNotes || '',
      guardians: athlete?.guardians?.map(g => ({
        guardianId: g.id,
        relationship: g.relationship,
        isPrimary: g.isPrimary
      })) || []
    }
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sportsData, venuesData] = await Promise.all([
          apiClient.getSports({ includeCategories: true }),
          apiClient.getVenues()
        ]);
        
        setSports(sportsData);
        setVenues(venuesData);
      } catch (error) {
        console.error('Error loading form data:', error);
        toast.error('Error al cargar los datos del formulario');
      }
    };

    loadData();
  }, []);

  // Calcular edad cuando cambia la fecha de nacimiento
  useEffect(() => {
    const birthDate = form.watch('birthDate');
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      const age = today.getFullYear() - birth.getFullYear() - 
        (today.getMonth() < birth.getMonth() || 
         (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0);
      
      setAthleteAge(age);
      setIsMinor(age < MINOR_AGE_LIMIT);
    } else {
      setAthleteAge(undefined);
      setIsMinor(false);
    }
  }, [form.watch('birthDate')]);

  // Validar tutores para menores de edad
  const validateGuardians = (data: AthleteFormData): string | null => {
    if (isMinor && (!data.guardians || data.guardians.length === 0)) {
      return 'Los menores de edad deben tener al menos un tutor asociado';
    }

    if (data.guardians && data.guardians.length > 0) {
      const primaryGuardians = data.guardians.filter(g => g.isPrimary);
      if (primaryGuardians.length > 1) {
        return 'Solo puede haber un tutor primario';
      }
    }

    return null;
  };

  const onSubmit = async (data: AthleteFormData) => {
    try {
      setLoading(true);

      // Validar tutores
      const guardianError = validateGuardians(data);
      if (guardianError) {
        toast.error(guardianError);
        return;
      }

      // Preparar datos para el API
      const requestData: AthleteCreateRequest | AthleteUpdateRequest = {
        fullName: data.fullName,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        emergencyContact: data.emergencyContact || undefined,
        emergencyPhone: data.emergencyPhone || undefined,
        medicalNotes: data.medicalNotes || undefined,
        venueId: data.venueId,
        categoryId: data.categoryId,
        gender: data.gender,
      };

      if (isEditing) {
        // Actualizar atleta existente
        const updatedAthlete = await apiClient.updateAthlete(athlete.id, requestData as AthleteUpdateRequest);
        toast.success('Atleta actualizado exitosamente');
        onSave?.(updatedAthlete);
      } else {
        // Crear nuevo atleta
        const createData: AthleteCreateRequest = {
          ...requestData,
          birthDate: data.birthDate,
          sportId: data.sportId,
          guardians: data.guardians || [],
        };
        
        const newAthlete = await apiClient.createAthlete(createData);
        toast.success('Atleta creado exitosamente');
        onSave?.(newAthlete);
      }

    } catch (error: any) {
      console.error('Error saving athlete:', error);
      toast.error(error.message || 'Error al guardar el atleta');
    } finally {
      setLoading(false);
    }
  };

  const watchedSportId = form.watch('sportId');
  const watchedGender = form.watch('gender');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Datos Básicos */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Información Personal</CardTitle>
            </div>
            {athleteAge && (
              <Badge variant={isMinor ? "destructive" : "default"} className="ml-auto">
                {athleteAge} años {isMinor && "(Menor de edad)"}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nombre completo del atleta" 
                        {...field} 
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        disabled={readOnly || isEditing}
                      />
                    </FormControl>
                    <FormDescription>
                      {isEditing ? "La fecha de nacimiento no se puede modificar" : "Edad mínima: 5 años, máxima: 60 años"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={readOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione género" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
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
                        placeholder="DUI, Pasaporte, etc." 
                        {...field} 
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Información Deportiva */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <CardTitle>Información Deportiva</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="venueId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sede *</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString() || ""}
                      disabled={readOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione sede" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {venues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{venue.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {venue.code}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sportId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deporte *</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString() || ""}
                      disabled={readOnly || isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione deporte" />
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
                      {isEditing ? "El deporte no se puede modificar" : "Seleccione primero el deporte para ver las categorías"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría *</FormLabel>
                  <FormControl>
                    <CategorySelector
                      sportId={watchedSportId}
                      athleteAge={athleteAge}
                      athleteGender={watchedGender as 'M' | 'F' | undefined}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={readOnly || !watchedSportId}
                      placeholder="Seleccione categoría"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <CardTitle>Información de Contacto</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="correo@ejemplo.com" 
                        {...field} 
                        disabled={readOnly}
                      />
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
                      <Input 
                        placeholder="+503 1234-5678" 
                        {...field} 
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormDescription>
                      Formato: +503 1234-5678
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Dirección completa del atleta"
                      className="resize-none"
                      {...field} 
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contacto de Emergencia */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <CardTitle>Contacto de Emergencia</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Contacto</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nombre completo" 
                        {...field} 
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono de Emergencia</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+503 1234-5678" 
                        {...field} 
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormDescription>
                      Formato: +503 1234-5678
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notas Médicas */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Información Médica</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="medicalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Médicas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Alergias, medicamentos, condiciones médicas, etc."
                      className="resize-none min-h-[100px]"
                      {...field} 
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormDescription>
                    Información médica relevante para la práctica deportiva
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Tutores (solo para menores de edad) */}
        {(isMinor || (athlete?.guardians && athlete.guardians.length > 0)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Tutores / Guardianes</CardTitle>
                </div>
                {isMinor && (
                  <Badge variant="destructive">
                    Requerido para menores de edad
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isMinor && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Los menores de {MINOR_AGE_LIMIT} años deben tener al menos un tutor asociado.
                    Puede asignar tutores existentes o crear nuevos.
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="guardians"
                render={({ field }) => {
                  // Convertir guardians a formato esperado por GuardianSelector
                  const guardianInfos = (field.value || []).map((g: GuardianAssociation) => ({
                    id: g.guardianId,
                    fullName: `Guardian ${g.guardianId}`, // Se sobrescribirá al cargar datos
                    relationship: g.relationship,
                    isPrimary: g.isPrimary || false
                  }));

                  return (
                    <FormItem>
                      <FormLabel>Tutores Asociados</FormLabel>
                      <FormControl>
                        <GuardianSelector
                          selectedGuardians={guardianInfos}
                          guardianAssociations={field.value || []}
                          onSelectionChange={(guardians, associations) => {
                            field.onChange(associations);
                          }}
                          required={isMinor}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Botones de acción */}
        {!readOnly && (
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (isEditing ? "Actualizando..." : "Creando...") 
                : (isEditing ? "Actualizar Atleta" : "Crear Atleta")
              }
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}