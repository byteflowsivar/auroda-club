"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"
import { SportsTable } from "@/components/sports/sports-table"
import { ArrowLeft } from "lucide-react"
import { ROLES } from "@/lib/constants"
import Link from "next/link"

export default function SportsConfigPage() {
  return (
    <AuthGuard requiredRoles={[ ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB ]}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset"/>
        <SidebarInset>
          <SiteHeader/>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/admin/config">
                  <ArrowLeft className="h-4 w-4"/>
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Deportes</h1>
                <p className="text-muted-foreground">
                  Configura deportes disponibles y sus categorías
                </p>
              </div>
            </div>

            <SportsTable />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}