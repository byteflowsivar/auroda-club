#### **App Router Structure**
```
/app/
├── layout.tsx                 # Root layout con SessionProvider
├── page.tsx                   # Landing page pública
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

#### **NextAuth Configuration con Keycloak**
```typescript
// /app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: {
        params: {
          scope: "openid email profile",
          // Forzar re-autenticación si es necesario
          prompt: "login", 
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Procesar tokens de Keycloak
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.roles = profile.realm_access?.roles || [];
        token.clubId = profile.club_id;
        token.venueIds = profile.venue_ids;
        token.sportIds = profile.sport_ids;
        token.fullName = profile.full_name;
        token.phone = profile.phone;
      }
      return token;
    },
    async session({ session, token }) {
      // Pasar datos del token a la sesión
      session.accessToken = token.accessToken;
      session.user.roles = token.roles;
      session.user.clubId = token.clubId;
      session.user.venueIds = token.venueIds;
      session.user.sportIds = token.sportIds;
      session.user.fullName = token.fullName;
      session.user.phone = token.phone;
      return session;
    }
  },
  pages: {
    // NO definir custom login page - usar Keycloak hosted
    // signIn: "/login", // ❌ NO HACER ESTO
    signOut: "/", // Redirect después de logout
    error: "/auth/error", // Página de error personalizada
  },
  session: {
    strategy: "jwt"
  }
})

export { handler as GET, handler as POST }
```

#### **Componentes de Autenticación**
```typescript
// /components/auth/LoginButton.tsx
import { signIn, signOut, useSession } from "next-auth/react"

export const LoginButton = () => {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <LoadingSpinner />
  
  if (session) {
    return (
      <button 
        onClick={() => signOut()}
        className="btn btn-secondary"
      >
        Cerrar Sesión ({session.user.fullName})
      </button>
    )
  }
  
  return (
    <button 
      onClick={() => signIn("keycloak")}
      className="btn btn-primary"
    >
      Iniciar Sesión
    </button>
  )
}

// /components/auth/AuthGuard.tsx
interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  allowedRoles = [],
  fallback = <UnauthorizedAccess />
}) => {
  const { data: session, status } = useSession()
  
  // Mostrar loading mientras se verifica autenticación
  if (status === "loading") {
    return <LoadingSpinner />
  }
  
  // Redirigir a Keycloak si no está autenticado
  if (!session) {
    signIn("keycloak")
    return <LoadingSpinner />
  }
  
  // Verificar roles si se especificaron
  if (allowedRoles.length > 0) {
    const userRoles = session.user.roles || []
    const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role))
    
    if (!hasAllowedRole) {
      return fallback
    }
  }
  
  return <>{children}</>
}
```

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

### 🎯 Validaciones Frontend

#### **Atleta**
```typescript
const athleteSchema = z.object({
  fullName: z.string().min(2, "Mínimo 2 caracteres").max(255),
  birthDate: z.date().max(new Date(), "Fecha no puede ser futura"),
  email: z.string().email().optional().or(z.literal("")),
  venueId: z.number().positive("Debe seleccionar una sede"),
  sportId: z.number().positive("Debe seleccionar un deporte"),
  categoryId: z.number().positive("Debe seleccionar una categoría"),
  // Validación condicional para menores
  guardians: z.array(guardianSchema).min(1).when("age", {
    is: (age: number) => age < 18,
    then: (schema) => schema.min(1, "Atletas menores requieren al menos un tutor"),
    otherwise: (schema) => schema.optional(),
  }),
});
```

#### **Validaciones en Tiempo Real**
- **Edad automática**: Calculada desde fecha de nacimiento
- **Categorías dinámicas**: Filtradas por deporte seleccionado y edad
- **Validación de email**: Formato y unicidad (con debounce)
- **Tutores requeridos**: Solo para menores de 18 años

### 📊 Data Fetching Strategy

#### **React Query Configuration**
```typescript
// Configuración global
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: (failureCount, error) => {
        if (error.status === 401) return false; // No retry en auth errors
        return failureCount < 3;
      },
    },
  },
});
```

#### **Custom Hooks por Módulo**

```typescript
// Athletes hooks
function useAthletes(filters?: AthleteFilters) {
  return useQuery({
    queryKey: ['athletes', filters],
    queryFn: () => athleteService.getAthletes(filters),
  });
}

function useCreateAthlete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: athleteService.createAthlete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
      toast.success('Atleta registrado exitosamente');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al registrar atleta');
    },
  });
}
```

### 🎨 Design System

#### **Color Palette**
```css
:root {
  /* Primary - Deportivo */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-900: #1e3a8a;
  
  /* Secondary - Energético */
  --secondary-50: #fef3c7;
  --secondary-500: #f59e0b;
  --secondary-900: #78350f;
  
  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

#### **Typography**
- **Headings**: Inter font family, weights 400-700
- **Body**: Inter, weight 400
- **UI Elements**: Inter, weights 400-600
- **Scale**: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl

#### **Spacing & Layout**
- **Container**: max-width 1280px
- **Sidebar**: 256px fixed width
- **Grid**: 12-column grid system
- **Spacing**: 4px base unit (space-1 = 4px)

### 🧪 Testing Strategy

#### **Unit Testing** (Jest + React Testing Library)
```typescript
// Ejemplo de test de componente
describe('AthleteForm', () => {
  it('shows guardian section for minors', () => {
    render(<AthleteForm />);
    
    // Seleccionar fecha que hace menor al atleta
    fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), {
      target: { value: '2010-01-01' }
    });
    
    expect(screen.getByText(/tutores/i)).toBeInTheDocument();
  });
});
```

#### **E2E Testing** (Playwright)
```typescript
// Flujo completo de autenticación
test('User can login through Keycloak and access dashboard', async ({ page }) => {
  // Ir a la aplicación
  await page.goto('/dashboard');
  
  // Debe redirigir a Keycloak automáticamente
  await page.waitForURL('**/realms/SGD/protocol/openid-connect/auth**');
  
  // Login en Keycloak hosted page
  await page.fill('#username', 'admin.general');
  await page.fill('#password', 'AdminGeneral2024!');
  await page.click('#kc-login');
  
  // Debe redirigir de vuelta al dashboard
  await page.waitForURL('/dashboard');
  await expect(page.getByText('Admin General SGD')).toBeVisible();
});

test('Unauthenticated user redirects to Keycloak', async ({ page }) => {
  await page.goto('/athletes');
  
  // Debe redirigir automáticamente a Keycloak
  await page.waitForURL('**/realms/SGD/protocol/openid-connect/auth**');
  await expect(page.getByText('Iniciar sesión')).toBeVisible();
});
```

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

#### **Next.js Configuration**
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};
```

### 📁 Documentación Relacionada
- `../../docs/project-context.md` - Contexto general del proyecto
- `../../docs/architecture/api-contracts.md` - APIs del backend
- `../../docs/keycloak/keycloak-config.md` - Configuración de autenticación
- `../../docker-compose.yml` - Servicios de desarrollo local

### 🎯 Prioridades de Desarrollo
1. **Fase 1**: Setup inicial + autenticación + layout base
2. **Fase 2**: Módulo de atletas (CRUD completo)
3. **Fase 3**: Módulo de tutores + relaciones
4. **Fase 4**: Dashboard con widgets y estadísticas
5. **Fase 5**: Configuraciones + administración de usuarios

---

**Nota**: Este contexto debe leerse junto con el prompt general del agente frontend. Siempre valida los designs y requerimientos UX con el equipo antes de implementar interfaces complejas.