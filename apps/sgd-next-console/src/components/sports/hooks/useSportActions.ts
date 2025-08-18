import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useErrorHandler } from '@/lib/error-handler';
import type { SportResponse } from '@/types/api';

interface UseSportActionsReturn {
  // Estado de eliminación
  deletingSport: SportResponse | null;
  setDeletingSport: (sport: SportResponse | null) => void;
  deleting: boolean;

  // Handlers de navegación
  handleView: (sport: SportResponse) => void;
  handleEdit: (sport: SportResponse) => void;
  handleCreate: () => void;

  // Handler de eliminación
  handleDelete: (sport: SportResponse, onSuccess?: () => void) => Promise<void>;

  // Handler de selección (para selectionMode)
  handleSelection: (sport: SportResponse) => void;
}

export const useSportActions = (
  onSelect?: (sport: SportResponse) => void
): UseSportActionsReturn => {
  const router = useRouter();
  const { showSuccess, showError } = useErrorHandler();

  const [deletingSport, setDeletingSport] = useState<SportResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Handlers de navegación
  const handleView = useCallback((sport: SportResponse) => {
    router.push(`/admin/config/sports/${sport.id}`);
  }, [router]);

  const handleEdit = useCallback((sport: SportResponse) => {
    router.push(`/admin/config/sports/${sport.id}/edit`);
  }, [router]);

  const handleCreate = useCallback(() => {
    router.push('/admin/config/sports/new');
  }, [router]);

  // Handler para eliminar deporte
  const handleDelete = useCallback(async (
    sport: SportResponse,
    onSuccess?: () => void
  ): Promise<void> => {
    setDeleting(true);
    try {
      // Add validation for categories here if needed, or handle it in the component
      if (sport.categories && sport.categories.length > 0) {
        showError('No se puede eliminar un deporte que tiene categorías asociadas');
        return;
      }

      await apiClient.deleteSport(sport.id);
      showSuccess(`Deporte "${sport.name}" eliminado exitosamente`);
      setDeletingSport(null); // Close dialog
      if (onSuccess) {
        onSuccess(); // Trigger refresh
      }
    } catch (error) {
      console.error('Error deleting sport:', error);
      showError('Error al eliminar el deporte');
    } finally {
      setDeleting(false);
    }
  }, [showSuccess, showError]);

  // Handler de selección (modo selección)
  const handleSelection = useCallback((sport: SportResponse) => {
    onSelect?.(sport);
  }, [onSelect]);

  return {
    deletingSport,
    setDeletingSport,
    deleting,
    handleView,
    handleEdit,
    handleCreate,
    handleDelete,
    handleSelection
  };
};