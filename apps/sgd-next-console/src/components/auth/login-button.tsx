"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface LoginButtonProps {
  className?: string
  children?: React.ReactNode
}

export function LoginButton({ className, children }: LoginButtonProps) {
  return (
    <Button
      onClick={() => signIn("keycloak")}
      className={className}
    >
      {children || "Iniciar Sesión"}
    </Button>
  )
}