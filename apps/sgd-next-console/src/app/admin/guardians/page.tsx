import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { GuardianTable } from "@/components/guardians/guardian-table"

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
      <AppSidebar variant="inset"/>
      <SidebarInset>
        <SiteHeader/>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tutores</h1>
            <p className="text-muted-foreground">
              Gestiona los tutores y responsables de los atletas
            </p>
          </div>

          <GuardianTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}