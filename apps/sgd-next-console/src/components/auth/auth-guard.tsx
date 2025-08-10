"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoadingSpinner } from "./loading-spinner"
import { hasAnyRole } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  requiredRoles = [], 
  fallback 
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    // Si no está autenticado, redirigir al login de Keycloak
    if (status === "unauthenticated") {
      router.push("/api/auth/signin")
      return
    }

    // Si está autenticado pero no tiene los roles requeridos
    if (session && requiredRoles.length > 0) {
      const userRoles = session.user.roles || []
      if (!hasAnyRole(userRoles, requiredRoles)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [session, status, router, requiredRoles])

  // Mostrar spinner mientras carga la sesión
  if (status === "loading") {
    return <LoadingSpinner />
  }

  // Si no está autenticado, mostrar fallback o spinner
  if (status === "unauthenticated") {
    return fallback || <LoadingSpinner />
  }

  // Si no tiene roles requeridos, mostrar fallback o spinner
  if (session && requiredRoles.length > 0) {
    const userRoles = session.user.roles || []
    if (!hasAnyRole(userRoles, requiredRoles)) {
      return fallback || <LoadingSpinner />
    }
  }

  // Todo OK, mostrar children
  return <>{children}</>
}