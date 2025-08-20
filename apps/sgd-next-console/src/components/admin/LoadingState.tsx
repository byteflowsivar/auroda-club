"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  /** Mensaje de loading personalizado */
  message?: string;
  /** Si debe mostrar el spinner */
  showSpinner?: boolean;
}

/**
 * Componente reutilizable para mostrar estados de carga
 */
export function LoadingState({ 
  message = "Cargando datos...", 
  showSpinner = true 
}: LoadingStateProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          {showSpinner && <Loader2 className="h-6 w-6 animate-spin" />}
          <span>{message}</span>
        </div>
      </CardContent>
    </Card>
  );
}