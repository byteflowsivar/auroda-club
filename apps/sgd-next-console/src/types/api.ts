// Tipos base para fechas
export type LocalDate = string; // "2022-03-10"
export type LocalDateTime = string; // "2022-03-10T12:15:50"

// =============================================================================
// PAGINATION
// =============================================================================

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

// =============================================================================
// CORE INFO TYPES (nested objects)
// =============================================================================

export interface ClubInfo {
  id: number;
  name: string;
  email: string;
}

export interface ClubInfo1 {
  id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface VenueInfo {
  id: number;
  name: string;
  code: string;
  address: string;
}

export interface VenueInfo1 {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  active: boolean;
}

export interface SportInfo {
  id: number;
  name: string;
  description: string;
}

export interface SportInfo1 {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface CategoryInfo {
  id: number;
  name: string;
  minAge: number;
  maxAge: number;
  sport: string;
}

export interface CategoryInfo1 {
  id: number;
  name: string;
  minAge: number;
  maxAge: number;
  ageRange: string;
  active: boolean;
}

export interface GuardianInfo {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface AthleteInfo {
  id: number;
  fullName: string;
  age: number;
  sport: string;
  venue: string;
  relationship: string;
  isPrimary: boolean;
  active: boolean;
}

// =============================================================================
// ATHLETE TYPES
// =============================================================================

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
  club: ClubInfo;
  venue: VenueInfo;
  sport: SportInfo;
  category: CategoryInfo;
  guardians: GuardianInfo[];
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

export interface AthleteCreateRequest {
  fullName: string; // required, minLength: 2, maxLength: 255
  birthDate: LocalDate; // required
  gender?: string; // maxLength: 10
  email?: string; // maxLength: 255
  phone?: string; // maxLength: 50, pattern: "^\\+503\\s[0-9]{4}-[0-9]{4}$|^$"
  address?: string; // maxLength: 1000
  identificationNumber?: string; // maxLength: 50
  emergencyContact?: string; // maxLength: 255
  emergencyPhone?: string; // maxLength: 50, pattern: "^\\+503\\s[0-9]{4}-[0-9]{4}$|^$"
  medicalNotes?: string; // maxLength: 2000
  venueId: number; // required, exclusiveMinimum: 0
  sportId: number; // required, exclusiveMinimum: 0
  categoryId: number; // required, exclusiveMinimum: 0
  guardians?: GuardianAssociation[];
}

export interface AthleteUpdateRequest {
  fullName: string; // required, minLength: 2, maxLength: 255
  email?: string; // maxLength: 255
  phone?: string; // maxLength: 50, pattern: "^\\+503\\s[0-9]{4}-[0-9]{4}$|^$"
  address?: string; // maxLength: 1000
  emergencyContact?: string; // maxLength: 255
  emergencyPhone?: string; // maxLength: 50, pattern: "^\\+503\\s[0-9]{4}-[0-9]{4}$|^$"
  medicalNotes?: string; // maxLength: 2000
  venueId?: number; // exclusiveMinimum: 0
  categoryId?: number; // exclusiveMinimum: 0
}

export interface AthletePageResponse {
  content: AthleteResponse[];
  pagination: PaginationInfo;
}

// =============================================================================
// GUARDIAN TYPES
// =============================================================================

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

export interface GuardianCreateRequest {
  fullName: string; // required, minLength: 2, maxLength: 255
  email?: string; // maxLength: 255
  phone?: string; // maxLength: 50
  secondaryPhone?: string; // maxLength: 50
  address?: string; // maxLength: 1000
  identificationNumber?: string; // maxLength: 50
}

export interface GuardianUpdateRequest {
  fullName?: string; // minLength: 2, maxLength: 255
  email?: string; // maxLength: 255
  phone?: string; // maxLength: 50
  secondaryPhone?: string; // maxLength: 50
  address?: string; // maxLength: 1000
  identificationNumber?: string; // maxLength: 50
}

export interface GuardianPageResponse {
  content: GuardianResponse[];
  pagination: PaginationInfo;
}

export interface GuardianOperationResponse {
  message: string;
  guardianId: number;
  details: string;
}

// =============================================================================
// GUARDIAN ASSOCIATION TYPES
// =============================================================================

export interface GuardianAssociation {
  guardianId: number; // required, exclusiveMinimum: 0
  relationship: string; // required, minLength: 2, maxLength: 50
  isPrimary?: boolean;
}

export interface GuardianAssociationRequest {
  guardianId: number; // required, exclusiveMinimum: 0
  relationship: string; // required, minLength: 2, maxLength: 50
  isPrimary?: boolean;
}

export interface GuardianAssociationResponse {
  message: string;
  athleteId: number;
  guardianId: number;
  relationship: string;
}

// =============================================================================
// SPORT TYPES
// =============================================================================

export interface SportResponse {
  id: number;
  name: string;
  description: string;
  active: boolean;
  categories: CategoryInfo1[];
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

// =============================================================================
// CATEGORY TYPES
// =============================================================================

export interface CategoryResponse {
  id: number;
  name: string;
  minAge: number;
  maxAge: number;
  ageRange: string;
  active: boolean;
  sport: SportInfo1;
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

// =============================================================================
// CLUB TYPES
// =============================================================================

export interface ClubResponse {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  venues: VenueInfo1[];
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

// =============================================================================
// VENUE TYPES
// =============================================================================

export interface VenueResponse {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  active: boolean;
  club: ClubInfo1;
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

// =============================================================================
// API QUERY PARAMETERS
// =============================================================================

export interface AthleteListParams {
  page?: number; // default: 0, min: 0
  size?: number; // default: 20, min: 1, max: 50
  search?: string; // maxLength: 100
  sportId?: number; // min: 1
  venueId?: number; // min: 1
  categoryId?: number; // min: 1
  ageMin?: number; // min: 0, max: 100
  ageMax?: number; // min: 0, max: 100
  active?: boolean; // default: true
  sort?: string; // default: "fullName"
  direction?: "ASC" | "DESC"; // default: "ASC"
}

export interface GuardianListParams {
  page?: number; // default: 0, min: 0
  size?: number; // default: 20, min: 1, max: 50
  search?: string;
  active?: boolean; // default: true
  hasAthletes?: boolean;
  sort?: "fullName" | "email" | "createdAt"; // default: "fullName"
  direction?: "ASC" | "DESC"; // default: "ASC"
}

export interface SportListParams {
  includeCategories?: boolean; // default: true
}

export interface CategoryListParams {
  sportId?: number; // exclusiveMinimum: 0
  age?: number; // min: 0, max: 100
}

// =============================================================================
// API ERROR TYPES
// =============================================================================

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

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type SortDirection = "ASC" | "DESC";

export type UserRole = "ADMIN_GENERAL" | "ADMIN_CLUB" | "PROFESOR";

export type AthleteStatus = "ACTIVE" | "INACTIVE";

export type RelationshipType = "Padre" | "Madre" | "Tutor" | "Abuelo" | "Abuela" | "Tío" | "Tía" | "Otro";

// Constantes para validación de teléfonos salvadoreños
export const PHONE_PATTERN = /^\+503\s[0-9]{4}-[0-9]{4}$/;
export const PHONE_FORMAT_MESSAGE = "Formato: +503 1234-5678";

// Edad mínima/máxima para atletas
export const MIN_ATHLETE_AGE = 5;
export const MAX_ATHLETE_AGE = 50;
export const MINOR_AGE_LIMIT = 18;