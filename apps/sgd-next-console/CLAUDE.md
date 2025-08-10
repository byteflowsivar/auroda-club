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
- **Usuarios**: Administradores de club, Administradores generales, Profesores
- **Framework**: NextJS 14+ con App Router
- **Autenticación**: Keycloak integration (sgd-frontend client)
- **API Backend**: Quarkus REST API

### 🏗️ Arquitectura del Sistema
```
Usuarios (Admin/Profesores) → Frontend (NextJS) → Backend (Quarkus) → PostgreSQL
                                      ↓
                                  Keycloak (Auth)
```

### 👥 Usuarios y Roles

#### **ADMIN_GENERAL**
- **Permisos**: Acceso completo al sistema
- **Funcionalidades**:
    - Gestión completa de atletas y tutores
    - Configuración de disciplinas y categorías
    - Administración de usuarios y sedes
    - Reportes y estadísticas globales

#### **ADMIN_CLUB**
- **Permisos**: Gestión de atletas y tutores de todas las sedes del club
- **Funcionalidades**:
    - CRUD de atletas y tutores
    - Visualización de reportes del club
    - Gestión de profesores

#### **PROFESOR**
- **Permisos**: Visualización de atletas asignados
- **Funcionalidades**:
    - Lista de atletas de su disciplina/sede
    - Actualización básica de datos deportivos
    - Consulta de información de contacto

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
signOut() de NextAuth → 
Cleanup de tokens locales →
Redirect a página pública
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
- `<AppLayout />` - Layout principal con sidebar y header (solo para usuarios autenticados)
- `<Sidebar />` - Navegación adaptada por rol
- `<Header />` - Barra superior con usuario y botón logout
- `<AuthGuard />` - Wrapper que protege rutas y redirige a Keycloak
- `<LoadingSpinner />` - Estado mientras verifica autenticación
- `<UnauthorizedAccess />` - Página para usuarios sin permisos

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
- `<LoginButton />` - Botón que redirige a Keycloak (no formulario local)
- `<LogoutButton />` - Botón de cierre de sesión
- `<AuthGuard />` - Protección de rutas con redirect automático
- `<ConfirmDialog />` - Dialogs de confirmación
- `<LoadingSpinner />` - Estados de carga
- `<ErrorBoundary />` - Manejo de errores
- `<Toast />` - Notificaciones al usuario
- `<UnauthorizedAccess />` - Página de acceso denegado


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

KEYCLOAK_ISSUER=http://localhost:8080/realms/SGD
KEYCLOAK_CLIENT_ID=sgd-frontend
KEYCLOAK_CLIENT_SECRET=your-frontend-secret

NEXT_PUBLIC_API_URL=http://localhost:8081/api
```

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

#### **1. Estructura de Rutas (100% faltante)**
```
❌ /dashboard (página principal) - Solo existe /[admin]/dashboard
❌ /athletes/* (gestión atletas) - Completamente faltante
❌ /guardians/* (gestión tutores) - Completamente faltante  
❌ /config/* (configuraciones admin) - Completamente faltante
❌ /auth/error (manejo errores auth) - Faltante
❌ /unauthorized (acceso denegado) - Faltante
```

#### **2. Componentes de Autenticación y Seguridad (90% faltante)**
```
❌ <AuthGuard /> - Componente crítico para proteger rutas
❌ <SessionProvider /> - Para manejo de sesión global
❌ <UnauthorizedAccess /> - Página acceso denegado
❌ <LoginButton /> - Redirect a Keycloak
❌ <LogoutButton /> - Cerrar sesión
❌ <LoadingSpinner /> - Estados de carga auth
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
- **Estado actual**: ~20% completado (solo base técnica)
- **Funcionalidad core faltante**: ~80%
- **Tiempo estimado**: 4-6 semanas para funcionalidad completa
- **Componentes críticos**: AuthGuard, rutas protegidas, formularios atletas/tutores
