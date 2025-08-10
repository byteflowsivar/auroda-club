import {AuthGuard} from "@/components/auth/auth-guard"
import { ROLES } from "@/lib/constants"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRoles={[ROLES.ADMIN_GENERAL, ROLES.ADMIN_CLUB, ROLES.PROFESOR]}>
      {children}
    </AuthGuard>
  )
}