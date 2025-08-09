"use client"

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"
import { hasAnyRole } from "@/lib/auth"
import { Loader2, AlertTriangle, Lock } from "lucide-react"

interface AuthGuardProps {
  children: ReactNode
  allowedRoles?: string[]
  fallback?: ReactNode
}

export function AuthGuard({ 
  children, 
  allowedRoles = [],
  fallback
}: AuthGuardProps) {
  const { data: session, status } = useSession()

  // Mostrar loading mientras se valida la sesión
  if (status === "loading") {
    return fallback || <LoadingScreen />
  }

  // Redirigir a Keycloak automáticamente si no está autenticado
  if (!session) {
    signIn("keycloak")
    return fallback || <LoadingScreen />
  }

  // Si hay roles requeridos y el usuario no los tiene
  if (allowedRoles.length > 0 && !hasAnyRole(session.user.roles, allowedRoles)) {
    return fallback || <UnauthorizedScreen allowedRoles={allowedRoles} />
  }

  // Todo OK, mostrar el contenido protegido
  return <>{children}</>
}

/**
 * Componente de carga por defecto
 */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary-600" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Validando acceso...
        </h2>
        <p className="text-text-muted">
          Por favor espera mientras verificamos tus credenciales.
        </p>
      </div>
    </div>
  )
}

/**
 * Componente de no autorizado por defecto
 */
function UnauthorizedScreen({ allowedRoles }: { allowedRoles: string[] }) {
  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-background-card rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-error-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-error-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Acceso No Autorizado
          </h1>
          
          <p className="text-text-muted mb-4">
            No tienes los permisos necesarios para acceder a esta página.
          </p>

          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-warning-600 mr-2" />
              <span className="font-medium text-warning-800">Roles requeridos:</span>
            </div>
            <ul className="text-sm text-warning-700">
              {allowedRoles.map((role) => (
                <li key={role} className="mb-1">• {getRoleDisplayName(role)}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => window.history.back()}
              className="btn btn-secondary w-full"
            >
              Volver Atrás
            </button>
            
            <button 
              onClick={() => window.location.href = "/dashboard"}
              className="btn btn-primary w-full"
            >
              Ir al Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Función helper para obtener nombres de roles más legibles
 */
function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    ADMIN_GENERAL: "Administrador General",
    ADMIN_CLUB: "Administrador de Club",
    PROFESOR: "Profesor",
  }
  
  return roleNames[role] || role
}

/**
 * HOC para proteger páginas completas
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>, 
  allowedRoles?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard allowedRoles={allowedRoles}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}

/**
 * Hook para verificar permisos desde cualquier componente
 */
export function useAuth() {
  const { data: session, status } = useSession()
  
  const hasPermission = (roles: string[]) => {
    if (!session?.user?.roles) return false
    return hasAnyRole(session.user.roles, roles)
  }

  const isRole = (role: string) => {
    if (!session?.user?.roles) return false
    return session.user.roles.includes(role)
  }

  return {
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    user: session?.user,
    hasPermission,
    isRole,
  }
}