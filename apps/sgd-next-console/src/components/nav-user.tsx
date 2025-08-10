"use client"

import {IconDotsVertical, IconLogout, IconShield, IconUserCircle,} from "@tabler/icons-react"
import {useSession} from "next-auth/react"
import {signOutCompletely} from "@/lib/auth"

import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar"
import {Badge} from "@/components/ui/badge"

export function NavUser() {
  const { data: session, status } = useSession()
  const { isMobile } = useSidebar()

  // Mostrar spinner si está cargando
  if (status === "loading") {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center justify-center h-12">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // Si no hay sesión, no mostrar nada
  if (status === "unauthenticated" || !session?.user) {
    return null
  }

  const user = session.user
  
  // Generar iniciales del nombre para avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Obtener rol principal para mostrar
  const getPrimaryRole = (roles: string[]) => {
    if (roles.includes("ADMIN_GENERAL")) return "Admin General"
    if (roles.includes("ADMIN_CLUB")) return "Admin Club"
    if (roles.includes("PROFESOR")) return "Profesor"
    return "Usuario"
  }

  const handleLogout = () => {
    signOutCompletely()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image || ""} alt={user.name || "Usuario"} />
                <AvatarFallback className="rounded-lg">
                  {user.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.name || "Usuario"}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email || "Sin email"}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image || ""} alt={user.name || "Usuario"} />
                  <AvatarFallback className="rounded-lg">
                    {user.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.name || "Usuario"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email || "Sin email"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Información de roles */}
            {user.roles && user.roles.length > 0 && (
              <>
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-normal text-muted-foreground">
                  Rol actual
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-default">
                    <IconShield className="mr-2 h-4 w-4" />
                    <span>{getPrimaryRole(user.roles)}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {user.roles.length > 1 ? `+${user.roles.length - 1}` : ''}
                    </Badge>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle className="mr-2 h-4 w-4" />
                Mi Perfil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <IconLogout className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
