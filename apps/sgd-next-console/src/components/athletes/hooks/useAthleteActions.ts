import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';

interface UseAthleteActionsReturn {
  // Estado de eliminación
  deleteAthleteId: number | null;
  setDeleteAthleteId: (id: number | null) => void;
  
  // Handlers de navegación
  handleView: (id: number) => void;
  handleEdit: (id: number) => void;
  handleCreate: () => void;
  
  // Handler de eliminación
  handleDelete: (id: number, onSuccess?: () => void) => Promise<void>;
}

export const useAthleteActions = (): UseAthleteActionsReturn => {
  const router = useRouter();
  const { showSuccess, showError } = useErrorHandler();
  
  const [deleteAthleteId, setDeleteAthleteId] = useState<number | null>(null);

  // Navegación a vista de detalle
  const handleView = useCallback((id: number) => {
    router.push(`/admin/athletes/${id}`);
  }, [router]);

  // Navegación a edición
  const handleEdit = useCallback((id: number) => {
    router.push(`/admin/athletes/${id}/edit`);
  }, [router]);

  // Navegación a creación
  const handleCreate = useCallback(() => {
    router.push('/admin/athletes/new');
  }, [router]);

  // Eliminación con confirmación
  const handleDelete = useCallback(async (
    id: number, 
    onSuccess?: () => void
  ): Promise<void> => {
    try {
      await apiClient.deleteAthlete(id);
      showSuccess('Atleta eliminado exitosamente');
      setDeleteAthleteId(null);
      
      // Ejecutar callback de éxito (ej: refrescar lista)
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error deleting athlete:', error);
      showError('Error al eliminar el atleta');
    }
  }, [showSuccess, showError]);

  return {
    deleteAthleteId,
    setDeleteAthleteId,
    handleView,
    handleEdit,
    handleCreate,
    handleDelete
  };
};