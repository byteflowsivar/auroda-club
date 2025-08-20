import { useState, useEffect } from 'react';

/**
 * Hook para manejar parámetros async de atletas de forma optimizada
 * Reduce la complejidad y evita re-renders innecesarios
 */
export function useAthleteParams(params: Promise<{ id: string }>) {
  const [athleteId, setAthleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const resolveParams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10);
        
        // Validar que el ID es un número válido
        if (isNaN(id) || id <= 0) {
          throw new Error('ID de atleta inválido');
        }
        
        if (!cancelled) {
          setAthleteId(id);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al procesar parámetros');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    resolveParams();

    // Cleanup function para cancelar operación async si el componente se desmonta
    return () => {
      cancelled = true;
    };
  }, [params]);

  return {
    athleteId,
    loading,
    error
  };
}