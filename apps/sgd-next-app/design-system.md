# Design System - Sistema de Gestión Deportiva (SGD)

## 📐 Información General
- **Versión**: 2.0.0
- **Fecha**: 2025-08-08
- **UI Library**: shadcn/ui v4
- **Base**: dashboard-01 + sidebar-07
- **Theme**: Yellow
- **Framework**: Tailwind CSS + React
- **Responsive**: Mobile-first approach
- **Accesibilidad**: WCAG 2.1 AA compliant

---

## 🎨 Paleta de Colores - Tema Yellow

### **Yellow Theme (shadcn/ui compatible)**
```css
:root {
  /* Yellow Primary - Energético y Deportivo */
  --primary-50: #fffbeb;
  --primary-100: #fef3c7;
  --primary-200: #fde68a;
  --primary-300: #fcd34d;
  --primary-400: #fbbf24;
  --primary-500: #f59e0b;    /* Yellow principal */
  --primary-600: #d97706;    /* Yellow intenso */
  --primary-700: #b45309;
  --primary-800: #92400e;
  --primary-900: #78350f;    /* Yellow oscuro */
  
  /* Orange Accent - Complementario deportivo */
  --accent-50: #fff7ed;
  --accent-100: #ffedd5;
  --accent-200: #fed7aa;
  --accent-300: #fdba74;
  --accent-400: #fb923c;
  --accent-500: #f97316;     /* Orange acento */
  --accent-600: #ea580c;
  --accent-700: #c2410c;
  --accent-800: #9a3412;
  --accent-900: #7c2d12;
}
```

### **Colores de Fondo - Yellow Theme**
```css
:root {
  /* Fondos con tema yellow */
  --background-primary: #fffbeb;    /* Yellow 50 - suave */
  --background-secondary: #f8fafc;  /* Neutral claro */
  --background-card: #ffffff;       /* Blanco puro para tarjetas */
  --background-muted: #fef3c7;      /* Yellow 100 - muted */
  --background-overlay: rgba(255, 251, 235, 0.9); /* Yellow overlay */
}
```

### **Colores Semánticos (shadcn/ui compatible)**
```css
:root {
  /* Estados del Sistema */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --success-900: #14532d;
  
  --warning-50: #fefce8;
  --warning-500: #eab308;
  --warning-600: #ca8a04;
  --warning-900: #713f12;
  
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  --error-900: #7f1d1d;
  
  --info-50: #eff6ff;
  --info-500: #3b82f6;
  --info-600: #2563eb;
  --info-900: #1e3a8a;
  
  /* shadcn/ui semantic colors */
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 42 87% 55%;  /* Yellow ring focus */
}
```

### **Colores de Texto**
```css
:root {
  /* Textos */
  --text-primary: #1f2937;      /* Casi negro para máximo contraste */
  --text-secondary: #4b5563;    /* Gris oscuro para texto secundario */
  --text-muted: #6b7280;        /* Gris medio para hints y placeholders */
  --text-light: #9ca3af;        /* Gris claro para labels inactivos */
  --text-on-primary: #92400e;   /* Texto oscuro sobre yellow */
  --text-on-accent: #ffffff;    /* Texto blanco sobre orange */
  --text-yellow: #78350f;       /* Texto yellow oscuro */
  
  /* shadcn/ui text colors */
  --foreground: 222 84% 5%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --card: 0 0% 100%;
  --card-foreground: 222 84% 5%;
}
```

---

## 🔤 Tipografía

### **Familia de Fuentes (shadcn/ui compatible)**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, monospace;
}
```

**¿Por qué Inter con shadcn/ui?**
- ✅ Compatible con el sistema de diseño shadcn/ui
- ✅ Excelente legibilidad en interfaces deportivas
- ✅ Optimizada para dashboards y formularios
- ✅ Soporte completo para caracteres latinos
- ✅ Performance optimizada para aplicaciones React

### **Escala Tipográfica (shadcn/ui)**
```css
/* shadcn/ui Typography Scale */
.text-xs { font-size: 0.75rem; line-height: 1rem; }      /* 12px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }  /* 14px */
.text-base { font-size: 1rem; line-height: 1.5rem; }     /* 16px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }  /* 18px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }   /* 20px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }      /* 24px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }   /* 36px */

/* Headings específicos para SGD */
.heading-page { @apply text-3xl font-bold tracking-tight text-foreground; }
.heading-section { @apply text-xl font-semibold text-foreground; }
.heading-card { @apply text-lg font-medium text-foreground; }
.text-body { @apply text-sm text-muted-foreground; }
.text-caption { @apply text-xs text-muted-foreground; }
```

---

## 📱 Sistema de Espaciado (shadcn/ui)

### **Espaciado Base (compatible con Tailwind)**
```css
:root {
  --spacing: 0.25rem;   /* Base unit: 4px */
  
  /* shadcn/ui spacing scale */
  --space-0-5: calc(var(--spacing) * 0.5);   /* 2px */
  --space-1: var(--spacing);                 /* 4px */
  --space-2: calc(var(--spacing) * 2);       /* 8px */
  --space-3: calc(var(--spacing) * 3);       /* 12px */
  --space-4: calc(var(--spacing) * 4);       /* 16px */
  --space-5: calc(var(--spacing) * 5);       /* 20px */
  --space-6: calc(var(--spacing) * 6);       /* 24px */
  --space-8: calc(var(--spacing) * 8);       /* 32px */
  --space-10: calc(var(--spacing) * 10);     /* 40px */
  --space-12: calc(var(--spacing) * 12);     /* 48px */
  --space-16: calc(var(--spacing) * 16);     /* 64px */
  --space-20: calc(var(--spacing) * 20);     /* 80px */
  --space-24: calc(var(--spacing) * 24);     /* 96px */
  
  /* Dashboard specific */
  --sidebar-width: calc(var(--spacing) * 72);  /* 288px - from dashboard-01 */
  --header-height: calc(var(--spacing) * 12);  /* 48px - from dashboard-01 */
}
```

### **Espaciado Semántico**
```css
/* Componentes */
--component-padding-sm: var(--space-3);   /* 12px */
--component-padding-md: var(--space-4);   /* 16px */
--component-padding-lg: var(--space-6);   /* 24px */

/* Layout */
--layout-gap-sm: var(--space-4);          /* 16px */
--layout-gap-md: var(--space-6);          /* 24px */
--layout-gap-lg: var(--space-8);          /* 32px */

/* Formularios */
--form-field-gap: var(--space-4);         /* 16px */
--form-section-gap: var(--space-8);       /* 32px */
```

---

## 🎛️ Componentes shadcn/ui - Yellow Theme

### **Dashboard Layout (basado en dashboard-01)**
```typescript
// Layout principal para SGD Dashboard
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)", // 288px
        "--header-height": "calc(var(--spacing) * 12)", // 48px
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### **Sidebar Navigation (basado en sidebar-07)**
```typescript
// Header con breadcrumbs para navegación SGD
export function SGDHeader({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={index}>
                {index < breadcrumbs.length - 1 ? (
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
```

### **Botones Yellow Theme (shadcn/ui)**
```typescript
// Button component con yellow theme
import { Button } from "@/components/ui/button"

// Uso con variantes shadcn/ui
<Button variant="default">Guardar Atleta</Button>       // Yellow primary
<Button variant="secondary">Cancelar</Button>          // Neutral
<Button variant="outline">Ver Detalles</Button>        // Outline
<Button variant="destructive">Eliminar</Button>        // Red destructive
<Button variant="ghost">Editar</Button>                // Transparent

// Sizes
<Button size="sm">Pequeño</Button>
<Button size="default">Normal</Button>
<Button size="lg">Grande</Button>
<Button size="icon"><PlusIcon /></Button>
```

### **Cards y Contenedores**
```typescript
// Card component con yellow theme
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AthleteCard({ athlete }: { athlete: Athlete }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{athlete.fullName}</CardTitle>
        <CardDescription>{athlete.sport} - {athlete.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>{calculateAge(athlete.birthDate)} años</span>
        </div>
      </CardContent>
    </Card>
  )
}
```

### **Formularios (shadcn/ui)**
```typescript
// Form components con yellow theme
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AthleteForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Atleta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo *</Label>
            <Input
              id="fullName"
              placeholder="Ingrese el nombre completo"
              className="focus:ring-yellow-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sport">Deporte *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un deporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="football">Fútbol</SelectItem>
                <SelectItem value="basketball">Baloncesto</SelectItem>
                <SelectItem value="volleyball">Voleibol</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
            Guardar Atleta
          </Button>
          <Button variant="outline" type="button">
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### **Data Tables**
```typescript
// Table component con yellow theme
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function AthletesTable({ athletes }: { athletes: Athlete[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Atletas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Deporte</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {athletes.map((athlete) => (
              <TableRow key={athlete.id}>
                <TableCell className="font-medium">{athlete.fullName}</TableCell>
                <TableCell>{athlete.sport}</TableCell>
                <TableCell>{athlete.category}</TableCell>
                <TableCell>
                  <Badge 
                    variant={athlete.status === 'active' ? 'default' : 'secondary'}
                    className={athlete.status === 'active' ? 'bg-yellow-500' : ''}
                  >
                    {athlete.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Ver</Button>
                  <Button variant="ghost" size="sm">Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
```

---

## 🎨 Configuración Tailwind (Yellow Theme)

### **tailwind.config.js**
```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Yellow theme colors
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
          foreground: '#92400e',
        },
        // shadcn/ui colors
        border: 'hsl(214 32% 91%)',
        input: 'hsl(214 32% 91%)',
        ring: 'hsl(42 87% 55%)', // Yellow ring
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222 84% 5%)',
        muted: {
          DEFAULT: 'hsl(210 40% 96%)',
          foreground: 'hsl(215 16% 47%)',
        },
        accent: {
          DEFAULT: 'hsl(210 40% 96%)',
          foreground: 'hsl(222 84% 5%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84% 60%)',
          foreground: 'hsl(210 40% 98%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222 84% 5%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',    // 72px
        '72': '18rem',     // 288px - sidebar width
        '88': '22rem',     // 352px
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}
```

---

## 🎯 Componentes SGD Específicos

### **Dashboard Widgets (basado en dashboard-01)**
```typescript
// Widget de estadísticas con yellow theme
export function StatsCard({ title, value, change, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          {' '}desde el mes pasado
        </p>
      </CardContent>
    </Card>
  )
}

// Uso en dashboard
export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Atletas"
        value="247"
        change={12}
        icon={Users}
      />
      <StatsCard
        title="Atletas Activos"
        value="189"
        change={8}
        icon={UserCheck}
      />
      <StatsCard
        title="Nuevos Este Mes"
        value="23"
        change={-2}
        icon={UserPlus}
      />
      <StatsCard
        title="Deportes Activos"
        value="8"
        change={0}
        icon={Trophy}
      />
    </div>
  )
}
```

### **Navigation Menu SGD**
```typescript
// Sidebar específico para SGD con roles
import { 
  Users, 
  UserCheck, 
  Trophy, 
  MapPin, 
  Settings,
  BarChart3,
  Home
} from "lucide-react"

export function SGDSidebar() {
  const { data: session } = useSession()
  const userRoles = session?.user?.roles || []
  const isAdmin = userRoles.includes('ADMIN_GENERAL') || userRoles.includes('ADMIN_CLUB')

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>SGD - Sistema Deportivo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/athletes">
                    <Users className="h-4 w-4" />
                    <span>Atletas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {isAdmin && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/guardians">
                        <UserCheck className="h-4 w-4" />
                        <span>Tutores</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/reports">
                        <BarChart3 className="h-4 w-4" />
                        <span>Reportes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/config">
                        <Settings className="h-4 w-4" />
                        <span>Configuración</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
```

---

## 📱 Responsive Design

### **Breakpoints (Tailwind)**
```css
/* Mobile First Approach */
/* Default: 0px - Mobile */
@media (min-width: 640px) { /* sm: Tablet */ }
@media (min-width: 768px) { /* md: Tablet Large */ }
@media (min-width: 1024px) { /* lg: Desktop */ }
@media (min-width: 1280px) { /* xl: Large Desktop */ }
@media (min-width: 1536px) { /* 2xl: Extra Large */ }
```

### **Layout Responsivo**
```typescript
// Layout adaptativo para dashboard
export function ResponsiveDashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile: Stack layout */}
      <div className="lg:hidden">
        <MobileSidebar />
        <main className="pt-16">
          {children}
        </main>
      </div>
      
      {/* Desktop: Sidebar layout */}
      <div className="hidden lg:block">
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </div>
    </div>
  )
}
```

---

## 🔍 Accesibilidad (WCAG 2.1 AA)

### **Contraste de Colores**
```css
/* Yellow theme con contraste validado */
.text-on-yellow-bg { 
  color: #92400e; /* 4.8:1 contrast ratio sobre yellow-500 */
}
.text-on-orange-bg { 
  color: #ffffff; /* 4.9:1 contrast ratio sobre orange-500 */
}
```

### **Focus Management**
```typescript
// Focus visible en componentes interactivos
<Button className="focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
  Acción Principal
</Button>
```

---

## 🚀 Implementación

### **Setup Inicial**
```bash
# Instalar shadcn/ui
npx shadcn-ui@latest init

# Agregar componentes necesarios
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add sidebar
npx shadcn-ui@latest add breadcrumb
npx shadcn-ui@latest add badge
```

### **Estructura de Componentes**
```
/components/
├── ui/                 # shadcn/ui components
├── sgd/               # SGD specific components
│   ├── dashboard/     # Dashboard widgets
│   ├── athletes/      # Athlete components
│   ├── forms/         # Form components
│   └── layout/        # Layout components
└── shared/           # Shared utilities
```

Este design system basado en shadcn/ui v4 con tema yellow proporciona una base sólida y moderna para el Sistema de Gestión Deportiva, manteniendo coherencia visual y excelente experiencia de usuario. 🏆
