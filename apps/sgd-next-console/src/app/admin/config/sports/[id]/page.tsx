import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"
import { SportsDetail } from "@/components/sports/sports-detail"
import { ROLES } from "@/lib/constants"

interface SportDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function SportDetailPage({ params }: SportDetailPageProps) {
  const { id } = await params
  const sportId = parseInt(id)

  return (
    <AuthGuard requiredRoles={[ ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB ]}>
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
            <SportsDetail sportId={sportId} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}