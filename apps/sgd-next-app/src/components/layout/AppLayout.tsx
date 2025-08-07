"use client"

import { useState } from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const layoutContent = (
    <div className="app-grid">
      <Header 
        onMenuToggle={toggleMobileMenu} 
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu}
      />
      <main className="app-main bg-background-secondary overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
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
    <AppLayout allowedRoles={[ROLES.ADMIN_GENERAL]}>
      {children}
    </AppLayout>
  )
}

/**
 * Layout específico para páginas de administración de club
 */
export function ClubAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout allowedRoles={[ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB]}>
      {children}
    </AppLayout>
  )
}

/**
 * Layout específico para páginas de profesor
 */
export function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout allowedRoles={[ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB, ROLES.PROFESOR]}>
      {children}
    </AppLayout>
  )
}