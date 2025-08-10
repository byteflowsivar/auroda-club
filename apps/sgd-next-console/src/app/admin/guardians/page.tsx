import {AppSidebar} from "@/components/app-sidebar"
import {SiteHeader} from "@/components/site-header"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {SidebarInset, SidebarProvider,} from "@/components/ui/sidebar"
import {UserCheck} from "lucide-react"

export default function GuardiansPage() {
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tutores</h1>
            <p className="text-muted-foreground">
              Gestiona la información de los tutores de atletas menores
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Lista de Tutores
              </CardTitle>
              <CardDescription>
                Tutores registrados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <UserCheck className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Componente GuardianTable pendiente de implementación</p>
                <p className="text-sm mt-2">
                  Incluirá: tabla de tutores, relación con atletas, información de contacto
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}