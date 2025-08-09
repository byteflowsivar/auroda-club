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
import { cn } from "@/lib/utils"
import { hasAnyRole, ROLES } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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

export function SGDSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Filtrar navegación según roles del usuario
  const filteredNavigation = navigation.filter(item => 
    session?.user?.roles && hasAnyRole(session.user.roles, item.roles)
  )

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-yellow-900" />
          </div>
          <div>
            <div className="text-lg font-bold">SGD</div>
            <div className="text-xs text-muted-foreground">Sistema Deportivo</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto bg-yellow-500 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
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