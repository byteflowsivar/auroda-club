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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Edit,
  Trash2,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Users,
  Trophy,
  AlertTriangle,
  MoreHorizontal,
  Copy,
  Activity
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import type { AthleteResponse } from '@/types/api';

interface AthleteDetailProps {
  /** ID del atleta */
  athleteId: number;
  /** Callback cuando se elimina el atleta */
  onDelete?: () => void;
}

export function AthleteDetail({ athleteId, onDelete }: AthleteDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { showSuccess } = useErrorHandler();

  // Estados locales
  const [athlete, setAthlete] = useState<AthleteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Cargar datos del atleta
  useEffect(() => {
    const loadAthleteData = async () => {
      try {
        setLoading(true);
        const athleteData = await apiClient.getAthlete(athleteId);
        setAthlete(athleteData);
      } catch (error) {
        console.error('Error loading athlete:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAthleteData();
  }, [athleteId]);

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

  // Obtener iniciales del nombre
  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handler para editar
  const handleEdit = () => {
    router.push(`/admin/athletes/${athleteId}/edit`);
  };

  // Handler para eliminar
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await apiClient.deleteAthlete(athleteId);
      showSuccess('Atleta eliminado exitosamente');
      setShowDeleteDialog(false);
      onDelete?.();
      router.push('/admin/athletes');
    } catch (error) {
      console.error('Error deleting athlete:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Handler para copiar información
  const handleCopyInfo = () => {
    if (!athlete) return;
    
    const info = `
Atleta: ${athlete.fullName}
Edad: ${calculateAge(athlete.birthDate)} años
Deporte: ${athlete.sport.name}
Categoría: ${athlete.category.name}
Sede: ${athlete.venue.name}
Email: ${athlete.email || 'No registrado'}
Teléfono: ${athlete.phone || 'No registrado'}
    `.trim();
    
    navigator.clipboard.writeText(info);
    showSuccess('Información copiada al portapapeles');
  };

  // Verificar permisos
  const canEdit = session?.user?.roles?.includes('ADMIN_GENERAL') || 
                  session?.user?.roles?.includes('ADMIN_CLUB');
  const canDelete = session?.user?.roles?.includes('ADMIN_GENERAL');

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

  if (!athlete) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Atleta no encontrado</h3>
        <p className="text-muted-foreground mb-4">
          No se pudo cargar la información del atleta.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>
    );
  }

  const age = calculateAge(athlete.birthDate);
  const isMinor = age < 18;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{athlete.fullName}</h1>
            <p className="text-muted-foreground">
              {athlete.sport.name} - {athlete.category.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
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
              <DropdownMenuSeparator />
              {canEdit && (
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {canEdit && (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Estado del atleta */}
      <div className="flex items-center gap-2">
        <Badge 
          variant={athlete.active ? "default" : "secondary"}
          className={athlete.active ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {athlete.active ? 'Activo' : 'Inactivo'}
        </Badge>
        {isMinor && (
          <Badge variant="outline">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Menor de edad
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {getInitials(athlete.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{athlete.fullName}</h3>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {age} años ({formatDate(athlete.birthDate)})
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              {athlete.gender && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Género:</span>
                  <span>{athlete.gender === 'M' ? 'Masculino' : 'Femenino'}</span>
                </div>
              )}
              
              {athlete.identificationNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Identificación:</span>
                  <span>{athlete.identificationNumber}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de registro:</span>
                <span>{formatDate(athlete.registrationDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p>{athlete.email || 'No registrado'}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Teléfono</span>
                </div>
                <p>{athlete.phone || 'No registrado'}</p>
              </div>

              {athlete.address && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Dirección</span>
                  </div>
                  <p>{athlete.address}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información Deportiva */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Información Deportiva
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deporte:</span>
                <Badge variant="outline">{athlete.sport.name}</Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Categoría:</span>
                <span>{athlete.category.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Sede:</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{athlete.venue.name}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Club:</span>
                <span>{athlete.club.name}</span>
              </div>
            </div>

            {athlete.sport.description && (
              <>
                <Separator />
                <div>
                  <span className="text-sm font-medium">Descripción del deporte:</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {athlete.sport.description}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Contacto de Emergencia */}
        {(athlete.emergencyContact || athlete.emergencyPhone) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Contacto de Emergencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {athlete.emergencyContact && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contacto:</span>
                  <span>{athlete.emergencyContact}</span>
                </div>
              )}

              {athlete.emergencyPhone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span>{athlete.emergencyPhone}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tutores (si es menor de edad) */}
        {isMinor && athlete.guardians.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Tutores Responsables
                <Badge variant="secondary">{athlete.guardians.length}</Badge>
              </CardTitle>
              <CardDescription>
                Tutores asociados al atleta menor de edad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {athlete.guardians.map((guardian) => (
                  <div key={guardian.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(guardian.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{guardian.fullName}</span>
                          {guardian.isPrimary && (
                            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-xs">
                              Principal
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {guardian.relationship}
                        </div>
                        {guardian.phone && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {guardian.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notas Médicas */}
        {athlete.medicalNotes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notas Médicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">
                {athlete.medicalNotes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Creado:</span>
                <span>{formatDate(athlete.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Última actualización:</span>
                <span>{formatDate(athlete.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar atleta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el registro de <strong>{athlete.fullName}</strong> 
              y todos sus datos asociados. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
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