"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminPageLayoutProps {
  /** Título principal de la página */
  title: string;
  /** Subtítulo opcional */
  subtitle?: string;
  /** URL de retorno para el botón "Volver" */
  backHref: string;
  /** Contenido principal de la página */
  children: React.ReactNode;
  /** Props adicionales para el botón de volver */
  backButtonProps?: React.ComponentProps<typeof Button>;
}

/**
 * Layout reutilizable para páginas administrativas
 * Incluye sidebar, header, botón de navegación y estructura común
 */
export function AdminPageLayout({
  title,
  subtitle,
  backHref,
  children,
  backButtonProps
}: AdminPageLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          {/* Header con navegación */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              asChild 
              {...backButtonProps}
            >
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}