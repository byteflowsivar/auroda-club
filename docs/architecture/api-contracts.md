# Contratos de API - Sistema de Gestión Deportiva (SGD)

## Información General

**Versión de la API**: 1.0.0  
**Base URL**: `http://localhost:8080/api` (desarrollo)  
**Framework**: Quarkus 3.x  
**Autenticación**: JWT Bearer tokens via Keycloak  
**Base de datos**: PostgreSQL  
**Última actualización**: 2025-08-07

---

## Resumen Ejecutivo

El Sistema de Gestión Deportiva expone una API RESTful que permite gestionar atletas, tutores, clubes deportivos y configuraciones del sistema. La API implementa autorización basada en roles (RBAC) con tres niveles principales: ADMIN_GENERAL, ADMIN_CLUB y PROFESOR.

### Características Principales
- **Seguridad**: Integración completa con Keycloak para autenticación/autorización
- **Performance**: Paginación automática y filtros optimizados
- **Validación**: Doble capa de validación (cliente + servidor)
- **Auditoria**: Timestamps automáticos en todas las operaciones
- **Multi-tenancy**: Aislamiento por club y sede deportiva

---

## Arquitectura de la API

### Módulos Principales
1. **Athletes** (`/api/athletes`): Gestión de atletas deportivos
2. **Guardians** (`/api/guardians`): Gestión de tutores/guardianes
3. **Configuration** (`/api/sports`, `/api/venues`, `/api/clubs`): Configuraciones del sistema

### Autorización por Roles

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `ADMIN_GENERAL` | Administrador del sistema | Acceso completo a todos los endpoints |
| `ADMIN_CLUB` | Administrador de club | Gestión de atletas y tutores del club |
| `PROFESOR` | Profesor/Entrenador | Solo lectura de atletas asignados |

### Claims JWT Requeridos
```json
{
  "realm_access": {
    "roles": ["ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"]
  },
  "resource_access": {
    "sgd-backend": {
      "roles": ["athletes:read", "athletes:write", "guardians:read", ...]
    }
  },
  "club_id": 1,
  "venue_ids": [1, 2, 3],
  "sport_ids": [1, 2],
  "full_name": "Usuario Test",
  "phone": "+503 1234-5678"
}
```

---

## Esquemas y DTOs

### Athlete (Atleta)

#### AthleteResponse
```json
{
  "id": 123,
  "fullName": "Juan Carlos Pérez",
  "birthDate": "2010-03-15",
  "age": 13,
  "gender": "M",
  "email": "juan.perez@email.com",
  "phone": "+503 1234-5678",
  "address": "San Salvador, El Salvador",
  "identificationNumber": "12345678-9",
  "emergencyContact": "María Pérez",
  "emergencyPhone": "+503 9876-5432",
  "medicalNotes": "Alergia a mariscos",
  "registrationDate": "2024-01-15",
  "active": true,
  "club": {
    "id": 1,
    "name": "Club Deportivo San Salvador",
    "email": "info@cdss.com"
  },
  "venue": {
    "id": 2,
    "name": "Complejo Deportivo Central",
    "code": "CDC001",
    "address": "Av. Independencia, San Salvador"
  },
  "sport": {
    "id": 1,
    "name": "Fútbol",
    "description": "Fútbol asociación"
  },
  "category": {
    "id": 3,
    "name": "Juvenil",
    "minAge": 13,
    "maxAge": 15,
    "sport": "Fútbol"
  },
  "guardians": [
    {
      "id": 45,
      "fullName": "María Elena Pérez",
      "email": "maria.perez@email.com",
      "phone": "+503 9876-5432",
      "relationship": "madre",
      "isPrimary": true
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:25:00Z"
}
```

#### AthleteCreateRequest
```json
{
  "fullName": "Juan Carlos Pérez",
  "birthDate": "2010-03-15",
  "gender": "M",
  "email": "juan.perez@email.com",
  "phone": "+503 1234-5678",
  "address": "San Salvador, El Salvador",
  "identificationNumber": "12345678-9",
  "emergencyContact": "María Pérez",
  "emergencyPhone": "+503 9876-5432",
  "medicalNotes": "Alergia a mariscos",
  "venueId": 2,
  "sportId": 1,
  "categoryId": 3,
  "guardians": [
    {
      "guardianId": 45,
      "relationship": "madre",
      "isPrimary": true
    }
  ]
}
```

#### AthleteUpdateRequest
```json
{
  "fullName": "Juan Carlos Pérez López",
  "email": "juan.perez.nuevo@email.com",
  "phone": "+503 1234-9999",
  "address": "Nueva dirección, San Salvador",
  "emergencyContact": "María Elena Pérez",
  "emergencyPhone": "+503 9876-5432",
  "medicalNotes": "Alergia a mariscos y nueces",
  "venueId": 3,
  "categoryId": 4
}
```

### Guardian (Tutor/Guardián)

#### GuardianResponse
```json
{
  "id": 45,
  "fullName": "María Elena Pérez",
  "email": "maria.perez@email.com",
  "phone": "+503 9876-5432",
  "secondaryPhone": "+503 2222-3333",
  "address": "Colonia Escalón, San Salvador",
  "identificationNumber": "98765432-1",
  "active": true,
  "athletes": [
    {
      "id": 123,
      "fullName": "Juan Carlos Pérez",
      "age": 13,
      "sport": "Fútbol",
      "venue": "Complejo Deportivo Central",
      "relationship": "madre",
      "isPrimary": true
    }
  ],
  "createdAt": "2024-01-10T09:15:00Z",
  "updatedAt": "2024-01-20T11:30:00Z"
}
```

#### GuardianCreateRequest
```json
{
  "fullName": "María Elena Pérez",
  "email": "maria.perez@email.com",
  "phone": "+503 9876-5432",
  "secondaryPhone": "+503 2222-3333",
  "address": "Colonia Escalón, San Salvador",
  "identificationNumber": "98765432-1"
}
```

### Configuration Entities

#### ClubResponse
```json
{
  "id": 1,
  "name": "Club Deportivo San Salvador",
  "description": "Club deportivo con 25 años de experiencia",
  "email": "info@cdss.com",
  "phone": "+503 2222-1111",
  "address": "Centro Histórico, San Salvador",
  "active": true,
  "venues": [
    {
      "id": 2,
      "name": "Complejo Deportivo Central",
      "code": "CDC001",
      "active": true
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### SportResponse
```json
{
  "id": 1,
  "name": "Fútbol",
  "description": "Fútbol asociación masculino y femenino",
  "active": true,
  "categories": [
    {
      "id": 3,
      "name": "Juvenil",
      "minAge": 13,
      "maxAge": 15,
      "active": true
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Common DTOs

#### PageResponse
```json
{
  "content": [...],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "first": true,
    "last": false,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

#### ErrorResponse
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación en los datos enviados",
    "details": [
      {
        "field": "birthDate",
        "message": "La fecha de nacimiento no puede ser futura",
        "rejectedValue": "2030-01-01"
      }
    ],
    "timestamp": "2024-08-07T15:30:00Z",
    "path": "/api/athletes"
  }
}
```

---

## Especificación OpenAPI Completa

### Módulo Athletes

#### GET /api/athletes
**Descripción**: Listar atletas con filtros y paginación

**Autorización**: `athletes:read`  
**Roles permitidos**: `ADMIN_GENERAL`, `ADMIN_CLUB`, `PROFESOR`

**Parámetros de consulta**:
```yaml
parameters:
  - name: page
    in: query
    schema:
      type: integer
      default: 0
      minimum: 0
    description: Número de página (base 0)
  - name: size
    in: query
    schema:
      type: integer
      default: 20
      minimum: 1
      maximum: 50
    description: Elementos por página
  - name: venueId
    in: query
    schema:
      type: integer
    description: Filtrar por sede deportiva
  - name: sportId
    in: query
    schema:
      type: integer
    description: Filtrar por deporte
  - name: categoryId
    in: query
    schema:
      type: integer
    description: Filtrar por categoría
  - name: active
    in: query
    schema:
      type: boolean
      default: true
    description: Filtrar por estado activo
  - name: search
    in: query
    schema:
      type: string
      maxLength: 100
    description: Búsqueda por nombre (contiene)
  - name: ageMin
    in: query
    schema:
      type: integer
      minimum: 0
      maximum: 100
    description: Edad mínima
  - name: ageMax
    in: query
    schema:
      type: integer
      minimum: 0
      maximum: 100
    description: Edad máxima
  - name: sort
    in: query
    schema:
      type: string
      enum: [fullName, age, registrationDate, createdAt]
      default: fullName
    description: Campo para ordenamiento
  - name: direction
    in: query
    schema:
      type: string
      enum: [ASC, DESC]
      default: ASC
    description: Dirección del ordenamiento
```

**Respuestas**:
```yaml
responses:
  '200':
    description: Lista de atletas recuperada exitosamente
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/PageResponse'
        example:
          content:
            - id: 123
              fullName: "Juan Carlos Pérez"
              age: 13
              sport: 
                name: "Fútbol"
              venue:
                name: "Complejo Central"
              active: true
  '400':
    description: Parámetros de consulta inválidos
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
  '401':
    description: Token de acceso inválido o expirado
  '403':
    description: Sin permisos para acceder a atletas de estas sedes
  '500':
    description: Error interno del servidor
```

**Lógica de autorización**:
- **ADMIN_GENERAL**: Ve todos los atletas del sistema
- **ADMIN_CLUB**: Ve solo atletas de su club (filtro automático por `club_id`)
- **PROFESOR**: Ve solo atletas de sus sedes asignadas (filtro por `venue_ids` del token)

---

#### POST /api/athletes
**Descripción**: Crear nuevo atleta

**Autorización**: `athletes:write`  
**Roles permitidos**: `ADMIN_GENERAL`, `ADMIN_CLUB`

**Request Body**:
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/AthleteCreateRequest'
      example:
        fullName: "Ana María González"
        birthDate: "2008-07-22"
        gender: "F"
        email: "ana.gonzalez@email.com"
        phone: "+503 5555-6666"
        venueId: 2
        sportId: 1
        categoryId: 4
        guardians:
          - guardianId: 67
            relationship: "madre"
            isPrimary: true
```

**Respuestas**:
```yaml
responses:
  '201':
    description: Atleta creado exitosamente
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/AthleteResponse'
    headers:
      Location:
        schema:
          type: string
        description: URL del atleta creado
  '400':
    description: Datos de entrada inválidos
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
        example:
          error:
            code: "VALIDATION_ERROR"
            message: "Errores de validación"
            details:
              - field: "birthDate"
                message: "La fecha de nacimiento no puede ser futura"
              - field: "categoryId"
                message: "La categoría no corresponde con la edad del atleta"
  '401':
    description: Token inválido
  '403':
    description: Sin permisos para crear atletas en esta sede
  '409':
    description: Conflicto - atleta ya existe
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
        example:
          error:
            code: "DUPLICATE_ATHLETE"
            message: "Ya existe un atleta con este documento de identidad"
```

**Validaciones automáticas**:
- **Edad vs Categoría**: La edad calculada debe estar en el rango de la categoría
- **Tutores obligatorios**: Atletas < 18 años deben tener al menos un tutor
- **Sede válida**: La sede debe pertenecer al club del usuario
- **Deporte activo**: Solo deportes activos pueden ser asignados
- **Email único**: Si se proporciona email, debe ser único

---

#### GET /api/athletes/{id}
**Descripción**: Obtener atleta específico por ID

**Autorización**: `athletes:read`  
**Roles permitidos**: `ADMIN_GENERAL`, `ADMIN_CLUB`, `PROFESOR`

**Parámetros**:
```yaml
parameters:
  - name: id
    in: path
    required: true
    schema:
      type: integer
      format: int64
    description: ID único del atleta
```

**Respuestas**:
```yaml
responses:
  '200':
    description: Atleta encontrado
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/AthleteResponse'
  '404':
    description: Atleta no encontrado o sin acceso
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
        example:
          error:
            code: "ATHLETE_NOT_FOUND"
            message: "Atleta con ID 999 no encontrado"
  '403':
    description: Sin permisos para ver este atleta
```

---

#### PUT /api/athletes/{id}
**Descripción**: Actualizar atleta existente

**Autorización**: `athletes:write`  
**Roles permitidos**: `ADMIN_GENERAL`, `ADMIN_CLUB`

**Parámetros**:
```yaml
parameters:
  - name: id
    in: path
    required: true
    schema:
      type: integer
      format: int64
```

**Request Body**:
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/AthleteUpdateRequest'
```

**Respuestas**:
```yaml
responses:
  '200':
    description: Atleta actualizado exitosamente
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/AthleteResponse'
  '400':
    description: Datos inválidos
  '404':
    description: Atleta no encontrado
  '403':
    description: Sin permisos para actualizar este atleta
  '409':
    description: Conflicto con datos existentes
```

**Validaciones especiales**:
- **No se puede cambiar**: `birthDate`, `club_id` (calculados automáticamente)
- **Categoría válida**: Nueva categoría debe ser compatible con la edad
- **Tutores requeridos**: Si el atleta es menor y se intenta quitar todos los tutores

---

#### DELETE /api/athletes/{id}
**Descripción**: Soft delete de atleta (marca como inactivo)

**Autorización**: `athletes:delete`  
**Roles permitidos**: `ADMIN_GENERAL`

**Respuestas**:
```yaml
responses:
  '204':
    description: Atleta eliminado exitosamente (soft delete)
  '404':
    description: Atleta no encontrado
  '403':
    description: Sin permisos para eliminar atletas
  '409':
    description: No se puede eliminar - atleta tiene dependencias activas
```

---

#### GET /api/athletes/{id}/guardians
**Descripción**: Obtener tutores del atleta

**Autorización**: `athletes:read`, `guardians:read`  
**Roles permitidos**: `ADMIN_GENERAL`, `ADMIN_CLUB`, `PROFESOR`

**Respuestas**:
```yaml
responses:
  '200':
    description: Lista de tutores del atleta
    content:
      application/json:
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              fullName:
                type: string
              email:
                type: string
              phone:
                type: string
              relationship:
                type: string
              isPrimary:
                type: boolean
        example:
          - id: 45
            fullName: "María Elena Pérez"
            email: "maria.perez@email.com"
            phone: "+503 9876-5432"
            relationship: "madre"
            isPrimary: true
```

---

#### POST /api/athletes/{id}/guardians
**Descripción**: Asociar tutor existente al atleta

**Autorización**: `athletes:write`, `guardians:write`  
**Roles permitidos**: `ADMIN_GENERAL`, `ADMIN_CLUB`

**Request Body**:
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          guardianId:
            type: integer
            format: int64
          relationship:
            type: string
            maxLength: 50
          isPrimary:
            type: boolean
            default: false
        required:
          - guardianId
          - relationship
      example:
        guardianId: 78
        relationship: "padre"
        isPrimary: false
```

**Respuestas**:
```yaml
responses:
  '201':
    description: Tutor asociado exitosamente
    content:
      application/json:
        schema:
          type: object
          properties:
            message:
              type: string
            athleteId:
              type: integer
            guardianId:
              type: integer
            relationship:
              type: string
        example:
          message: "Tutor asociado exitosamente"
          athleteId: 123
          guardianId: 78
          relationship: "padre"
  '400':
    description: Datos inválidos o tutor ya asociado
  '404':
    description: Atleta o tutor no encontrado
  '409':
    description: Ya existe un tutor primario para este atleta
```

---

### Módulo Guardians

#### GET /api/guardians
**Descripción**: Listar tutores con paginación y filtros

**Autorización**: `guardians:read`  
**Roles permitidos**: `ADMIN_GENERAL`, `ADMIN_CLUB`

**Parámetros**:
```yaml
parameters:
  - name: page
    in: query
    schema:
      type: integer
      default: 0
  - name: size
    in: query
    schema:
      type: integer
      default: 20
      maximum: 50
  - name: search
    in: query
    schema:
      type: string
    description: Búsqueda por nombre o email
  - name: hasAthletes
    in: query
    schema:
      type: boolean
    description: Filtrar solo tutores con atletas asociados
  - name: active
    in: query
    schema:
      type: boolean
      default: true
```

**Respuestas**:
```yaml
responses:
  '200':
    description: Lista de tutores
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/PageResponse'
```

---

#### POST /api/guardians
**Descripción**: Crear nuevo tutor

**Autorización**: `guardians:write`  
**Roles permitidos**: `ADMIN_GENERAL`, `ADMIN_CLUB`

**Request Body**:
```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/GuardianCreateRequest'
```

**Validaciones específicas**:
- **Contacto requerido**: Al menos email O phone debe estar presente
- **Email único**: Si se proporciona email, debe ser único
- **Formato de teléfono**: Debe cumplir formato local

---

#### GET /api/guardians/{id}
**Descripción**: Obtener tutor específico con sus atletas

**Respuestas**:
```yaml
responses:
  '200':
    description: Tutor encontrado
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/GuardianResponse'
```

---

#### PUT /api/guardians/{id}
**Descripción**: Actualizar tutor existente

**Validaciones**:
- **No eliminar último contacto**: Debe mantener al menos email o phone

---

#### GET /api/guardians/{id}/athletes
**Descripción**: Obtener atletas bajo tutela

**Respuestas**:
```yaml
responses:
  '200':
    description: Lista de atletas del tutor
    content:
      application/json:
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              fullName:
                type: string
              age:
                type: integer
              sport:
                type: string
              venue:
                type: string
              relationship:
                type: string
              isPrimary:
                type: boolean
              active:
                type: boolean
```

---

### Módulo Configuration

#### GET /api/sports
**Descripción**: Listar deportes disponibles

**Autorización**: `config:read`  
**Roles permitidos**: `ADMIN_GENERAL`, `ADMIN_CLUB`, `PROFESOR`

**Parámetros**:
```yaml
parameters:
  - name: active
    in: query
    schema:
      type: boolean
      default: true
  - name: includeCategories
    in: query
    schema:
      type: boolean
      default: false
    description: Incluir categorías en la respuesta
```

**Respuestas**:
```yaml
responses:
  '200':
    description: Lista de deportes
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: '#/components/schemas/SportResponse'
```

---

#### GET /api/sports/{id}/categories
**Descripción**: Obtener categorías de un deporte específico

**Parámetros**:
```yaml
parameters:
  - name: id
    in: path
    required: true
    schema:
      type: integer
  - name: age
    in: query
    schema:
      type: integer
    description: Filtrar categorías válidas para esta edad
  - name: active
    in: query
    schema:
      type: boolean
      default: true
```

**Respuestas**:
```yaml
responses:
  '200':
    description: Categorías del deporte
    content:
      application/json:
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
              minAge:
                type: integer
              maxAge:
                type: integer
              active:
                type: boolean
        example:
          - id: 3
            name: "Juvenil"
            minAge: 13
            maxAge: 15
            active: true
          - id: 4
            name: "Cadete"
            minAge: 16
            maxAge: 18
            active: true
```

---

#### GET /api/venues
**Descripción**: Listar sedes deportivas accesibles

**Autorización**: `config:read`  
**Roles permitidos**: `ADMIN_GENERAL`, `ADMIN_CLUB`, `PROFESOR`

**Lógica de autorización**:
- **ADMIN_GENERAL**: Ve todas las sedes del sistema
- **ADMIN_CLUB**: Ve solo sedes de su club
- **PROFESOR**: Ve solo sedes asignadas en `venue_ids`

**Parámetros**:
```yaml
parameters:
  - name: clubId
    in: query
    schema:
      type: integer
    description: Filtrar por club (solo ADMIN_GENERAL)
  - name: active
    in: query
    schema:
      type: boolean
      default: true
```

**Respuestas**:
```yaml
responses:
  '200':
    description: Lista de sedes
    content:
      application/json:
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
              code:
                type: string
              address:
                type: string
              phone:
                type: string
              active:
                type: boolean
              club:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
        example:
          - id: 2
            name: "Complejo Deportivo Central"
            code: "CDC001"
            address: "Av. Independencia, San Salvador"
            phone: "+503 2222-3333"
            active: true
            club:
              id: 1
              name: "Club Deportivo San Salvador"
```

---

#### GET /api/clubs
**Descripción**: Obtener información de clubes

**Autorización**: `config:read`  
**Roles permitidos**: `ADMIN_GENERAL`, `ADMIN_CLUB`, `PROFESOR`

**Lógica de autorización**:
- **ADMIN_GENERAL**: Ve todos los clubes
- **ADMIN_CLUB/PROFESOR**: Ve solo su club (filtro por `club_id`)

**Respuestas**:
```yaml
responses:
  '200':
    description: Lista de clubes
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: '#/components/schemas/ClubResponse'
```

---

## Manejo de Errores

### Códigos de Error Estándar

| Código HTTP | Código Interno | Descripción | Cuándo Ocurre |
|-------------|----------------|-------------|---------------|
| 400 | `VALIDATION_ERROR` | Error de validación | Datos de entrada inválidos |
| 400 | `INVALID_FILTER` | Filtro inválido | Parámetros de consulta incorrectos |
| 401 | `INVALID_TOKEN` | Token inválido | JWT malformado o expirado |
| 403 | `ACCESS_DENIED` | Acceso denegado | Usuario sin permisos suficientes |
| 403 | `VENUE_ACCESS_DENIED` | Sin acceso a sede | Usuario intenta acceder a sede no asignada |
| 404 | `ATHLETE_NOT_FOUND` | Atleta no encontrado | ID no existe o sin acceso |
| 404 | `GUARDIAN_NOT_FOUND` | Tutor no encontrado | ID no existe o sin acceso |
| 409 | `DUPLICATE_ATHLETE` | Atleta duplicado | Documento de identidad ya existe |
| 409 | `DUPLICATE_EMAIL` | Email duplicado | Email ya está en uso |
| 409 | `CATEGORY_AGE_MISMATCH` | Categoría no válida para edad | Edad fuera del rango de la categoría |
| 409 | `MINOR_REQUIRES_GUARDIAN` | Menor requiere tutor | Atleta < 18 sin tutores |
| 422 | `BUSINESS_RULE_VIOLATION` | Regla de negocio violada | Lógica de negocio específica |
| 500 | `INTERNAL_ERROR` | Error interno | Error inesperado del servidor |
| 503 | `DATABASE_UNAVAILABLE` | Base de datos no disponible | Problemas de conectividad |

### Estructura de Error Detallada

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Se encontraron errores de validación en los datos enviados",
    "details": [
      {
        "field": "birthDate",
        "message": "La fecha de nacimiento no puede ser futura",
        "rejectedValue": "2030-01-01",
        "code": "FUTURE_DATE"
      },
      {
        "field": "email",
        "message": "El formato del email no es válido",
        "rejectedValue": "email-invalido",
        "code": "INVALID_EMAIL_FORMAT"
      }
    ],
    "timestamp": "2024-08-07T15:30:00Z",
    "path": "/api/athletes",
    "method": "POST",
    "correlationId": "abc123def456"
  }
}
```

---

## Paginación y Filtros

### Paginación Estándar

Todos los endpoints de listado implementan paginación:

**Parámetros**:
- `page`: Número de página (base 0, por defecto 0)
- `size`: Elementos por página (por defecto 20, máximo 50)

**Respuesta**:
```json
{
  "content": [...],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "first": true,
    "last": false,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Ordenamiento

**Parámetro `sort`**: Campo por el cual ordenar  
**Parámetro `direction`**: ASC o DESC

**Campos disponibles para ordenar**:
- **Athletes**: `fullName`, `age`, `registrationDate`, `createdAt`
- **Guardians**: `fullName`, `email`, `createdAt`

### Filtros Avanzados

#### Athletes
- **Por sede**: `venueId=2`
- **Por deporte**: `sportId=1`
- **Por categoría**: `categoryId=3`
- **Por edad**: `ageMin=10&ageMax=15`
- **Por estado**: `active=true`
- **Búsqueda texto**: `search=juan` (busca en nombre)

#### Guardians
- **Búsqueda**: `search=maria` (busca en nombre y email)
- **Con atletas**: `hasAthletes=true`
- **Por estado**: `active=true`

---

## Consideraciones de Seguridad

### Filtrado Automático por Autorización

La API implementa filtrado automático basado en los claims del JWT:

1. **Por Club**: Los usuarios ven solo datos de su club (`club_id` claim)
2. **Por Sedes**: Los profesores ven solo atletas de sus sedes (`venue_ids` claim)
3. **Por Deportes**: Filtrado opcional por deportes asignados (`sport_ids` claim)

### Validaciones de Seguridad

1. **Validación de venue_ids**: 
   - Verificar que el usuario tenga acceso a la sede antes de crear/actualizar atletas
   
2. **Validación de club_id**: 
   - Asegurar que las sedes pertenezcan al club del usuario
   
3. **Rate Limiting** (recomendado para producción):
   - 100 requests/minuto por usuario para endpoints de lectura
   - 20 requests/minuto para endpoints de escritura

### Headers de Seguridad

La API debe incluir los siguientes headers en las respuestas:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

---

## Ejemplos de Uso

### 1. Login y Obtener Token

```bash
curl -X POST \
  http://localhost:8080/realms/SGD/protocol/openid-connect/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=password' \
  -d 'client_id=sgd-frontend' \
  -d 'client_secret=CLIENT_SECRET' \
  -d 'username=admin.club1' \
  -d 'password=AdminClub2024!'
```

### 2. Listar Atletas de una Sede

```bash
curl -X GET \
  'http://localhost:8080/api/athletes?venueId=2&page=0&size=20' \
  -H 'Authorization: Bearer ACCESS_TOKEN'
```

### 3. Crear Nuevo Atleta

```bash
curl -X POST \
  http://localhost:8080/api/athletes \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer ACCESS_TOKEN' \
  -d '{
    "fullName": "Ana María González",
    "birthDate": "2008-07-22",
    "gender": "F",
    "email": "ana.gonzalez@email.com",
    "phone": "+503 5555-6666",
    "venueId": 2,
    "sportId": 1,
    "categoryId": 4,
    "guardians": [
      {
        "guardianId": 67,
        "relationship": "madre",
        "isPrimary": true
      }
    ]
  }'
```

### 4. Buscar Atletas por Nombre

```bash
curl -X GET \
  'http://localhost:8080/api/athletes?search=juan&sort=fullName&direction=ASC' \
  -H 'Authorization: Bearer ACCESS_TOKEN'
```

### 5. Obtener Tutores de un Atleta

```bash
curl -X GET \
  http://localhost:8080/api/athletes/123/guardians \
  -H 'Authorization: Bearer ACCESS_TOKEN'
```

### 6. Listar Categorías por Edad

```bash
curl -X GET \
  'http://localhost:8080/api/sports/1/categories?age=13' \
  -H 'Authorization: Bearer ACCESS_TOKEN'
```

---

## Testing y Validación

### Casos de Prueba Requeridos

#### 1. Autorización
- ✅ ADMIN_GENERAL puede acceder a todos los endpoints
- ✅ ADMIN_CLUB no puede ver atletas de otros clubes
- ✅ PROFESOR solo ve atletas de sus sedes asignadas
- ✅ Tokens expirados son rechazados
- ✅ Usuarios sin permisos reciben 403

#### 2. Validaciones de Negocio
- ✅ Atletas menores requieren al menos un tutor
- ✅ Categorías son validadas contra edad del atleta
- ✅ Emails son únicos cuando se proporcionan
- ✅ Sedes pertenecen al club del usuario

#### 3. Paginación y Filtros
- ✅ Paginación funciona correctamente
- ✅ Filtros combinados producen resultados esperados
- ✅ Ordenamiento funciona en todos los campos
- ✅ Búsqueda por texto es case-insensitive

#### 4. Performance
- ✅ Consultas con JOINS optimizados
- ✅ Índices funcionan correctamente
- ✅ Respuestas < 500ms para consultas típicas
- ✅ Paginación no causa N+1 queries

### Herramientas de Testing Recomendadas

1. **REST Assured** para integration tests
2. **TestContainers** para tests con PostgreSQL
3. **WireMock** para mockear Keycloak en tests
4. **JMeter** para tests de performance
5. **OpenAPI Generator** para validar contratos

---

## Changelog y Versionado

### Versión 1.0.0 (Inicial)
- ✅ Módulo Athletes completo
- ✅ Módulo Guardians completo  
- ✅ Módulo Configuration básico
- ✅ Integración Keycloak
- ✅ Autorización por roles
- ✅ Paginación y filtros

### Futuras Versiones

#### v1.1.0 (Planificado)
- 📋 Endpoints de reportes y estadísticas
- 📋 Bulk operations para atletas
- 📋 Exportación a Excel/PDF
- 📋 API versioning con headers

#### v1.2.0 (Planificado)
- 📋 WebSockets para notificaciones tiempo real
- 📋 API para aplicación móvil
- 📋 Gestión de archivos (fotos, documentos)

---

## Recursos Adicionales

### Documentación Relacionada
- `../database/schema.md` - Esquema completo de base de datos
- `../../keycloak/keycloak-config.md` - Configuración de autenticación
- `../architecture-log.md` - Decisiones arquitectónicas
- `/apps/sgd-backend/CLAUDE.md` - Contexto específico del proyecto

### URLs de Desarrollo
- **API Base**: `http://localhost:8080/api`
- **OpenAPI Spec**: `http://localhost:8080/q/openapi`
- **Swagger UI**: `http://localhost:8080/q/swagger-ui`
- **Health Check**: `http://localhost:8080/q/health`
- **Keycloak**: `http://localhost:8080/realms/SGD/.well-known/openid_configuration`

### Configuración Recomendada

#### application.properties (Desarrollo)
```properties
# Server
quarkus.http.port=8080
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:3000

# Database
quarkus.datasource.db-kind=postgresql
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/sgd_main
quarkus.datasource.username=sgd_user
quarkus.datasource.password=sgd_pass_2024!

# Keycloak
quarkus.oidc.auth-server-url=http://localhost:8080/realms/SGD
quarkus.oidc.client-id=sgd-backend
quarkus.oidc.credentials.secret=${KEYCLOAK_CLIENT_SECRET}

# OpenAPI
quarkus.swagger-ui.always-include=true
mp.openapi.extensions.smallrye.info.title=SGD Backend API
mp.openapi.extensions.smallrye.info.version=1.0.0

# Logging
quarkus.log.category."com.sgd".level=DEBUG
```

---

**Documento generado**: 2025-08-07  
**Autor**: Sistema de documentación automática  
**Revisión requerida**: Equipo de desarrollo frontend y backend