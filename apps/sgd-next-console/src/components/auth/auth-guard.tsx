"use client"

import { useSession, signOut } from "next-auth/react"
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

    // Si no está autenticado, redirigir al login
    if (status === "unauthenticated") {
      console.log("User not authenticated, redirecting to login")
      router.push("/api/auth/signin")
      return
    }

    // Si la sesión tiene error de refresh token, forzar logout y redirigir
    if (session && 'error' in session && session.error === "RefreshAccessTokenError") {
      console.log("Refresh token error detected, forcing logout")
      signOut({ callbackUrl: "/api/auth/signin" })
      return
    }

    // Validar que la sesión tenga los datos mínimos necesarios
    if (session && (!session.user || !session.user.id)) {
      console.log("Invalid session detected, forcing logout")
      signOut({ callbackUrl: "/api/auth/signin" })
      return
    }

    // Si está autenticado pero no tiene los roles requeridos
    if (session && requiredRoles.length > 0) {
      const userRoles = session.user.roles || []
      if (!hasAnyRole(userRoles, requiredRoles)) {
        console.log("User doesn't have required roles, redirecting to unauthorized")
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