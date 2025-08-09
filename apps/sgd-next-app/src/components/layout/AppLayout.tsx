"use client"

import { DashboardLayout } from "./DashboardLayout"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { ROLES } from "@/lib/auth"

interface AppLayoutProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: string[]
}

export function AppLayout({ 
  children, 
  requireAuth = true, 
  allowedRoles = [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB, ROLES.PROFESOR] 
}: AppLayoutProps) {
  const layoutContent = (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )

  // Si no requiere autenticación, renderizar directamente
  if (!requireAuth) {
    return layoutContent
  }

  // Si requiere autenticación, envolver con AuthGuard
  return (
    <AuthGuard allowedRoles={allowedRoles}>
      {layoutContent}
    </AuthGuard>
  )
}

/**
 * Layout específico para páginas de administración general
 */
export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={[ROLES.ADMIN_GENERAL]}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthGuard>
  )
}

/**
 * Layout específico para páginas de administración de club
 */
export function ClubAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={[ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB]}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthGuard>
  )
}

/**
 * Layout específico para páginas de profesor
 */
export function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={[ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB, ROLES.PROFESOR]}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthGuard>
  )
}