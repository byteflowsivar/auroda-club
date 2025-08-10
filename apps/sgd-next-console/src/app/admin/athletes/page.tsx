import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Plus, Users } from "lucide-react"
import Link from "next/link"

export default function AthletesPage() {
  return (
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
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Atletas</h1>
              <p className="text-muted-foreground">
                Gestiona la información de los atletas del club
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/athletes/new">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Atleta
              </Link>
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lista de Atletas
              </CardTitle>
              <CardDescription>
                Aquí aparecerá la lista de atletas con filtros y búsqueda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Componente AthleteTable pendiente de implementación</p>
                <p className="text-sm mt-2">
                  Incluirá: tabla con paginación, filtros por deporte/sede, búsqueda
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}