"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
} from '@/components/ui/alert-dialog';
import { 
  Search, 
  Plus, 
  Trash2, 
  Users, 
  Star,
  UserPlus,
  Phone,
  Mail,
  Heart
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import type { 
  GuardianResponse,
  GuardianInfo,
  GuardianAssociation,
  RelationshipType
} from '@/types/api';

interface GuardianSelectorProps {
  /** Tutores actualmente seleccionados */
  selectedGuardians: GuardianInfo[];
  /** Asociaciones actuales con relaciones */
  guardianAssociations: GuardianAssociation[];
  /** Callback cuando cambia la selección */
  onSelectionChange: (guardians: GuardianInfo[], associations: GuardianAssociation[]) => void;
  /** Si es obligatorio tener al menos un tutor */
  required?: boolean;
  /** Título personalizado */
  title?: string;
}

interface GuardianSearchResult extends GuardianResponse {
  isSelected: boolean;
}

const RELATIONSHIP_OPTIONS: { value: RelationshipType; label: string }[] = [
  { value: 'Padre', label: 'Padre' },
  { value: 'Madre', label: 'Madre' },
  { value: 'Tutor', label: 'Tutor Legal' },
  { value: 'Abuelo', label: 'Abuelo' },
  { value: 'Abuela', label: 'Abuela' },
  { value: 'Tío', label: 'Tío' },
  { value: 'Tía', label: 'Tía' },
  { value: 'Otro', label: 'Otro' }
];

export function GuardianSelector({
  selectedGuardians,
  guardianAssociations,
  onSelectionChange,
  required = false
}: GuardianSelectorProps) {
  const { showSuccess } = useErrorHandler();
  
  // Estados locales
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GuardianSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [removeGuardianId, setRemoveGuardianId] = useState<number | null>(null);
  const [editingRelationship, setEditingRelationship] = useState<{
    guardianId: number;
    currentRelationship: string;
    isPrimary: boolean;
  } | null>(null);

  // Búsqueda de tutores
  const searchGuardians = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await apiClient.getGuardians({
        search: query,
        active: true,
        page: 0,
        size: 20
      });

      // Marcar cuales ya están seleccionados
      const resultsWithSelection = results.content.map(guardian => ({
        ...guardian,
        isSelected: selectedGuardians.some(selected => selected.id === guardian.id)
      }));

      setSearchResults(resultsWithSelection);
    } catch (error) {
      console.error('Error searching guardians:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Efecto para búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (showSearchDialog) {
        searchGuardians(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, showSearchDialog, selectedGuardians]);

  // Limpiar búsqueda al cerrar dialog
  useEffect(() => {
    if (!showSearchDialog) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [showSearchDialog]);

  // Agregar tutor
  const handleAddGuardian = (guardian: GuardianResponse) => {
    // Verificar si ya está agregado
    if (selectedGuardians.some(g => g.id === guardian.id)) {
      return;
    }

    const newGuardianInfo: GuardianInfo = {
      id: guardian.id,
      fullName: guardian.fullName,
      email: guardian.email || undefined,
      phone: guardian.phone || undefined,
      relationship: 'Padre', // Relación por defecto
      isPrimary: selectedGuardians.length === 0 // El primero es principal por defecto
    };

    const newAssociation: GuardianAssociation = {
      guardianId: guardian.id,
      relationship: 'Padre',
      isPrimary: selectedGuardians.length === 0
    };

    const updatedGuardians = [...selectedGuardians, newGuardianInfo];
    const updatedAssociations = [...guardianAssociations, newAssociation];

    onSelectionChange(updatedGuardians, updatedAssociations);
    setShowSearchDialog(false);
    showSuccess(`Tutor ${guardian.fullName} agregado exitosamente`);
  };

  // Remover tutor
  const handleRemoveGuardian = (guardianId: number) => {
    const guardian = selectedGuardians.find(g => g.id === guardianId);
    
    if (!guardian) {
      console.error('Guardian not found:', guardianId);
      setRemoveGuardianId(null);
      return;
    }

    const updatedGuardians = selectedGuardians.filter(g => g.id !== guardianId);
    const updatedAssociations = guardianAssociations.filter(a => a.guardianId !== guardianId);

    // Si se removió el tutor principal y quedan otros, hacer principal al primero
    const wasRemovingPrimary = guardianAssociations.find(a => a.guardianId === guardianId)?.isPrimary;
    if (wasRemovingPrimary && updatedAssociations.length > 0) {
      updatedAssociations[0].isPrimary = true;
      if (updatedGuardians.length > 0) {
        updatedGuardians[0].isPrimary = true;
      }
    }

    // Actualizar el estado primero
    onSelectionChange(updatedGuardians, updatedAssociations);
    
    // Luego cerrar el modal
    setRemoveGuardianId(null);
    
    // Y mostrar el mensaje de éxito
    showSuccess(`Tutor ${guardian.fullName} removido exitosamente`);
  };

  // Actualizar relación
  const handleUpdateRelationship = (guardianId: number, relationship: string, isPrimary: boolean) => {
    // Si se está marcando como principal, remover principal de otros
    let updatedAssociations = [...guardianAssociations];
    let updatedGuardians = [...selectedGuardians];

    if (isPrimary) {
      updatedAssociations = updatedAssociations.map(a => ({
        ...a,
        isPrimary: a.guardianId === guardianId
      }));
      updatedGuardians = updatedGuardians.map(g => ({
        ...g,
        isPrimary: g.id === guardianId
      }));
    }

    // Actualizar la relación específica
    const associationIndex = updatedAssociations.findIndex(a => a.guardianId === guardianId);
    if (associationIndex >= 0) {
      updatedAssociations[associationIndex] = {
        ...updatedAssociations[associationIndex],
        relationship: relationship as RelationshipType,
        isPrimary
      };
    }

    const guardianIndex = updatedGuardians.findIndex(g => g.id === guardianId);
    if (guardianIndex >= 0) {
      updatedGuardians[guardianIndex] = {
        ...updatedGuardians[guardianIndex],
        relationship: relationship as RelationshipType,
        isPrimary
      };
    }

    onSelectionChange(updatedGuardians, updatedAssociations);
    setEditingRelationship(null);
  };

  // Obtener iniciales del nombre
  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {/* Lista de tutores seleccionados */}
      <div className="space-y-3">
        {selectedGuardians.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay tutores asociados</h3>
              <p className="text-muted-foreground text-center mb-4">
                {required ? 
                  'Es obligatorio asociar al menos un tutor responsable' : 
                  'Puede agregar tutores responsables para este atleta'
                }
              </p>
              <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Agregar Primer Tutor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Buscar y Agregar Tutor</DialogTitle>
                    <DialogDescription>
                      Busque un tutor existente por nombre para asociarlo con este atleta
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nombre del tutor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {isSearching ? (
                        <div className="text-center py-4">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
                        </div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((guardian) => (
                          <Card key={guardian.id} className={guardian.isSelected ? 'border-primary bg-primary/5' : ''}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback>
                                      {getInitials(guardian.fullName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{guardian.fullName}</div>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                      {guardian.email && (
                                        <div className="flex items-center gap-1">
                                          <Mail className="h-3 w-3" />
                                          {guardian.email}
                                        </div>
                                      )}
                                      {guardian.phone && (
                                        <div className="flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          {guardian.phone}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleAddGuardian(guardian)}
                                  disabled={guardian.isSelected}
                                  variant={guardian.isSelected ? "secondary" : "default"}
                                >
                                  {guardian.isSelected ? 'Ya Agregado' : 'Agregar'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : searchQuery.trim() ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No se encontraron tutores con ese nombre
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          Escriba para buscar tutores
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSearchDialog(false)}>
                      Cerrar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <>
            {selectedGuardians.map((guardian) => {
              const association = guardianAssociations.find(a => a.guardianId === guardian.id);
              
              return (
                <Card key={guardian.id} className={association?.isPrimary ? 'border-primary' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(guardian.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{guardian.fullName}</span>
                            {association?.isPrimary && (
                              <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                                <Star className="h-3 w-3 mr-1" />
                                Principal
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {association?.relationship || 'Sin definir'}
                            </div>
                            {guardian.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {guardian.email}
                              </div>
                            )}
                            {guardian.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {guardian.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingRelationship({
                            guardianId: guardian.id,
                            currentRelationship: association?.relationship || 'Padre',
                            isPrimary: association?.isPrimary || false
                          })}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRemoveGuardianId(guardian.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Botón para agregar más tutores */}
            <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Otro Tutor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Buscar y Agregar Tutor</DialogTitle>
                  <DialogDescription>
                    Busque un tutor existente por nombre para asociarlo con este atleta
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre del tutor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {isSearching ? (
                      <div className="text-center py-4">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((guardian) => (
                        <Card key={guardian.id} className={guardian.isSelected ? 'border-primary bg-primary/5' : ''}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {getInitials(guardian.fullName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{guardian.fullName}</div>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    {guardian.email && (
                                      <div className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {guardian.email}
                                      </div>
                                    )}
                                    {guardian.phone && (
                                      <div className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {guardian.phone}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleAddGuardian(guardian)}
                                disabled={guardian.isSelected}
                                variant={guardian.isSelected ? "secondary" : "default"}
                              >
                                {guardian.isSelected ? 'Ya Agregado' : 'Agregar'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : searchQuery.trim() ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No se encontraron tutores con ese nombre
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Escriba para buscar tutores
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSearchDialog(false)}>
                    Cerrar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      {/* Dialog para editar relación */}
      {editingRelationship && (
        <Dialog open={true} onOpenChange={() => setEditingRelationship(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Relación del Tutor</DialogTitle>
              <DialogDescription>
                Configure la relación y si es el tutor principal
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Relación</label>
                <Select 
                  defaultValue={editingRelationship.currentRelationship}
                  onValueChange={(value) => 
                    setEditingRelationship(prev => prev ? { ...prev, currentRelationship: value } : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={editingRelationship.isPrimary}
                  onChange={(e) => 
                    setEditingRelationship(prev => prev ? { ...prev, isPrimary: e.target.checked } : null)
                  }
                  className="rounded"
                />
                <label htmlFor="isPrimary" className="text-sm font-medium">
                  Tutor Principal
                </label>
              </div>
              
              <p className="text-sm text-muted-foreground">
                El tutor principal aparecerá primero en las listas y será el contacto prioritario.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingRelationship(null)}>
                Cancelar
              </Button>
              <Button
                onClick={() => handleUpdateRelationship(
                  editingRelationship.guardianId,
                  editingRelationship.currentRelationship,
                  editingRelationship.isPrimary
                )}
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de confirmación para remover */}
      <AlertDialog 
        open={removeGuardianId !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setRemoveGuardianId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Remover tutor?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea remover este tutor de la lista de responsables? 
              Esta acción se puede deshacer agregándolo nuevamente.
              {removeGuardianId && (
                <>
                  <br />
                  <strong>
                    Tutor: {selectedGuardians.find(g => g.id === removeGuardianId)?.fullName}
                  </strong>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemoveGuardianId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removeGuardianId) {
                  handleRemoveGuardian(removeGuardianId);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}