import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

interface AuthErrorPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const { error } = await searchParams

  const getErrorMessage = (error?: string) => {
    switch (error) {
      case "Configuration":
        return "Existe un problema en la configuración de autenticación."
      case "AccessDenied":
        return "Acceso denegado. No tienes permisos para acceder."
      case "Verification":
        return "Error en la verificación. El token puede haber expirado."
      case "Default":
      default:
        return "Ha ocurrido un error durante la autenticación."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive"/>
          </div>
          <CardTitle className="text-2xl">Error de Autenticación</CardTitle>
          <CardDescription>
            {getErrorMessage(error)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            {error && (
              <p className="mb-2">
                Código de error: <code className="bg-muted px-2 py-1 rounded">{error}</code>
              </p>
            )}
            <p>
              Por favor, intenta iniciar sesión nuevamente o contacta al administrador.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/api/auth/signin">
                <RefreshCw className="mr-2 h-4 w-4"/>
                Intentar Nuevamente
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4"/>
                Ir al Inicio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}