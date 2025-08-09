import { DashboardLayout } from "@/components/layout/DashboardLayout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - SGD",
  description: "Panel principal del Sistema de Gestión Deportiva con resumen de actividades, estadísticas y accesos rápidos.",
}

export default function DashboardLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" }
      ]}
    >
      {children}
    </DashboardLayout>
  )
}