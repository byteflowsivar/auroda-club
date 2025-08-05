# Architecture Decision Log - Sistema de Gestión Deportiva

## ADR-001: Selección de Stack Tecnológico Principal
**Fecha**: 2025-08-04  
**Estado**: Aceptado  

### Contexto
Se requiere crear desde cero un Sistema de Gestión Deportiva para clubes deportivos y escuelas de formación, con necesidades específicas de SSO y escalabilidad futura.

### Decisión
Adoptar un stack personalizado compuesto por:
- **Frontend**: NextJS
- **Backend**: Quarkus (Java)  
- **Base de datos**: PostgreSQL
- **Autenticación**: Keycloak

### Razones
- **Control total**: Flexibilidad completa sobre lógica de negocio específica del dominio deportivo
- **SSO**: Preparación para Single Sign-On con futuras aplicaciones (app móvil Android)
- **Escalabilidad**: Arquitectura preparada para 400+ atletas y crecimiento futuro
- **Expertise**: El equipo tiene conocimiento en estas tecnologías
- **Presupuesto**: Stack optimizado para infraestructura de $25/mes

### Consecuencias
- **Positivas**: Control total del desarrollo, preparación para SSO, stack moderno
- **Negativas**: Desarrollo desde cero requiere más tiempo inicial
- **Mitigación**: Enfoque incremental por módulos, comenzando con registro de atletas

---

## ADR-011: Diseño de Base de Datos - Schema Principal
**Fecha**: 2025-08-04  
**Estado**: Aceptado  

### Contexto
Se requiere diseñar el esquema de base de datos que soporte las entidades principales del sistema de gestión deportiva, con enfoque en escalabilidad y integridad referencial.

### Decisión
Implementar el siguiente esquema en PostgreSQL:

```sql
-- Tabla principal de organizaciones/clubes
CREATE TABLE clubs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sedes de los clubes
CREATE TABLE venues (
    id BIGSERIAL PRIMARY KEY,
    club_id BIGINT NOT NULL REFERENCES clubs(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disciplinas deportivas
CREATE TABLE sports (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorías por disciplina y edad
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    sport_id BIGINT NOT NULL REFERENCES sports(id),
    name VARCHAR(255) NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_age_range CHECK (min_age <= max_age)
);

-- Tutores/Guardianes
CREATE TABLE guardians (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    secondary_phone VARCHAR(50),
    address TEXT,
    identification_number VARCHAR(50),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Atletas
CREATE TABLE athletes (
    id BIGSERIAL PRIMARY KEY,
    club_id BIGINT NOT NULL REFERENCES clubs(id),
    venue_id BIGINT NOT NULL REFERENCES venues(id),
    sport_id BIGINT NOT NULL REFERENCES sports(id),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    age INTEGER GENERATED ALWAYS AS (
        DATE_PART('year', AGE(CURRENT_DATE, birth_date))
    ) STORED,
    gender VARCHAR(10),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    identification_number VARCHAR(50),
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(50),
    medical_notes TEXT,
    registration_date DATE DEFAULT CURRENT_DATE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_birth_date CHECK (birth_date <= CURRENT_DATE)
);

-- Relación many-to-many entre atletas y tutores
CREATE TABLE athlete_guardians (
    id BIGSERIAL PRIMARY KEY,
    athlete_id BIGINT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    guardian_id BIGINT NOT NULL REFERENCES guardians(id),
    relationship VARCHAR(50) NOT NULL, -- padre, madre, tutor, etc.
    is_primary BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(athlete_id, guardian_id)
);

-- Índices para optimización
CREATE INDEX idx_athletes_club_venue ON athletes(club_id, venue_id);
CREATE INDEX idx_athletes_sport_category ON athletes(sport_id, category_id);
CREATE INDEX idx_athletes_active ON athletes(active) WHERE active = true;
CREATE INDEX idx_athletes_birth_date ON athletes(birth_date);
CREATE INDEX idx_venues_club ON venues(club_id);
CREATE INDEX idx_categories_sport ON categories(sport_id);
CREATE INDEX idx_athlete_guardians_athlete ON athlete_guardians(athlete_id);
CREATE INDEX idx_athlete_guardians_guardian ON athlete_guardians(guardian_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$ language 'plpgsql';

-- Aplicar trigger a todas las tablas principales
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sports_updated_at BEFORE UPDATE ON sports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guardians_updated_at BEFORE UPDATE ON guardians 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON athletes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Razones del Diseño

**Estructura Jerárquica**:
- `clubs` → `venues` → `athletes`: Jerarquía clara de organización
- `sports` → `categories`: Configurabilidad por disciplina y edad
- `guardians` ↔ `athletes`: Relación flexible many-to-many

**Campos Calculados**:
- `age` en athletes: Calculado automáticamente desde birth_date
- `updated_at`: Actualizado automáticamente con triggers

**Integridad**:
- Restricciones CHECK para validar rangos de edad
- Restricciones de fecha de nacimiento
- Claves foráneas con DELETE CASCADE donde apropiado

**Performance**:
- Índices compuestos para consultas frecuentes
- Índices parciales para registros activos
- Índices en claves foráneas

### Consecuencias
- **Positivas**: Schema normalizado, integridad referencial, performance optimizada
- **Negativas**: Complejidad en consultas que cruzan múltiples tablas
- **Mitigación**: Views para consultas complejas, DTOs con joins optimizados

### Casos de Uso Soportados
1. **Registro de atleta mayor**: Solo tabla athletes
2. **Registro de atleta menor**: athletes + athlete_guardians + guardians
3. **Búsqueda por sede/disciplina**: Índices optimizados
4. **Validación de categorías por edad**: Check constraints automáticos
5. **Gestión multi-sede**: Separación clara club/venue

---

## ADR-008: Estructura de Módulos en Quarkus
**Fecha**: 2025-08-04  
**Estado**: Aceptado  

### Contexto
Se requiere una organización modular clara que revele la intencionalidad del negocio y minimice la complejidad del desarrollo y mantenimiento.

### Decisión
Estructura de paquetes basada en dominios de negocio:

```
src/main/java/com/sgd/
├── shared/                    # Componentes transversales
│   ├── config/               # Configuraciones (Keycloak, DB)
│   ├── security/             # Autenticación y autorización
│   ├── exception/            # Manejo global de excepciones
│   └── util/                 # Utilidades comunes
├── athlete/                  # Dominio de atletas
│   ├── model/               # Entidades JPA
│   ├── dto/                 # Transfer Objects
│   ├── repository/          # Acceso a datos
│   ├── service/             # Lógica de negocio
│   └── resource/            # Controllers REST
├── club/                    # Dominio de clubes y sedes
│   ├── model/
│   ├── dto/
│   ├── repository/
│   ├── service/
│   └── resource/
├── sport/                   # Dominio deportivo (disciplinas/categorías)
│   ├── model/
│   ├── dto/
│   ├── repository/
│   ├── service/
│   └── resource/
└── guardian/                # Dominio de tutores
    ├── model/
    ├── dto/
    ├── repository/
    ├── service/
    └── resource/
```

### Razones
- **Intencionalidad**: Cada paquete refleja un dominio de negocio específico
- **Cohesión**: Funcionalidades relacionadas agrupadas
- **Bajo acoplamiento**: Dependencias claras entre módulos
- **Mantenibilidad**: Fácil localización y modificación de código
- **Escalabilidad**: Preparado para evolución a microservicios

### Consecuencias
- **Positivas**: Código organizado, fácil navegación, desarrollo en paralelo
- **Negativas**: Posible duplicación de DTOs entre módulos
- **Mitigación**: Shared DTOs para entidades comunes, interfaces claras

---

## ADR-009: Estrategia de Validaciones Duales
**Fecha**: 2025-08-04  
**Estado**: Aceptado  

### Contexto
Se requiere garantizar la calidad de datos capturados mientras se proporciona una experiencia de usuario fluida.

### Decisión
Implementar validaciones complementarias en cliente y servidor:

**Validaciones Cliente (NextJS)**:
- Validación en tiempo real de formato de campos
- Sugerencias automáticas (disciplinas, categorías)
- Cálculo automático de edad desde fecha de nacimiento
- Validación de rangos de edad para categorías
- Feedback visual inmediato

**Validaciones Servidor (Quarkus)**:
- Bean Validation (JSR-303) en DTOs
- Validaciones de negocio en services
- Verificación de integridad referencial
- Validación de permisos por rol
- Sanitización de datos de entrada

### Razones
- **UX**: Cliente mejora experiencia y reduce errores
- **Seguridad**: Servidor garantiza integridad y seguridad
- **Performance**: Cliente reduce roundtrips innecesarios
- **Robustez**: Doble capa de protección

### Consecuencias
- **Positivas**: Mejor UX, datos íntegros, sistema robusto
- **Negativas**: Duplicación de lógica de validación
- **Mitigación**: Compartir esquemas de validación, documentar reglas

---

## ADR-010: Context API para Manejo de Estado Frontend
**Fecha**: 2025-08-04  
**Estado**: Aceptado  

### Contexto
Se requiere gestionar estado global en NextJS para datos de usuario, sesión y formularios complejos.

### Decisión
Utilizar React Context API nativo con múltiples contextos especializados:

- **AuthContext**: Estado de autenticación (usuario, roles, tokens)
- **ClubContext**: Información del club activo y sedes
- **AthleteFormContext**: Estado de formularios de registro de atletas
- **NotificationContext**: Mensajes y alertas del sistema

### Razones
- **Simplicidad**: Nativo de React, sin dependencias adicionales
- **Flexibilidad**: Múltiples contextos especializados
- **Performance**: Control granular de re-renders
- **Mantenibilidad**: Menos abstracción, más directo
- **Bundle size**: Sin overhead de librerías externas

### Consecuencias
- **Positivas**: Simple, sin dependencias, control total
- **Negativas**: Más código boilerplate, gestión manual de optimizaciones
- **Mitigación**: Hooks personalizados, useCallback/useMemo para optimización

---

## ADR-002: Keycloak para Gestión de Autenticación
**Fecha**: 2025-08-04  
**Estado**: Aceptado  

### Contexto
Se requiere un sistema de autenticación robusto que soporte SSO y múltiples aplicaciones futuras (web + móvil Android).

### Decisión
Implementar Keycloak como servidor de identidad centralizado.

### Razones
- **SSO nativo**: Soporte completo para Single Sign-On
- **Estándares**: Compatible con OAuth 2.0, OpenID Connect, SAML
- **Roles granulares**: Manejo de Admin General, Admin Club, Profesor
- **Escalabilidad**: Preparado para múltiples aplicaciones
- **Open Source**: Sin costos de licenciamiento

### Consecuencias
- **Positivas**: SSO robusto, estándares de seguridad, roles flexibles
- **Negativas**: Curva de aprendizaje en configuraciones avanzadas
- **Mitigación**: Comenzar con configuración básica, documentar setup

---

## ADR-003: Quarkus como Framework Backend
**Fecha**: 2025-08-04  
**Estado**: Aceptado  

### Contexto
Se necesita un framework Java moderno que sea eficiente en recursos y compatible con contenedores.

### Decisión
Utilizar Quarkus como framework para la API monolítica.

### Razones
- **Performance**: Startup rápido y menor consumo de memoria
- **Cloud Native**: Optimizado para contenedores y Kubernetes
- **Developer Experience**: Hot reload, configuración declarativa
- **Integración**: Excelente soporte para PostgreSQL, Keycloak
- **Futuro**: Preparado para microservicios si se requiere

### Consecuencias
- **Positivas**: Alto rendimiento, desarrollo ágil, preparado para cloud
- **Negativas**: Framework relativamente nuevo, menos documentación que Spring Boot
- **Mitigación**: Aprovechar documentación oficial, comunidad activa

---

## ADR-004: Arquitectura Monolítica Modular
**Fecha**: 2025-08-04  
**Estado**: Aceptado  

### Contexto
Para el MVP con 400 atletas y funcionalidades básicas, se debe decidir entre monolito vs microservicios.

### Decisión
Implementar una arquitectura monolítica con separación modular clara.

### Razones
- **Simplicidad**: Menos complejidad operacional para el equipo actual
- **Recursos**: Optimización para DigitalOcean Droplet ($25/mes)
- **Desarrollo**: Más rápido para MVP y funcionalidades iniciales
- **Refactoring**: Preparado para división en microservicios futuros

### Módulos identificados:
- **Core**: Entidades base, configuración
- **Athletes**: Gestión de atletas y tutores
- **Auth**: Integración con Keycloak
- **Clubs**: Gestión de sedes y organizaciones
- **Payments**: Control de cuotas (futuro)

### Consecuencias
- **Positivas**: Desarrollo rápido, deployment simple, debugging fácil
- **Negativas**: Acoplamiento potencial, escalamiento conjunto
- **Mitigación**: Separación clara de módulos, interfaces bien definidas

---

## ADR-005: PostgreSQL como Base de Datos Principal
**Fecha**: 2025-08-04  
**Estado**: Aceptado  

### Contexto
Se requiere una base de datos relacional que maneje eficientemente las relaciones complejas entre atletas, tutores, sedes y disciplinas.

### Decisión
PostgreSQL como SGBD principal.

### Razones
- **Relaciones complejas**: Excelente para many-to-many (atleta-tutor)
- **JSON**: Soporte nativo para datos semi-estructurados si se requiere
- **Performance**: Optimizado para consultas complejas
- **Integración**: Soporte nativo en Quarkus
- **Costo**: Open source, incluido en droplet

### Consecuencias
- **Positivas**: Robustez, flexibilidad, performance
- **Negativas**: Requiere diseño cuidadoso del esquema
- **Mitigación**: Usar migraciones de Flyway, índices apropiados

---

## ADR-006: Roles y Permisos Iniciales
**Fecha**: 2025-08-04  
**Estado**: Aceptado  

### Contexto
Se requiere definir los roles básicos del sistema para la fase inicial.

### Decisión
Implementar tres roles principales en Keycloak:

1. **Admin General**: 
   - Acceso completo al sistema
   - Gestión de todas las sedes
   - Configuración de disciplinas y categorías

2. **Administrador del Club**:
   - Gestión de atletas de todas las sedes
   - Visualización de reportes generales
   - Gestión de profesores

3. **Profesor**:
   - Visualización de atletas asignados
   - Actualización de datos deportivos básicos

### Razones
- **Separación clara**: Cada rol tiene responsabilidades específicas
- **Escalabilidad**: Preparado para roles adicionales
- **Seguridad**: Principio de menor privilegio

### Consecuencias
- **Positivas**: Seguridad granular, separación de responsabilidades
- **Negativas**: Complejidad inicial en configuración de Keycloak
- **Mitigación**: Documentar configuración, comenzar con permisos básicos

---

## ADR-007: Configurabilidad de Disciplinas y Categorías
**Fecha**: 2025-08-04  
**Estado**: Aceptado  

### Contexto
El sistema debe adaptarse a diferentes deportes y regulaciones de categorías por edad.

### Decisión
Implementar disciplinas y categorías como entidades configurables con:
- **Disciplina**: Nombre, descripción, estado activo/inactivo
- **Categoría**: Nombre, disciplina asociada, rango de edad (min/max), estado activo/inactivo

### Razones
- **Flexibilidad**: Adaptable a cualquier deporte
- **Mantenibilidad**: Cambios sin código, solo configuración
- **Escalabilidad**: Soporte para múltiples deportes por club
- **Usabilidad**: Interface administrativa para gestión

### Consecuencias
- **Positivas**: Sistema adaptable, fácil mantenimiento
- **Negativas**: Mayor complejidad en validaciones
- **Mitigación**: Validaciones automáticas por rango de edad, UI intuitiva

---

## Decisiones Pendientes

### PEN-001: Estrategia de Deployment
- **Contexto**: Definir proceso de CI/CD para DigitalOcean
- **Opciones**: Docker Compose vs Kubernetes vs deployment directo
- **Timeline**: Antes del primer release

### PEN-002: Manejo de Archivos
- **Contexto**: Almacenamiento de fotos de atletas, documentos
- **Opciones**: Sistema de archivos local vs Object Storage
- **Timeline**: Fase 2 del proyecto

### PEN-003: Logging y Monitoreo
- **Contexto**: Observabilidad en producción
- **Opciones**: ELK Stack vs soluciones simples como Grafana
- **Timeline**: Antes de producción