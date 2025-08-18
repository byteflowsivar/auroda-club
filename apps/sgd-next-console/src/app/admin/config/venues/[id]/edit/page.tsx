"use client"

import { use } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"
import { VenueForm } from "@/components/venues/venue-form"
import { ArrowLeft } from "lucide-react"
import { ROLES } from "@/lib/constants"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface EditVenuePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditVenuePage({ params }: EditVenuePageProps) {
  const { id } = use(params);
  const venueId = parseInt(id);
  const router = useRouter();

  if (isNaN(venueId)) {
    return (
      <AuthGuard requiredRoles={[ROLES.ADMIN_GENERAL]}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
            <p className="text-muted-foreground">ID de sede inválido</p>
            <Button asChild className="mt-4">
              <Link href="/admin/config/venues">
                Volver a Sedes
              </Link>
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRoles={[ROLES.ADMIN_GENERAL]}>
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
                <Link href="/admin/config/venues">
                  <ArrowLeft className="h-4 w-4"/>
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar Sede</h1>
                <p className="text-muted-foreground">
                  Modifica la información de la sede.
                </p>
              </div>
            </div>

            <VenueForm venueId={venueId} onSave={() => router.push('/admin/config/venues')} onCancel={() => router.push('/admin/config/venues')} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
