import { LoginButton } from "@/components/auth/login-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Sistema de Gestión Deportiva
          </CardTitle>
          <CardDescription>
            Bienvenido al sistema administrativo del club
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Para acceder al sistema, inicia sesión con tus credenciales de Keycloak.
            </p>
          </div>
          <LoginButton className="w-full" />
        </CardContent>
      </Card>
    </div>
  )
}