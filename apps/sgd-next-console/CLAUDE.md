# SGD Frontend - Sistema de Gestión Deportiva
## Reglas Generales del Proyecto

### 📋 **Información del Proyecto**
- **Nombre**: Sistema de Gestión Deportiva (SGD) - Aplicación Web Administrativa
- **Arquitectura**: Single-tenant (una instancia por club)
- **Usuarios**: Administradores de club, Profesores  
- **Framework**: NextJS 15+ con App Router
- **Autenticación**: Keycloak integration (sgd-frontend client)
- **API Backend**: Quarkus REST API (single-tenant)

### 🏗️ **Arquitectura del Sistema**
```
SINGLE-TENANT: Una instancia completa por club

Club A: Frontend → Backend → PostgreSQL → Keycloak
Club B: Frontend → Backend → PostgreSQL → Keycloak  
Club C: Frontend → Backend → PostgreSQL → Keycloak

Cada instancia es completamente independiente
```

### 👥 **Roles y Permisos Definidos**

#### **ADMIN_CLUB** (Administrador del Club)
- **Permisos**: Acceso completo a la instancia del club
- **Funcionalidades**:
  - Gestión completa de atletas y tutores
  - Configuración de disciplinas y categorías
  - Administración de sedes del club
  - Gestión de profesores
  - Reportes y estadísticas del club
  - Configuración general del club

#### **PROFESOR** (Instructor/Entrenador)
- **Permisos**: Visualización de atletas asignados
- **Funcionalidades**:
  - Lista de atletas de su disciplina/sede
  - Actualización básica de datos deportivos  
  - Consulta de información de contacto
  - Visualización de reportes de su área

**NOTA**: No existe rol ADMIN_GENERAL ya que cada instancia es independiente por club.

### 🔐 **Patrones de Autenticación y Seguridad**

#### **Keycloak Hosted Login Strategy**
- **REGLA CRÍTICA**: La aplicación NextJS NO debe tener pantallas de login propias
- **TODO LOGIN** se maneja vía Keycloak hosted pages con el tema configurado en el client
- **AuthGuard obligatorio** en todas las rutas protegidas (`/admin/*`)
- **Redirección automática** a Keycloak si el usuario no está autenticado

#### **Flujo de Autenticación Base**
```
Usuario accede a app → AuthGuard detecta no autenticado → 
Redirect a Keycloak Login Page → Usuario se autentica → 
Redirect de vuelta a NextJS con tokens → Aplicación permite acceso
```

#### **Logout Resiliente**
- **Principio Fail-Safe**: SIEMPRE limpiar sesión local independientemente de errores con Keycloak
- **Endpoints**: `/api/auth/logout-keycloak` (completo) + `/api/auth/logout-local` (fallback)
- **Funciones**: `signOutCompletely()` (recomendado) y `signOutLocalOnly()` (emergencia)

### ⚖️ **Reglas de Negocio Críticas**

#### **Gestión de Atletas**
1. **Atletas menores de 18 años** → Requieren al menos 1 tutor asociado obligatoriamente
2. **Campos obligatorios**: fullName, birthDate, venueId, sportId, categoryId
3. **Formato de teléfonos**: `+503 1234-5678` (formato salvadoreño)
4. **Auto-cálculo de edad** desde fecha de nacimiento
5. **Categorías automáticas** según deporte y edad del atleta

#### **Gestión de Tutores**
1. **Tutores primarios**: Solo uno por atleta
2. **Relaciones válidas**: "Padre", "Madre", "Tutor", "Abuelo", "Abuela", "Tío", "Tía", "Otro"
3. **Campos obligatorios**: fullName, relationship
4. **Asociación bidireccional** tutor ↔ atleta

#### **Permisos y Acceso**
1. **Role-based access**: Usuarios solo ven/editan datos según sus permisos
2. **Filtrado automático**: Datos filtrados por permisos en todas las operaciones
3. **Rutas protegidas**: Toda funcionalidad bajo `/admin/*` requiere AuthGuard
4. **Validación dual**: Client-side + server-side en todos los formularios

### 🔧 **Configuración de Entorno**

#### **Variables Requeridas en .env.local**
```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Keycloak Configuration
KEYCLOAK_CLIENT_ID=sgd-frontend
KEYCLOAK_CLIENT_SECRET=your-frontend-secret
KEYCLOAK_ISSUER=http://localhost:8089/realms/SGD

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Single-Tenant Config
CLUB_ID=1
CLUB_NAME=Club Deportivo ABC
```

### 🎯 **Estructura de Rutas Obligatoria**

#### **Rutas Públicas**
- `/` - Landing page simple (redirección si autenticado)
- `/auth/error` - Página de errores de autenticación
- `/unauthorized` - Acceso denegado por roles

#### **Rutas Protegidas** (requieren AuthGuard)
- `/admin/dashboard` - Dashboard principal adaptado por rol
- `/admin/athletes/*` - Gestión de atletas (lista, formularios, detalles)
- `/admin/guardians/*` - Gestión de tutores
- `/admin/config/*` - Configuraciones (solo ADMIN_CLUB)

### 📱 **Patrones de Diseño y UX**

#### **Responsive Design**
- **Breakpoints**: Mobile (320-768px), Tablet (768-1024px), Desktop (1024px+)
- **Sidebar colapsable** en dispositivos móviles
- **Touch-friendly buttons** (44px mínimo)
- **Formularios adaptivos** para pantallas pequeñas

#### **Performance**
- **Paginación**: 20 items por página por defecto
- **Debounced search**: 300ms delay en búsquedas
- **SWR para cache** de datos con revalidación automática
- **Lazy loading** de componentes pesados

#### **Estados de la Aplicación**
- **Loading states** para todas las operaciones async
- **Empty states** con call-to-action claros
- **Error states** con opciones de recuperación
- **Success notifications** con toast system

### 🔗 **Integración con API Backend**
- **Base URL**: `http://localhost:8080/api`
- **OpenAPI Spec**: `http://localhost:8080/api/q/openapi?format=json`
- **Autenticación**: JWT Bearer Token via Keycloak automático
- **Manejo de errores**: Cliente robusto con retry automático

### 🎨 **Componentes y Tecnologías**

#### **Stack Tecnológico Fijo**
- **NextJS 15** con App Router (no Pages Router)
- **TypeScript** estricto (zero errors policy)
- **Shadcn/ui** para componentes base
- **TailwindCSS 4** para estilos
- **SWR** para state management y cache
- **Zod** para validación de formularios
- **NextAuth** con Keycloak provider

#### **Patrones de Componentes**
- **AuthGuard**: Wrapper obligatorio para rutas protegidas
- **SessionProvider**: En layout raíz para toda la aplicación
- **Error Boundaries**: Manejo graceful de errores
- **Loading Spinners**: Estados consistentes de carga

---

## 📚 **Referencias a Documentación Especializada**

### 📋 **Estado Actual del Proyecto**
**Ver:** `CHANGELOG.md` - Documentación completa de funcionalidades implementadas
- ✅ Progreso actual: 85% completado
- ✅ Funcionalidades operativas y estado de cada módulo
- ✅ Problemas resueltos y soluciones aplicadas

### 🗺️ **Funcionalidades Pendientes**
**Ver:** `ROADMAP.md` - Plan de implementación de funcionalidades restantes  
- 📊 15% restante planificado en sprints organizados
- 🎯 Prioridades definidas y timeline estimado
- 💡 Evaluación del enfoque y recomendaciones estratégicas

---

## 🚫 **important-instruction-reminders**

**REGLAS FUNDAMENTALES DE DESARROLLO:**

1. **Do what has been asked; nothing more, nothing less.**
2. **NEVER create files unless they're absolutely necessary for achieving your goal.**
3. **ALWAYS prefer editing an existing file to creating a new one.**
4. **NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.**
5. **NEVER add comments to code unless explicitly requested.**
6. **Keep responses concise and direct - minimize output tokens.**
7. **Use TodoWrite tool frequently to track progress and plan tasks.**
8. **Follow security best practices - never expose secrets or keys.**
9. **Maintain code style and conventions of the existing codebase.**
10. **Always use AuthGuard for protected routes - no custom login pages.**

---

**🚀 Última actualización**: 27 de Agosto, 2025
**📊 Estado de implementación**: Ver CHANGELOG.md
**🗺️ Funcionalidades pendientes**: Ver ROADMAP.md