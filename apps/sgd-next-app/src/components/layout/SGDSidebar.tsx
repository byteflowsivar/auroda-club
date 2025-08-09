"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronRight,
  LayoutDashboard,
  Users,
  UserCheck,
  Trophy,
  MapPin,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  ChevronsUpDown,
  type LucideIcon,
} from "lucide-react"

import { hasAnyRole, ROLES } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { signOut } from "next-auth/react"

interface NavigationItem {
  title: string
  url: string
  icon: LucideIcon
  roles: string[]
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

const navigationData: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB, ROLES.PROFESOR],
  },
  {
    title: "Atletas",
    url: "/athletes",
    icon: Users,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB, ROLES.PROFESOR],
    items: [
      {
        title: "Lista de Atletas",
        url: "/athletes",
      },
      {
        title: "Nuevo Atleta",
        url: "/athletes/new",
      },
    ],
  },
  {
    title: "Tutores",
    url: "/guardians",
    icon: UserCheck,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB],
    items: [
      {
        title: "Lista de Tutores",
        url: "/guardians",
      },
      {
        title: "Vincular Tutor",
        url: "/guardians/link",
      },
    ],
  },
  {
    title: "Reportes",
    url: "/reports",
    icon: BarChart3,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB],
    items: [
      {
        title: "Estadísticas",
        url: "/reports/stats",
      },
      {
        title: "Exportar Datos",
        url: "/reports/export",
      },
    ],
  },
  {
    title: "Configuración",
    url: "/config",
    icon: Settings,
    roles: [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB],
    items: [
      {
        title: "Deportes",
        url: "/config/sports",
      },
      {
        title: "Sedes",
        url: "/config/venues",
      },
      {
        title: "Usuarios",
        url: "/config/users",
      },
    ],
  },
]

type SGDSidebarProps = React.ComponentProps<typeof Sidebar>

export function SGDSidebar({ ...props }: SGDSidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { isMobile } = useSidebar()

  // Filter navigation based on user roles
  const filteredNavigation = React.useMemo(() => {
    if (!session?.user?.roles) return []

    return navigationData
      .filter(item => hasAnyRole(session.user.roles, item.roles))
      .map(item => ({
        ...item,
        isActive: pathname === item.url || pathname.startsWith(item.url + '/'),
      }))
  }, [session?.user?.roles, pathname])

  const userDisplayName = session?.user?.name || session?.user?.email || 'Usuario'
  const userInitials = userDisplayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const getRoleDisplayName = (role: string): string => {
    const roleNames: Record<string, string> = {
      [ROLES.ADMIN_GENERAL]: "Administrador General",
      [ROLES.ADMIN_CLUB]: "Administrador de Club",
      [ROLES.PROFESOR]: "Profesor",
    }
    return roleNames[role] || role
  }

  const primaryRole = session?.user?.roles?.[0] || ''

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* SGD Brand */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Trophy className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SGD</span>
                  <span className="truncate text-xs">Sistema Deportivo</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarMenu>
            {filteredNavigation.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {item.items ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          tooltip={item.title}
                          className={item.isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild
                                className={pathname === subItem.url ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : (
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      className={item.isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage 
                      src={session?.user?.image || undefined} 
                      alt={userDisplayName} 
                    />
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{userDisplayName}</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {getRoleDisplayName(primaryRole)}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage 
                        src={session?.user?.image || undefined} 
                        alt={userDisplayName} 
                      />
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{userDisplayName}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Shield className="size-4" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}