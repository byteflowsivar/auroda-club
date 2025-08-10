"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  className?: string
  children?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function LogoutButton({ 
  className, 
  children, 
  variant = "outline" 
}: LogoutButtonProps) {
  return (
    <Button 
      onClick={() => signOut()}
      variant={variant}
      className={className}
    >
      {children || "Cerrar Sesión"}
    </Button>
  )
}