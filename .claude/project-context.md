# Contexto del Proyecto: Sistema de Gestión Deportiva

## Información General
- **Dominio**: Gestión integral de atletas para clubes deportivos y escuelas de formación
- **Stage**: Diseño inicial (migración desde Appwrite)
- **Timeline**: Sin timeline definido
- **Presupuesto**: $25 USD/mes (DigitalOcean Droplet)

## Stakeholders
- **Usuarios objetivo**: Clubes deportivos con múltiples sedes y escuelas de formación deportiva
- **Volumen esperado**: ~400 atletas (infantiles, juveniles y adultos)
- **Expansión futura**: App móvil Android para tutores y atletas

## Requerimientos Técnicos
- **Funcionalidades core (Fase 1)**: Registro y gestión de atletas con relación tutor-menor
- **Funcionalidades futuras**: Control de pagos de cuotas, gestión de sedes
- **Integraciones**: SSO con aplicaciones futuras vía Keycloak
- **Datos de atletas**: Nombre, fecha nacimiento, edad, disciplina, categoría
- **Datos de tutores**: Nombre completo, parentesco, datos de contacto
- **Reglas de negocio**: 
  - Menores de 18 años requieren uno o varios tutores
  - Un tutor puede estar asociado a múltiples atletas
  - Soporte para múltiples sedes por club
  - Cada atleta debe estar asociado a una sede específica
  - Categorías configurables por disciplina y edad para adaptarse a diferentes deportes
- **Roles de usuario**: Admin General, Administrador del Club, Profesor
- **Permisos**: Administradores pueden ver todas las sedes

## Decisiones Arquitectónicas
- **Stack**: NextJS (Frontend) + Quarkus (API Monolítica) + PostgreSQL + Keycloak (Auth)
- **Patrones**: Monolito modular con separación clara de responsabilidades
- **Infraestructura**: DigitalOcean Droplet
- **Estado**: Transición desde Appwrite a nueva arquitectura

## Restricciones
- **Presupuesto**: Máximo $25/mes en infraestructura (DigitalOcean)
- **Experiencia técnica**: Equipo con conocimiento básico en Quarkus/Keycloak, requiere apoyo en configuraciones avanzadas
- **Compliance**: Sin regulaciones específicas identificadas para manejo de datos de menores

## Módulo Prioritario: Registro de Atletas
- **Entidades principales**:
  - Atleta (nombre, fecha_nacimiento, edad, disciplina, categoría, sede_id)
  - Tutor (nombre_completo, parentesco, teléfono, email)
  - Sede (nombre, dirección, código)
  - Disciplina (nombre, descripción, activa)
  - Categoría (nombre, disciplina_id, edad_min, edad_max, activa)
  - Relación Atleta-Tutor (many-to-many)
- **Casos de uso**:
  - Registrar atleta mayor de edad (independiente)
  - Registrar atleta menor de edad con tutores
  - Asociar/desasociar tutores a atletas
  - Consultar atletas por sede/disciplina/categoría
  - Gestionar sedes del club
  - Configurar disciplinas y categorías por deporte
  - Asignar atletas a profesores por disciplina

## Métricas Objetivo
- **Performance**: Tiempo de respuesta < 1s para consultas básicas
- **Disponibilidad**: 99% uptime
- **Escalabilidad**: Soporte hasta 1K atletas sin refactoring mayor
- **Usabilidad**: Interfaz intuitiva para personal administrativo de clubes