"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  /** Mensaje de error */
  message: string;
  /** Callback para reintentar la operación */
  onRetry?: () => void;
  /** Texto del botón de reintento */
  retryText?: string;
  /** Si debe mostrar el botón de reintento */
  showRetry?: boolean;
}

/**
 * Componente reutilizable para mostrar estados de error
 */
export function ErrorState({ 
  message, 
  onRetry, 
  retryText = "Intentar de nuevo",
  showRetry = true 
}: ErrorStateProps) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>

      {showRetry && onRetry && (
        <div className="flex justify-center">
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryText}
          </Button>
        </div>
      )}
    </div>
  );
}