"use client"

import useSWR from "swr"
import { useSession } from "next-auth/react"
import { Users, Building, Trophy } from "lucide-react"

// Layout Components
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Dashboard Components
import { StatCard } from "@/components/dashboard/StatCard"
import { DashboardChart } from "@/components/dashboard/DashboardChart"
import { AlertCard } from "@/components/dashboard/AlertCard"
import { LoadingState } from "@/components/admin/LoadingState"
import { ErrorState } from "@/components/admin/ErrorState"

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// --- Vistas específicas por Rol ---

function AdminDashboard({ data, isLoading }: { data: any; isLoading: boolean }) {
  return (
    <div className="space-y-6">
      {/* Fila de KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Atletas Activos" 
          value={data?.totalActiveAthletes} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
          isLoading={isLoading}
        />
        <StatCard 
          title="Nuevos Atletas (30 días)" 
          value={data?.newAthletesLast30Days} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Sedes Activas" 
          value={data?.totalActiveVenues} 
          icon={<Building className="h-4 w-4 text-muted-foreground" />} 
          isLoading={isLoading}
        />
        <StatCard 
          title="Deportes Ofertados" 
          value={data?.totalActiveSports} 
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />} 
          isLoading={isLoading}
        />
      </div>

      {/* Fila de Gráficos y Alertas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardChart 
            title="Atletas por Deporte" 
            data={data?.athletesBySport} 
            type="bar" 
            isLoading={isLoading}
          />
        </div>
        <div className="space-y-6">
          <DashboardChart 
            title="Atletas por Sede" 
            data={data?.athletesByVenue} 
            type="donut" 
            isLoading={isLoading}
          />
          <AlertCard 
            title="Atletas Menores Sin Tutor" 
            value={data?.athletesWithoutGuardian} 
            link="/admin/athletes?filter=no_guardian" // hypothetical link
            linkText="Revisar atletas"
          />
        </div>
      </div>
    </div>
  )
}

function ProfessorDashboard() {
  // TODO: Implementar dashboard específico para profesores
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Dashboard del Profesor</h2>
      <p className="text-muted-foreground">Próximamente...</p>
    </div>
  )
}

// --- Componente Principal de la Página ---

function DashboardContent() {
  const { data: session } = useSession()
  const { data, error, isLoading } = useSWR("/api/sgd/dashboard/summary", fetcher)

  const userRole = session?.user?.role

  const renderDashboard = () => {
    if (isLoading) {
      return <AdminDashboard data={null} isLoading={true} />
    }

    if (error) {
      return <ErrorState message="No se pudo cargar la información del dashboard." />
    }

    if (!data) {
      return <p>No hay datos disponibles.</p>
    }

    if (userRole === "ADMIN_GENERAL" || userRole === "ADMIN_CLUB") {
      return <AdminDashboard data={data} isLoading={false} />
    }

    if (userRole === "PROFESOR") {
      return <ProfessorDashboard />
    }

    return <p>No tienes un rol asignado para ver el dashboard.</p>
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, {session?.user?.name || "Usuario"}. Aquí tienes un resumen de la actividad del club.
        </p>
      </div>
      {renderDashboard()}
    </div>
  )
}

export default function DashboardPage() {
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
        <DashboardContent />
      </SidebarInset>
    </SidebarProvider>
  )
}