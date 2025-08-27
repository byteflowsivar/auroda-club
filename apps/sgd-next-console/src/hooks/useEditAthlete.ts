import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import type { AthleteResponse } from '@/types/api';

interface UseEditAthleteState {
  athlete: AthleteResponse | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
}

interface UseEditAthleteActions {
  handleSave: (updatedAthlete: AthleteResponse) => void;
  handleCancel: () => void;
  retry: () => void;
}

interface UseEditAthleteReturn extends UseEditAthleteState, UseEditAthleteActions {}

/**
 * Hook personalizado para manejar toda la lógica de edición de atletas
 * Centraliza el estado, loading, error handling y navegación
 */
export function useEditAthlete(athleteId: number | null): UseEditAthleteReturn {
  const router = useRouter();
  
  // Estados principales
  const [athlete, setAthlete] = useState<AthleteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving] = useState(false);

  // Función para cargar datos del atleta
  const loadAthlete = useCallback(async () => {
    if (!athleteId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    try {
      console.log(`🔄 [useEditAthlete] Cargando atleta ID: ${athleteId}`);
      setLoading(true);
      setError(null);
      
      const athleteData = await apiClient.getAthlete(athleteId);
      
      if (!cancelled) {
        console.log(`✅ [useEditAthlete] Atleta cargado:`, athleteData.fullName);
        setAthlete(athleteData);
      }
    } catch (err) {
      if (!cancelled) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos del atleta';
        console.error(`❌ [useEditAthlete] Error cargando atleta:`, err);
        setError(errorMessage);
        setAthlete(null);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [athleteId]);

  // Cargar datos cuando cambia el athleteId
  useEffect(() => {
    loadAthlete();
  }, [loadAthlete]);

  // Handler para guardar cambios - memoizado para evitar re-renders
  const handleSave = useCallback((updatedAthlete: AthleteResponse) => {
    console.log(`✅ [useEditAthlete] Atleta guardado exitosamente:`, updatedAthlete.fullName);
    console.log(`🔄 [useEditAthlete] Navegando a lista de atletas...`);
    
    // Redirigir a la lista de atletas después de guardar exitosamente
    router.push('/admin/athletes');
  }, [router]);

  // Handler para cancelar - memoizado para evitar re-renders
  const handleCancel = useCallback(() => {
    console.log(`🚫 [useEditAthlete] Operación cancelada, volviendo a lista de atletas`);
    
    // Volver a la lista de atletas
    router.push('/admin/athletes');
  }, [router]);

  // Handler para reintentar carga de datos
  const retry = useCallback(() => {
    console.log(`🔄 [useEditAthlete] Reintentando carga de datos...`);
    loadAthlete();
  }, [loadAthlete]);

  return {
    // Estado
    athlete,
    loading,
    error,
    saving,
    
    // Acciones
    handleSave,
    handleCancel,
    retry
  };
}