"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { LogIn, LogOut, Loader2 } from "lucide-react"
import { clsx } from "clsx"

interface LoginButtonProps {
  variant?: "primary" | "secondary" | "accent" | "danger"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoginButton({ 
  variant = "primary", 
  size = "md",
  className 
}: LoginButtonProps) {
  const { data: session, status } = useSession()

  const handleAuth = async () => {
    if (session) {
      await signOut()
    } else {
      await signIn("keycloak", { 
        callbackUrl: "/dashboard" 
      })
    }
  }

  const isLoading = status === "loading"
  const isAuthenticated = !!session

  const buttonClasses = clsx(
    "btn",
    `btn-${variant}`,
    size === "sm" && "btn-sm",
    size === "lg" && "btn-lg",
    "focus-ring",
    className
  )

  return (
    <button 
      onClick={handleAuth}
      disabled={isLoading}
      className={buttonClasses}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Cargando...
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4 mr-2" />
          Iniciar Sesión
        </>
      )}
    </button>
  )
}

/**
 * Componente simple para solo mostrar botón de login
 */
export function SignInButton({ 
  variant = "primary", 
  size = "md",
  className 
}: LoginButtonProps) {
  const { status } = useSession()
  const isLoading = status === "loading"

  const handleSignIn = async () => {
    await signIn("keycloak", { 
      callbackUrl: "/dashboard" 
    })
  }

  const buttonClasses = clsx(
    "btn",
    `btn-${variant}`,
    size === "sm" && "btn-sm",
    size === "lg" && "btn-lg",
    "focus-ring",
    className
  )

  return (
    <button 
      onClick={handleSignIn}
      disabled={isLoading}
      className={buttonClasses}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Iniciando...
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4 mr-2" />
          Iniciar Sesión
        </>
      )}
    </button>
  )
}

/**
 * Componente simple para solo mostrar botón de logout
 */
export function SignOutButton({ 
  variant = "secondary", 
  size = "md",
  className 
}: LoginButtonProps) {
  const { status } = useSession()
  const isLoading = status === "loading"

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const buttonClasses = clsx(
    "btn",
    `btn-${variant}`,
    size === "sm" && "btn-sm",
    size === "lg" && "btn-lg",
    "focus-ring",
    className
  )

  return (
    <button 
      onClick={handleSignOut}
      disabled={isLoading}
      className={buttonClasses}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Cerrando...
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </>
      )}
    </button>
  )
}