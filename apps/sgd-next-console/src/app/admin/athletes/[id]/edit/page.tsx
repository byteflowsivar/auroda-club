import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

interface EditAthletePageProps {
  params: Promise<{ id: string }>
}

export default async function EditAthletePage({ params }: EditAthletePageProps) {
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
      <AppSidebar variant="inset"/>
      <SidebarInset>
        <SiteHeader/>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/admin/athletes/${id}`}>
                <ArrowLeft className="h-4 w-4"/>
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Editar Atleta</h1>
              <p className="text-muted-foreground">
                Modificar información del atleta ID: {id}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5"/>
                Formulario de Edición
              </CardTitle>
              <CardDescription>
                Actualiza la información del atleta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Edit className="mx-auto h-16 w-16 mb-4 opacity-50"/>
                <h3 className="text-lg font-semibold mb-2">Componente AthleteForm (edit mode) pendiente</h3>
                <div className="text-sm space-y-1">
                  <p>• Formulario precargado con datos actuales</p>
                  <p>• Validación de cambios</p>
                  <p>• Historial de modificaciones</p>
                  <p>• Confirmación de cambios críticos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}