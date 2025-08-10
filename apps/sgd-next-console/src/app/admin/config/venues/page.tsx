"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ArrowLeft, MapPin, Plus } from "lucide-react"
import { ROLES } from "@/lib/auth"
import Link from "next/link"

export default function VenuesConfigPage() {
  return (
    <AuthGuard requiredRoles={[ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB]}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                  <Link href="/admin/config">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Gestión de Sedes</h1>
                  <p className="text-muted-foreground">
                    Configura las sedes del club
                  </p>
                </div>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Sede
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Lista de Sedes
                </CardTitle>
                <CardDescription>
                  Sedes registradas en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Componente VenuesTable pendiente de implementación</p>
                  <p className="text-sm mt-2">
                    Incluirá: tabla de sedes, dirección, capacidad, deportes disponibles
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}