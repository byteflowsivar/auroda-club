import { DashboardLayout } from "@/components/layout/DashboardLayout"

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