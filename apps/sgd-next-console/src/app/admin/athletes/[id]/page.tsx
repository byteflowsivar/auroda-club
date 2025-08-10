import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ArrowLeft, Edit, User } from "lucide-react"
import Link from "next/link"

interface AthleteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AthleteDetailPage({ params }: AthleteDetailPageProps) {
  const { id } = await params
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
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/admin/athletes">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Detalle del Atleta</h1>
                <p className="text-muted-foreground">
                  ID: {id}
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/admin/athletes/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Componente AthleteCard pendiente</p>
                  <p className="text-sm mt-2">
                    Mostrará datos personales, contacto y foto
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información Deportiva</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Datos deportivos del atleta</p>
                  <p className="text-sm mt-2">
                    Deporte, categoría, sede, historial
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tutores</CardTitle>
                <CardDescription>
                  Tutores asociados (si es menor de edad)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Lista de tutores</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historial</CardTitle>
                <CardDescription>
                  Actividad reciente del atleta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Historial de cambios</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}