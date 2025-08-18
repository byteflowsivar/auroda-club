import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"

export default function NewAthletePage() {
  return (
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
              <Link href="/admin/athletes">
                <ArrowLeft className="h-4 w-4"/>
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Nuevo Atleta</h1>
              <p className="text-muted-foreground">
                Registra un nuevo atleta en el sistema
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5"/>
                Formulario de Registro
              </CardTitle>
              <CardDescription>
                Completa la información del atleta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <UserPlus className="mx-auto h-16 w-16 mb-4 opacity-50"/>
                <h3 className="text-lg font-semibold mb-2">Componente AthleteForm pendiente</h3>
                <div className="text-sm space-y-1">
                  <p>• Datos personales (nombre, documento, fecha nacimiento)</p>
                  <p>• Información de contacto (teléfono, email, dirección)</p>
                  <p>• Datos deportivos (deporte, categoría, sede)</p>
                  <p>• Información médica básica</p>
                  <p>• Asociación con tutores (si es menor de edad)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}