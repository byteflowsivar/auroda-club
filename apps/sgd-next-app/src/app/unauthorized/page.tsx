"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Shield, AlertTriangle, ArrowLeft, Home } from "lucide-react"
import { SignOutButton } from "@/components/auth/LoginButton"

export default function UnauthorizedPage() {
  const { data: session } = useSession()

  const getRoleDisplayName = (role: string): string => {
    const roleNames: Record<string, string> = {
      ADMIN_GENERAL: "Administrador General",
      ADMIN_CLUB: "Administrador de Club", 
      PROFESOR: "Profesor",
    }
    
    return roleNames[role] || role
  }

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="card text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-error-100 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-error-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Acceso No Autorizado
          </h1>

          {/* Description */}
          <p className="text-text-secondary mb-6">
            No tienes los permisos necesarios para acceder a esta página o sección del sistema.
          </p>

          {/* User info */}
          {session?.user && (
            <div className="bg-background-secondary border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-medium text-sm">
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">
                    {session.user.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-text-muted">
                    {session.user.email || 'Sin email'}
                  </p>
                </div>
              </div>
              
              {/* Current roles */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Tus permisos actuales:
                </p>
                <div className="flex flex-wrap justify-center gap-1">
                  {session.user.roles && session.user.roles.length > 0 ? (
                    session.user.roles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-info-100 text-info-800"
                      >
                        {getRoleDisplayName(role)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-text-muted">
                      Sin roles asignados
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Warning box */}
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5 text-warning-600 mr-2" />
              <span className="font-medium text-warning-800">¿Necesitas más permisos?</span>
            </div>
            <p className="text-sm text-warning-700">
              Si crees que deberías tener acceso a esta página, contacta a tu administrador 
              de club o administrador general para solicitar los permisos necesarios.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button 
              onClick={() => window.history.back()}
              className="btn btn-secondary w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver Atrás
            </button>
            
            <Link 
              href="/dashboard"
              className="btn btn-primary w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir al Dashboard
            </Link>
            
            <div className="pt-4 border-t border-gray-200">
              <SignOutButton 
                variant="danger" 
                size="sm" 
                className="w-full"
              />
            </div>
          </div>

          {/* Support info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-text-muted mb-2">
              <strong>¿Necesitas ayuda?</strong>
            </p>
            <p className="text-xs text-text-light">
              Contacta al soporte técnico o a tu administrador con la siguiente información:
            </p>
            <div className="mt-2 text-left bg-gray-50 rounded border p-2">
              <code className="text-xs text-text-muted break-all">
                Usuario: {session?.user?.email || session?.user?.name || 'No identificado'}<br />
                Roles: {session?.user?.roles?.join(', ') || 'Ninguno'}<br />
                Página: {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}<br />
                Timestamp: {new Date().toISOString()}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}