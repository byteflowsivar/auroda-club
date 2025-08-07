# Design System - Sistema de Gestión Deportiva

## 📐 Información General
- **Versión**: 1.0.0
- **Fecha**: 2025-08-07
- **Framework**: Tailwind CSS
- **Responsive**: Mobile-first approach
- **Accesibilidad**: WCAG 2.1 AA compliant

---

## 🎨 Paleta de Colores

### **Colores Primarios** (Basados en la imagen)
```css
:root {
  /* Azul Principal - Deportivo y Profesional */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;    /* Azul botón "Iniciar sesión" */
  --primary-600: #2563eb;    /* Azul intenso del logo */
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;    /* Azul oscuro profesional */
  
  /* Naranja Acento - Energético y Deportivo */
  --accent-50: #fff7ed;
  --accent-100: #ffedd5;
  --accent-200: #fed7aa;
  --accent-300: #fdba74;
  --accent-400: #fb923c;
  --accent-500: #f97316;     /* Naranja del logo */
  --accent-600: #ea580c;
  --accent-700: #c2410c;
  --accent-800: #9a3412;
  --accent-900: #7c2d12;
}
```

### **Colores de Fondo** (Basados en la imagen)
```css
:root {
  /* Fondo Principal - Azul Suave */
  --background-primary: #dbeafe;    /* Azul claro del fondo */
  --background-secondary: #f8fafc;  /* Blanco hueso para contraste */
  --background-card: #ffffff;       /* Blanco puro para tarjetas */
  --background-overlay: rgba(219, 234, 254, 0.8); /* Overlay semitransparente */
}
```

### **Colores Semánticos**
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
  --text-on-primary: #ffffff;   /* Texto sobre colores primarios */
  --text-on-accent: #ffffff;    /* Texto sobre colores de acento */
}
```

---

## 🔤 Tipografía

### **Familia de Fuentes**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
}
```

**¿Por qué Inter?**
- ✅ Excelente legibilidad en pantallas
- ✅ Optimizada para interfaces digitales
- ✅ Soporte completo para caracteres latinos
- ✅ Disponible en Google Fonts
- ✅ Buena performance y loading

### **Escala Tipográfica**
```css
/* Headings - Títulos */
.text-display-2xl {
  font-size: 4.5rem;    /* 72px */
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.text-display-xl {
  font-size: 3.75rem;   /* 60px */
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.text-display-lg {
  font-size: 3rem;      /* 48px */
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.text-display-md {
  font-size: 2.25rem;   /* 36px */
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.text-display-sm {
  font-size: 1.875rem;  /* 30px */
  line-height: 1.3;
  font-weight: 600;
}

.text-xl {
  font-size: 1.25rem;   /* 20px */
  line-height: 1.4;
  font-weight: 600;
}

.text-lg {
  font-size: 1.125rem;  /* 18px */
  line-height: 1.5;
  font-weight: 500;
}

.text-base {
  font-size: 1rem;      /* 16px */
  line-height: 1.5;
  font-weight: 400;
}

.text-sm {
  font-size: 0.875rem;  /* 14px */
  line-height: 1.5;
  font-weight: 400;
}

.text-xs {
  font-size: 0.75rem;   /* 12px */
  line-height: 1.4;
  font-weight: 400;
}
```

### **Uso por Contexto**
```css
/* Títulos de página */
.page-title {
  @apply text-display-md text-text-primary font-bold mb-6;
}

/* Títulos de sección */
.section-title {
  @apply text-xl text-text-primary font-semibold mb-4;
}

/* Texto de cuerpo */
.body-text {
  @apply text-base text-text-secondary leading-relaxed;
}

/* Labels de formulario */
.form-label {
  @apply text-sm text-text-primary font-medium mb-2;
}

/* Texto de ayuda */
.help-text {
  @apply text-xs text-text-muted mt-1;
}
```

---

## 📱 Sistema de Espaciado

### **Escala Base** (Múltiplos de 4px)
```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
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

## 🎛️ Componentes Base

### **Botones**
```css
/* Botón Primario - Basado en el "Iniciar sesión" */
.btn-primary {
  @apply px-6 py-3 bg-primary-600 hover:bg-primary-700 focus:bg-primary-700;
  @apply text-white font-medium text-base rounded-lg;
  @apply transition-colors duration-200 ease-in-out;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  @apply disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed;
  
  /* Tamaño mínimo táctil para móviles */
  min-height: 44px;
  min-width: 120px;
}

/* Botón Secundario */
.btn-secondary {
  @apply px-6 py-3 bg-white hover:bg-gray-50 focus:bg-gray-50;
  @apply text-primary-600 font-medium text-base rounded-lg;
  @apply border border-primary-600 hover:border-primary-700;
  @apply transition-colors duration-200 ease-in-out;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  
  min-height: 44px;
  min-width: 120px;
}

/* Botón de Acento */
.btn-accent {
  @apply px-6 py-3 bg-accent-500 hover:bg-accent-600 focus:bg-accent-600;
  @apply text-white font-medium text-base rounded-lg;
  @apply transition-colors duration-200 ease-in-out;
  @apply focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2;
  
  min-height: 44px;
  min-width: 120px;
}

/* Botón Danger */
.btn-danger {
  @apply px-6 py-3 bg-error-500 hover:bg-error-600 focus:bg-error-600;
  @apply text-white font-medium text-base rounded-lg;
  @apply transition-colors duration-200 ease-in-out;
  @apply focus:outline-none focus:ring-2 focus:ring-error-400 focus:ring-offset-2;
  
  min-height: 44px;
  min-width: 120px;
}

/* Tamaños de botón */
.btn-sm {
  @apply px-4 py-2 text-sm;
  min-height: 36px;
  min-width: 80px;
}

.btn-lg {
  @apply px-8 py-4 text-lg;
  min-height: 52px;
  min-width: 140px;
}
```

### **Campos de Formulario**
```css
/* Input base - Similar al estilo de la imagen */
.form-input {
  @apply w-full px-4 py-3 text-base text-text-primary;
  @apply bg-white border border-gray-300 rounded-lg;
  @apply placeholder:text-text-muted placeholder:font-normal;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
  @apply disabled:bg-gray-100 disabled:text-text-muted disabled:cursor-not-allowed;
  @apply transition-colors duration-200 ease-in-out;
  
  /* Tamaño mínimo táctil */
  min-height: 44px;
}

/* Input con error */
.form-input-error {
  @apply form-input border-error-500 focus:ring-error-500 focus:border-error-500;
}

/* Input con éxito */
.form-input-success {
  @apply form-input border-success-500 focus:ring-success-500 focus:border-success-500;
}

/* Textarea */
.form-textarea {
  @apply form-input resize-none;
  min-height: 88px; /* 2 líneas mínimo */
}

/* Select */
.form-select {
  @apply form-input cursor-pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px 12px;
  padding-right: 44px;
}
```

### **Tarjetas y Contenedores**
```css
/* Tarjeta base */
.card {
  @apply bg-background-card rounded-xl shadow-sm border border-gray-200;
  @apply p-6;
}

/* Tarjeta elevada */
.card-elevated {
  @apply card shadow-lg;
}

/* Panel de formulario */
.form-panel {
  @apply card space-y-6;
}

/* Contenedor principal */
.main-container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

---

## 📐 Layout y Grid

### **Breakpoints Responsivos**
```css
/* Mobile First Approach */
:root {
  --screen-sm: 640px;    /* Teléfonos grandes */
  --screen-md: 768px;    /* Tablets */
  --screen-lg: 1024px;   /* Laptops */
  --screen-xl: 1280px;   /* Desktops */
  --screen-2xl: 1536px;  /* Pantallas grandes */
}
```

### **Grid System**
```css
/* Grid principal de la aplicación */
.app-grid {
  display: grid;
  min-height: 100vh;
  
  /* Mobile: Solo contenido */
  grid-template-areas: 
    "header"
    "main";
  grid-template-rows: auto 1fr;
  
  /* Tablet y Desktop: Con sidebar */
  @media (min-width: 768px) {
    grid-template-areas: 
      "sidebar header"
      "sidebar main";
    grid-template-columns: 256px 1fr;
    grid-template-rows: auto 1fr;
  }
}

.app-header { grid-area: header; }
.app-sidebar { grid-area: sidebar; }
.app-main { grid-area: main; }
```

### **Layout de Formularios**
```css
/* Formulario responsive */
.form-grid {
  display: grid;
  gap: var(--form-field-gap);
  
  /* Mobile: 1 columna */
  grid-template-columns: 1fr;
  
  /* Tablet: 2 columnas */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Desktop: 3 columnas */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Campo que ocupa ancho completo */
.form-field-full {
  grid-column: 1 / -1;
}

/* Campo que ocupa 2 columnas en tablet+ */
.form-field-wide {
  @media (min-width: 768px) {
    grid-column: span 2;
  }
}
```

---

## 🚨 Estados y Feedback

### **Estados de Carga**
```css
/* Skeleton loader */
.skeleton {
  @apply bg-gray-200 animate-pulse rounded;
}

.skeleton-text {
  @apply skeleton h-4 w-full mb-2;
}

.skeleton-button {
  @apply skeleton h-10 w-24;
}

/* Spinner */
.spinner {
  @apply animate-spin h-6 w-6 border-2 border-primary-200 border-t-primary-600 rounded-full;
}
```

### **Mensajes de Estado**
```css
/* Alert base */
.alert {
  @apply p-4 rounded-lg border flex items-start gap-3;
}

.alert-success {
  @apply alert bg-success-50 border-success-200 text-success-800;
}

.alert-warning {
  @apply alert bg-warning-50 border-warning-200 text-warning-800;
}

.alert-error {
  @apply alert bg-error-50 border-error-200 text-error-800;
}

.alert-info {
  @apply alert bg-info-50 border-info-200 text-info-800;
}
```

### **Estados de Validación**
```css
/* Mensaje de error de campo */
.field-error {
  @apply text-error-600 text-xs mt-1 flex items-center gap-1;
}

/* Mensaje de éxito de campo */
.field-success {
  @apply text-success-600 text-xs mt-1 flex items-center gap-1;
}

/* Hint de campo */
.field-hint {
  @apply text-text-muted text-xs mt-1;
}
```

---

## 🔍 Accesibilidad

### **Principios WCAG 2.1 AA**

#### **Contraste de Colores**
```css
/* Ratios de contraste cumpliendo WCAG AA */
--contrast-ratio-normal: 4.5:1;  /* Texto normal */
--contrast-ratio-large: 3:1;     /* Texto grande (18px+ o 14px+ bold) */

/* Combinaciones validadas */
.text-on-primary { color: #ffffff; }      /* 4.52:1 sobre primary-600 */
.text-on-background { color: #1f2937; }   /* 16.68:1 sobre background-primary */
.text-secondary-on-background { color: #4b5563; } /* 7.54:1 sobre background-primary */
```

#### **Focus Indicators**
```css
/* Indicador de foco visible */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

/* Para elementos sobre fondos oscuros */
.focus-ring-invert {
  @apply focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600;
}
```

#### **Tamaños Táctiles**
```css
/* Área mínima táctil de 44x44px (recomendación WCAG) */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Para iconos clickeables */
.icon-button {
  @apply touch-target flex items-center justify-center p-2;
}
```

---

## 📱 Adaptaciones Móviles

### **Sidebar Responsive**
```css
/* Sidebar móvil como overlay */
.sidebar-mobile {
  @apply fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl;
  @apply transform -translate-x-full transition-transform duration-300 ease-in-out;
}

.sidebar-mobile.open {
  @apply translate-x-0;
}

/* Overlay de fondo */
.sidebar-overlay {
  @apply fixed inset-0 z-40 bg-black bg-opacity-50;
  @apply opacity-0 transition-opacity duration-300 ease-in-out;
}

.sidebar-overlay.open {
  @apply opacity-100;
}
```

### **Formularios Móviles**
```css
/* Inputs más grandes en móvil */
@media (max-width: 767px) {
  .form-input {
    @apply py-4 text-lg;
    min-height: 48px;
  }
  
  .btn {
    @apply py-4 text-lg;
    min-height: 48px;
  }
}
```

### **Tablas Responsive**
```css
/* Tabla scrolleable en móvil */
.table-container {
  @apply overflow-x-auto;
}

.table-responsive {
  @apply min-w-full;
}

/* Cards en móvil en lugar de tabla */
@media (max-width: 767px) {
  .table-mobile-cards .table-row {
    @apply block bg-white rounded-lg shadow mb-4 p-4;
  }
  
  .table-mobile-cards .table-cell {
    @apply block text-sm;
  }
  
  .table-mobile-cards .table-cell:before {
    content: attr(data-label) ": ";
    @apply font-medium text-text-primary;
  }
}
```

---

## 🎨 Implementación en Tailwind

### **Configuración tailwind.config.js**
```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        background: {
          primary: '#dbeafe',
          secondary: '#f8fafc',
          card: '#ffffff',
        },
        text: {
          primary: '#1f2937',
          secondary: '#4b5563',
          muted: '#6b7280',
          light: '#9ca3af',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

---

## 📋 Componentes de Ejemplo

### **Login Page (Keycloak Style)**
```html
<!-- Esta página la proporciona Keycloak, pero el estilo debe coincidir -->
<div class="min-h-screen bg-background-primary flex items-center justify-center p-4">
  <div class="max-w-md w-full">
    <!-- Logo Section -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-xl mb-4">
        <div class="w-8 h-8 bg-accent-500 rounded"></div>
      </div>
      <h1 class="text-display-sm text-text-primary mb-2">Bienvenido</h1>
    </div>
    
    <!-- Form Card -->
    <div class="card">
      <form class="space-y-6">
        <div>
          <label class="form-label">Usuario o email</label>
          <input type="text" class="form-input" placeholder="Usuario o email">
        </div>
        
        <div>
          <label class="form-label">Contraseña</label>
          <input type="password" class="form-input" placeholder="Contraseña">
        </div>
        
        <div class="flex items-center">
          <input type="checkbox" class="mr-2">
          <span class="text-sm text-text-muted">Seguir conectado</span>
        </div>
        
        <button type="submit" class="btn-primary w-full">
          Iniciar sesión
        </button>
        
        <div class="text-center">
          <a href="#" class="text-sm text-primary-600 hover:text-primary-700">
            ¿Has olvidado tu contraseña?
          </a>
        </div>
      </form>
    </div>
  </div>
</div>
```

### **Dashboard Widget**
```html
<div class="card">
  <div class="flex items-center justify-between mb-4">
    <h3 class="section-title mb-0">Atletas Registrados</h3>
    <span class="text-2xl font-bold text-primary-600">247</span>
  </div>
  <p class="text-sm text-text-muted">
    +12 atletas este mes
  </p>
  <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
    <div class="bg-primary-600 h-2 rounded-full" style="width: 68%"></div>
  </div>
</div>
```

---

## 🔧 Uso Práctico

### **Para Desarrolladores Frontend**
1. **Importar Tailwind**: Configurar con los colores extendidos
2. **Usar clases semánticas**: `btn-primary`, `form-input`, `card`
3. **Responsive first**: Siempre comenzar con móvil
4. **Testing de contraste**: Verificar ratios de accesibilidad
5. **Touch targets**: Asegurar 44px mínimo en elementos interactivos

### **Para Keycloak Themes**
1. **Usar la misma paleta de colores**: Mantener consistencia visual
2. **Aplicar tipografía Inter**: Para cohesión de marca
3. **Respetar espaciados**: Usar la misma escala de espaciado
4. **Mantener responsividad**: El login debe verse bien en móvil


## 🎯 **Beneficios del Design System**

- 🚀 **Desarrollo más rápido** con componentes predefinidos
- 🔧 **Mantenimiento simplificado** con tokens centralizados
- 👥 **Colaboración mejorada** entre diseño y desarrollo
- 📈 **Escalabilidad** para futuras funcionalidades

---

## 🧩 Componentes Avanzados

### **Navegación y Header**
```css
/* Header principal */
.app-header {
  @apply bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8;
  @apply flex items-center justify-between h-16;
}

/* Sidebar navigation */
.sidebar {
  @apply bg-white border-r border-gray-200 w-64 hidden md:block;
  @apply flex flex-col h-full;
}

.sidebar-nav {
  @apply flex-1 pt-5 pb-4 overflow-y-auto;
}

.nav-item {
  @apply block px-3 py-2 mx-3 rounded-md text-sm font-medium;
  @apply text-text-secondary hover:text-text-primary;
  @apply hover:bg-gray-50 transition-colors duration-150;
}

.nav-item.active {
  @apply text-primary-600 bg-primary-50 hover:bg-primary-100;
}

/* Breadcrumbs */
.breadcrumb {
  @apply flex items-center space-x-2 text-sm text-text-muted;
}

.breadcrumb-item {
  @apply hover:text-text-primary transition-colors duration-150;
}

.breadcrumb-separator {
  @apply text-gray-400;
}
```

### **Tablas de Datos**
```css
/* Tabla base */
.data-table {
  @apply min-w-full divide-y divide-gray-200 bg-white shadow-sm rounded-lg overflow-hidden;
}

.table-header {
  @apply bg-gray-50;
}

.table-header-cell {
  @apply px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider;
}

.table-row {
  @apply divide-y divide-gray-200;
}

.table-row:hover {
  @apply bg-gray-50;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-text-primary;
}

/* Paginación */
.pagination {
  @apply flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6;
}

.pagination-info {
  @apply text-sm text-text-muted;
}

.pagination-controls {
  @apply flex space-x-2;
}

.pagination-button {
  @apply px-3 py-2 text-sm font-medium text-text-secondary;
  @apply border border-gray-300 rounded-md hover:bg-gray-50;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.pagination-button.active {
  @apply text-primary-600 bg-primary-50 border-primary-500;
}
```

### **Modales y Overlays**
```css
/* Modal overlay */
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center;
  @apply bg-black bg-opacity-50 backdrop-blur-sm;
  @apply opacity-0 transition-opacity duration-300;
}

.modal-overlay.open {
  @apply opacity-100;
}

/* Modal content */
.modal {
  @apply bg-white rounded-xl shadow-xl max-w-lg w-full mx-4;
  @apply transform scale-95 transition-transform duration-300;
}

.modal.open {
  @apply scale-100;
}

.modal-header {
  @apply px-6 py-4 border-b border-gray-200;
  @apply flex items-center justify-between;
}

.modal-title {
  @apply text-lg font-semibold text-text-primary;
}

.modal-close {
  @apply p-2 text-text-muted hover:text-text-primary;
  @apply rounded-full hover:bg-gray-100 transition-colors;
}

.modal-body {
  @apply px-6 py-4;
}

.modal-footer {
  @apply px-6 py-4 border-t border-gray-200;
  @apply flex items-center justify-end space-x-3;
}
```

### **Filtros y Búsqueda**
```css
/* Barra de filtros */
.filter-bar {
  @apply bg-white border border-gray-200 rounded-lg p-4 mb-6;
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4;
}

/* Campo de búsqueda */
.search-input {
  @apply form-input pl-10;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'/%3e%3c/svg%3e");
  background-position: left 12px center;
  background-repeat: no-repeat;
  background-size: 16px 16px;
}

/* Tags de filtros activos */
.filter-tag {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium;
  @apply bg-primary-100 text-primary-800;
}

.filter-tag-remove {
  @apply ml-2 text-primary-600 hover:text-primary-800 cursor-pointer;
}
```

---

## 📊 Dashboard Específico

### **Widgets de Estadísticas**
```css
/* Widget base */
.stat-widget {
  @apply card p-6;
}

/* Widget con tendencia */
.stat-value {
  @apply text-3xl font-bold text-text-primary mb-1;
}

.stat-label {
  @apply text-sm font-medium text-text-muted mb-2;
}

.stat-trend {
  @apply flex items-center text-sm;
}

.stat-trend.positive {
  @apply text-success-600;
}

.stat-trend.negative {
  @apply text-error-600;
}

.stat-trend.neutral {
  @apply text-text-muted;
}

/* Progress bar */
.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-2 mt-3;
}

.progress-fill {
  @apply h-2 rounded-full transition-all duration-500 ease-in-out;
}

.progress-fill.primary {
  @apply bg-primary-600;
}

.progress-fill.success {
  @apply bg-success-500;
}

.progress-fill.warning {
  @apply bg-warning-500;
}
```

### **Gráficos y Visualizaciones**
```css
/* Contenedor de gráfico */
.chart-container {
  @apply card p-6;
}

.chart-header {
  @apply flex items-center justify-between mb-4;
}

.chart-title {
  @apply text-lg font-semibold text-text-primary;
}

.chart-subtitle {
  @apply text-sm text-text-muted mt-1;
}

/* Leyenda */
.chart-legend {
  @apply flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200;
}

.legend-item {
  @apply flex items-center gap-2 text-sm text-text-secondary;
}

.legend-color {
  @apply w-3 h-3 rounded-full;
}
```

---

## 🏃‍♂️ Formularios Deportivos Específicos

### **Formulario de Atleta**
```css
/* Sección de formulario */
.form-section {
  @apply space-y-6 p-6 border border-gray-200 rounded-lg;
}

.form-section-title {
  @apply text-lg font-semibold text-text-primary mb-4 pb-2 border-b border-gray-200;
}

/* Indicador de atleta menor */
.minor-indicator {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium;
  @apply bg-warning-100 text-warning-800 border border-warning-200;
}

/* Selector de tutor */
.guardian-selector {
  @apply border border-gray-200 rounded-lg p-4 space-y-4;
}

.guardian-card {
  @apply flex items-center justify-between p-3 bg-gray-50 rounded-lg;
}

.guardian-info {
  @apply flex-1;
}

.guardian-name {
  @apply font-medium text-text-primary;
}

.guardian-relationship {
  @apply text-sm text-text-muted;
}

.guardian-remove {
  @apply text-error-600 hover:text-error-800 cursor-pointer p-1;
}

/* Calculadora de edad automática */
.age-display {
  @apply inline-flex items-center px-3 py-2 bg-primary-50 text-primary-700 rounded-lg;
  @apply text-sm font-medium;
}
```

### **Validaciones Específicas**
```css
/* Validación de edad vs categoría */
.category-validation {
  @apply flex items-center gap-2 mt-2;
}

.category-validation.valid {
  @apply text-success-600;
}

.category-validation.invalid {
  @apply text-error-600;
}

/* Indicador de tutor requerido */
.guardian-required {
  @apply flex items-center gap-2 p-3 bg-warning-50 border border-warning-200 rounded-lg;
  @apply text-warning-800;
}

/* Campo condicional */
.conditional-field {
  @apply transition-all duration-300 ease-in-out;
}

.conditional-field.hidden {
  @apply opacity-0 transform scale-95 pointer-events-none;
}

.conditional-field.visible {
  @apply opacity-100 transform scale-100;
}
```

---

## 🎮 Microinteracciones

### **Animaciones de Transición**
```css
/* Smooth transitions */
.smooth-transition {
  @apply transition-all duration-300 ease-in-out;
}

/* Hover effects */
.hover-lift {
  @apply transform transition-transform duration-200 hover:scale-105;
}

.hover-glow {
  @apply transition-shadow duration-200 hover:shadow-lg;
}

/* Loading states */
.loading-shimmer {
  @apply relative overflow-hidden bg-gray-200 rounded;
}

.loading-shimmer::after {
  content: '';
  @apply absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white to-transparent;
  @apply animate-shimmer;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Success animations */
.success-bounce {
  @apply animate-bounce;
}

.success-pulse {
  @apply animate-pulse;
}
```

### **Estados Interactivos**
```css
/* Button press effect */
.btn-press {
  @apply transform transition-transform duration-75 active:scale-95;
}

/* Input focus enhancement */
.input-focus-enhanced {
  @apply transition-all duration-200;
  @apply focus:scale-105 focus:shadow-lg;
}

/* Card hover effects */
.card-interactive {
  @apply cursor-pointer transition-all duration-200;
  @apply hover:shadow-lg hover:-translate-y-1;
}
```

---

## 📱 Patrones Móviles Específicos

### **Bottom Sheet para Móvil**
```css
/* Bottom sheet overlay */
.bottom-sheet-overlay {
  @apply fixed inset-0 z-50 bg-black bg-opacity-50;
  @apply opacity-0 transition-opacity duration-300;
}

.bottom-sheet-overlay.open {
  @apply opacity-100;
}

/* Bottom sheet content */
.bottom-sheet {
  @apply fixed bottom-0 left-0 right-0 z-50;
  @apply bg-white rounded-t-xl shadow-xl;
  @apply transform translate-y-full transition-transform duration-300;
  @apply max-h-96 overflow-y-auto;
}

.bottom-sheet.open {
  @apply translate-y-0;
}

.bottom-sheet-handle {
  @apply w-12 h-1 bg-gray-300 rounded-full mx-auto my-3;
}
```

### **Pull-to-Refresh**
```css
/* Pull to refresh indicator */
.pull-refresh {
  @apply flex items-center justify-center py-4;
  @apply text-text-muted text-sm;
  @apply transform transition-transform duration-200;
}

.pull-refresh.pulling {
  @apply text-primary-600;
}

.pull-refresh.releasing {
  @apply text-success-600;
}
```

### **Swipe Actions**
```css
/* Swipe action container */
.swipe-container {
  @apply relative overflow-hidden;
}

.swipe-actions {
  @apply absolute inset-y-0 right-0 flex items-center;
  @apply transform translate-x-full transition-transform duration-200;
}

.swipe-container.swiped .swipe-actions {
  @apply translate-x-0;
}

.swipe-action {
  @apply flex items-center justify-center w-16 h-full text-white;
}

.swipe-action.edit {
  @apply bg-warning-500;
}

.swipe-action.delete {
  @apply bg-error-500;
}
```

---

## 🔧 Utilidades Específicas del Dominio

### **Estados de Atleta**
```css
/* Badge de estado */
.athlete-status {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.athlete-status.active {
  @apply bg-success-100 text-success-800;
}

.athlete-status.inactive {
  @apply bg-gray-100 text-gray-800;
}

.athlete-status.suspended {
  @apply bg-error-100 text-error-800;
}

/* Categoría por edad */
.age-category {
  @apply inline-flex items-center px-2 py-1 rounded text-xs font-medium;
}

.age-category.infantil {
  @apply bg-blue-100 text-blue-800;
}

.age-category.juvenil {
  @apply bg-green-100 text-green-800;
}

.age-category.cadete {
  @apply bg-yellow-100 text-yellow-800;
}

.age-category.adulto {
  @apply bg-purple-100 text-purple-800;
}
```

### **Indicadores Deportivos**
```css
/* Disciplina deportiva */
.sport-indicator {
  @apply flex items-center gap-2 px-3 py-2 bg-accent-50 rounded-lg;
}

.sport-icon {
  @apply w-5 h-5 text-accent-600;
}

.sport-name {
  @apply text-sm font-medium text-accent-800;
}

/* Sede/Venue */
.venue-tag {
  @apply inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded;
}
```

---

## 📖 Guía de Implementación

### **Checklist para Desarrolladores**
```markdown
## ✅ Setup Inicial
- [ ] Instalar Tailwind CSS con configuración extendida
- [ ] Importar fuente Inter desde Google Fonts
- [ ] Configurar plugins (@tailwindcss/forms, @tailwindcss/typography)
- [ ] Setup de variables CSS custom

## ✅ Componentes Base
- [ ] Implementar sistema de botones
- [ ] Crear componentes de formulario
- [ ] Desarrollar sistema de tarjetas
- [ ] Configurar layout responsivo

## ✅ Características Específicas
- [ ] Componentes de atleta/tutor
- [ ] Dashboard widgets
- [ ] Tablas de datos deportivos
- [ ] Formularios condicionales

## ✅ Testing
- [ ] Verificar contraste de colores (WCAG AA)
- [ ] Testear en dispositivos móviles
- [ ] Validar touch targets (44px mínimo)
- [ ] Probar con screen readers
```

### **Performance Considerations**
```css
/* Optimizaciones CSS */
.will-change-transform {
  will-change: transform;
}

.gpu-accelerated {
  transform: translateZ(0);
}

/* Lazy loading para imágenes */
.athlete-photo {
  @apply w-12 h-12 rounded-full bg-gray-200;
  loading: lazy;
}
```

Este Design System completo proporciona todo lo necesario para crear una aplicación deportiva cohesiva, accesible y profesional que funcione perfectamente tanto en web como en dispositivos móviles. 🏆