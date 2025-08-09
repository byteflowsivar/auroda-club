"use client"

import * as React from "react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { SGDSidebar } from "./Sidebar"
import { SGDHeader } from "./SGDHeader"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ROLES } from "@/lib/auth"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  showSearch?: boolean
  onSearch?: (query: string) => void
  requireAuth?: boolean
  allowedRoles?: string[]
}

/**
 * Main dashboard layout component based on shadcn/ui dashboard-01 pattern
 * Integrates SGD sidebar, header, and content area with authentication
 */
export function DashboardLayout({ 
  children,
  breadcrumbs,
  title,
  showSearch = false,
  onSearch,
  requireAuth = true,
  allowedRoles = [ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB, ROLES.PROFESOR]
}: DashboardLayoutProps) {
  
  const layoutContent = (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)", // 288px
        "--header-height": "calc(var(--spacing) * 12)", // 48px
      } as React.CSSProperties}
    >
      <SGDSidebar />
      <SidebarInset>
        <SGDHeader 
          breadcrumbs={breadcrumbs}
          title={title}
          showSearch={showSearch}
          onSearch={onSearch}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <main className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )

  // Return without authentication wrapper if not required
  if (!requireAuth) {
    return layoutContent
  }

  // Return with authentication guard
  return (
    <AuthGuard allowedRoles={allowedRoles}>
      {layoutContent}
    </AuthGuard>
  )
}

/**
 * Dashboard stats/cards container with responsive grid
 * Based on dashboard-01 section cards pattern
 */
export function DashboardStatsContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
      {children}
    </div>
  )
}

/**
 * Dashboard content container for main content areas
 */
export function DashboardContentContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 lg:px-6">
      {children}
    </div>
  )
}

/**
 * Dashboard grid container for complex layouts
 */
export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3 px-4 lg:px-6">
      {children}
    </div>
  )
}

/**
 * Pre-configured layouts for specific user roles
 */

/**
 * Layout for admin-only pages (general admin only)
 */
export function AdminLayout({ 
  children, 
  ...props 
}: Omit<DashboardLayoutProps, 'allowedRoles'>) {
  return (
    <DashboardLayout 
      {...props}
      allowedRoles={[ROLES.ADMIN_GENERAL]}
    >
      {children}
    </DashboardLayout>
  )
}

/**
 * Layout for club management pages (general admin + club admin)
 */
export function ClubAdminLayout({ 
  children, 
  ...props 
}: Omit<DashboardLayoutProps, 'allowedRoles'>) {
  return (
    <DashboardLayout 
      {...props}
      allowedRoles={[ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB]}
    >
      {children}
    </DashboardLayout>
  )
}

/**
 * Layout for general access pages (all authenticated users)
 */
export function GeneralLayout({ 
  children, 
  ...props 
}: Omit<DashboardLayoutProps, 'allowedRoles'>) {
  return (
    <DashboardLayout 
      {...props}
      allowedRoles={[ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB, ROLES.PROFESOR]}
    >
      {children}
    </DashboardLayout>
  )
}