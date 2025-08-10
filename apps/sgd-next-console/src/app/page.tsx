"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginButton } from "@/components/auth/login-button"
import { LoadingSpinner } from "@/components/auth/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Si está autenticado, redirigir al dashboard
    if (status === "authenticated" && session) {
      router.push("/admin/dashboard")
    }
  }, [session, status, router])

  // Mostrar loading mientras verifica la sesión
  if (status === "loading") {
    return <LoadingSpinner />
  }

  // Si está autenticado, mostrar loading mientras redirecciona
  if (status === "authenticated") {
    return <LoadingSpinner />
  }

  // Si no está autenticado, mostrar página de login
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