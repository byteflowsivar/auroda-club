"use client";

import { AthleteForm } from "./athlete-form";
import { LoadingState } from "@/components/admin/LoadingState";
import { ErrorState } from "@/components/admin/ErrorState";
import { NotFoundState } from "@/components/admin/NotFoundState";
import type { AthleteResponse } from "@/types/api";

interface EditAthleteContentProps {
  /** Datos del atleta a editar */
  athlete: AthleteResponse | null;
  /** Estado de carga */
  loading: boolean;
  /** Mensaje de error si existe */
  error: string | null;
  /** Estado de guardado */
  saving: boolean;
  /** Callback cuando se guarda exitosamente */
  handleSave: (athlete: AthleteResponse) => void;
  /** Callback cuando se cancela */
  handleCancel: () => void;
  /** Callback para reintentar carga */
  retry: () => void;
}

/**
 * Componente que maneja la lógica de presentación para la edición de atletas
 * Separado de la lógica de negocio y del layout
 */
export function EditAthleteContent({
  athlete,
  loading,
  error,
  saving,
  handleSave,
  handleCancel,
  retry
}: EditAthleteContentProps) {
  console.log(`🔍 [EditAthleteContent] Render - loading: ${loading}, error: ${!!error}, athlete: ${athlete?.fullName || 'null'}`);

  // Estado de carga inicial
  if (loading) {
    return <LoadingState message="Cargando información del atleta..." />;
  }

  // Estado de error
  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={retry}
        retryText="Intentar de nuevo"
      />
    );
  }

  // Estado de no encontrado
  if (!athlete) {
    return (
      <NotFoundState 
        resourceName="atleta"
        message="No se pudo encontrar el atleta solicitado."
        backHref="/admin/athletes"
        backText="Volver a la lista"
      />
    );
  }

  // Estado principal - mostrar formulario
  console.log(`✅ [EditAthleteContent] Mostrando formulario para atleta: ${athlete.fullName}`);
  
  return (
    <AthleteForm
      athlete={athlete}
      onSave={handleSave}
      onCancel={handleCancel}
      readOnly={saving}
    />
  );
}