"use client"

import * as React from "react"
import {
    IconChartBar,
    IconDashboard,
    IconHelp,
    IconInnerShadowTop,
    IconMapPin,
    IconReport,
    IconSettings,
    IconTrophy,
    IconUser,
    IconUserCheck,
} from "@tabler/icons-react"

import {NavDocuments} from "@/components/nav-documents"
import {NavMain} from "@/components/nav-main"
import {NavSecondary} from "@/components/nav-secondary"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Atletas",
      url: "/admin/athletes",
      icon: IconUser,
      items: [
        {
          title: "Todos los atletas",
          url: "/admin/athletes",
        },
        {
          title: "Nuevo atleta",
          url: "/admin/athletes/new",
        },
      ],
    },
    {
      title: "Tutores",
      url: "/admin/guardians",
      icon: IconUserCheck,
    },
    {
      title: "Reportes",
      url: "#",
      icon: IconReport,
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "/admin/config",
      icon: IconSettings,
      items: [
        {
          title: "General",
          url: "/admin/config",
        },
        {
          title: "Deportes",
          url: "/admin/config/sports",
        },
        {
          title: "Sedes",
          url: "/admin/config/venues",
        },
      ],
    },
    {
      title: "Ayuda",
      url: "#",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Estadísticas",
      url: "#",
      icon: IconChartBar,
    },
    {
      name: "Deportes",
      url: "/admin/config/sports",
      icon: IconTrophy,
    },
    {
      name: "Sedes",
      url: "/admin/config/venues",
      icon: IconMapPin,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SGD Console</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
