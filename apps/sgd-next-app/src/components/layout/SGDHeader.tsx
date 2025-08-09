"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Bell, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface SGDHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  showSearch?: boolean
  onSearch?: (query: string) => void
}

export function SGDHeader({ 
  breadcrumbs = [], 
  title,
  showSearch = false,
  onSearch 
}: SGDHeaderProps) {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  // Default breadcrumbs if none provided
  const defaultBreadcrumbs: BreadcrumbItem[] = breadcrumbs.length > 0 
    ? breadcrumbs 
    : [
        { label: "Dashboard", href: "/dashboard" },
        { label: title || "Página" }
      ]

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-4 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            {defaultBreadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                  {crumb.href && index < defaultBreadcrumbs.length - 1 ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < defaultBreadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title if no breadcrumbs */}
        {title && breadcrumbs.length === 0 && (
          <div className="flex items-center gap-2 ml-2">
            <Separator orientation="vertical" className="h-4" />
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div className="ml-auto flex-1 max-w-sm">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 bg-background"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 px-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notificaciones</span>
        </Button>

        {/* User info (mobile) */}
        <div className="hidden text-right md:block">
          <div className="text-sm font-medium leading-none">
            {session?.user?.name || session?.user?.email}
          </div>
          <div className="text-xs text-muted-foreground">
            {session?.user?.roles?.[0] && getRoleDisplayName(session.user.roles[0])}
          </div>
        </div>
      </div>
    </header>
  )
}

/**
 * Helper function to get readable role names
 */
function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    'ADMIN_GENERAL': "Administrador General",
    'ADMIN_CLUB': "Administrador de Club", 
    'PROFESOR': "Profesor",
  }
  return roleNames[role] || role
}