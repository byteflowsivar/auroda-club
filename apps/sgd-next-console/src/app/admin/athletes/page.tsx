import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { AthleteTable } from '@/components/athletes/athlete-table'

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
      <AppSidebar variant="inset"/>
      <SidebarInset>
        <SiteHeader/>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Atletas</h1>
            <p className="text-muted-foreground">
              Gestiona los atletas registrados en el sistema
            </p>
          </div>

          <AthleteTable showCreateButton={true} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}