package com.sgd.shared.exception;

/**
 * Base exception for business rule violations.
 * Used when business logic validation fails.
 */
public class BusinessException extends RuntimeException {

    private final String errorCode;
    private final Object[] parameters;

    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.parameters = null;
    }

    public BusinessException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.parameters = null;
    }

    public BusinessException(String errorCode, String message, Object... parameters) {
        super(message);
        this.errorCode = errorCode;
        this.parameters = parameters;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public Object[] getParameters() {
        return parameters;
    }

    // Predefined business exceptions for common cases
    public static class AthleteNotFound extends BusinessException {
        public AthleteNotFound(Long athleteId) {
            super("ATHLETE_NOT_FOUND", "Atleta con ID " + athleteId + " no encontrado", athleteId);
        }
    }

    public static class GuardianNotFound extends BusinessException {
        public GuardianNotFound(Long guardianId) {
            super("GUARDIAN_NOT_FOUND", "Tutor con ID " + guardianId + " no encontrado", guardianId);
        }
    }

    public static class VenueNotFound extends BusinessException {
        public VenueNotFound(Long venueId) {
            super("VENUE_NOT_FOUND", "Sede con ID " + venueId + " no encontrada", venueId);
        }
    }

    public static class SportNotFound extends BusinessException {
        public SportNotFound(Long sportId) {
            super("SPORT_NOT_FOUND", "Deporte con ID " + sportId + " no encontrado", sportId);
        }
    }

    public static class CategoryNotFound extends BusinessException {
        public CategoryNotFound(Long categoryId) {
            super("CATEGORY_NOT_FOUND", "Categoría con ID " + categoryId + " no encontrada", categoryId);
        }
    }

    public static class DuplicateAthlete extends BusinessException {
        public DuplicateAthlete(String identificationNumber) {
            super("DUPLICATE_ATHLETE", 
                  "Ya existe un atleta con el documento de identidad: " + identificationNumber, 
                  identificationNumber);
        }
    }

    public static class DuplicateEmail extends BusinessException {
        public DuplicateEmail(String email) {
            super("DUPLICATE_EMAIL", "El email " + email + " ya está en uso", email);
        }
    }

    public static class CategoryAgeMismatch extends BusinessException {
        public CategoryAgeMismatch(int athleteAge, String categoryName, int minAge, int maxAge) {
            super("CATEGORY_AGE_MISMATCH", 
                  String.format("El atleta de %d años no puede estar en la categoría %s (rango: %d-%d años)", 
                               athleteAge, categoryName, minAge, maxAge),
                  athleteAge, categoryName, minAge, maxAge);
        }
    }

    public static class MinorRequiresGuardian extends BusinessException {
        public MinorRequiresGuardian(String athleteName, int age) {
            super("MINOR_REQUIRES_GUARDIAN", 
                  "El atleta " + athleteName + " (" + age + " años) requiere al menos un tutor activo",
                  athleteName, age);
        }
    }

    public static class VenueAccessDenied extends BusinessException {
        public VenueAccessDenied(Long venueId) {
            super("VENUE_ACCESS_DENIED", 
                  "Sin permisos para acceder a la sede con ID " + venueId, venueId);
        }
    }

    public static class ClubAccessDenied extends BusinessException {
        public ClubAccessDenied(Long clubId) {
            super("CLUB_ACCESS_DENIED", 
                  "Sin permisos para acceder al club con ID " + clubId, clubId);
        }
    }

    public static class PrimaryGuardianExists extends BusinessException {
        public PrimaryGuardianExists(String athleteName) {
            super("PRIMARY_GUARDIAN_EXISTS", 
                  "El atleta " + athleteName + " ya tiene un tutor primario asignado", athleteName);
        }
    }

    public static class GuardianAlreadyAssociated extends BusinessException {
        public GuardianAlreadyAssociated(String athleteName, String guardianName) {
            super("GUARDIAN_ALREADY_ASSOCIATED", 
                  "El tutor " + guardianName + " ya está asociado al atleta " + athleteName,
                  athleteName, guardianName);
        }
    }

    public static class CannotDeleteActiveEntity extends BusinessException {
        public CannotDeleteActiveEntity(String entityType, String entityName, String reason) {
            super("CANNOT_DELETE_ACTIVE_ENTITY", 
                  "No se puede eliminar " + entityType + " '" + entityName + "': " + reason,
                  entityType, entityName, reason);
        }
    }

    public static class InvalidCategoryForSport extends BusinessException {
        public InvalidCategoryForSport(String categoryName, String sportName) {
            super("INVALID_CATEGORY_FOR_SPORT", 
                  "La categoría " + categoryName + " no pertenece al deporte " + sportName,
                  categoryName, sportName);
        }
    }
}