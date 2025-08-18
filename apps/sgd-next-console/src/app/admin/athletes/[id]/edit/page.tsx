"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { AthleteForm } from "@/components/athletes/athlete-form"
import { apiClient } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { AthleteResponse } from "@/types/api"

interface EditAthletePageProps {
  params: Promise<{ id: string }>
}

export default function EditAthletePage({ params }: EditAthletePageProps) {
  const router = useRouter();
  const [athlete, setAthlete] = useState<AthleteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [athleteId, setAthleteId] = useState<string | null>(null);

  // Resolver params de forma asíncrona
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setAthleteId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Cargar datos del atleta
  useEffect(() => {
    const loadAthlete = async () => {
      if (!athleteId) return;

      try {
        setLoading(true);
        setError(null);
        const athleteData = await apiClient.getAthlete(parseInt(athleteId));
        setAthlete(athleteData);
      } catch (err: any) {
        console.error('Error loading athlete:', err);
        setError(err.message || 'Error al cargar los datos del atleta');
      } finally {
        setLoading(false);
      }
    };

    loadAthlete();
  }, [athleteId]);

  const handleSave = (updatedAthlete: AthleteResponse) => {
    // Redirigir al detalle del atleta
    router.push(`/admin/athletes/${updatedAthlete.id}`);
  };

  const handleCancel = () => {
    if (athleteId) {
      router.push(`/admin/athletes/${athleteId}`);
    } else {
      router.push('/admin/athletes');
    }
  };

  if (loading) {
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
                <h1 className="text-3xl font-bold tracking-tight">Editar Atleta</h1>
                <p className="text-muted-foreground">
                  Cargando información del atleta...
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Cargando datos del atleta...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
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
                <h1 className="text-3xl font-bold tracking-tight">Editar Atleta</h1>
                <p className="text-muted-foreground">
                  Error al cargar la información
                </p>
              </div>
            </div>

            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button onClick={() => window.location.reload()}>
                Intentar de nuevo
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!athlete) {
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
                <h1 className="text-3xl font-bold tracking-tight">Editar Atleta</h1>
                <p className="text-muted-foreground">
                  Atleta no encontrado
                </p>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                No se pudo encontrar el atleta solicitado.
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button asChild>
                <Link href="/admin/athletes">
                  Volver a la lista
                </Link>
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
              <Link href={`/admin/athletes/${athlete.id}`}>
                <ArrowLeft className="h-4 w-4"/>
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Editar Atleta</h1>
              <p className="text-muted-foreground">
                Modificar información de {athlete.fullName}
              </p>
            </div>
          </div>

          <AthleteForm
            athlete={athlete}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}