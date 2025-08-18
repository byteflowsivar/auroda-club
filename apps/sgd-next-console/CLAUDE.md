#### **App Router Structure**
```
/app/
├── layout.tsx                # Root layout con SessionProvider
├── dashboard/
│   ├── layout.tsx            # Layout con AuthGuard
│   └── page.tsx              # Dashboard principal
├── athletes/
│   ├── layout.tsx            # Layout con AuthGuard  
│   ├── page.tsx              # Lista de atletas
│   ├── new/page.tsx          # Formulario nuevo atleta
│   └── [id]/
│       ├── page.tsx          # Detalle atleta
│       └── edit/page.tsx     # Editar atleta
├── guardians/
│   ├── layout.tsx            # Layout con AuthGuard
│   ├── page.tsx              # Lista de tutores
│   └── [id]/page.tsx         # Detalle tutor
├── config/
│   ├── layout.tsx            # AuthGuard con roles ADMIN
│   ├── page.tsx              # Configuraciones generales
│   ├── sports/page.tsx       # Gestión deportes
│   └── venues/page.tsx       # Gestión sedes
├── auth/
│   └── error/page.tsx        # Errores de autenticación
├── unauthorized/page.tsx     # Acceso denegado
└── api/
    └── auth/
        └── [...nextauth]/route.ts  # NextAuth config
```

# SGD Frontend - Sistema de Gestión Deportiva
## Contexto Específico del Proyecto

### 📋 Información del Proyecto
- **Nombre**: Sistema de Gestión Deportiva (SGD) - Aplicación Web Administrativa
- **Arquitectura**: Single-tenant (una instancia por club)
- **Usuarios**: Administradores de club, Profesores  
- **Framework**: NextJS 14+ con App Router
- **Autenticación**: Keycloak integration (sgd-frontend client)
- **API Backend**: Quarkus REST API (single-tenant)

### 🏗️ Arquitectura del Sistema
```
SINGLE-TENANT: Una instancia completa por club

Club A: Frontend → Backend → PostgreSQL → Keycloak
Club B: Frontend → Backend → PostgreSQL → Keycloak  
Club C: Frontend → Backend → PostgreSQL → Keycloak

Cada instancia es completamente independiente
```

### 👥 Usuarios y Roles

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

### 🎨 Flujos de Usuario Principales

#### **1. Acceso Inicial a la Aplicación**
```
Usuario accede a https://sgd.domain.com → 
AuthGuard detecta no autenticado → 
Redirect automático a Keycloak Login (hosted) →
Usuario ingresa credenciales en Keycloak →
Keycloak valida y redirige a callback NextJS →
NextJS procesa tokens y redirige a Dashboard
```

#### **2. Registro de Atleta Mayor (18+)**
```
Dashboard → Atletas → Nuevo Atleta → Formulario Básico → Guardar
```

#### **3. Registro de Atleta Menor (<18)**
```
Dashboard → Atletas → Nuevo Atleta → Formulario + Tutores → Asociar Tutores → Guardar
```

#### **4. Logout del Sistema**
```
Header → Cerrar Sesión → 
signOutCompletely() → 
/api/auth/logout-keycloak → 
Cleanup cookies locales + Keycloak logout → 
Redirect a home con sesión limpia
```

**NOTA IMPORTANTE**: No hay pantallas de login custom en NextJS. Todo login se maneja vía Keycloak hosted pages con el tema configurado en el client.

### 🖥️ Estructura de Pantallas

#### **Páginas Públicas**
- **/** - Landing page simple (si no está autenticado)
- **/auth/error** - Página de errores de autenticación
- **/unauthorized** - Acceso denegado por roles

#### **Aplicación Protegida** (requiere AuthGuard)
- **/dashboard** - Dashboard principal adaptado por rol
- **/athletes** - Gestión de atletas (lista, formularios, detalles)
- **/guardians** - Gestión de tutores
- **/config** - Configuraciones (solo Admins)
- **/reports** - Reportes y estadísticas

**IMPORTANTE**: Todas las rutas protegidas deben usar `<AuthGuard>` que automáticamente redirige a Keycloak si el usuario no está autenticado.

### 🔐 Autenticación y Autorización

#### **Keycloak Hosted Login Strategy**

**IMPORTANTE**: La aplicación NextJS NO debe tener pantallas de login propias. Todo el flujo de autenticación se maneja a través de Keycloak hosted login pages.

#### **Flujo de Autenticación**
```
Usuario accede a app → Detecta no autenticado → Redirect a Keycloak Login Page → 
Usuario se autentica en Keycloak → Redirect de vuelta a NextJS con tokens → 
Aplicación procesa tokens y permite acceso

```
Se utiliza `next-auth` con el proveedor Keycloak para manejar la sesión y los tokens JWT.
La documentación de configuración de Keycloak está en https://next-auth.js.org/providers/keycloak


### 📱 Componentes Principales

#### **Layout Components**
- ✅ `<AppSidebar />` - Sidebar principal con navegación adaptada por rol
- ✅ `<NavMain />` - Navegación principal con estado activo por ruta
- ✅ `<NavUser />` - Información de usuario autenticado con roles y logout
- ✅ `<NavSecondary />` - Navegación secundaria (configuración, ayuda)
- ✅ `<NavDocuments />` - Accesos rápidos (estadísticas, deportes, sedes)
- ✅ `<AuthGuard />` - Wrapper que protege rutas y redirige a Keycloak
- ✅ `<LoadingSpinner />` - Estado mientras verifica autenticación
- ❌ `<UnauthorizedAccess />` - Página para usuarios sin permisos

#### **Form Components**
- `<AthleteForm />` - Formulario de registro/edición de atletas
- `<GuardianForm />` - Formulario de tutores
- `<GuardianSelector />` - Componente para asociar tutores
- `<CategorySelector />` - Selector de categoría por deporte y edad

#### **Data Components**
- `<AthleteTable />` - Tabla de atletas con paginación y filtros
- `<GuardianTable />` - Lista de tutores
- `<AthleteCard />` - Tarjeta resumen de atleta
- `<StatsWidget />` - Widgets de estadísticas para dashboard

#### **Utility Components**
- ✅ `<LoginButton />` - Botón que redirige a Keycloak (no formulario local)
- ✅ `<LogoutButton />` - Botón de cierre de sesión (deprecated)
- ✅ `<AuthGuard />` - Protección de rutas con redirect automático
- ✅ `<LoadingSpinner />` - Estados de carga
- ❌ `<ConfirmDialog />` - Dialogs de confirmación  
- ❌ `<ErrorBoundary />` - Manejo de errores
- ❌ `<Toast />` - Notificaciones al usuario
- ❌ `<UnauthorizedAccess />` - Página de acceso denegado

#### **Auth & Security Components**
- ✅ `<SessionProvider />` - Proveedor de contexto de sesión NextAuth
- ✅ `signOutCompletely()` - Logout resiliente con Keycloak + local cleanup
- ✅ `signOutLocalOnly()` - Logout de emergencia (solo local)
- ✅ `/api/auth/logout-keycloak` - Endpoint logout completo con fallback
- ✅ `/api/auth/logout-local` - Endpoint fallback para logout local únicamente


### 🚀 Performance Considerations

#### **Code Splitting**
```typescript
// Lazy loading de rutas
const AthletesPage = lazy(() => import('../pages/athletes'));
const GuardiansPage = lazy(() => import('../pages/guardians'));
const ConfigPage = lazy(() => import('../pages/config'));
```

#### **Optimización de Listas**
- **Virtualización**: Para listas de +100 atletas
- **Paginación**: 20 items por página por defecto
- **Debounced search**: 300ms delay en búsquedas
- **Infinite scroll**: Para móviles

### 📱 Responsive Design

#### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

#### **Mobile Adaptations**
- Sidebar colapsable en mobile
- Formularios en pasos para pantallas pequeñas
- Tablas scrollables horizontalmente
- Touch-friendly button sizes (44px mínimo)

### 🔧 Configuración de Entorno

#### **Environment Variables**
```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

KEYCLOAK_ISSUER=http://localhost:8089/realms/SGD
KEYCLOAK_CLIENT_ID=sgd-frontend
KEYCLOAK_CLIENT_SECRET=your-frontend-secret

BACKEND_API_URL=http://localhost:8080/api

# SINGLE-TENANT CONFIG
CLUB_ID=1                    # ID del club de esta instancia
CLUB_NAME=Club Deportivo ABC # Nombre del club (opcional, para UI)
```

### Integración con API Backend
- **Base URL**: `http://localhost:8080/api`
- **OpenAPI**: `http://localhost:8080/api/q/openapi?format=json`

---

## 📊 ESTADO ACTUAL Y ROADMAP DE IMPLEMENTACIÓN

### ✅ Lo que ya está implementado:
- Configuración básica de Next.js 15 con App Router
- Configuración de autenticación Keycloak con NextAuth
- Sistema de roles definido (`ADMIN_GENERAL`, `ADMIN_CLUB`, `PROFESOR`) 
- Componentes UI base con shadcn/ui
- Sidebar y header básicos
- Un dashboard demo con gráficos

### ❌ Funcionalidades Faltantes Críticas

#### **1. Estructura de Rutas (✅ COMPLETADO)**

Estas rutas deben estar dentro de /app/[admin]/ para que sean accesibles solo por usuarios autenticados y con los roles correctos.

```
✅ /[admin]/ - Layout principal con AuthGuard
✅ /[admin]/dashboard (página principal) - Dashboard existente movido aquí
✅ /[admin]/athletes/* (gestión atletas) - Estructura completa creada:
   ├── page.tsx - Lista de atletas (placeholder)
   ├── new/page.tsx - Formulario nuevo atleta (placeholder)  
   ├── [id]/page.tsx - Detalle atleta (placeholder)
   └── [id]/edit/page.tsx - Editar atleta (placeholder)
✅ /[admin]/guardians/* (gestión tutores) - Estructura creada:
   ├── page.tsx - Lista de tutores (placeholder)
   └── [id]/page.tsx - Detalle tutor (placeholder)
✅ /[admin]/config/* (configuraciones admin) - Estructura creada:
   ├── page.tsx - Panel configuraciones (con AuthGuard roles admin)
   ├── sports/page.tsx - Gestión deportes (placeholder)
   └── venues/page.tsx - Gestión sedes (placeholder)
✅ /auth/error - Página errores autenticación
✅ /unauthorized - Página acceso denegado
```

#### **2. Componentes de Autenticación y Seguridad (✅ COMPLETADO)**
```
✅ <AuthGuard /> - Componente crítico para proteger rutas (/components/auth/auth-guard.tsx)
✅ <SessionProvider /> - Implementado en layout raíz
✅ <UnauthorizedAccess /> - Página acceso denegado (/unauthorized)
✅ <LoginButton /> - Redirect a Keycloak (/components/auth/login-button.tsx)
✅ <LogoutButton /> - Cerrar sesión (/components/auth/logout-button.tsx)
✅ <LoadingSpinner /> - Estados de carga auth (/components/auth/loading-spinner.tsx)
```

#### **6. Configuración de Entorno (✅ COMPLETADO)**
```
✅ .env.example - Variables entorno requeridas (creado con todas las variables Keycloak y NextAuth)
✅ Configuración NextAuth completa - Ya existía en /lib/auth.ts
✅ SessionProvider en layout raíz - Implementado
❌ Middleware protección rutas - Pendiente (opcional, AuthGuard lo cubre)
❌ Configuración API backend - Pendiente para fase posterior
```

#### **3. Componentes de Negocio (100% faltante)**
```
❌ <AthleteForm /> - Formulario registro/edición atletas
❌ <GuardianForm /> - Formulario tutores
❌ <GuardianSelector /> - Asociar tutores a atletas
❌ <CategorySelector /> - Selector categoría por deporte/edad
❌ <AthleteTable /> - Tabla atletas con paginación/filtros
❌ <GuardianTable /> - Lista tutores
❌ <AthleteCard /> - Tarjeta resumen atleta
❌ <StatsWidget /> - Widgets estadísticas dashboard
```

#### **4. Layout y Navegación (70% faltante)**
```
✅ Layout base - Existe pero incompleto
❌ <AppLayout /> - Layout principal con sidebar/header
❌ Sidebar adaptado por roles - Navegación dinámica según permisos  
❌ Layouts por ruta con AuthGuard - Protección automática
❌ Responsive mobile - Sidebar colapsable, formularios por pasos
```

#### **5. Utilidades y Helpers (80% faltante)**
```
❌ <ConfirmDialog /> - Dialogs confirmación
❌ <Toast /> - Sistema notificaciones
❌ <ErrorBoundary /> - Manejo errores global
❌ Validación de formularios con Zod - Esquemas validación
❌ API clients - Conectores backend Quarkus
```

#### **6. Configuración de Entorno (100% faltante)**
```
❌ .env.example - Variables entorno requeridas
❌ Configuración NextAuth completa - Callbacks, pages, session
❌ Middleware protección rutas - Verificación automática roles
❌ Configuración API backend - URLs, interceptors, error handling
```

### 🚀 ROADMAP DE IMPLEMENTACIÓN

#### **FASE 1: FOUNDATION (Crítica) - Prioridad MÁXIMA**
1. **Configurar entorno completo**
   - Crear `.env.example` con todas las variables requeridas
   - Configurar middleware de protección de rutas
   - Implementar `<SessionProvider>` en layout raíz

2. **Componentes de autenticación esenciales**
   - `<AuthGuard>` - Protección rutas con redirect automático
   - `<LoadingSpinner>` - Estados carga autenticación
   - `<UnauthorizedAccess>` - Página acceso denegado

#### **FASE 2: CORE FUNCTIONALITY - Prioridad ALTA**
3. **Estructura de rutas completa**
   - `/dashboard` - Dashboard principal adaptado por rol
   - `/athletes/*` - Todas las rutas gestión atletas
   - `/guardians/*` - Rutas gestión tutores  
   - `/config/*` - Configuraciones (solo admins)
   - `/auth/error` y `/unauthorized`

4. **Layouts con protección**
   - Layout dashboard con `<AuthGuard>`
   - Layout athletes con `<AuthGuard>`
   - Layout config con verificación rol `ADMIN_GENERAL`

#### **FASE 3: BUSINESS LOGIC - Prioridad MEDIA**
5. **Componentes formularios**
   - `<AthleteForm>` - Registro/edición con validación Zod
   - `<GuardianForm>` - Gestión tutores
   - `<GuardianSelector>` - Asociación atletas-tutores
   - `<CategorySelector>` - Lógica categorías por deporte/edad

6. **Componentes datos**
   - `<AthleteTable>` - Con paginación, filtros, búsqueda
   - `<GuardianTable>` - Lista tutores
   - `<StatsWidget>` - Métricas dashboard por rol

#### **FASE 4: UX/POLISH - Prioridad BAJA**
7. **Navegación adaptiva**
   - Sidebar dinámico según roles usuario
   - Breadcrumbs navegación
   - Mobile responsive (sidebar colapsable, formularios por pasos)

8. **Utilidades UX**
   - `<ConfirmDialog>` - Confirmaciones acciones críticas
   - `<Toast>` - Sistema notificaciones
   - `<ErrorBoundary>` - Manejo errores graceful

### 📈 Estimación de Progreso
- **Estado actual**: ~50% completado (**FASE 1 + UX COMPLETADAS** ✅)
- **Funcionalidad core faltante**: ~50% (componentes de negocio + integración API)
- **Tiempo estimado**: 1-2 semanas para funcionalidad completa
- **Próximos componentes críticos**: AthleteForm, AthleteTable, GuardianForm, API integration

### ✅ **FASE 1 COMPLETADA - FOUNDATION**
- ✅ Configuración de entorno completa (.env.example)
- ✅ SessionProvider implementado en layout raíz (/app/providers.tsx)
- ✅ Componentes de autenticación: AuthGuard, LoadingSpinner, LoginButton, LogoutButton
- ✅ Páginas de error: /auth/error, /unauthorized
- ✅ Estructura completa de rutas protegidas /admin/* con placeholders
- ✅ Protección por roles en rutas administrativas
- ✅ Redirección automática al dashboard para usuarios autenticados
- ✅ Callback URL configurado en NextAuth para redirigir a /admin/dashboard
- ✅ **NUEVO**: Sistema de logout resiliente con limpieza garantizada de cookies
- ✅ **NUEVO**: Navegación activa en sidebar con resaltado visual
- ✅ **NUEVO**: NavUser component con información real del usuario autenticado
- ✅ **NUEVO**: Manejo de cookies chunked y reducción de tamaño de sesión

### 🔧 **PROBLEMAS COMUNES Y SOLUCIONES**

#### **Error de Refresh Token: "invalid_client"**
**Problema**: Error al refrescar tokens: `Invalid client or Invalid client credentials`

**Causa**: Inconsistencia en variables de entorno entre la configuración del provider y la función refresh.

**Solución aplicada**:
1. ✅ **Variables de entorno consistentes**: Usar `KEYCLOAK_ID` y `KEYCLOAK_SECRET` en toda la aplicación
2. ✅ **Función refreshAccessToken mejorada**: 
   - Validación de refresh token antes de hacer la petición
   - Logging inteligente (distingue errores reales vs comportamientos normales)
   - Manejo robusto de errores
3. ✅ **AuthGuard actualizado**: Detecta errores de refresh y redirige al login automáticamente
4. ✅ **JWT callback mejorado**: Maneja fallos de refresh y limpia sesiones corruptas

#### **"Session not active" - COMPORTAMIENTO NORMAL**
**Mensaje**: `invalid_grant: Session not active` en refresh token

**❗ ESTO NO ES UN ERROR** - Es el comportamiento de seguridad normal de Keycloak:

1. **¿Cuándo ocurre?**
   - Sesión de Keycloak expira (configurada en realm settings)
   - Usuario inactivo por tiempo prolongado
   - Administrador invalida sesiones manualmente

2. **¿Qué hace el sistema?**
   - ✅ Detecta automáticamente la expiración
   - ✅ Logs informativos (no como error)
   - ✅ **NUEVO**: Limpia cookies de sesión automáticamente
   - ✅ **NUEVO**: Fuerza `signOut()` para destruir sesión local
   - ✅ Redirige al usuario al login de Keycloak
   - ✅ Usuario se re-autentica y continúa trabajando

3. **Flujo temporal típico:**
   ```
   Access Token: 15 minutos → Se refresca automáticamente
   Sesión Keycloak: 30 minutos → Require re-autenticación
   ```

#### **SOLUCIÓN FINAL IMPLEMENTADA**
**Problema anterior**: Cookies de sesión no se limpiaban al expirar tokens, usuario seguía viendo dashboard con sesión inválida.

**✅ Correcciones aplicadas**:
1. **Callback `session` mejorado**: Lanza error cuando token es inválido, forzando a NextAuth a invalidar la sesión
2. **AuthGuard con `signOut()` forzado**: Detecta sesiones inválidas y ejecuta logout automático
3. **Homepage inteligente**: Valida sesiones antes de redireccionar al dashboard
4. **Limpieza completa**: Cookies y estado local se destruyen automáticamente

**Variables requeridas en .env.local**:
```bash
KEYCLOAK_CLIENT_ID=sgd-frontend
KEYCLOAK_CLIENT_SECRET=your-frontend-secret
KEYCLOAK_ISSUER=http://localhost:8080/realms/SGD
```

### 🔐 **SISTEMA DE LOGOUT RESILIENTE IMPLEMENTADO**

#### **Estrategia "Fail-Safe" para Logout**
La aplicación implementa un sistema de logout robusto que **SIEMPRE limpia la sesión local** independientemente de errores con Keycloak.

#### **Endpoints de Logout**
```bash
# Logout completo (Keycloak + Local)
GET /api/auth/logout-keycloak

# Logout solo local (fallback)  
GET /api/auth/logout-local

# Logout forzado sin Keycloak
GET /api/auth/logout-keycloak?force_local=true
```

#### **Funciones Helper**
```typescript
// Logout completo (recomendado)
signOutCompletely() // Intenta Keycloak, fallback a local

// Logout solo local (emergencia)
signOutLocalOnly() // Solo limpia cookies locales
```

#### **Comportamiento por Escenario**

| Escenario | Sesión Local | Sesión Keycloak | Resultado |
|-----------|-------------|-----------------|-----------|
| **✅ Todo funciona** | Limpiada | Limpiada | Logout perfecto |
| **⚠️ Keycloak offline** | Limpiada | Puede quedar | Seguro para usuario |
| **⚠️ Error de red** | Limpiada | Puede quedar | Seguro para usuario |
| **⚠️ Config incorrecta** | Limpiada | Puede quedar | Seguro para usuario |
| **⚠️ Token inválido** | Limpiada | Puede quedar | Seguro para usuario |

#### **Flujo de Logout Resiliente**
```
Usuario → "Cerrar Sesión" → signOutCompletely() → /api/auth/logout-keycloak
                                                           ↓
                                                  [SIEMPRE limpia cookies]
                                                           ↓
                                        ¿Keycloak disponible?
                                         ↙                ↘
                                    ✅ SÍ                ❌ NO
                                      ↓                   ↓
                         Redirect a Keycloak logout    Fallback local
                                      ↓                   ↓
                              Keycloak cierra sesión  /api/auth/logout-local
                                      ↓                   ↓
                              Redirect a home ←──────────┘
```

#### **Cookies Limpiadas Automáticamente**
```typescript
// Cookies NextAuth principales
'next-auth.session-token'
'__Secure-next-auth.session-token'  
'next-auth.csrf-token'
'__Secure-next-auth.csrf-token'
'next-auth.callback-url'

// Cookies "chunked" (cuando sesión es muy grande)
'next-auth.session-token.0'
'next-auth.session-token.1'
'next-auth.session-token.2'
```

#### **Principio "Fail-Safe" Aplicado**
> **"Mejor una sesión zombie en Keycloak que una sesión local activa cuando el usuario cree que cerró sesión"**

- ✅ **Seguridad**: Usuario nunca queda con sesión local activa tras logout
- ✅ **UX consistente**: Siempre ve pantalla de login después del logout  
- ✅ **Resiliente**: Funciona aunque Keycloak esté caído
- ✅ **Debugging**: Logs claros distinguen errores reales vs comportamientos normales

#### **Problemas de Cookie Chunking Solucionados**
**Antes**: Cookie de sesión excedía 4096 bytes → Fragmentación automática en múltiples cookies
**Ahora**: 
- ✅ `id_token` solo se mantiene en JWT del servidor (no en cookie del cliente)
- ✅ Cookie de sesión reducida significativamente  
- ✅ Limpieza garantizada de cookies chunked en logout

## 🔗 **INTEGRACIÓN CON API BACKEND**

### **API Backend Disponible**
- **Base URL**: `http://localhost:8080/api`
- **OpenAPI Spec**: `http://localhost:8080/api/q/openapi?format=json`
- **Autenticación**: JWT Bearer Token via Keycloak
- **Roles**: `ADMIN_GENERAL`, `ADMIN_CLUB`, `PROFESOR`

### **Endpoints Principales Identificados**

#### **👤 Athletes Management**
```typescript
// Listar atletas con filtros y paginación
GET /api/athletes
- Params: page, size, search, sportId, venueId, categoryId, ageMin, ageMax, active
- Response: AthletePageResponse { content: AthleteResponse[], pagination: PaginationInfo }

// Crear nuevo atleta
POST /api/athletes
- Body: AthleteCreateRequest (fullName, birthDate, venueId, sportId, categoryId, guardians[])
- Response: AthleteResponse

// Obtener atleta específico
GET /api/athletes/{id}
- Response: AthleteResponse (incluye club, venue, sport, category, guardians)

// Actualizar atleta
PUT /api/athletes/{id}
- Body: AthleteUpdateRequest
- Response: AthleteResponse

// Eliminar atleta (soft delete)
DELETE /api/athletes/{id}
- Response: 204 No Content

// Gestión de tutores del atleta
GET /api/athletes/{id}/guardians
POST /api/athletes/{id}/guardians (asociar tutor existente)
```

#### **👨‍👩‍👧‍👦 Guardians Management**
```typescript
// Listar tutores con filtros
GET /api/guardians
- Params: page, size, search, active, hasAthletes
- Response: GuardianPageResponse

// Crear tutor
POST /api/guardians
- Body: GuardianCreateRequest
- Response: GuardianResponse

// Obtener tutor específico
GET /api/guardians/{id}
- Response: GuardianResponse (incluye atletas asociados)

// Actualizar/Eliminar tutor
PUT /api/guardians/{id}
DELETE /api/guardians/{id}

// Obtener atletas del tutor
GET /api/guardians/{id}/athletes
```

#### **⚽ Sports & Categories**
```typescript
// Listar deportes activos
GET /api/sports
- Params: includeCategories=true
- Response: SportResponse[] (incluye categorías)

// Obtener deporte específico
GET /api/sports/{id}
- Response: SportResponse

// Categorías por deporte y edad
GET /api/sports/{id}/categories?age={age}
GET /api/categories/by-age/{age}
```

#### **🏢 Clubs & Venues**
```typescript
// Listar clubes accesibles
GET /api/clubs
- Response: ClubResponse[]

// Obtener club específico
GET /api/clubs/{id}
- Response: ClubResponse (incluye venues)

// Sedes del club
GET /api/clubs/{id}/venues
- Response: VenueResponse[]

// Listar sedes accesibles
GET /api/venues
- Response: VenueResponse[]
```

### **🔧 Tipos TypeScript Requeridos**

#### **Core Response Types**
```typescript
// Athlete Types
interface AthleteResponse {
  id: number;
  fullName: string;
  birthDate: string; // LocalDate
  age: number;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  identificationNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
  registrationDate: string;
  active: boolean;
  club: ClubInfo;
  venue: VenueInfo;
  sport: SportInfo;
  category: CategoryInfo;
  guardians: GuardianInfo[];
  createdAt: string; // LocalDateTime
  updatedAt: string;
}

interface AthleteCreateRequest {
  fullName: string; // required
  birthDate: string; // required
  gender?: string;
  email?: string;
  phone?: string; // pattern: "+503 1234-5678"
  address?: string;
  identificationNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
  venueId: number; // required
  sportId: number; // required
  categoryId: number; // required
  guardians?: GuardianAssociation[];
}

// Guardian Types
interface GuardianResponse {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  secondaryPhone?: string;
  address?: string;
  identificationNumber?: string;
  active: boolean;
  athletes: AthleteInfo[];
  createdAt: string;
  updatedAt: string;
}

interface GuardianAssociation {
  guardianId: number; // required
  relationship: string; // required, "Padre", "Madre", "Tutor"
  isPrimary?: boolean;
}

// Pagination
interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface AthletePageResponse {
  content: AthleteResponse[];
  pagination: PaginationInfo;
}
```

### **🚀 TODO: IMPLEMENTACIÓN DE INTEGRACIÓN API**

#### **✅ COMPLETADO - Fundación**
- ✅ Configuración de entorno y autenticación Keycloak
- ✅ Estructura de rutas protegidas /admin/*
- ✅ Componentes de autenticación (AuthGuard, SessionProvider)
- ✅ Layouts con protección por roles

#### **🚧 FASE ACTUAL: Integración API y Componentes de Negocio**

**PRIORIDAD 1: Base de la Integración**
1. **Definiciones TypeScript** - Crear interfaces para todos los tipos de la API
2. **Cliente API** - HTTP client centralizado con autenticación JWT automática
3. **Manejo de Errores** - Sistema global de manejo de errores con toasts

**PRIORIDAD 2: Gestión de Atletas (Core)**
4. **AthleteTable** - Tabla con paginación, filtros (deporte, sede, edad), búsqueda
5. **AthleteForm (Create)** - Formulario completo con validación Zod y CategorySelector
6. **AthleteForm (Edit)** - Formulario de edición en `/admin/athletes/{id}/edit`
7. **Athlete Detail** - Página de detalle con información completa y tutores
8. **Guardian Association** - Componente para asociar/desasociar tutores

**PRIORIDAD 3: Gestión de Tutores**
9. **GuardianTable** - Lista paginada con filtros
10. **GuardianForm** - Formularios crear/editar tutores
11. **Guardian Detail** - Página detalle con atletas asociados

**PRIORIDAD 4: Configuración (Admin Only)**
12. **Sports Config** - Gestión de deportes en `/admin/config/sports`
13. **Venues Config** - Gestión de sedes en `/admin/config/venues`
14. **CategorySelector** - Selector inteligente por deporte y edad

**PRIORIDAD 5: Dashboard y UX**
15. **Dashboard Stats** - Widgets con métricas usando datos agregados
16. **Error Boundaries** - Manejo graceful de errores de componentes
17. **Loading States** - Estados de carga para todas las operaciones async

### **🎯 Componentes Críticos por Implementar**

#### **1. API Client (`/src/lib/api-client.ts`)**
```typescript
class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T>
  async post<T>(endpoint: string, data: any): Promise<T>
  async put<T>(endpoint: string, data: any): Promise<T>
  async delete<T>(endpoint: string): Promise<T>
  
  // Automático: JWT token injection, error handling, retry logic
}
```

#### **2. AthleteTable (`/src/components/athletes/athlete-table.tsx`)**
- Integración con `GET /api/athletes`
- Filtros: deporte, sede, categoría, edad, estado activo
- Búsqueda en tiempo real (debounced)
- Paginación server-side
- Acciones: Ver, Editar, Eliminar (según rol)

#### **3. AthleteForm (`/src/components/athletes/athlete-form.tsx`)**
- Validación Zod basada en `AthleteCreateRequest`
- CategorySelector dinámico por deporte y edad
- GuardianSelector para atletas menores de 18
- Validación de teléfonos formato salvadoreño
- Auto-cálculo de edad desde fecha nacimiento

#### **4. Dashboard Widgets (`/src/components/dashboard/stats-widgets.tsx`)**
- Total de atletas por sede/deporte
- Distribución por categorías de edad
- Atletas activos vs inactivos
- Métricas de nuevos registros

### **📋 Validaciones Importantes a Implementar**

#### **Reglas de Negocio Críticas**
1. **Atletas menores de 18** → Requieren al menos 1 tutor asociado
2. **Teléfonos** → Formato: `+503 1234-5678` (El Salvador)
3. **Categorías** → Auto-validación por edad y deporte
4. **Permisos** → Usuarios solo ven/editan atletas de sus sedes asignadas
5. **Tutores primarios** → Solo uno por atleta
6. **Campos obligatorios** → fullName, birthDate, venueId, sportId, categoryId

### **🔐 Consideraciones de Seguridad**
- **JWT Refresh** → Manejo automático de tokens expirados
- **Role-based access** → Filtrado de datos por permisos de usuario
- **Input validation** → Validación client + server side
- **Error sanitization** → No exponer información sensible en errores

### **🚀 **PRÓXIMA FASE: Implementación de Componentes de Negocio**
Con la base sólida implementada y API mapeada, ahora se puede proceder con:
1. **Tipos TypeScript** (api-types) - Base para toda la integración
2. **Cliente API** (api-client) - Comunicación centralizada con backend 
3. **AthleteTable** (athletes-table) - Componente core de gestión
4. **Formularios** (athlete-form-create, guardian-form) - CRUD completo
