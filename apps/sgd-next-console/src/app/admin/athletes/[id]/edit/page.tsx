"use client";

import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { EditAthleteContent } from "@/components/athletes/EditAthleteContent";
import { LoadingState } from "@/components/admin/LoadingState";
import { ErrorState } from "@/components/admin/ErrorState";
import { useAthleteParams } from "@/hooks/useAthleteParams";
import { useEditAthlete } from "@/hooks/useEditAthlete";

interface EditAthletePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Página de edición de atletas - Refactorizada con mejores prácticas
 * 
 * Separación de responsabilidades:
 * - useAthleteParams: Manejo de parámetros async
 * - useEditAthlete: Lógica de negocio (estado, API, navegación)
 * - AdminPageLayout: Layout reutilizable
 * - EditAthleteContent: Lógica de presentación
 */
export default function EditAthletePage({ params }: EditAthletePageProps) {
  console.log(`🚀 [EditAthletePage] Iniciando página de edición`);

  // Hook para manejar parámetros async de forma optimizada
  const { athleteId, loading: paramsLoading, error: paramsError } = useAthleteParams(params);
  
  // Hook para manejar toda la lógica de edición de atletas
  const editState = useEditAthlete(athleteId);

  console.log(`📊 [EditAthletePage] Estado actual:`, {
    athleteId,
    paramsLoading,
    paramsError,
    athleteLoading: editState.loading,
    athleteError: editState.error,
    athleteName: editState.athlete?.fullName
  });

  // Mientras se resuelven los parámetros
  if (paramsLoading) {
    return (
      <AdminPageLayout
        title="Editar Atleta"
        subtitle="Procesando solicitud..."
        backHref="/admin/athletes"
      >
        <LoadingState message="Procesando solicitud..." />
      </AdminPageLayout>
    );
  }

  // Error en parámetros
  if (paramsError) {
    return (
      <AdminPageLayout
        title="Editar Atleta"
        subtitle="Error en parámetros"
        backHref="/admin/athletes"
      >
        <ErrorState 
          message={paramsError}
          onRetry={() => window.location.reload()}
          retryText="Recargar página"
        />
      </AdminPageLayout>
    );
  }

  // Página principal con todos los estados manejados por EditAthleteContent
  return (
    <AdminPageLayout
      title="Editar Atleta"
      subtitle={editState.athlete ? `Modificar información de ${editState.athlete.fullName}` : undefined}
      backHref="/admin/athletes"
    >
      <EditAthleteContent {...editState} />
    </AdminPageLayout>
  );
}