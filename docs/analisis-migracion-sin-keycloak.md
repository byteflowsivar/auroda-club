# Análisis de Migración: Eliminación de Keycloak

## Resumen Ejecutivo

Este análisis evalúa las implicaciones técnicas, de recursos y desarrollo requeridas para remover Keycloak como proveedor de autenticación del sistema SGD (Sistema de Gestión Deportiva) y migrar a una solución de autenticación personalizada nativa.

**Conclusión Clave**: La eliminación de Keycloak representaría una **reducción significativa de recursos (~512MB+ RAM)** pero **incrementaría sustancialmente la complejidad del desarrollo** y requeriría implementar funcionalidades críticas de seguridad que actualmente Keycloak maneja automáticamente.

---

## 1. Estado Actual de la Arquitectura con Keycloak

### 1.1 Infraestructura Actual
```yaml
Servicios Docker:
├── keycloak_db (PostgreSQL)     # ~256MB RAM
├── keycloak (Quay.io v26.3)     # ~512MB RAM  
├── aurora_db (PostgreSQL)       # ~256MB RAM
└── club_backend (Quarkus)       # ~256MB RAM
```

**Recursos Totales**: ~1.28GB RAM para el stack completo

### 1.2 Dependencias de Keycloak Identificadas

#### Backend (sgd-backend)
```xml
<!-- Dependencias OIDC/Keycloak en pom.xml -->
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-oidc</artifactId>          <!-- JWT validation -->
</dependency>
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-security</artifactId>       <!-- Role-based security -->
</dependency>
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-security-jpa</artifactId>   <!-- User persistence -->
</dependency>
```

**Configuración actual**:
- OIDC endpoint: `http://localhost:8089/realms/SGD`
- JWT token validation automática
- Role extraction desde access tokens
- Claims personalizados: `club_id`, `venue_ids`, `sport_ids`

#### Frontend (sgd-next-console)
```json
{
  "next-auth": "^4.24.11"  // Integración con Keycloak Provider
}
```

**Integración actual**:
- NextAuth con Keycloak Provider
- JWT refresh token automático
- Session management resiliente
- Logout distribuido (local + Keycloak)

---

## 2. Impacto en Gestión de Usuarios y Sesiones

### 2.1 Funcionalidades que se Perderían
```
❌ Gestión centralizada de usuarios
❌ Password policies automáticas
❌ Session management distribuido
❌ JWT generation/validation automática
❌ Role-based access control (RBAC) integrado
❌ Refresh token rotation automática
❌ Security event logging
❌ Multi-factor authentication (MFA) support
❌ OAuth2/OIDC compliance
❌ Login brute-force protection
❌ Account lockout policies
❌ Password reset flows seguros
❌ Admin UI para gestión de usuarios
```

### 2.2 Datos y Configuraciones que se Migrarían
```sql
-- Datos actualmente en Keycloak (keycloak_db)
Users:          Emails, passwords hasheados, metadata
Roles:          ADMIN_GENERAL, ADMIN_CLUB, PROFESOR  
Claims:         club_id, venue_ids, sport_ids, full_name, phone
Sessions:       Active sessions, refresh tokens
Clients:        sgd-backend, sgd-frontend configurations
Realm Config:   Password policies, session timeouts, security settings
```

---

## 3. Desarrollo Requerido en Backend (sgd-backend)

### 3.1 Sistema de Autenticación Personalizado

#### **A. Nuevas Entidades JPA**
```java
// src/main/java/com/sgd/auth/entity/
@Entity public class User {
    private String email;
    private String passwordHash; // BCrypt
    private Set<Role> roles;
    private Long clubId;
    private String venueIds; // JSON array
    private String sportIds; // JSON array
    private boolean active;
    private LocalDateTime lastLogin;
    private int failedLogins;
    private LocalDateTime lockedUntil;
}

@Entity public class Role {
    private String name; // ADMIN_GENERAL, ADMIN_CLUB, PROFESOR
    private String description;
}

@Entity public class UserSession {
    private String sessionId;
    private String accessToken; // JWT generado localmente
    private String refreshToken;
    private LocalDateTime expiresAt;
    private LocalDateTime refreshExpiresAt;
    private String ipAddress;
    private String userAgent;
}

@Entity public class SecurityEvent {
    private String eventType; // LOGIN, LOGOUT, LOGIN_FAILED, PASSWORD_CHANGE
    private String userEmail;
    private String ipAddress;
    private String details;
    private LocalDateTime timestamp;
}
```

#### **B. Nuevos Servicios de Seguridad**
```java
// src/main/java/com/sgd/auth/service/
@ApplicationScoped
public class AuthenticationService {
    public AuthResponse login(String email, String password);
    public void logout(String sessionId);
    public TokenRefreshResponse refreshToken(String refreshToken);
    public boolean validateToken(String accessToken);
    public void lockAccount(String email);
    public void resetPassword(String email);
}

@ApplicationScoped
public class JwtService {
    public String generateAccessToken(User user);
    public String generateRefreshToken(User user);
    public Claims validateToken(String token);
    public boolean isTokenExpired(String token);
}

@ApplicationScoped
public class UserService {
    public User createUser(UserCreateRequest request);
    public User updateUser(Long id, UserUpdateRequest request);
    public void changePassword(Long userId, String newPassword);
    public void assignRoles(Long userId, Set<String> roles);
}

@ApplicationScoped
public class SecurityEventService {
    public void logLogin(String email, String ip);
    public void logFailedLogin(String email, String ip);
    public void logLogout(String email, String ip);
    public List<SecurityEvent> getEventsByUser(String email);
}
```

#### **C. Nuevos Endpoints REST**
```java
// src/main/java/com/sgd/auth/resource/
@Path("/auth")
@ApplicationScoped
public class AuthResource {
    @POST @Path("/login")
    public Response login(LoginRequest request);
    
    @POST @Path("/logout") 
    public Response logout(@HeaderParam("Authorization") String token);
    
    @POST @Path("/refresh")
    public Response refreshToken(RefreshTokenRequest request);
    
    @POST @Path("/forgot-password")
    public Response forgotPassword(ForgotPasswordRequest request);
    
    @POST @Path("/reset-password")
    public Response resetPassword(ResetPasswordRequest request);
}

@Path("/users")
@RolesAllowed("ADMIN_GENERAL")
public class UserManagementResource {
    @GET
    public Response getUsers(@QueryParam("page") int page);
    
    @POST
    public Response createUser(UserCreateRequest request);
    
    @PUT @Path("/{id}")
    public Response updateUser(@PathParam("id") Long id, UserUpdateRequest request);
    
    @DELETE @Path("/{id}")
    public Response deleteUser(@PathParam("id") Long id);
    
    @POST @Path("/{id}/roles")
    public Response assignRoles(@PathParam("id") Long id, RoleAssignmentRequest request);
}
```

#### **D. Configuración de Seguridad**
```java
// src/main/java/com/sgd/auth/config/
@ApplicationScoped
public class CustomSecurityConfig {
    @ConfigProperty(name = "sgd.jwt.secret")
    String jwtSecret;
    
    @ConfigProperty(name = "sgd.jwt.expiration")
    Duration jwtExpiration; // 15 minutos
    
    @ConfigProperty(name = "sgd.refresh.expiration") 
    Duration refreshExpiration; // 7 días
    
    @ConfigProperty(name = "sgd.password.min-length")
    int minPasswordLength; // 8
    
    @ConfigProperty(name = "sgd.login.max-attempts")
    int maxLoginAttempts; // 5
    
    @ConfigProperty(name = "sgd.account.lockout-duration")
    Duration lockoutDuration; // 30 minutos
}
```

#### **E. Filtros de Seguridad Personalizados**
```java
// src/main/java/com/sgd/auth/filter/
@Provider
@Priority(AUTHENTICATION)
public class JwtAuthenticationFilter implements ContainerRequestFilter {
    @Override
    public void filter(ContainerRequestContext requestContext) {
        String token = extractToken(requestContext);
        if (token != null && jwtService.validateToken(token)) {
            SecurityContext securityContext = createSecurityContext(token);
            requestContext.setSecurityContext(securityContext);
        }
    }
}

@ApplicationScoped
public class CustomSecurityContext implements SecurityContext {
    private final User currentUser;
    private final Set<String> roles;
    
    @Override
    public boolean isUserInRole(String role) {
        return roles.contains(role);
    }
    
    // Implementar métodos de SecurityContext
}
```

### 3.2 Migraciones de Base de Datos
```sql
-- src/main/resources/db/migration/V003__create_auth_schema.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    club_id BIGINT REFERENCES clubs(id),
    venue_ids TEXT, -- JSON array: [1,2,3]
    sport_ids TEXT, -- JSON array: [1,2]
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    failed_logins INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- ADMIN_GENERAL, ADMIN_CLUB, PROFESOR
    description VARCHAR(255)
);

CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(id),
    role_id BIGINT REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id BIGINT REFERENCES users(id),
    access_token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    refresh_expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE security_events (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- LOGIN, LOGOUT, LOGIN_FAILED, etc.
    user_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_club_venue ON users(club_id, venue_ids);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_security_events_user_email ON security_events(user_email);
CREATE INDEX idx_security_events_timestamp ON security_events(timestamp);
```

### 3.3 Nuevas Dependencias Maven
```xml
<!-- Reemplazar quarkus-oidc con: -->
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-security-jpa-reactive</artifactId>
</dependency>
<dependency>
    <groupId>io.smallrye</groupId>
    <artifactId>smallrye-jwt</artifactId>
</dependency>
<dependency>
    <groupId>org.mindrot</groupId>
    <artifactId>jbcrypt</artifactId>
</dependency>
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-mailer</artifactId> <!-- Para reset password -->
</dependency>
```

### 3.4 Estimación de Desarrollo Backend
```
⏱️  Entidades JPA + Repositories:        8-12 horas
⏱️  Servicios de autenticación:          16-24 horas  
⏱️  JWT generation/validation:           8-12 horas
⏱️  Endpoints REST:                      12-16 horas
⏱️  Filtros de seguridad:                8-12 horas
⏱️  Migraciones de datos:                4-8 horas
⏱️  Tests unitarios e integración:       16-24 horas
⏱️  Documentación OpenAPI:               4-8 horas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TOTAL BACKEND:                        76-116 horas
```

---

## 4. Desarrollo Requerido en Frontend (sgd-next-console)

### 4.1 Sistema de Autenticación Personalizado

#### **A. Reemplazo de NextAuth**
```typescript
// src/lib/auth/custom-auth.ts
export class CustomAuthService {
  async login(email: string, password: string): Promise<AuthResponse>;
  async logout(): Promise<void>;
  async refreshToken(): Promise<TokenRefreshResponse>;
  async forgotPassword(email: string): Promise<void>;
  async resetPassword(token: string, newPassword: string): Promise<void>;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
  hasRole(role: string): boolean;
}

// src/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    router.push('/admin/dashboard');
  };
  
  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push('/');
  };
  
  return { user, login, logout, isLoading };
}
```

#### **B. Nuevos Componentes de UI**
```typescript
// src/components/auth/login-form.tsx
export function LoginForm() {
  const { login } = useAuth();
  const form = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      toast.error("Credenciales inválidas");
    }
  };
  
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <Link href="/auth/forgot-password" className="text-sm text-blue-600">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// src/components/auth/forgot-password-form.tsx
export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.forgotPassword(email);
    setIsSubmitted(true);
  };
  
  if (isSubmitted) {
    return (
      <Card className="w-[400px]">
        <CardContent className="pt-6">
          <CheckIcon className="mx-auto h-12 w-12 text-green-600" />
          <h3 className="mt-4 text-lg font-medium text-center">
            Email enviado
          </h3>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Revisa tu bandeja de entrada para restablecer tu contraseña.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Recuperar Contraseña</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar instrucciones
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-sm text-blue-600">
            Volver al inicio de sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// src/components/auth/reset-password-form.tsx
export function ResetPasswordForm({ token }: { token: string }) {
  const form = useForm<ResetPasswordData>();
  const router = useRouter();
  
  const onSubmit = async (data: ResetPasswordData) => {
    try {
      await authService.resetPassword(token, data.password);
      toast.success("Contraseña actualizada exitosamente");
      router.push('/auth/login');
    } catch (error) {
      toast.error("Token inválido o expirado");
    }
  };
  
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Nueva Contraseña</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="password"
              rules={{ minLength: 8 }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                validate: (value) => value === form.watch('password') || "Las contraseñas no coinciden"
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Actualizar Contraseña
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

#### **C. Gestión de Usuarios (Admin)**
```typescript
// src/components/admin/user-management.tsx
export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>
      
      <UserTable users={users} onUserUpdate={handleUserUpdate} />
      
      <CreateUserDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}

// src/components/admin/user-table.tsx
export function UserTable({ users, onUserUpdate }: UserTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "fullName", 
      header: "Nombre Completo",
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.roles.map(role => (
            <Badge key={role} variant="outline">{role}</Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "active",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.active ? "default" : "destructive"}>
          {row.original.active ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      accessorKey: "lastLogin",
      header: "Último Acceso",
      cell: ({ row }) => (
        row.original.lastLogin 
          ? format(new Date(row.original.lastLogin), "dd/MM/yyyy HH:mm")
          : "Nunca"
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUserUpdate(row.original)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleToggleActive(row.original)}
              className={row.original.active ? "text-red-600" : "text-green-600"}
            >
              {row.original.active ? "Desactivar" : "Activar"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  
  return <DataTable columns={columns} data={users} />;
}

// src/components/admin/create-user-dialog.tsx
export function CreateUserDialog({ open, onOpenChange, onUserCreated }: CreateUserDialogProps) {
  const form = useForm<CreateUserData>();
  
  const onSubmit = async (data: CreateUserData) => {
    try {
      const newUser = await userService.createUser(data);
      onUserCreated(newUser);
      onOpenChange(false);
      form.reset();
      toast.success("Usuario creado exitosamente");
    } catch (error) {
      toast.error("Error al crear usuario");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={AVAILABLE_ROLES}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña Temporal</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear Usuario</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

#### **D. Nuevas Rutas y Páginas**
```typescript
// src/app/auth/login/page.tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm />
    </div>
  );
}

// src/app/auth/forgot-password/page.tsx  
export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ForgotPasswordForm />
    </div>
  );
}

// src/app/auth/reset-password/page.tsx
export default function ResetPasswordPage({ 
  searchParams 
}: { 
  searchParams: { token?: string } 
}) {
  if (!searchParams.token) {
    return <div>Token inválido</div>;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ResetPasswordForm token={searchParams.token} />
    </div>
  );
}

// src/app/admin/users/page.tsx
export default function UsersPage() {
  return <UserManagementPage />;
}
```

#### **E. Middleware de Autenticación**
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth/jwt-utils';

export async function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedPaths = ['/admin'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // Verificar token de autenticación
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  try {
    const payload = await verifyJWT(token);
    
    // Verificar permisos por ruta
    if (request.nextUrl.pathname.startsWith('/admin/users')) {
      if (!payload.roles.includes('ADMIN_GENERAL')) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 4.2 Migración de Dependencias
```json
{
  "dependencies": {
    // Remover:
    // "next-auth": "^4.24.11"
    
    // Agregar:
    "js-cookie": "^3.0.5",           // Manejo de cookies
    "jsonwebtoken": "^9.0.2",       // JWT verification client-side
    "react-query": "^3.39.3",       // API state management
    "@hookform/resolvers": "^5.2.1", // Ya existe
    "zod": "^4.0.16"                 // Ya existe
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.6",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
```

### 4.3 Estimación de Desarrollo Frontend
```
⏱️  Servicio de autenticación custom:      12-16 horas
⏱️  Componentes de login/logout:           8-12 horas
⏱️  Forgot/Reset password flows:          8-12 horas
⏱️  Gestión de usuarios (Admin UI):        16-24 horas
⏱️  Middleware y guards de rutas:          8-12 horas
⏱️  Migración de NextAuth:                 8-12 horas
⏱️  Hook useAuth y context:                4-8 horas
⏱️  Tests componentes auth:                12-16 horas
⏱️  Integración con API backend:           8-12 horas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TOTAL FRONTEND:                         84-124 horas
```

---

## 5. Reducción de Recursos de Memoria

### 5.1 Análisis de Consumo Actual
```yaml
# Docker Compose actual (memoria aproximada en producción)
keycloak_db:    256MB RAM
keycloak:       512MB RAM  
aurora_db:      256MB RAM
club_backend:   256MB RAM
──────────────────────────
TOTAL:         1,280MB RAM
```

### 5.2 Proyección Sin Keycloak
```yaml
# Infraestructura simplificada
aurora_db:      256MB RAM  (sin cambios)
club_backend:   276MB RAM  (+20MB por auth custom)
──────────────────────────
TOTAL:          532MB RAM
```

### 5.3 Recursos Liberados
```
🗑️  keycloak_db (PostgreSQL):     -256MB RAM
🗑️  keycloak (Aplicación):        -512MB RAM  
🗑️  Docker networks reducidas:    Mínimo
🗑️  Volúmenes de datos:           ~2GB storage

📊 REDUCCIÓN TOTAL: -768MB RAM (60% menos memoria)
📊 AHORRO STORAGE:  ~2GB
```

### 5.4 Beneficios Adicionales
```
✅ Menos contenedores Docker (4 → 2)
✅ Menos complejidad de red (2 networks → 1)
✅ Menos configuración de entorno
✅ Startup time más rápido
✅ Menos puntos de falla
✅ Backup/restore simplificado
```

---

## 6. Consideraciones de Seguridad

### 6.1 Funcionalidades de Seguridad que se Perderían
```
❌ Security event logging automático
❌ Brute force protection integrado
❌ Account lockout policies
❌ Password complexity enforcement
❌ Session timeout management
❌ Cross-site request forgery (CSRF) protection
❌ Clickjacking protection
❌ Security headers automáticos
❌ Audit trails completos
❌ Compliance con estándares (OAuth2, OIDC)
```

### 6.2 Implementaciones de Seguridad Requeridas
```java
// Protección contra fuerza bruta
@ApplicationScoped
public class BruteForceProtectionService {
    private static final int MAX_ATTEMPTS = 5;
    private static final Duration LOCKOUT_DURATION = Duration.ofMinutes(30);
    
    public void recordFailedLogin(String email, String ipAddress) {
        // Incrementar contador de intentos fallidos
        // Bloquear cuenta si excede MAX_ATTEMPTS
    }
    
    public boolean isAccountLocked(String email) {
        // Verificar si la cuenta está bloqueada
    }
    
    public boolean isIpBlocked(String ipAddress) {
        // Verificar si la IP está bloqueada
    }
}

// Hash de contraseñas seguro
@ApplicationScoped
public class PasswordService {
    private static final int BCRYPT_ROUNDS = 12;
    
    public String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt(BCRYPT_ROUNDS));
    }
    
    public boolean verifyPassword(String password, String hash) {
        return BCrypt.checkpw(password, hash);
    }
    
    public boolean isPasswordStrong(String password) {
        // Validar complejidad: 8+ chars, mayús, minús, número, símbolo
        return password.length() >= 8 &&
               password.matches(".*[A-Z].*") &&
               password.matches(".*[a-z].*") &&
               password.matches(".*[0-9].*") &&
               password.matches(".*[!@#$%^&*()].*");
    }
}

// JWT seguro
@ApplicationScoped 
public class SecureJwtService {
    @ConfigProperty(name = "sgd.jwt.secret")
    String jwtSecret; // 256+ bits
    
    public String generateToken(User user) {
        return JWT.create()
            .withIssuer("sgd-backend")
            .withSubject(user.getEmail())
            .withClaim("userId", user.getId())
            .withClaim("roles", user.getRoles())
            .withClaim("clubId", user.getClubId()) 
            .withExpiresAt(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES)))
            .withIssuedAt(new Date())
            .withJWTId(UUID.randomUUID().toString())
            .sign(Algorithm.HMAC256(jwtSecret));
    }
}
```

### 6.3 Headers de Seguridad Requeridos
```java
// src/main/java/com/sgd/auth/filter/SecurityHeadersFilter.java
@Provider
public class SecurityHeadersFilter implements ContainerResponseFilter {
    @Override
    public void filter(ContainerRequestContext requestContext, 
                      ContainerResponseContext responseContext) {
        MultivaluedMap<String, Object> headers = responseContext.getHeaders();
        
        // Prevenir clickjacking
        headers.add("X-Frame-Options", "DENY");
        
        // Prevenir MIME type sniffing
        headers.add("X-Content-Type-Options", "nosniff");
        
        // XSS Protection
        headers.add("X-XSS-Protection", "1; mode=block");
        
        // HTTPS enforcement
        headers.add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        
        // Content Security Policy
        headers.add("Content-Security-Policy", "default-src 'self'");
        
        // Referrer Policy
        headers.add("Referrer-Policy", "strict-origin-when-cross-origin");
    }
}
```

---

## 7. Análisis de Riesgos

### 7.1 Riesgos Técnicos
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Vulnerabilidades de seguridad en implementación custom** | Alta | Crítico | Auditorías de seguridad, testing exhaustivo |
| **Pérdida de funcionalidades de autenticación** | Media | Alto | Implementación incremental de features |
| **Bugs en gestión de sesiones** | Media | Alto | Tests extensivos, monitoring |
| **Tiempo de desarrollo subestimado** | Alta | Alto | Buffer del 50% en estimaciones |
| **Incompatibilidad con integraciones futuras** | Media | Medio | Diseño modular y estándares |

### 7.2 Riesgos de Negocio
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Usuarios pierden acceso durante migración** | Media | Crítico | Plan de rollback, migración escalonada |
| **Pérdida de datos de usuarios** | Baja | Crítico | Backups múltiples, validación de migración |
| **Tiempo de inactividad extendido** | Media | Alto | Deploy con zero-downtime |
| **Resistencia de usuarios a nueva UI** | Alta | Medio | Training, UI familiar |

### 7.3 Riesgos de Compliance
```
⚠️  Pérdida de compliance OAuth2/OIDC
⚠️  Audit trails incompletos
⚠️  Manejo inadecuado de datos personales
⚠️  Falta de logs de seguridad detallados
⚠️  No cumplimiento con estándares de password policies
```

---

## 8. Plan de Migración Sugerido

### 8.1 Fase 1: Preparación (2-3 semanas)
```
📋 Semana 1-2: Desarrollo Backend
   ├── Crear entidades de User, Role, Session
   ├── Implementar servicios de autenticación
   ├── Desarrollar endpoints de auth
   └── Tests unitarios

📋 Semana 2-3: Desarrollo Frontend  
   ├── Crear componentes de login/logout
   ├── Implementar gestión de usuarios
   ├── Desarrollar flows de password reset
   └── Tests de integración
```

### 8.2 Fase 2: Migración de Datos (1 semana)
```
📋 Script de migración de Keycloak a PostgreSQL
   ├── Exportar usuarios, roles y configuraciones
   ├── Migrar contraseñas hasheadas (si compatible)
   ├── Mapear custom claims a campos de user
   └── Validar integridad de datos migrados
```

### 8.3 Fase 3: Deployment y Cutover (1 semana)
```
📋 Deploy en ambiente de testing
   ├── Validar funcionalidades críticas
   ├── Performance testing
   ├── Security testing
   └── User acceptance testing

📋 Cutover a producción
   ├── Backup completo de Keycloak
   ├── Deploy nueva versión
   ├── Migración de datos en vivo
   └── Rollback plan preparado
```

### 8.4 Total Estimado: **5-6 semanas** (160-200 horas desarrollo)

---

## 9. Recomendaciones

### 9.1 ✅ **A FAVOR de remover Keycloak:**
```
🚀 Reducción significativa de recursos (60% menos RAM)
🚀 Simplificación de infraestructura 
🚀 Menor complejidad operacional
🚀 Control total sobre funcionalidades de auth
🚀 Customización completa según necesidades
🚀 Eliminación de dependencia externa
🚀 Costos de hosting menores
```

### 9.2 ❌ **EN CONTRA de remover Keycloak:**
```
⚠️  Incremento significativo en desarrollo (160-200 horas)
⚠️  Pérdida de funcionalidades de seguridad probadas
⚠️  Riesgos de seguridad por implementación custom
⚠️  Mantenimiento a largo plazo de auth system
⚠️  Pérdida de compliance OAuth2/OIDC
⚠️  Re-implementar wheel (Keycloak es estándar)
⚠️  Testing extensivo requerido
```

### 9.3 **Recomendación Final:**
```
📊 MANTENER KEYCLOAK si:
   ├── El consumo de 768MB RAM es aceptable
   ├── Se valora la seguridad y estabilidad sobre recursos
   ├── Se requiere compliance con estándares OAuth2/OIDC
   └── El tiempo de desarrollo (5-6 semanas) no está disponible

🔄 MIGRAR A AUTH CUSTOM si:
   ├── La reducción de 768MB RAM es crítica
   ├── Se cuenta con 5-6 semanas para desarrollo seguro
   ├── Se tiene experiencia en implementación de auth systems
   └── Se pueden destinar recursos para testing exhaustivo
```

---

## 10. Estimación de Costos

### 10.1 Costos de Desarrollo
```
👨‍💻 Backend Developer (Senior):     80-116 horas × $50/hora = $4,000-5,800
👨‍💻 Frontend Developer (Senior):    84-124 horas × $50/hora = $4,200-6,200  
🧪 QA/Testing:                      40-60 horas × $40/hora  = $1,600-2,400
📋 DevOps/Infrastructure:           16-24 horas × $60/hora  = $960-1,440
──────────────────────────────────────────────────────────────────────────
💰 TOTAL DESARROLLO:                                       $10,760-15,840
```

### 10.2 Ahorro en Hosting (Anual)
```
🏗️  Reducción de recursos AWS/Azure:
   ├── 768MB RAM menos = ~$30-50/mes
   ├── 2GB storage menos = ~$5-10/mes  
   ├── Menos CPU usage = ~$15-25/mes
   └── TOTAL AHORRO: ~$50-85/mes = $600-1,020/año
```

### 10.3 ROI Estimado
```
📊 Break-even: 10-26 meses dependiendo del ahorro
📊 ROI positivo después de 2-3 años
📊 Beneficio intangible: Simplificación operacional
```

---

## 11. Conclusiones

### 11.1 Viabilidad Técnica: ✅ **FACTIBLE**
La migración es técnicamente posible y bien definida. Las tecnologías requeridas (Quarkus Security, JWT, BCrypt) son maduras y estables.

### 11.2 Reducción de Recursos: ✅ **SIGNIFICATIVA**
**768MB RAM (60%) de reducción** es un beneficio sustancial, especialmente en entornos con recursos limitados.

### 11.3 Complejidad de Desarrollo: ⚠️ **CONSIDERABLE**
**160-200 horas de desarrollo** representan 4-5 semanas de trabajo full-time para un equipo de 2-3 desarrolladores.

### 11.4 Recomendación Estratégica:

**🎯 PROCEDER CON LA MIGRACIÓN si:**
- La reducción de 768MB RAM resuelve limitaciones críticas de recursos
- Se cuenta con el presupuesto ($10K-$15K) y timeline (5-6 semanas)
- Se puede destinar tiempo adecuado para testing y security review
- La simplificación operacional es valorada a largo plazo

**🛑 MANTENER KEYCLOAK si:**
- Los recursos actuales son suficientes para la operación
- Se prefiere estabilidad y security-by-default sobre optimización
- No se cuenta con timeline o presupuesto para la migración
- Se valora compliance con estándares OAuth2/OIDC

---

**Documento generado**: 2025-08-20  
**Versión**: 1.0  
**Estado**: Análisis Completo ✅