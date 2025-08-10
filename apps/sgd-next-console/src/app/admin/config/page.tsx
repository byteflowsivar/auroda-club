"use client"

import {AppSidebar} from "@/components/app-sidebar"
import {SiteHeader} from "@/components/site-header"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {SidebarInset, SidebarProvider,} from "@/components/ui/sidebar"
import {AuthGuard} from "@/components/auth/auth-guard"
import {MapPin, Settings, Trophy, Users} from "lucide-react"
import {ROLES} from "@/lib/auth"
import Link from "next/link"

export default function ConfigPage() {
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
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
              <p className="text-muted-foreground">
                Administra la configuración del sistema
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Deportes y Categorías
                  </CardTitle>
                  <CardDescription>
                    Gestiona los deportes disponibles y sus categorías
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/config/sports">
                      <Trophy className="mr-2 h-4 w-4" />
                      Gestionar Deportes
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Sedes
                  </CardTitle>
                  <CardDescription>
                    Configura las sedes del club
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/admin/config/venues">
                      <MapPin className="mr-2 h-4 w-4" />
                      Gestionar Sedes
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Usuarios
                  </CardTitle>
                  <CardDescription>
                    Administra usuarios y permisos (solo Admin General)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Funcionalidad pendiente</p>
                    <p className="text-sm">Gestión de usuarios Keycloak</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Sistema
                  </CardTitle>
                  <CardDescription>
                    Configuraciones generales del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Configuraciones generales</p>
                    <p className="text-sm">Parámetros del sistema</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}