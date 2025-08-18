import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';

interface UseGuardianActionsReturn {
  // Estado de eliminación
  deleteGuardianId: number | null;
  setDeleteGuardianId: (id: number | null) => void;
  
  // Handlers de navegación
  handleView: (id: number) => void;
  handleEdit: (id: number) => void;
  handleCreate: () => void;
  
  // Handler de eliminación
  handleDelete: (id: number, onSuccess?: () => void) => Promise<void>;
}

export const useGuardianActions = (): UseGuardianActionsReturn => {
  const router = useRouter();
  const { showSuccess, showError } = useErrorHandler();
  
  const [deleteGuardianId, setDeleteGuardianId] = useState<number | null>(null);

  // Navegación a vista de detalle
  const handleView = useCallback((id: number) => {
    router.push(`/admin/guardians/${id}`);
  }, [router]);

  // Navegación a edición
  const handleEdit = useCallback((id: number) => {
    router.push(`/admin/guardians/${id}/edit`);
  }, [router]);

  // Navegación a creación
  const handleCreate = useCallback(() => {
    router.push('/admin/guardians/new');
  }, [router]);

  // Eliminación con confirmación
  const handleDelete = useCallback(async (
    id: number, 
    onSuccess?: () => void
  ): Promise<void> => {
    try {
      await apiClient.deleteGuardian(id);
      showSuccess('Tutor eliminado exitosamente');
      setDeleteGuardianId(null);
      
      // Ejecutar callback de éxito (ej: refrescar lista)
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error deleting guardian:', error);
      showError('Error al eliminar el tutor');
    }
  }, [showSuccess, showError]);

  return {
    deleteGuardianId,
    setDeleteGuardianId,
    handleView,
    handleEdit,
    handleCreate,
    handleDelete
  };
};