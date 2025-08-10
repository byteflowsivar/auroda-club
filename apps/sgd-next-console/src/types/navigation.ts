// Tipos para componentes de navegación y sidebar
import { type Icon } from "@tabler/icons-react"

export interface NavItem {
  title: string
  url: string
  icon?: Icon
  items?: NavSubItem[]
}

export interface NavSubItem {
  title: string
  url: string
}

export interface NavMainProps {
  items: NavItem[]
}

export interface NavSecondaryProps {
  items: NavItem[]
  className?: string
}

export interface NavDocumentsProps {
  items: {
    name: string
    url: string
    icon?: Icon
  }[]
}

export interface AppSidebarProps extends React.ComponentProps<'div'> {
  variant?: 'sidebar' | 'floating' | 'inset'
  side?: 'left' | 'right'
  collapsible?: 'icon' | 'offcanvas' | 'none'
}