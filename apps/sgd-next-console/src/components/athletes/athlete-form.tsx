"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Save, 
  X, 
  Calendar, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  UserPlus,
  Trash2,
  AlertTriangle,
  Users
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import { CategorySelector } from '@/components/common/category-selector';
import { GuardianSelector } from '@/components/common/guardian-selector';
import type { 
  AthleteResponse, 
  AthleteCreateRequest,
  AthleteUpdateRequest,
  SportResponse,
  VenueResponse,
  GuardianAssociation,
  GuardianInfo
} from '@/types/api';
import { 
  PHONE_PATTERN, 
  PHONE_FORMAT_MESSAGE, 
  MIN_ATHLETE_AGE, 
  MAX_ATHLETE_AGE,
  MINOR_AGE_LIMIT 
} from '@/types/api';

// Schema de validación con Zod
const athleteFormSchema = z.object({
  fullName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  birthDate: z.string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= MIN_ATHLETE_AGE && age <= MAX_ATHLETE_AGE;
    }, `La edad debe estar entre ${MIN_ATHLETE_AGE} y ${MAX_ATHLETE_AGE} años`),
  gender: z.enum(['M', 'F', '']).optional(),
  email: z.string()
    .email('Email inválido')
    .max(255, 'El email no puede exceder 255 caracteres')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .regex(PHONE_PATTERN, PHONE_FORMAT_MESSAGE)
    .optional()
    .or(z.literal('')),
  address: z.string()
    .max(1000, 'La dirección no puede exceder 1000 caracteres')
    .optional(),
  identificationNumber: z.string()
    .max(50, 'El número de identificación no puede exceder 50 caracteres')
    .optional(),
  emergencyContact: z.string()
    .max(255, 'El contacto de emergencia no puede exceder 255 caracteres')
    .optional(),
  emergencyPhone: z.string()
    .regex(PHONE_PATTERN, PHONE_FORMAT_MESSAGE)
    .optional()
    .or(z.literal('')),
  medicalNotes: z.string()
    .max(2000, 'Las notas médicas no pueden exceder 2000 caracteres')
    .optional(),
  venueId: z.number()
    .positive('Debe seleccionar una sede'),
  sportId: z.number()
    .positive('Debe seleccionar un deporte'),
  categoryId: z.number()
    .positive('Debe seleccionar una categoría'),
  guardians: z.array(z.object({
    guardianId: z.number().positive(),
    relationship: z.string().min(2).max(50),
    isPrimary: z.boolean().optional()
  })).optional()
});

type AthleteFormData = z.infer<typeof athleteFormSchema>;

interface AthleteFormProps {
  /** Atleta existente para editar (opcional) */
  athlete?: AthleteResponse;
  /** Modo del formulario */
  mode: 'create' | 'edit';
  /** Callback al guardar exitosamente */
  onSuccess?: (athlete: AthleteResponse) => void;
  /** Callback al cancelar */
  onCancel?: () => void;
}

export function AthleteForm({
  athlete,
  mode,
  onSuccess,
  onCancel
}: AthleteFormProps) {
  const router = useRouter();
  const { showSuccess } = useErrorHandler();
  
  // Estados locales
  const [sports, setSports] = useState<SportResponse[]>([]);
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedGuardians, setSelectedGuardians] = useState<GuardianInfo[]>([]);
  const [guardianAssociations, setGuardianAssociations] = useState<GuardianAssociation[]>([]);

  // Form setup
  const form = useForm<AthleteFormData>({
    resolver: zodResolver(athleteFormSchema),
    defaultValues: {
      fullName: athlete?.fullName || '',
      birthDate: athlete?.birthDate || '',
      gender: athlete?.gender || '',
      email: athlete?.email || '',
      phone: athlete?.phone || '',
      address: athlete?.address || '',
      identificationNumber: athlete?.identificationNumber || '',
      emergencyContact: athlete?.emergencyContact || '',
      emergencyPhone: athlete?.emergencyPhone || '',
      medicalNotes: athlete?.medicalNotes || '',
      venueId: athlete?.venue.id || 0,
      sportId: athlete?.sport.id || 0,
      categoryId: athlete?.category.id || 0,
      guardians: athlete?.guardians?.map(g => ({
        guardianId: g.id,
        relationship: g.relationship,
        isPrimary: g.isPrimary
      })) || []
    }
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingData(true);
        const [sportsData, venuesData] = await Promise.all([
          apiClient.getSports({ includeCategories: true }),
          apiClient.getVenues()
        ]);
        
        setSports(sportsData);
        setVenues(venuesData);

        // Si es modo edición, cargar tutores asociados
        if (mode === 'edit' && athlete) {
          setSelectedGuardians(athlete.guardians);
          setGuardianAssociations(athlete.guardians.map(g => ({
            guardianId: g.id,
            relationship: g.relationship,
            isPrimary: g.isPrimary
          })));
        }
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, [mode, athlete]);

  // Calcular edad desde fecha de nacimiento
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Verificar si es menor de edad
  const watchedBirthDate = form.watch('birthDate');
  const currentAge = calculateAge(watchedBirthDate);
  const isMinor = currentAge < MINOR_AGE_LIMIT;

  // Handler para submit del formulario
  const onSubmit = async (data: AthleteFormData) => {
    try {
      setIsLoading(true);

      // Validación específica: menores deben tener al menos un tutor
      if (isMinor && guardianAssociations.length === 0) {
        form.setError('guardians', {
          message: 'Los atletas menores de 18 años deben tener al menos un tutor asociado'
        });
        return;
      }

      // Validar que solo haya un tutor primario
      const primaryGuardians = guardianAssociations.filter(g => g.isPrimary);
      if (primaryGuardians.length > 1) {
        form.setError('guardians', {
          message: 'Solo puede haber un tutor principal'
        });
        return;
      }

      if (mode === 'create') {
        const createRequest: AthleteCreateRequest = {
          ...data,
          venueId: data.venueId,
          sportId: data.sportId,
          categoryId: data.categoryId,
          guardians: guardianAssociations
        };

        const newAthlete = await apiClient.createAthlete(createRequest);
        showSuccess('Atleta creado exitosamente');
        onSuccess?.(newAthlete);
        router.push(`/admin/athletes/${newAthlete.id}`);
      } else {
        const updateRequest: AthleteUpdateRequest = {
          fullName: data.fullName,
          email: data.email || undefined,
          phone: data.phone || undefined,
          address: data.address || undefined,
          emergencyContact: data.emergencyContact || undefined,
          emergencyPhone: data.emergencyPhone || undefined,
          medicalNotes: data.medicalNotes || undefined,
          venueId: data.venueId,
          categoryId: data.categoryId
        };

        const updatedAthlete = await apiClient.updateAthlete(athlete!.id, updateRequest);
        
        // Actualizar asociaciones de tutores si es necesario
        // TODO: Implementar lógica para actualizar tutores asociados
        
        showSuccess('Atleta actualizado exitosamente');
        onSuccess?.(updatedAthlete);
        router.push(`/admin/athletes/${updatedAthlete.id}`);
      }
    } catch (error) {
      console.error('Error saving athlete:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para cancelar
  const handleCancel = () => {
    if (form.formState.isDirty) {
      setShowCancelDialog(true);
    } else {
      onCancel?.() || router.back();
    }
  };

  // Handler para confirmar cancelación
  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    onCancel?.() || router.back();
  };

  // Handler para selección de tutores
  const handleGuardianSelection = (guardians: GuardianInfo[], associations: GuardianAssociation[]) => {
    setSelectedGuardians(guardians);
    setGuardianAssociations(associations);
    form.setValue('guardians', associations);
    
    // Limpiar error de tutores si se resolvió
    if (associations.length > 0) {
      form.clearErrors('guardians');
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'create' ? 'Registrar Nuevo Atleta' : 'Editar Atleta'}
          </h2>
          <p className="text-muted-foreground">
            {mode === 'create' 
              ? 'Complete la información del atleta para registrarlo en el sistema'
              : 'Modifique la información del atleta'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Datos básicos del atleta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Carlos Pérez López" {...field} />
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
                        <Input type="date" {...field} />
                      </FormControl>
                      {watchedBirthDate && (
                        <FormDescription className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {currentAge} años
                          {isMinor && (
                            <Badge variant="outline" className="ml-2">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Menor de edad
                            </Badge>
                          )}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">No especificar</SelectItem>
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
                        <Input placeholder="DUI, Pasaporte, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="atleta@ejemplo.com" 
                          {...field} 
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
                        />
                      </FormControl>
                      <FormDescription>
                        {PHONE_FORMAT_MESSAGE}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Dirección completa del atleta"
                          {...field} 
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
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Información Deportiva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="venueId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sede *</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione sede" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {venues.map((venue) => (
                            <SelectItem key={venue.id} value={venue.id.toString()}>
                              {venue.name}
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
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          // Reset categoría cuando cambia el deporte
                          form.setValue('categoryId', 0);
                        }} 
                        defaultValue={field.value?.toString()}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría *</FormLabel>
                      <CategorySelector
                        sportId={form.watch('sportId')}
                        athleteAge={currentAge}
                        athleteGender={form.watch('gender')}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!form.watch('sportId')}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contacto de Emergencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Contacto de Emergencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="María Pérez (Madre)" {...field} />
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
                        <Input placeholder="+503 1234-5678" {...field} />
                      </FormControl>
                      <FormDescription>
                        {PHONE_FORMAT_MESSAGE}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tutores (solo para menores) */}
          {isMinor && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Tutores Responsables
                  <Badge variant="destructive">Obligatorio</Badge>
                </CardTitle>
                <CardDescription>
                  Los atletas menores de 18 años deben tener al menos un tutor asociado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GuardianSelector
                  selectedGuardians={selectedGuardians}
                  guardianAssociations={guardianAssociations}
                  onSelectionChange={handleGuardianSelection}
                  required={true}
                />
                <FormField
                  control={form.control}
                  name="guardians"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Notas Médicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Información Médica
              </CardTitle>
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
                        placeholder="Alergias, medicamentos, condiciones médicas relevantes..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Información médica relevante para el entrenamiento y competencias
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Dialog de confirmación para cancelar */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              Tienes cambios sin guardar. Si continúas, se perderán todos los cambios realizados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar Editando</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Descartar Cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}