import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AthleteDetail } from "@/components/athletes/athlete-detail"

interface AthleteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AthleteDetailPage({ params }: AthleteDetailPageProps) {
  const { id } = await params
  const athleteId = parseInt(id)

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
          <AthleteDetail athleteId={athleteId} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}