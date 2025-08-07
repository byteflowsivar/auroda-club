"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Settings, 
  Trophy,
  MapPin,
  BarChart3,
  Shield,
  X 
} from "lucide-react"
import { clsx } from "clsx"
import { hasAnyRole, ROLES } from "@/lib/auth"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
  badge?: string
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB, ROLES.PROFESOR],
  },
  {
    name: "Atletas",
    href: "/athletes",
    icon: Users,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB, ROLES.PROFESOR],
  },
  {
    name: "Tutores",
    href: "/guardians",
    icon: UserCheck,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB],
  },
  {
    name: "Disciplinas",
    href: "/sports",
    icon: Trophy,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB],
  },
  {
    name: "Sedes",
    href: "/venues", 
    icon: MapPin,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB],
  },
  {
    name: "Reportes",
    href: "/reports",
    icon: BarChart3,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB],
  },
  {
    name: "Usuarios",
    href: "/users",
    icon: Shield,
    roles: [ROLES.ADMIN_GENERAL],
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Settings,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB],
  },
]

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Filtrar navegación según roles del usuario
  const filteredNavigation = navigation.filter(item => 
    session?.user?.roles && hasAnyRole(session.user.roles, item.roles)
  )

  const sidebarClasses = clsx(
    "app-sidebar",
    "bg-white border-r border-gray-200 flex flex-col h-full",
    // Mobile styles
    "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
    isOpen ? "translate-x-0" : "-translate-x-full"
  )

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Header del sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-accent-500 rounded-sm"></div>
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary">SGD</div>
              <div className="text-xs text-text-muted">Sistema Deportivo</div>
            </div>
          </div>

          {/* Botón cerrar móvil */}
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 pt-6 pb-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={clsx(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                      : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
                  )}
                >
                  <Icon
                    className={clsx(
                      "mr-3 h-5 w-5 transition-colors duration-150",
                      isActive
                        ? "text-primary-600"
                        : "text-text-muted group-hover:text-text-secondary"
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto inline-block bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-primary-50 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-primary-900 truncate">
                  {session?.user?.name}
                </div>
                <div className="text-xs text-primary-600 truncate">
                  {getRoleDisplayName(session?.user?.roles?.[0] || '')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
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