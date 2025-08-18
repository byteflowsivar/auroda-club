"use client";

import { useRouter } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AthleteForm } from "@/components/athletes/athlete-form"
import type { AthleteResponse } from "@/types/api"

export default function NewAthletePage() {
  const router = useRouter();

  const handleSave = (athlete: AthleteResponse) => {
    // Redirigir al detalle del atleta creado
    router.push(`/admin/athletes/${athlete.id}`);
  };

  const handleCancel = () => {
    router.push('/admin/athletes');
  };

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

          <AthleteForm
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}