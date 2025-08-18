import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { GuardianDetail } from "@/components/guardians/guardian-detail"

interface GuardianDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function GuardianDetailPage({ params }: GuardianDetailPageProps) {
  const { id } = await params
  const guardianId = parseInt(id)

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
          <GuardianDetail guardianId={guardianId} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}