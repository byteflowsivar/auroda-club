"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { User, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NotFoundStateProps {
  /** Título del recurso no encontrado */
  resourceName?: string;
  /** Mensaje personalizado */
  message?: string;
  /** URL de retorno */
  backHref?: string;
  /** Texto del botón de retorno */
  backText?: string;
}

/**
 * Componente reutilizable para mostrar estados de "no encontrado"
 */
export function NotFoundState({ 
  resourceName = "recurso",
  message,
  backHref = "/admin",
  backText = "Volver"
}: NotFoundStateProps) {
  const defaultMessage = `No se pudo encontrar el ${resourceName} solicitado.`;

  return (
    <div className="space-y-4">
      <Alert>
        <User className="h-4 w-4" />
        <AlertDescription>
          {message || defaultMessage}
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button asChild variant="outline">
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backText}
          </Link>
        </Button>
      </div>
    </div>
  );
}