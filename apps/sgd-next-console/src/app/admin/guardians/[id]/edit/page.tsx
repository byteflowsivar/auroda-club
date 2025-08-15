"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { GuardianForm } from "@/components/guardians/guardian-form"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { apiClient } from '@/lib/api'
import type { GuardianResponse } from '@/types/api'

export default function EditGuardianPage() {
  const params = useParams()
  const guardianId = parseInt(params.id as string)
  
  const [guardian, setGuardian] = useState<GuardianResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGuardian = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getGuardian(guardianId)
        setGuardian(data)
      } catch (err) {
        console.error('Error loading guardian:', err)
        setError('Error al cargar la información del tutor')
      } finally {
        setLoading(false)
      }
    }

    if (guardianId) {
      loadGuardian()
    }
  }, [guardianId])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset"/>
      <SidebarInset>
        <SiteHeader/>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Cargando información del tutor...</span>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-red-600 mb-2">{error}</p>
                  <p className="text-sm text-muted-foreground">
                    Verifique que el ID del tutor sea correcto
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : guardian ? (
            <GuardianForm guardian={guardian} />
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}