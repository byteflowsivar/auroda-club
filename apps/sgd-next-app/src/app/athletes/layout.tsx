import { ClubAdminLayout } from "@/components/layout/DashboardLayout"

export default function AthletesLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClubAdminLayout>
      {children}
    </ClubAdminLayout>
  )
}