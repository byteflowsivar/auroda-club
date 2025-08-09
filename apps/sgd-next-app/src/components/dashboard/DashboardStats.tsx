"use client"

import * as React from "react"
import { Users, UserCheck, UserPlus, Trophy, MapPin, Target } from "lucide-react"
import { StatsCard, StatsCardsContainer } from "./StatsCard"

// Mock data - replace with real data fetching
const mockStats = {
  totalAthletes: 247,
  activeAthletes: 189,
  newThisMonth: 23,
  totalSports: 8,
  totalVenues: 5,
  completionRate: 87,
  changes: {
    totalAthletes: 12,
    activeAthletes: 8,
    newThisMonth: -2,
    totalSports: 0,
    totalVenues: 1,
    completionRate: 5,
  }
}

interface DashboardStatsProps {
  userRole?: string
  loading?: boolean
}

/**
 * Dashboard statistics section with role-based content
 * Based on dashboard-01 section cards pattern
 */
export function DashboardStats({ userRole, loading = false }: DashboardStatsProps) {
  
  // Show different stats based on user role
  const isAdmin = userRole === 'ADMIN_GENERAL' || userRole === 'ADMIN_CLUB'
  const isGeneralAdmin = userRole === 'ADMIN_GENERAL'

  return (
    <StatsCardsContainer>
      {/* Total Athletes - visible to all */}
      <StatsCard
        title="Total Atletas"
        value={mockStats.totalAthletes}
        change={mockStats.changes.totalAthletes}
        icon={Users}
        loading={loading}
      />

      {/* Active Athletes - visible to all */}
      <StatsCard
        title="Atletas Activos"
        value={mockStats.activeAthletes}
        change={mockStats.changes.activeAthletes}
        icon={UserCheck}
        loading={loading}
      />

      {/* New athletes this month - admin only */}
      {isAdmin && (
        <StatsCard
          title="Nuevos Este Mes"
          value={mockStats.newThisMonth}
          change={mockStats.changes.newThisMonth}
          icon={UserPlus}
          loading={loading}
        />
      )}

      {/* Sports count - admin only */}
      {isAdmin && (
        <StatsCard
          title="Deportes Activos"
          value={mockStats.totalSports}
          change={mockStats.changes.totalSports}
          icon={Trophy}
          loading={loading}
        />
      )}

      {/* Venues - general admin only */}
      {isGeneralAdmin && (
        <StatsCard
          title="Sedes Activas"
          value={mockStats.totalVenues}
          change={mockStats.changes.totalVenues}
          icon={MapPin}
          loading={loading}
        />
      )}

      {/* Completion rate - for professors */}
      {userRole === 'PROFESOR' && (
        <StatsCard
          title="Tasa de Completitud"
          value={`${mockStats.completionRate}%`}
          change={mockStats.changes.completionRate}
          icon={Target}
          description="de datos actualizados"
          loading={loading}
        />
      )}
    </StatsCardsContainer>
  )
}

/**
 * Recent activity card component
 */
export function RecentActivityCard() {
  return (
    <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Target className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">Actividad Reciente</p>
        <p className="text-xs">Próximamente</p>
      </div>
    </div>
  )
}

/**
 * Quick actions card component
 */
export function QuickActionsCard() {
  return (
    <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <UserPlus className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">Acciones Rápidas</p>
        <p className="text-xs">Próximamente</p>
      </div>
    </div>
  )
}

/**
 * Performance metrics card component
 */
export function PerformanceMetricsCard() {
  return (
    <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Trophy className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">Métricas de Rendimiento</p>
        <p className="text-xs">Próximamente</p>
      </div>
    </div>
  )
}