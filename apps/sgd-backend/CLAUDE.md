# SGD Backend - Sistema de Gestión Deportiva
## Contexto Específico del Proyecto

### 📋 Información del Proyecto
- **Nombre**: Sistema de Gestión Deportiva (SGD)
- **Dominio**: Gestión de atletas, tutores, clubes y disciplinas deportivas
- **Framework**: Quarkus 3.x
- **Base de datos**: PostgreSQL
- **Autenticación**: Keycloak integration

### 🏗️ Arquitectura del Sistema
```
Frontend (NextJS) → Backend (Quarkus) → PostgreSQL
                  ↗ Keycloak ← Authentication
```

### 📊 Módulos del Sistema
```
src/main/java/com/sgd/
├── shared/                    # Componentes transversales
├── athlete/                   # Dominio de atletas
├── guardian/                  # Dominio de tutores  
├── club/                      # Dominio de clubes y sedes
└── sport/                     # Dominio deportivo
```

### 🎯 Casos de Uso Principales
1. **Registro de atletas mayores** (independientes)
2. **Registro de atletas menores** (con tutores obligatorios)
3. **Gestión de tutores** (pueden tener múltiples atletas)
4. **Administración de sedes y disciplinas**
5. **Consultas y reportes** según roles de usuario

### 👥 Roles y Permisos
- **ADMIN_GENERAL**: Acceso completo al sistema
- **ADMIN_CLUB**: Gestión de atletas y tutores de todas las sedes
- **PROFESOR**: Visualización de atletas asignados

### 🔐 Integración Keycloak
- **Realm**: SGD
- **Backend Client**: sgd-backend (bearer-only)
- **Custom Claims**: club_id, venue_ids, sport_ids, full_name, phone

### 🗄️ Entidades Principales
```sql
clubs (1) → venues (N) → athletes (N)
sports (1) → categories (N) → athletes (N)  
athletes (N) ↔ guardians (N) [many-to-many]
```

### 🎨 Patrones Requeridos
- **Validation**: Doble capa (cliente + servidor)
- **Security**: Role-based access control
- **Performance**: Paginación, índices optimizados
- **Auditoría**: created_at, updated_at automáticos

### 📡 APIs a Desarrollar

#### **Módulo Athletes**
```
GET    /api/athletes              # Listar atletas (con filtros)
POST   /api/athletes              # Crear atleta
GET    /api/athletes/{id}         # Obtener atleta específico  
PUT    /api/athletes/{id}         # Actualizar atleta
DELETE /api/athletes/{id}         # Soft delete atleta
GET    /api/athletes/{id}/guardians # Tutores del atleta
POST   /api/athletes/{id}/guardians # Asociar tutor
```

#### **Módulo Guardians**
```
GET    /api/guardians             # Listar tutores
POST   /api/guardians             # Crear tutor
GET    /api/guardians/{id}        # Obtener tutor específico
PUT    /api/guardians/{id}        # Actualizar tutor
GET    /api/guardians/{id}/athletes # Atletas del tutor
```

#### **Módulo Configuration**
```
GET    /api/sports                # Listar deportes
GET    /api/sports/{id}/categories # Categorías por deporte
GET    /api/venues               # Sedes del club
GET    /api/clubs                # Información de clubes
```

### 🔍 Validaciones de Negocio
- Atletas < 18 años **DEBEN** tener al menos un tutor activo
- Edad calculada automáticamente desde fecha_nacimiento
- Categoría debe ser compatible con edad del atleta
- Usuario solo puede ver datos de sus sedes asignadas (venue_ids)

### 📈 Consideraciones de Performance
- **Paginación**: Máximo 50 registros por página
- **Filtros**: Por sede, deporte, categoría, estado activo
- **Índices**: Optimizados para consultas frecuentes
- **Lazy Loading**: En relaciones JPA

### 🔒 Seguridad Específica
```java
// Ejemplo de autorización por endpoint
@RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB"})
@Path("/athletes")

// Filtros automáticos por sede del usuario
WHERE a.venue_id IN (:userVenueIds)
```

### 📋 Validaciones Requeridas
```java
// Atleta
- full_name: NotBlank, Size(2-255)
- birth_date: Past, NotNull  
- email: Email (opcional)
- venue_id: Must exist and user has access

// Guardian (cuando atleta < 18)
- full_name: NotBlank, Size(2-255)
- Al menos email O phone requerido
- relationship: NotBlank
```

### 🧪 Testing Requerido
- **Unit Tests**: Services y validaciones
- **Integration Tests**: Con TestContainers (PostgreSQL)
- **Security Tests**: Autorización por roles
- **Contract Tests**: Para frontend integration

### 📖 Documentación a Mantener
- **OpenAPI**: Spec completa con ejemplos
- **API Contracts**: Para equipo frontend
- **Database**: Queries complejas optimizadas
- **Deployment**: Configuraciones de entorno

### 🚀 Configuraciones de Entorno
```properties
# Keycloak
quarkus.oidc.auth-server-url=http://localhost:8080/realms/SGD
quarkus.oidc.client-id=sgd-backend

# Database  
quarkus.datasource.db-kind=postgresql
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/sgd_main

# CORS (para frontend)
quarkus.http.cors.origins=http://localhost:3000
```

### 📊 **ESTADO ACTUAL DEL DESARROLLO - 70% COMPLETADO**

#### ✅ **Módulo Athletes - COMPLETADO (100%)**
- ✅ **Resource**: AthleteResource.java - Todos los endpoints implementados
- ✅ **Service**: AthleteService.java - Lógica completa con validaciones 
- ✅ **DTOs**: 5 de 5 completados (Create, Update, Response, Filters, GuardianAssociation)
- ✅ **Entities**: Athlete y AthleteGuardian completados
- ✅ **Repository**: AthleteRepository y AthleteGuardianRepository implementados
- ✅ **Tests**: AthleteResourceTest y AthleteServiceTest existentes
- ✅ **Compilación**: Sin errores ✓
- ✅ **Pruebas API**: Endpoints funcionando correctamente ✓

#### ✅ **Módulo Guardians - COMPLETADO (100%)**
- ✅ **Resource**: GuardianResource.java - **IMPLEMENTADO** - Todos los endpoints
- ✅ **Service**: GuardianService.java - **IMPLEMENTADO** - Lógica completa con validaciones
- ✅ **DTOs**: 4 de 4 completados (CreateRequest, UpdateRequest, Response, Filters)
- ✅ **Mapper**: GuardianMapper.java - **IMPLEMENTADO** - Conversión entidades/DTOs
- ✅ **Entity**: Guardian.java - OK
- ✅ **Repository**: GuardianRepository.java - OK (con métodos adicionales)
- ✅ **Compilación**: Sin errores ✓
- ✅ **Pruebas API**: Endpoints funcionando con autenticación JWT ✓
- ✅ **Seguridad**: Control de acceso por roles implementado ✓

#### 🟡 **Módulo Club - 20% COMPLETADO**
- ❌ **PENDIENTE**: ClubResource.java - **FALTA IMPLEMENTAR**
- ❌ **PENDIENTE**: ClubService.java - **FALTA IMPLEMENTAR**
- ❌ **PENDIENTE**: DTOs (ClubResponse, VenueResponse) - **FALTA IMPLEMENTAR**
- ✅ **Entities**: Club.java y Venue.java - OK
- ✅ **Repositories**: ClubRepository y VenueRepository - OK

#### 🟡 **Módulo Sport - 20% COMPLETADO**
- ❌ **PENDIENTE**: SportResource.java - **FALTA IMPLEMENTAR**
- ❌ **PENDIENTE**: SportService.java - **FALTA IMPLEMENTAR**
- ❌ **PENDIENTE**: DTOs (SportResponse, CategoryResponse) - **FALTA IMPLEMENTAR**
- ✅ **Entities**: Sport.java y Category.java - OK
- ✅ **Repositories**: SportRepository y CategoryRepository - OK

### 🎯 Prioridades de Desarrollo ACTUALIZADAS
1. **✅ Fase 1**: Módulo athletes (CRUD básico) - **COMPLETADO**
2. **✅ Fase 2**: Integración Keycloak + autorización - **COMPLETADO**  
3. **✅ Fase 3**: Módulo guardians + relaciones - **COMPLETADO**
4. **🔄 Fase 4**: Configuraciones (sports, categories, venues) - **EN PROCESO**
5. **⏳ Fase 5**: Reportes y consultas avanzadas - **PENDIENTE**

### 🚧 **PRÓXIMAS TAREAS**

#### **ALTA PRIORIDAD (Configuration Module)**
1. **Implementar SportResource** - Endpoints para deportes y categorías
2. **Crear SportService** - Lógica de negocio para deportes
3. **Implementar ClubResource** - Endpoints para clubes y sedes
4. **Crear ClubService** - Lógica de negocio para clubes/sedes
5. **Definir DTOs de Configuration** (SportResponse, CategoryResponse, ClubResponse, VenueResponse)

#### **MEDIA PRIORIDAD**  
6. **Verificar migraciones de DB** existentes (V001, V002)
7. **Implementar tests para Configuration** módulos
8. **Optimización de consultas** y performance

#### **ENDPOINTS CRÍTICOS FALTANTES**
```java
// Configuration Module - ALTA PRIORIDAD
GET    /api/sports                 # Listar deportes
GET    /api/sports/{id}/categories # Categorías por deporte
GET    /api/venues                # Sedes del club  
GET    /api/clubs                 # Información de clubes
```

### ✅ **ENDPOINTS YA IMPLEMENTADOS Y FUNCIONANDO**
```java
// Athletes Module - COMPLETADO ✓
GET    /api/athletes              # Listar atletas (con filtros)
POST   /api/athletes              # Crear atleta
GET    /api/athletes/{id}         # Obtener atleta específico  
PUT    /api/athletes/{id}         # Actualizar atleta
DELETE /api/athletes/{id}         # Soft delete atleta
GET    /api/athletes/{id}/guardians # Tutores del atleta
POST   /api/athletes/{id}/guardians # Asociar tutor

// Guardians Module - COMPLETADO ✓
GET    /api/guardians             # Listar tutores
POST   /api/guardians             # Crear tutor
GET    /api/guardians/{id}        # Obtener tutor específico
PUT    /api/guardians/{id}        # Actualizar tutor
DELETE /api/guardians/{id}        # Soft delete tutor (ADMIN_GENERAL)
GET    /api/guardians/{id}/athletes # Atletas del tutor
```

### 📁 Documentación Relacionada
- `../../docs/project-context.md` - Contexto general
- `../../docs/architecture/architecture-log.md` - Decisiones arquitectónicas  
- `../../docs/architecture/database/schema.md` - Schema completo
- `../../docs/keycloak/keycloak-config.md` - Configuración de auth
- `../../docker-compose.yml` - Infraestructura local

### 🔄 Flujo de Trabajo
1. Leer documentación compartida antes de empezar
2. Implementar feature completa (entity → service → resource → test)
3. Actualizar `../../docs/architecture/api-contracts.md`
4. Validar integración con frontend team
5. Documentar decisiones técnicas relevantes

