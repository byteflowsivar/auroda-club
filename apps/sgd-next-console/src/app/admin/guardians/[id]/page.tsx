import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { ArrowLeft, UserCheck } from "lucide-react"
import Link from "next/link"

interface GuardianDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function GuardianDetailPage({ params }: GuardianDetailPageProps) {
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
              <Link href="/admin/guardians">
                <ArrowLeft className="h-4 w-4"/>
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Detalle del Tutor</h1>
              <p className="text-muted-foreground">
                ID: {id}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5"/>
                  Información del Tutor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Datos personales del tutor</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atletas a Cargo</CardTitle>
                <CardDescription>
                  Atletas asociados a este tutor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Lista de atletas menores</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}