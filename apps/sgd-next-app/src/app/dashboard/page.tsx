"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { DashboardStats, RecentActivityCard, QuickActionsCard, PerformanceMetricsCard } from "@/components/dashboard/DashboardStats"
import { DashboardGrid, DashboardContentContainer } from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Trophy, MapPin, Calendar, AlertTriangle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panel principal del Sistema de Gestión Deportiva con resumen de actividades, estadísticas y accesos rápidos.",
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const userRole = session?.user?.roles?.[0]

  return (
    <>
      {/* Welcome Section */}
      <DashboardContentContainer>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {getRoleDisplayName(userRole)}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Bienvenido al Sistema de Gestión Deportiva, {session?.user?.name}
          </p>
        </div>
      </DashboardContentContainer>

      {/* Stats Cards */}
      <DashboardContentContainer>
        <DashboardStats userRole={userRole} />
      </DashboardContentContainer>

      {/* Dashboard Grid */}
      <DashboardGrid>
        <RecentActivityCard />
        <QuickActionsCard />
        <PerformanceMetricsCard />
      </DashboardGrid>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-6">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones realizadas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: 'athlete',
                    icon: Users,
                    title: 'Nuevo atleta registrado',
                    description: 'María González se registró en Natación',
                    time: 'Hace 2 horas',
                    color: 'bg-primary/10 text-primary'
                  },
                  {
                    type: 'guardian',
                    icon: UserCheck,
                    title: 'Tutor actualizado',
                    description: 'Carlos Pérez actualizó información de contacto',
                    time: 'Hace 4 horas',
                    color: 'bg-chart-2/10 text-chart-2'
                  },
                  {
                    type: 'athlete',
                    icon: Trophy,
                    title: 'Atleta transferido',
                    description: 'Ana Martín cambió de categoría',
                    time: 'Hace 1 día',
                    color: 'bg-chart-3/10 text-chart-3'
                  },
                  {
                    type: 'system',
                    icon: MapPin,
                    title: 'Nueva sede registrada',
                    description: 'Sede Norte agregada al sistema',
                    time: 'Hace 2 días',
                    color: 'bg-chart-1/10 text-chart-1'
                  }
                ].map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Ver toda la actividad
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Próximas tareas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Próximas Tareas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">Revisión mensual</p>
                    <p className="text-xs text-muted-foreground">Vence en 3 días</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
                  <Calendar className="w-5 h-5 text-chart-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-chart-2">Backup semanal</p>
                    <p className="text-xs text-muted-foreground">Programado para mañana</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accesos rápidos */}
          <Card>
            <CardHeader>
              <CardTitle>Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild className="h-auto p-4 flex-col">
                  <Link href="/athletes/new">
                    <Users className="w-6 h-6 mb-2 text-primary" />
                    <span className="text-xs font-medium">Nuevo Atleta</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col">
                  <Link href="/guardians">
                    <UserCheck className="w-6 h-6 mb-2 text-chart-2" />
                    <span className="text-xs font-medium">Tutores</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col">
                  <Link href="/config/sports">
                    <Trophy className="w-6 h-6 mb-2 text-chart-1" />
                    <span className="text-xs font-medium">Disciplinas</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col">
                  <Link href="/config/venues">
                    <MapPin className="w-6 h-6 mb-2 text-chart-3" />
                    <span className="text-xs font-medium">Sedes</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

/**
 * Helper function to get readable role names
 */
function getRoleDisplayName(role?: string): string {
  if (!role) return "Usuario"
  
  const roleNames: Record<string, string> = {
    'ADMIN_GENERAL': "Administrador General",
    'ADMIN_CLUB': "Administrador de Club",
    'PROFESOR': "Profesor",
  }
  return roleNames[role] || role
}