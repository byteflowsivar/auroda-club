/**
 * Tipos TypeScript para la API backend SGD (Sistema de Gestión Deportiva)
 * 🎯 CORREGIDO según OpenAPI spec: http://localhost:8080/api/q/openapi?format=json
 * 
 * Este archivo refleja EXACTAMENTE los schemas definidos en el backend Quarkus
 * 
 * @version 2.0.0 - Corregido según especificación real
 * @author Claude Code Assistant
 */

// ============================================================================
// BASE TYPES (según OpenAPI)
// ============================================================================

/**
 * Representa una fecha en formato ISO (YYYY-MM-DD)
 * @example "2022-03-10"
 */
export type LocalDate = string;

/**
 * Representa una fecha y hora en formato ISO (YYYY-MM-DDTHH:mm:ss)
 * @example "2022-03-10T12:15:50"
 */
export type LocalDateTime = string;

// ============================================================================
// PAGINATION (según OpenAPI)
// ============================================================================

/**
 * Información de paginación - Schema: PaginationInfo
 */
export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================================================
// CORE INFO TYPES (según OpenAPI - exactos)
// ============================================================================

/**
 * Schema: ClubInfo
 */
export interface ClubInfo {
  id: number;
  name: string;
  email: string;
}

/**
 * Schema: ClubInfo1 (versión extendida)
 */
export interface ClubInfo1 {
  id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}

/**
 * Schema: VenueInfo
 */
export interface VenueInfo {
  id: number;
  name: string;
  code: string;
  address: string;
}

/**
 * Schema: VenueInfo1 (versión extendida)
 */
export interface VenueInfo1 {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  active: boolean;
}

/**
 * Schema: SportInfo
 */
export interface SportInfo {
  id: number;
  name: string;
  description: string;
}

/**
 * Schema: SportInfo1 (versión extendida)
 */
export interface SportInfo1 {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

/**
 * Schema: CategoryInfo
 * ⚠️ IMPORTANTE: sport es string, no objeto
 */
export interface CategoryInfo {
  id: number;
  name: string;
  minAge: number;  // ✅ Corregido: era ageMin
  maxAge: number;  // ✅ Corregido: era ageMax
  sport: string;   // ✅ Corregido: era SportInfo
}

/**
 * Schema: CategoryInfo1 (versión extendida)
 */
export interface CategoryInfo1 {
  id: number;
  name: string;
  minAge: number;
  maxAge: number;
  ageRange: string;
  active: boolean;
}

/**
 * Schema: GuardianInfo
 */
export interface GuardianInfo {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  relationship: string;
  isPrimary: boolean;
}

/**
 * Schema: AthleteInfo
 * ⚠️ IMPORTANTE: sport y venue son strings, no objetos
 * ✅ Incluye relationship e isPrimary
 */
export interface AthleteInfo {
  id: number;
  fullName: string;
  age: number;
  sport: string;        // ✅ Corregido: era SportInfo
  venue: string;        // ✅ Corregido: era VenueInfo
  relationship: string; // ✅ Agregado: faltaba
  isPrimary: boolean;   // ✅ Agregado: faltaba
  active: boolean;
}

// ============================================================================
// ATHLETE TYPES (según OpenAPI exacto)
// ============================================================================

/**
 * Schema: AthleteResponse
 */
export interface AthleteResponse {
  id: number;
  fullName: string;
  birthDate: LocalDate;
  age: number;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  identificationNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
  registrationDate: LocalDate;
  active: boolean;
  club: ClubInfo;           // ✅ Usa ClubInfo básico
  venue: VenueInfo;         // ✅ Usa VenueInfo básico  
  sport: SportInfo;         // ✅ Usa SportInfo básico
  category: CategoryInfo;   // ✅ Usa CategoryInfo básico
  guardians: GuardianInfo[];
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

/**
 * Schema: AthleteCreateRequest
 */
export interface AthleteCreateRequest {
  /** required, minLength: 2, maxLength: 255, pattern: \S */
  fullName: string;
  /** required */
  birthDate: LocalDate;
  /** maxLength: 10 */
  gender?: string;
  /** maxLength: 255 */
  email?: string;
  /** maxLength: 50, pattern: ^\\+503\\s[0-9]{4}-[0-9]{4}$|^$ */
  phone?: string;
  /** maxLength: 1000 */
  address?: string;
  /** maxLength: 50 */
  identificationNumber?: string;
  /** maxLength: 255 */
  emergencyContact?: string;
  /** maxLength: 50, pattern: ^\\+503\\s[0-9]{4}-[0-9]{4}$|^$ */
  emergencyPhone?: string;
  /** maxLength: 2000 */
  medicalNotes?: string;
  /** required, exclusiveMinimum: 0 */
  venueId: number;
  /** required, exclusiveMinimum: 0 */
  sportId: number;
  /** required, exclusiveMinimum: 0 */
  categoryId: number;
  guardians?: GuardianAssociation[];
}

/**
 * Schema: AthleteUpdateRequest
 */
export interface AthleteUpdateRequest {
  /** required, minLength: 2, maxLength: 255, pattern: \S */
  fullName: string;
  /** maxLength: 255 */
  email?: string;
  /** maxLength: 50, pattern: ^\\+503\\s[0-9]{4}-[0-9]{4}$|^$ */
  phone?: string;
  /** maxLength: 1000 */
  address?: string;
  /** maxLength: 255 */
  emergencyContact?: string;
  /** maxLength: 50, pattern: ^\\+503\\s[0-9]{4}-[0-9]{4}$|^$ */
  emergencyPhone?: string;
  /** maxLength: 2000 */
  medicalNotes?: string;
  /** exclusiveMinimum: 0 */
  venueId?: number;
  /** exclusiveMinimum: 0 */
  categoryId?: number;
}

/**
 * Schema: AthletePageResponse
 */
export interface AthletePageResponse {
  content: AthleteResponse[];
  pagination: PaginationInfo;
}

// ============================================================================
// GUARDIAN TYPES (según OpenAPI exacto)
// ============================================================================

/**
 * Schema: GuardianResponse
 */
export interface GuardianResponse {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  secondaryPhone?: string;
  address?: string;
  identificationNumber?: string;
  active: boolean;
  athletes: AthleteInfo[];
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

/**
 * Schema: GuardianCreateRequest
 */
export interface GuardianCreateRequest {
  /** required, minLength: 2, maxLength: 255, pattern: \S */
  fullName: string;
  /** maxLength: 255 */
  email?: string;
  /** maxLength: 50 */
  phone?: string;
  /** maxLength: 50 */
  secondaryPhone?: string;
  /** maxLength: 1000 */
  address?: string;
  /** maxLength: 50 */
  identificationNumber?: string;
}

/**
 * Schema: GuardianUpdateRequest
 */
export interface GuardianUpdateRequest {
  /** minLength: 2, maxLength: 255, pattern: \S */
  fullName?: string;
  /** maxLength: 255 */
  email?: string;
  /** maxLength: 50 */
  phone?: string;
  /** maxLength: 50 */
  secondaryPhone?: string;
  /** maxLength: 1000 */
  address?: string;
  /** maxLength: 50 */
  identificationNumber?: string;
}

/**
 * Schema: GuardianPageResponse
 */
export interface GuardianPageResponse {
  content: GuardianResponse[];
  pagination: PaginationInfo;
}

/**
 * Schema: GuardianOperationResponse
 */
export interface GuardianOperationResponse {
  message: string;
  guardianId: number;
  details: string;
}

// ============================================================================
// GUARDIAN ASSOCIATION TYPES (según OpenAPI exacto)
// ============================================================================

/**
 * Schema: GuardianAssociation
 */
export interface GuardianAssociation {
  /** required, exclusiveMinimum: 0 */
  guardianId: number;
  /** required, minLength: 2, maxLength: 50 */
  relationship: string;
  isPrimary?: boolean;
}

/**
 * Schema: GuardianAssociationRequest
 */
export interface GuardianAssociationRequest {
  /** required, exclusiveMinimum: 0 */
  guardianId: number;
  /** required, minLength: 2, maxLength: 50 */
  relationship: string;
  isPrimary?: boolean;
}

/**
 * Schema: GuardianAssociationResponse
 */
export interface GuardianAssociationResponse {
  message: string;
  athleteId: number;
  guardianId: number;
  relationship: string;
}

// ============================================================================
// SPORT TYPES (según OpenAPI exacto)
// ============================================================================

/**
 * Schema: SportCreateRequest
 */
export interface SportCreateRequest {
  /** required, minLength: 2, maxLength: 255, pattern: \S */
  name: string;
  /** maxLength: 1000 */
  description?: string;
}

/**
 * Schema: SportUpdateRequest
 */
export interface SportUpdateRequest {
  /** required, minLength: 2, maxLength: 255, pattern: \S */
  name: string;
  /** maxLength: 1000 */
  description?: string;
}

/**
 * Schema: SportResponse
 */
export interface SportResponse {
  id: number;
  name: string;
  description: string;
  active: boolean;
  categories: CategoryInfo1[];  // ✅ Usa CategoryInfo1 extendido
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

// ============================================================================
// CATEGORY TYPES (según OpenAPI exacto)
// ============================================================================

/**
 * Schema: CategoryCreateRequest
 */
export interface CategoryCreateRequest {
  /** required, exclusiveMinimum: 0 */
  sportId: number;
  /** required, minLength: 2, maxLength: 255, pattern: \S */
  name: string;
  /** required, minimum: 0, maximum: 100 */
  minAge: number;
  /** required, minimum: 0, maximum: 100 */
  maxAge: number;
  ageRangeValid?: boolean;
  ageRange?: string;
}

/**
 * Schema: CategoryUpdateRequest
 */
export interface CategoryUpdateRequest {
  /** required, exclusiveMinimum: 0 */
  sportId: number;
  /** required, minLength: 2, maxLength: 255, pattern: \S */
  name: string;
  /** required, minimum: 0, maximum: 100 */
  minAge: number;
  /** required, minimum: 0, maximum: 100 */
  maxAge: number;
  ageRangeValid?: boolean;
  ageRange?: string;
}

/**
 * Schema: CategoryResponse
 * ✅ Incluye ageRange
 */
export interface CategoryResponse {
  id: number;
  name: string;
  minAge: number;     // ✅ Corregido: era ageMin
  maxAge: number;     // ✅ Corregido: era ageMax
  ageRange: string;   // ✅ Agregado: faltaba
  active: boolean;
  sport: SportInfo1;  // ✅ Usa SportInfo1 extendido
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

// ============================================================================
// DASHBOARD TYPES (según OpenAPI exacto)
// ============================================================================

/**
 * Schema: CountByName
 * Utilizado para datos de gráficos
 */
export interface CountByName {
  name: string;
  value: number;
}

/**
 * Schema: DashboardSummaryResponse
 */
export interface DashboardSummaryResponse {
  totalActiveAthletes: number;
  newAthletesLast30Days: number;
  totalActiveVenues: number;
  totalActiveSports: number;
  athletesBySport: CountByName[];
  athletesByVenue: CountByName[];
  athletesWithoutGuardian: number;
}

// ============================================================================
// CLUB TYPES (según OpenAPI exacto)
// ============================================================================

/**
 * Schema: ClubResponse
 */
export interface ClubResponse {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  venues: VenueInfo1[];  // ✅ Usa VenueInfo1 extendido
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

// ============================================================================
// VENUE TYPES (según OpenAPI exacto)
// ============================================================================

/**
 * Schema: VenueCreateRequest
 */
export interface VenueCreateRequest {
  clubId: number;
  name: string;
  code: string;
  address?: string;
  phone?: string;
}

/**
 * Schema: VenueUpdateRequest
 */
export interface VenueUpdateRequest {
  name: string;
  address?: string;
  phone?: string;
  active?: boolean;
}

/**
 * Schema: VenueResponse
 */
export interface VenueResponse {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  active: boolean;
  club: ClubInfo1;      // ✅ Usa ClubInfo1 extendido
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

// ============================================================================
// UTILITY TYPES & CONSTANTS
// ============================================================================

/**
 * Patrón para validación de teléfonos salvadoreños (según OpenAPI)
 */
export const PHONE_PATTERN = /^\+503\s[0-9]{4}-[0-9]{4}$/;

/**
 * Mensaje de formato para teléfonos
 */
export const PHONE_FORMAT_MESSAGE = "Formato: +503 1234-5678";

/**
 * Edad mínima para registro de atletas
 */
export const MIN_ATHLETE_AGE = 5;

/**
 * Edad máxima para registro de atletas
 */
export const MAX_ATHLETE_AGE = 50;

/**
 * Límite de edad para considerar menor de edad
 */
export const MINOR_AGE_LIMIT = 18;

// ============================================================================
// SEARCH PARAMS (inferidos desde endpoints)
// ============================================================================

/**
 * Parámetros de búsqueda para atletas
 */
export interface AthleteListParams {
  page?: number;
  size?: number;
  search?: string;
  sportId?: number;
  venueId?: number;
  categoryId?: number;
  ageMin?: number;
  ageMax?: number;
  active?: boolean;
  sort?: string;
  direction?: "ASC" | "DESC";
  /** Index signature para compatibilidad con parámetros dinámicos */
  [key: string]: unknown;
}

/**
 * Parámetros de búsqueda para tutores
 */
export interface GuardianListParams {
  page?: number;
  size?: number;
  search?: string;
  active?: boolean;
  hasAthletes?: boolean;
  sort?: "fullName" | "email" | "createdAt";
  direction?: "ASC" | "DESC";
}

/**
 * Parámetros para listar deportes
 */
export interface SportListParams {
  includeCategories?: boolean;
}

/**
 * Parámetros para listar categorías
 */
export interface CategoryListParams {
  sportId?: number;
  age?: number;
}

// ============================================================================
// ERROR TYPES (básicos)
// ============================================================================

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path: string;
  details?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  rejectedValue?: unknown;
}

export interface ValidationErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  path: string;
  errors: ValidationError[];
}

// ============================================================================
// LEGACY TYPES (para compatibilidad durante migración)
// ============================================================================

/**
 * @deprecated Use AthleteListParams
 */
export type AthleteSearchParams = AthleteListParams;

/**
 * @deprecated Use GuardianListParams  
 */
export type GuardianSearchParams = GuardianListParams;

/**
 * Tipo para direcciones de ordenamiento
 */
export type SortDirection = "ASC" | "DESC";

/**
 * Tipos de relación tutor-atleta
 */
export type RelationshipType = "Padre" | "Madre" | "Tutor" | "Abuelo" | "Abuela" | "Tío" | "Tía" | "Otro";

/**
 * Roles de usuario
 */
export type UserRole = "ADMIN_GENERAL" | "ADMIN_CLUB" | "PROFESOR";

/**
 * Géneros
 */
export type Gender = "M" | "F";

/**
 * Estados
 */
export type AthleteStatus = "ACTIVE" | "INACTIVE";