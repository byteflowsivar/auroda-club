# Guía Paso a Paso: Configuración Keycloak
## Sistema de Gestión Deportiva - Tutorial Completo

### 📋 Prerrequisitos
- Docker y Docker Compose instalados
- Puerto 8080 disponible
- Editor de texto para archivos de configuración
- Navegador web para acceso a Admin Console

---

## 🚀 Paso 1: Preparación del Entorno

### 1.1 Crear Estructura de Directorios
```bash
mkdir sgd-keycloak-setup
cd sgd-keycloak-setup
mkdir scripts
```

**¿Por qué?** Organizar archivos de configuración facilita el mantenimiento y permite versionado con Git.

### 1.2 Crear Script de Inicialización de Base de Datos
Crear archivo: `scripts/init-keycloak-db.sql`

```sql
-- Crear base de datos específica para Keycloak
CREATE DATABASE sgd_keycloak;

-- Crear usuario dedicado para Keycloak
CREATE USER keycloak_user WITH PASSWORD 'keycloak_pass_2024!';

-- Otorgar permisos completos sobre la base de datos
GRANT ALL PRIVILEGES ON DATABASE sgd_keycloak TO keycloak_user;

-- Permitir al usuario crear tablas y esquemas
ALTER USER keycloak_user CREATEDB;
```

**¿Por qué?** 
- **Separación de datos**: Keycloak y la aplicación usan bases de datos diferentes para evitar conflictos
- **Usuario dedicado**: Principio de menor privilegio, cada servicio tiene su propio usuario
- **Permisos específicos**: Solo los permisos necesarios para que Keycloak funcione

### 1.3 Crear Docker Compose
Crear archivo: `docker-compose.yml`

```yaml
version: '3.8'

services:
  # Base de datos PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: sgd-postgres
    restart: unless-stopped
    environment:
      # Base de datos principal del sistema
      POSTGRES_DB: sgd_main
      POSTGRES_USER: sgd_user
      POSTGRES_PASSWORD: sgd_pass_2024!
      # Configuración de PostgreSQL
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    ports:
      - "5432:5432"
    volumes:
      # Persistencia de datos
      - postgres_data:/var/lib/postgresql/data
      # Script de inicialización para crear DB de Keycloak
      - ./scripts/init-keycloak-db.sql:/docker-entrypoint-initdb.d/01-keycloak.sql
    networks:
      - sgd-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sgd_user -d sgd_main"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Servidor Keycloak
  keycloak:
    image: quay.io/keycloak/keycloak:26.3.2
    container_name: sgd-keycloak
    restart: unless-stopped
    environment:
      # Credenciales del administrador inicial
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: AdminSGD2024!
      
      # Configuración de base de datos
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/sgd_keycloak
      KC_DB_USERNAME: keycloak_user
      KC_DB_PASSWORD: keycloak_pass_2024!
      
      # Configuración de hostname (desarrollo) - MEJORADA EN v26
      KC_HOSTNAME: localhost
      KC_HOSTNAME_PORT: 8080
      KC_HOSTNAME_STRICT: false
      KC_HOSTNAME_STRICT_HTTPS: false
      KC_HOSTNAME_ADMIN: localhost
      
      # Configuración de HTTP
      KC_HTTP_ENABLED: true
      KC_HTTP_PORT: 8080
      
      # Configuración de proxy (importante para producción)
      KC_PROXY_HEADERS: xforwarded
      
      # Configuración de logs - MEJORADA EN v26
      KC_LOG_LEVEL: INFO
      KC_LOG_CONSOLE_COLOR: true
      KC_LOG_CONSOLE_FORMAT: "%d{yyyy-MM-dd HH:mm:ss,SSS} %-5p [%c] (%t) %s%e%n"
      
      # Configuración de salud y métricas
      KC_HEALTH_ENABLED: true
      KC_METRICS_ENABLED: true
      
      # Cache distribuido - NUEVO EN v26
      KC_CACHE: ispn
      KC_CACHE_CONFIG_FILE: cache-ispn.xml
      
      # Features habilitados - ACTUALIZADOS EN v26
      KC_FEATURES: token-exchange,admin-fine-grained-authz,declarative-user-profile
    command:
      # Modo desarrollo con importación automática
      - start-dev
      - --import-realm
    ports:
      - "8080:8080"
    volumes:
      # Directorio para importar configuraciones automáticamente
      - ./realm-exports:/opt/keycloak/data/import
      # Cache persistente - NUEVO EN v26
      - keycloak_data:/opt/keycloak/data
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - sgd-network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8080/health/ready || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 90s

volumes:
  postgres_data:
    driver: local
  keycloak_data:
    driver: local

networks:
  sgd-network:
    driver: bridge
```

**¿Por qué cada configuración?**
- **postgres:15-alpine**: Versión estable y liviana
- **restart: unless-stopped**: Reinicio automático salvo detención manual
- **healthcheck**: Verificación automática de disponibilidad
- **volumes**: Persistencia de datos entre reinicios
- **networks**: Comunicación segura entre contenedores
- **KC_PROXY_HEADERS: xforwarded**: NUEVO en v26 - Reemplaza KC_PROXY para mejor manejo de headers
- **KC_HOSTNAME_ADMIN**: NUEVO en v26 - Permite hostname diferente para admin console
- **KC_CACHE: ispn**: Cache distribuido Infinispan mejorado en v26
- **KC_FEATURES**: Nuevas características habilitadas en v26
- **start-dev**: Modo desarrollo con configuración simplificada
- **--import-realm**: Importación automática de configuraciones
- **start_period: 90s**: Mayor tiempo para v26 que necesita más inicialización

### 1.4 Iniciar Servicios
```bash
# Levantar servicios en background
docker-compose up -d

# Verificar que estén funcionando
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f keycloak
```

**¿Por qué?** Los logs muestran el proceso de inicialización y posibles errores.

---

## 🏗️ Paso 2: Acceso y Configuración Inicial

### 2.1 Acceder a Admin Console
1. Abrir navegador: `http://localhost:8080`
2. Hacer clic en "Administration Console"
3. Login: `admin` / `keycloak`

**¿Por qué este flujo?** Keycloak separa la interfaz de usuario (realm) de la consola administrativa por seguridad.

### 2.2 Verificar Instalación
En Administration Console verificar:
- ✅ **Master realm** aparece en dropdown superior izquierdo
- ✅ **Server Info** muestra versión 26.3.2
- ✅ **Events** está disponible (para auditoría)
- ✅ **Realm Settings → General** muestra nuevas opciones de v26

**¿Por qué verificar?** Confirma que Keycloak v26.3.2 está completamente funcional con las nuevas características.

---

## 🌐 Paso 3: Crear y Configurar Realm "SGD"

### 3.1 Crear Nuevo Realm
1. **Realm dropdown** (esquina superior izquierda) → **Create Realm**
2. **Realm name**: `SGD`
3. **Enabled**: ✅ Activado
4. **Display name**: `Sistema de Gestión Deportiva`
5. **HTML Display name**: `<strong>Sistema de Gestión Deportiva</strong>`
6. Hacer clic **Create**

**¿Por qué un realm separado?**
- **Aislamiento**: Cada aplicación tiene su propio espacio de usuarios y configuración
- **Seguridad**: Credenciales de admin del master realm no afectan la aplicación
- **Escalabilidad**: Facilita agregar más aplicaciones en el futuro

### 3.2 Configurar Settings Generales
**Ir a: Realm Settings → General**

```
Display name: Sistema de Gestión Deportiva
Display name HTML: <strong>Sistema Gestión Deportiva</strong>
Front-end URL: http://localhost:8080 (desarrollo)
Require SSL: None (desarrollo) / All requests (producción)
```

**¿Por qué?**
- **Display name**: Aparece en pantallas de login
- **Front-end URL**: URL que verán los usuarios finales
- **SSL**: Desarrollo sin SSL, producción SIEMPRE con SSL

### 3.3 Configurar Login Settings
**Ir a: Realm Settings → Login**

```
✅ User registration: Habilitado
❌ Email as username: Deshabilitado  
✅ Login with email: Habilitado
❌ Duplicate emails: Deshabilitado
❌ Verify email: Deshabilitado (desarrollo)
✅ Reset password: Habilitado
✅ Remember me: Habilitado
✅ Login with email: Habilitado
```

**¿Por qué cada configuración?**
- **User registration**: Los administradores pueden crear usuarios
- **Email as username**: Mantenemos username separado para flexibilidad
- **Login with email**: Los usuarios pueden usar email O username
- **Duplicate emails**: Cada email debe ser único en el sistema
- **Verify email**: Deshabilitado en desarrollo, habilitado en producción
- **Reset password**: Funcionalidad esencial para usuarios
- **Remember me**: Mejora experiencia de usuario

### 3.4 Configurar Tokens
**Ir a: Realm Settings → Tokens**

```
Access Token Lifespan: 5 Minutes
Access Token Lifespan For Implicit Flow: 15 Minutes  
Client Login Timeout: 1 Minute
Login Timeout: 30 Minutes
Login Action Timeout: 5 Minutes
SSO Session Idle Timeout: 30 Minutes
SSO Session Max Lifespan: 10 Hours
Offline Session Idle Timeout: 30 Days
Offline Session Max Lifespan: 60 Days
Client Offline Session Idle Timeout: 30 Days
Client Offline Session Max Lifespan: 60 Days

# NUEVOS EN v26.3.2:
User Session Limit: 10 (por usuario)
Refresh Token Max Reuse: 0 (sin reutilización)
OAuth 2.0 Device Authorization Grant: Enabled
OAuth 2.0 CIBA Grant: Disabled
```

**¿Por qué estos tiempos?**
- **Access Token 5min**: Corto por seguridad, se renueva automáticamente
- **SSO Session 30min idle**: Balance entre seguridad y usabilidad
- **SSO Max 10 horas**: Día laboral completo sin re-login
- **Offline 30 días**: Para funcionalidad "Remember me"
- **User Session Limit 10**: NUEVO en v26 - Previene acumulación excesiva de sesiones
- **Refresh Token Max Reuse 0**: NUEVO en v26 - Mayor seguridad contra ataques de replay

### 3.5 Configurar Seguridad
**Ir a: Realm Settings → Security Defenses**

**Brute Force Detection:**
```
✅ Enabled: Habilitado
Max Login Failures: 5
Wait Increment: 60 seconds
Quick Login Check: 1000 milliseconds  
Minimum Quick Login Wait: 60 seconds
Max Wait: 15 minutes (900 seconds)
Failure Reset Time: 12 hours
```

**¿Por qué?**
- **5 intentos**: Balance entre seguridad y usabilidad
- **Incremento exponencial**: Disuade ataques automatizados
- **Reset 12 horas**: Tiempo razonable para usuarios legítimos

**Headers:**
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-Robots-Tag: noindex
X-XSS-Protection: 1; mode=block
Content-Security-Policy: frame-ancestors 'self'

# NUEVOS EN v26.3.2:
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Cross-Origin-Opener-Policy: same-origin
```

**¿Por qué?** Protección contra ataques web comunes (XSS, clickjacking, etc.). v26.3.2 incluye headers adicionales de seguridad.

---

## 👤 Paso 4: Configurar Clients

### 4.1 Client Backend (sgd-backend)
**Ir a: Clients → Create Client**

**General Settings:**
```
Client type: OpenID Connect
Client ID: sgd-backend
Name: SGD Backend API  
Description: Quarkus REST API para Sistema de Gestión Deportiva
Always display in console: ❌ Deshabilitado

# NUEVO EN v26.3.2:
Root URL: (vacío para backend)
Valid redirect URIs: (configurar después)
```

**Capability config:**
```
✅ Client authentication: Habilitado
❌ Authorization: Deshabilitado
❌ Standard flow: Deshabilitado
❌ Implicit flow: Deshabilitado  
❌ Direct access grants: Deshabilitado
✅ Service accounts roles: Habilitado

# NUEVOS EN v26.3.2:
❌ OAuth 2.0 Device Authorization Grant: Deshabilitado
❌ OIDC CIBA Grant: Deshabilitado
✅ OAuth 2.0 Token Exchange: Habilitado (para futuras integraciones)
```

**¿Por qué esta configuración?**
- **Client authentication**: Backend necesita autenticarse con secret
- **Service accounts**: Para comunicación server-to-server
- **Standard flow deshabilitado**: Backend no maneja usuarios directamente
- **Direct access grants deshabilitado**: Más seguro para APIs
- **Token Exchange habilitado**: NUEVO en v26 - Permite intercambio seguro de tokens entre servicios

**Login settings:**
```
Valid redirect URIs: (vacío)
Valid post logout redirect URIs: (vacío)  
Web origins: http://localhost:3000
Admin URL: (vacío)
```

**¿Por qué?**
- **Sin redirects**: Backend no maneja login de usuarios
- **Web origins**: CORS para frontend en localhost:3000

### 4.2 Client Frontend (sgd-panel-frontend)  
**Crear nuevo client:**

**General Settings:**
```
Client type: OpenID Connect
Client ID: sgd-panel-frontend
Name: SGD Frontend Web
Description: NextJS Frontend para Sistema de Gestión Deportiva
```

**Capability config:**
```
✅ Client authentication: Habilitado
❌ Authorization: Deshabilitado
✅ Standard flow: Habilitado
❌ Implicit flow: Deshabilitado
✅ Direct access grants: Habilitado  
❌ Service accounts roles: Deshabilitado

# NUEVOS EN v26.3.2:
❌ OAuth 2.0 Device Authorization Grant: Deshabilitado
❌ OIDC CIBA Grant: Deshabilitado
❌ OAuth 2.0 Token Exchange: Deshabilitado
✅ OAuth 2.0 Pushed Authorization Requests (PAR): Habilitado (mayor seguridad)
```

**¿Por qué?**
- **Standard flow**: Authorization Code Flow para SPAs
- **Direct access grants**: Para casos especiales (testing, admin)
- **Client authentication**: Protege el client secret
- **PAR habilitado**: NUEVO en v26 - Mayor seguridad para authorization requests

**Login settings:**
```
Root URL: http://localhost:3000
Home URL: http://localhost:3000
Valid redirect URIs: 
  - http://localhost:3000/api/auth/callback/*
  - http://localhost:3000/auth/callback/*
Valid post logout redirect URIs:
  - http://localhost:3000
  - http://localhost:3000/login
Web origins: 
  - http://localhost:3000
Admin URL: (vacío)
```

**¿Por qué estas URLs?**
- **Root/Home URL**: Base de la aplicación frontend
- **Redirect URIs**: Endpoints donde Keycloak redirige después del login
- **Post logout**: Donde redirigir después de logout
- **Web origins**: CORS permitido para el frontend

### 4.3 Obtener Client Secrets
**Para sgd-backend:**
1. Ir a **Clients → sgd-backend → Credentials**
2. Copiar **Client secret**
3. Guardar en archivo seguro: `BACKEND_CLIENT_SECRET=<valor>`

**Para sgd-panel-frontend**
1. Ir a **Clients → sgd-frontend → Credentials**  
2. Copiar **Client secret**
3. Guardar: `FRONTEND_CLIENT_SECRET=<valor>`

**¿Por qué guardar?** Estos secrets se necesitan en las variables de entorno de las aplicaciones.

---

## 🎭 Paso 5: Configurar Sistema de Roles

### 5.1 Crear Realm Roles
**Ir a: Realm Roles → Create Role**

**Role 1: ADMIN_GENERAL**
```
Role name: ADMIN_GENERAL
Description: Administrador general del sistema con acceso completo
Composite: ❌ No (por ahora)
```

**Role 2: ADMIN_CLUB**
```
Role name: ADMIN_CLUB  
Description: Administrador de club deportivo - gestiona atletas y tutores
Composite: ❌ No
```

**Role 3: PROFESOR**
```
Role name: PROFESOR
Description: Profesor/Entrenador - visualiza atletas asignados
Composite: ❌ No
```

**Role 4: ATLETA** (para futuro)
```
Role name: ATLETA
Description: Atleta registrado - acceso a app móvil
Composite: ❌ No
```

**Role 5: TUTOR** (para futuro)
```
Role name: TUTOR  
Description: Tutor/Guardian - ve datos de atletas bajo tutela
Composite: ❌ No
```

**¿Por qué estos roles?**
- **Separación clara**: Cada role tiene responsabilidades específicas
- **Escalabilidad**: Preparado para app móvil futura
- **Seguridad**: Principio de menor privilegio

### 5.2 Crear Client Roles (sgd-backend)
**Ir a: Clients → sgd-backend → Roles → Create Role**

**Crear estos roles uno por uno:**
```
athletes:read → "Leer información de atletas"
athletes:write → "Crear y actualizar atletas"  
athletes:delete → "Eliminar atletas"
guardians:read → "Leer información de tutores"
guardians:write → "Crear y actualizar tutores"
config:read → "Leer configuraciones del sistema"
config:write → "Gestionar configuraciones (deportes, categorías)"
reports:read → "Acceder a reportes y estadísticas"
users:manage → "Gestionar usuarios del sistema"
```

**¿Por qué client roles?**
- **Granularidad**: Permisos específicos por funcionalidad
- **Flexibilidad**: Se pueden combinar según necesidad
- **API Security**: El backend puede verificar permisos específicos

### 5.3 Configurar Composite Roles
**Ir a: Realm Roles → ADMIN_GENERAL → Composite Roles**

**ADMIN_GENERAL incluye (Client Roles de sgd-backend):**
- ✅ athletes:read
- ✅ athletes:write
- ✅ athletes:delete
- ✅ guardians:read
- ✅ guardians:write
- ✅ config:read
- ✅ config:write
- ✅ reports:read
- ✅ users:manage

**ADMIN_CLUB incluye:**
- ✅ athletes:read
- ✅ athletes:write
- ✅ guardians:read
- ✅ guardians:write
- ✅ config:read
- ✅ reports:read

**PROFESOR incluye:**
- ✅ athletes:read
- ✅ config:read

**¿Por qué composite roles?**
- **Herencia automática**: Un role incluye múltiples permisos
- **Mantenimiento**: Cambiar permisos en un lugar afecta todos los usuarios
- **Claridad**: Los tokens incluyen todos los permisos automáticamente

---

## 🏷️ Paso 6: Configurar User Attributes y Mappers

### 6.1 Definir User Attributes
Los usuarios necesitarán estos atributos personalizados:
- `club_id`: ID del club (número)
- `venue_ids`: IDs de sedes accesibles (JSON array)  
- `sport_ids`: IDs de deportes que maneja (JSON array)
- `full_name`: Nombre completo
- `phone`: Teléfono de contacto

**¿Por qué estos atributos?**
- **club_id**: Filtrar datos por organización
- **venue_ids**: Controlar acceso por sede
- **sport_ids**: Limitar deportes visibles
- **full_name/phone**: Información adicional para la UI

### 6.2 Crear Protocol Mappers
**Ir a: Clients → sgd-panel-frontend → Client Scopes → sgd-panel-frontend-dedicated → Mappers → Create Protocol Mapper**

> **NOTA v26.3.2**: La interfaz de mappers ha sido reorganizada. Si no encuentras "sgd-panel-frontend-dedicated", busca en **Client Scopes** en la navegación principal, luego selecciona el scope dedicado del client.

**Mapper 1: club_id**
```
Mapper Type: User Attribute
Name: club_id
User Attribute: club_id
Token Claim Name: club_id
Claim JSON Type: long
Add to ID token: ✅ Sí
Add to access token: ✅ Sí  
Add to userinfo: ✅ Sí
Multivalued: ❌ No
Aggregate attribute values: ❌ No

# NUEVO EN v26.3.2:
Include in lightweight access token: ✅ Sí
```

**Mapper 2: venue_ids**
```
Mapper Type: User Attribute  
Name: venue_ids
User Attribute: venue_ids
Token Claim Name: venue_ids
Claim JSON Type: JSON
Add to ID token: ✅ Sí
Add to access token: ✅ Sí
Add to userinfo: ✅ Sí
Multivalued: ❌ No
```

**Mapper 3: sport_ids**
```
Mapper Type: User Attribute
Name: sport_ids  
User Attribute: sport_ids
Token Claim Name: sport_ids
Claim JSON Type: JSON
Add to ID token: ✅ Sí
Add to access token: ✅ Sí
Add to userinfo: ✅ Sí
```

**Mapper 4: full_name**
```
Mapper Type: User Attribute
Name: full_name
User Attribute: full_name  
Token Claim Name: full_name
Claim JSON Type: String
Add to ID token: ✅ Sí
Add to access token: ✅ Sí
Add to userinfo: ✅ Sí
```

**Mapper 5: phone**
```
Mapper Type: User Attribute
Name: phone
User Attribute: phone
Token Claim Name: phone  
Claim JSON Type: String
Add to ID token: ✅ Sí
Add to access token: ✅ Sí
Add to userinfo: ✅ Sí
```

**¿Por qué estos mappers?**
- **ID Token**: Frontend puede acceder inmediatamente después del login
- **Access Token**: Backend puede usar la información sin consultas adicionales
- **UserInfo**: Endpoint estándar para obtener información del usuario
- **JSON Type**: Permite arrays y objetos complejos en venue_ids/sport_ids
- **Lightweight access token**: NUEVO en v26 - Reduce tamaño del token manteniendo claims esenciales

**Repetir mappers para sgd-backend client** con la misma configuración, incluyendo la nueva opción "Include in lightweight access token".

---

## 👥 Paso 7: Crear Usuarios de Prueba

### 7.1 Usuario Admin General
**Ir a: Users → Create User**

**User Details:**
```
Username: admin.general
Email: admin@sgd.local
First name: Admin
Last name: General  
Email verified: ✅ Sí
Enabled: ✅ Sí
```

**Credentials:**
1. Ir a **Credentials** tab
2. **Set Password**: `AdminGeneral2024!`
3. **Temporary**: ❌ No

**Role Mapping:**
1. Ir a **Role mapping** tab
2. **Assign role** → **Filter by realm roles**
3. Seleccionar: `ADMIN_GENERAL`

**Attributes:**
1. Ir a **Attributes** tab
2. Agregar:
   ```
   club_id: 1
   venue_ids: [1,2,3]
   sport_ids: [1,2,3,4]
   full_name: Admin General SGD
   phone: +503 1234-5678
   ```

### 7.2 Usuario Admin Club
**Crear usuario similar:**
```
Username: admin.club1
Email: admin.club@sgd.local
First name: Carlos
Last name: Rodríguez
Password: AdminClub2024!
Role: ADMIN_CLUB
Attributes:
  club_id: 1
  venue_ids: [1,2]  
  sport_ids: [1,2]
  full_name: Carlos Rodríguez
  phone: +503 2345-6789
```

### 7.3 Usuario Profesor
```
Username: profesor.futbol
Email: profesor@sgd.local  
First name: María
Last name: González
Password: Profesor2024!
Role: PROFESOR
Attributes:
  club_id: 1
  venue_ids: [1]
  sport_ids: [1]
  full_name: María González
  phone: +503 3456-7890
```

**¿Por qué estos usuarios?**
- **Datos realistas**: Nombres y roles que reflejan uso real
- **Diferentes permisos**: Permite probar cada nivel de acceso
- **Attributes completos**: Valida que los mappers funcionan

---

## 🔍 Paso 8: Testing y Validación

### 8.1 Verificar Configuración del Realm
**Ir a: Realm Settings → General**
- ✅ **Endpoints**: Click en "OpenID Endpoint Configuration"
- ✅ Verificar que aparece la URL: `http://localhost:8080/realms/SGD/.well-known/openid_configuration`

### 8.2 Test de Autenticación
**Usar curl o Postman:**
```bash
curl -X POST \
  http://localhost:8080/realms/SGD/protocol/openid-connect/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=password' \
  -d 'client_id=sgd-frontend' \
  -d 'client_secret=TU_CLIENT_SECRET_AQUI' \
  -d 'username=admin.general' \
  -d 'password=AdminGeneral2024!'
```

**Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "not-before-policy": 0,
  "session_state": "uuid-here",
  "scope": "profile email"
}
```

### 8.3 Validar Claims en Token
1. Copiar `access_token` de la respuesta
2. Ir a `https://jwt.io`
3. Pegar el token en "Encoded"
4. Verificar en "Payload":

```json
{
  "exp": 1234567890,
  "iat": 1234567890,
  "jti": "uuid",
  "iss": "http://localhost:8080/realms/SGD",
  "sub": "user-uuid",
  "typ": "Bearer",
  "azp": "sgd-frontend",
  "session_state": "uuid",
  "realm_access": {
    "roles": ["ADMIN_GENERAL"]
  },
  "resource_access": {
    "sgd-backend": {
      "roles": [
        "athletes:read",
        "athletes:write", 
        "athletes:delete",
        "guardians:read",
        "guardians:write",
        "config:read",
        "config:write",
        "reports:read",
        "users:manage"
      ]
    }
  },
  "club_id": 1,
  "venue_ids": [1, 2, 3],
  "sport_ids": [1, 2, 3, 4],
  "full_name": "Admin General SGD",
  "phone": "+503 1234-5678",
  "email": "admin@sgd.local",
  "preferred_username": "admin.general"
}
```

**¿Qué verificar?**
- ✅ **realm_access.roles**: Contiene ADMIN_GENERAL
- ✅ **resource_access.sgd-backend.roles**: Contiene todos los permisos
- ✅ **Custom claims**: club_id, venue_ids, sport_ids, full_name, phone
- ✅ **Standard claims**: email, preferred_username

### 8.4 Test de Diferentes Usuarios
Repetir el test con cada usuario creado:
- `admin.club1` / `AdminClub2024!` → Debe tener menos permisos
- `profesor.futbol` / `Profesor2024!` → Solo permisos de lectura

---

## 📁 Paso 9: Backup y Documentación

### 9.1 Exportar Configuración
```bash
# Exportar realm completo (comando actualizado para v26.3.2)
docker exec sgd-keycloak /opt/keycloak/bin/kc.sh export \
  --realm SGD \
  --file /opt/keycloak/data/sgd-realm-backup.json \
  --users realm_file

# Copiar archivo al host
docker cp sgd-keycloak:/opt/keycloak/data/sgd-realm-backup.json ./sgd-realm-backup.json
```

> **NOTA v26.3.2**: El comando export ahora incluye la opción `--users realm_file` para exportar usuarios junto con la configuración del realm.

### 9.2 Crear Variables de Entorno
Crear archivo: `.env.keycloak`
```bash
# Keycloak Server
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=SGD

# Client Credentials
KEYCLOAK_FRONTEND_CLIENT_ID=sgd-frontend
KEYCLOAK_FRONTEND_CLIENT_SECRET=tu_frontend_secret_aqui
KEYCLOAK_BACKEND_CLIENT_ID=sgd-backend  
KEYCLOAK_BACKEND_CLIENT_SECRET=tu_backend_secret_aqui

# Admin Credentials (solo para desarrollo)
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=AdminSGD2024!

# Test Users (solo para desarrollo)
TEST_ADMIN_USER=admin.general
TEST_ADMIN_PASSWORD=AdminGeneral2024!
TEST_CLUB_USER=admin.club1  
TEST_CLUB_PASSWORD=AdminClub2024!
TEST_PROFESOR_USER=profesor.futbol
TEST_PROFESOR_PASSWORD=Profesor2024!
```

**¿Por qué este archivo?**
- **Centralización**: Todas las configuraciones en un lugar
- **Seguridad**: No hardcodear secrets en código
- **Documentación**: Referencia rápida para desarrolladores

### 9.3 Crear Checklist de Verificación
Crear archivo: `keycloak-checklist.md`

```markdown
# Checklist de Configuración Keycloak

## ✅ Configuración Base
- [ ] Realm "SGD" creado
- [ ] SSL configurado (producción)
- [ ] Tokens configurados (5min access, 30min idle, User Session Limit)
- [ ] Brute force protection habilitado
- [ ] Headers de seguridad configurados (incluyendo nuevos de v26)
- [ ] OAuth 2.0 PAR habilitado para frontend

## ✅ Clients
- [ ] sgd-backend: bearer-only, service accounts habilitado, Token Exchange habilitado
- [ ] sgd-panel-frontend: standard flow, client authentication, PAR habilitado
- [ ] Client secrets generados y guardados

## ✅ Roles  
- [ ] Realm roles: ADMIN_GENERAL, ADMIN_CLUB, PROFESOR
- [ ] Client roles: athletes:*, guardians:*, config:*
- [ ] Composite roles configurados correctamente

## ✅ Mappers
- [ ] club_id mapper (long) con lightweight access token
- [ ] venue_ids mapper (JSON) con lightweight access token
- [ ] sport_ids mapper (JSON) con lightweight access token
- [ ] full_name mapper (String) con lightweight access token
- [ ] phone mapper (String) con lightweight access token

## ✅ Usuarios de Prueba
- [ ] admin.general con ADMIN_GENERAL role
- [ ] admin.club1 con ADMIN_CLUB role
- [ ] profesor.futbol con PROFESOR role
- [ ] Todos los atributos personalizados asignados

## ✅ Testing
- [ ] Token request funciona para cada usuario
- [ ] Claims personalizados aparecen en tokens
- [ ] Composite roles funcionan correctamente
- [ ] CORS configurado para frontend
```

---

## 🚨 Problemas Comunes y Soluciones

### Error: "Invalid redirect URI"
**Causa**: URL en `Valid redirect URIs`