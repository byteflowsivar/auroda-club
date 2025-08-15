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
  Phone,
  Mail,
  MapPin,
  FileText,
  Users,
  Trophy,
  MoreHorizontal,
  Copy,
  Activity,
  Calendar,
  Building,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import type { GuardianResponse } from '@/types/api';

interface GuardianDetailProps {
  /** ID del tutor */
  guardianId: number;
  /** Callback cuando se elimina el tutor */
  onDelete?: () => void;
}

export function GuardianDetail({ guardianId, onDelete }: GuardianDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { showSuccess } = useErrorHandler();

  // Estados locales
  const [guardian, setGuardian] = useState<GuardianResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Cargar datos del tutor
  useEffect(() => {
    const loadGuardianData = async () => {
      try {
        setLoading(true);
        const guardianData = await apiClient.getGuardian(guardianId);
        setGuardian(guardianData);
      } catch (error) {
        console.error('Error loading guardian:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuardianData();
  }, [guardianId]);

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
    router.push(`/admin/guardians/${guardianId}/edit`);
  };

  // Handler para eliminar
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await apiClient.deleteGuardian(guardianId);
      showSuccess('Tutor eliminado exitosamente');
      setShowDeleteDialog(false);
      onDelete?.();
      router.push('/admin/guardians');
    } catch (error) {
      console.error('Error deleting guardian:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Handler para copiar información
  const handleCopyInfo = () => {
    if (!guardian) return;
    
    const info = `
Tutor: ${guardian.fullName}
Email: ${guardian.email || 'No registrado'}
Teléfono: ${guardian.phone || 'No registrado'}
${guardian.secondaryPhone ? `Teléfono secundario: ${guardian.secondaryPhone}` : ''}
${guardian.address ? `Dirección: ${guardian.address}` : ''}
Atletas asociados: ${guardian.athletes.length}
    `.trim();
    
    navigator.clipboard.writeText(info);
    showSuccess('Información copiada al portapapeles');
  };

  // Handler para ver atleta
  const handleViewAthlete = (athleteId: number) => {
    router.push(`/admin/athletes/${athleteId}`);
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

  if (!guardian) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Tutor no encontrado</h3>
        <p className="text-muted-foreground mb-4">
          No se pudo cargar la información del tutor.
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
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{guardian.fullName}</h1>
            <p className="text-muted-foreground">
              Tutor responsable de {guardian.athletes.length} atleta{guardian.athletes.length !== 1 ? 's' : ''}
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

      {/* Estado del tutor */}
      <div className="flex items-center gap-2">
        <Badge 
          variant={guardian.active ? "default" : "secondary"}
          className={guardian.active ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {guardian.active ? 'Activo' : 'Inactivo'}
        </Badge>
        {guardian.athletes.length > 0 && (
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            {guardian.athletes.length} atleta{guardian.athletes.length !== 1 ? 's' : ''}
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
                  {getInitials(guardian.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{guardian.fullName}</h3>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Registrado {formatDate(guardian.createdAt)}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              {guardian.identificationNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Identificación:</span>
                  <span>{guardian.identificationNumber}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de registro:</span>
                <span>{formatDate(guardian.createdAt)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Última actualización:</span>
                <span>{formatDate(guardian.updatedAt)}</span>
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
                <p>{guardian.email || 'No registrado'}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Teléfono Principal</span>
                </div>
                <p>{guardian.phone || 'No registrado'}</p>
              </div>

              {guardian.secondaryPhone && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Teléfono Secundario</span>
                  </div>
                  <p>{guardian.secondaryPhone}</p>
                </div>
              )}

              {guardian.address && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Dirección</span>
                  </div>
                  <p>{guardian.address}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Atletas Asociados */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Atletas Asociados
              <Badge variant="secondary">{guardian.athletes.length}</Badge>
            </CardTitle>
            <CardDescription>
              {guardian.athletes.length > 0 
                ? `Atletas bajo la responsabilidad de ${guardian.fullName}`
                : 'Este tutor no tiene atletas asociados actualmente'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {guardian.athletes.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay atletas asociados a este tutor
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Los atletas se asocian automáticamente al crear o editar su registro
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {guardian.athletes.map((athlete) => (
                  <div key={athlete.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(athlete.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{athlete.fullName}</span>
                          {athlete.isPrimary && (
                            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-xs">
                              Tutor Principal
                            </Badge>
                          )}
                          {athlete.active && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Activo
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-4">
                            <span>Relación: {athlete.relationship}</span>
                            <span>Edad: {athlete.age} años</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Trophy className="h-3 w-3" />
                              {athlete.sport}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {athlete.venue}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewAthlete(athlete.id)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ver Atleta
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
                <span>{formatDate(guardian.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Última actualización:</span>
                <span>{formatDate(guardian.updatedAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estado:</span>
                <span className={guardian.active ? 'text-green-600' : 'text-gray-600'}>
                  {guardian.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  Información de contacto {guardian.email || guardian.phone ? 'completa' : 'incompleta'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {guardian.athletes.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm">
                  {guardian.athletes.length > 0 
                    ? `Responsable de ${guardian.athletes.length} atleta${guardian.athletes.length !== 1 ? 's' : ''}`
                    : 'Sin atletas asociados'
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  Registro completo y actualizado
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tutor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el registro de <strong>{guardian.fullName}</strong> 
              y todos sus datos asociados.
              {guardian.athletes.length > 0 && (
                <>
                  <br /><br />
                  <strong>Advertencia:</strong> Este tutor tiene {guardian.athletes.length}{' '}
                  atleta{guardian.athletes.length !== 1 ? 's' : ''} asociado{guardian.athletes.length !== 1 ? 's' : ''}.
                  Al eliminarlo, se removerá la asociación con {guardian.athletes.length === 1 ? 'este atleta' : 'estos atletas'}.
                </>
              )}
              <br /><br />
              Esta acción no se puede deshacer.
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