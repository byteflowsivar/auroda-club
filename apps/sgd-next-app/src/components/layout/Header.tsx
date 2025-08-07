"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Menu, X, Bell, User, ChevronDown } from "lucide-react"
import { SignOutButton } from "@/components/auth/LoginButton"

interface HeaderProps {
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const { data: session } = useSession()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  return (
    <header className="app-header bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Botón de menú móvil */}
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Breadcrumb para desktop */}
          <nav className="hidden md:flex items-center ml-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-text-muted">
              <li>
                <span className="hover:text-text-primary transition-colors cursor-pointer">
                  SGD
                </span>
              </li>
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              <li>
                <span className="text-text-primary font-medium">
                  Dashboard
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Sección derecha */}
        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <button className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Perfil del usuario */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              
              {/* Información del usuario - Solo en desktop */}
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-text-primary">
                  {session?.user?.name || 'Usuario'}
                </div>
                <div className="text-xs text-text-muted">
                  {getRoleDisplayName(session?.user?.roles?.[0] || '')}
                </div>
              </div>

              <ChevronDown className="w-4 h-4 hidden sm:block" />
            </button>

            {/* Dropdown de perfil */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">
                        {session?.user?.name || 'Usuario'}
                      </div>
                      <div className="text-xs text-text-muted truncate">
                        {session?.user?.email || 'Sin email'}
                      </div>
                      <div className="text-xs text-primary-600 font-medium">
                        {getRoleDisplayName(session?.user?.roles?.[0] || '')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-medium text-text-muted uppercase tracking-wider">
                      Permisos
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {session?.user?.roles?.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {getRoleDisplayName(role)}
                        </span>
                      )) || (
                        <span className="text-xs text-text-muted">Sin roles asignados</span>
                      )}
                    </div>
                  </div>

                  {/* Información adicional para admins */}
                  {session?.user?.clubId && (
                    <div className="space-y-2 mb-4 text-xs">
                      <div className="font-medium text-text-muted">Club ID: {session.user.clubId}</div>
                      {session?.user?.venueIds && session.user.venueIds.length > 0 && (
                        <div className="font-medium text-text-muted">
                          Sedes: {session.user.venueIds.join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <SignOutButton variant="danger" size="sm" className="w-full" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para cerrar dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </header>
  )
}

/**
 * Función helper para obtener nombres de roles más legibles
 */
function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    ADMIN_GENERAL: "Admin General",
    ADMIN_CLUB: "Admin Club", 
    PROFESOR: "Profesor",
  }
  
  return roleNames[role] || role || 'Usuario'
}