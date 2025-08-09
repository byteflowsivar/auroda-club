"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, Bell, User, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear bg-background border-b">
      <div className="flex items-center gap-2 px-4 flex-1">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost" 
          size="icon"
          onClick={onMenuToggle}
          className="md:hidden"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {/* Breadcrumb */}
        <nav className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span>SGD</span>
          <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
          <span className="font-medium text-foreground">Dashboard</span>
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 px-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-yellow-500 text-yellow-900">
                  {session?.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-medium">
                  {session?.user?.name || 'Usuario'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {getRoleDisplayName(session?.user?.roles?.[0] || '')}
                </span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Roles */}
            <div className="px-2 py-1.5">
              <div className="text-xs font-medium text-muted-foreground mb-1">Permisos</div>
              <div className="flex flex-wrap gap-1">
                {session?.user?.roles?.map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                    {getRoleDisplayName(role)}
                  </Badge>
                ))}
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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