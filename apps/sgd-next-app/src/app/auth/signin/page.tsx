"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SignInButton } from "@/components/auth/LoginButton"
import { Loader2, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const { status } = useSession()
  const router = useRouter()

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  // Mostrar loading si está verificando la sesión
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary-600" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Verificando sesión...
          </h2>
          <p className="text-text-muted">
            Por favor espera mientras validamos tu estado de autenticación.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-white">
      {/* Header con botón de volver */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl mb-6 shadow-lg">
              <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Bienvenido a SGD
            </h1>
            <p className="text-text-secondary">
              Sistema de Gestión Deportiva
            </p>
          </div>

          {/* Main Card */}
          <div className="card">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-text-muted">
                Accede con tus credenciales del sistema para continuar
              </p>
            </div>

            {/* Sign In Button */}
            <div className="space-y-4">
              <SignInButton 
                variant="primary" 
                size="lg"
                className="w-full"
              />
              
              {/* Info box */}
              <div className="bg-info-50 border border-info-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-info-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-info-800 mb-1">
                      Autenticación Segura
                    </p>
                    <p className="text-xs text-info-700">
                      Utilizamos Keycloak para garantizar la máxima seguridad en el acceso al sistema. 
                      Tus credenciales están protegidas con estándares de seguridad empresarial.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help text */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-text-muted mb-2">
                ¿No tienes acceso al sistema?
              </p>
              <p className="text-xs text-text-light">
                Contacta al administrador de tu club deportivo para solicitar acceso.
              </p>
            </div>
          </div>

          {/* Features preview */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/60">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="w-4 h-4 text-primary-600" />
              </div>
              <p className="text-xs font-medium text-text-primary mb-1">Seguro</p>
              <p className="text-xs text-text-muted">Acceso protegido</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/60">
              <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Loader2 className="w-4 h-4 text-accent-600" />
              </div>
              <p className="text-xs font-medium text-text-primary mb-1">Rápido</p>
              <p className="text-xs text-text-muted">Acceso inmediato</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}