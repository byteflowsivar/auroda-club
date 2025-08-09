import { AuthGuard } from "@/components/auth/AuthGuard"
import { redirect } from "next/navigation"

export default function Home() {
  // Si no está autenticado, redirigir automáticamente a Keycloak
  return (
    <AuthGuard>
      <div>{/* Este contenido nunca se mostrará ya que será redirigido */}</div>
    </AuthGuard>
  )
}
