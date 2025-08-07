package com.sgd.shared.exception;

import com.sgd.shared.dto.ErrorResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Global exception mapper to handle all exceptions and provide consistent error responses.
 * Maps different exception types to appropriate HTTP status codes and error structures.
 */
@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Exception> {

    private static final Logger LOG = Logger.getLogger(GlobalExceptionMapper.class);

    @Override
    public Response toResponse(Exception exception) {
        String correlationId = UUID.randomUUID().toString();
        
        // Log the exception with correlation ID
        LOG.error("Exception occurred [correlationId: " + correlationId + "]", exception);
        
        // Handle different exception types
        if (exception instanceof BusinessException) {
            return handleBusinessException((BusinessException) exception, correlationId);
        } else if (exception instanceof ConstraintViolationException) {
            return handleValidationException((ConstraintViolationException) exception, correlationId);
        } else if (exception instanceof org.hibernate.exception.ConstraintViolationException) {
            return handleDatabaseConstraintException((org.hibernate.exception.ConstraintViolationException) exception, correlationId);
        } else if (exception instanceof jakarta.ws.rs.BadRequestException) {
            return handleBadRequestException((jakarta.ws.rs.BadRequestException) exception, correlationId);
        } else if (exception instanceof jakarta.ws.rs.NotAuthorizedException) {
            return handleUnauthorizedException((jakarta.ws.rs.NotAuthorizedException) exception, correlationId);
        } else if (exception instanceof jakarta.ws.rs.ForbiddenException) {
            return handleForbiddenException((jakarta.ws.rs.ForbiddenException) exception, correlationId);
        } else if (exception instanceof jakarta.ws.rs.NotFoundException) {
            return handleNotFoundException((jakarta.ws.rs.NotFoundException) exception, correlationId);
        } else {
            return handleGeneralException(exception, correlationId);
        }
    }

    /**
     * Handle business logic exceptions.
     */
    private Response handleBusinessException(BusinessException ex, String correlationId) {
        Response.Status status = mapBusinessExceptionToStatus(ex.getErrorCode());
        
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setError(new ErrorResponse.ErrorDetail(
            ex.getErrorCode(),
            ex.getMessage(),
            null, // No field-level details for business exceptions
            null, // Path will be set by filter if available
            null, // Method will be set by filter if available
            correlationId
        ));
        
        return Response.status(status).entity(errorResponse).build();
    }

    /**
     * Handle Bean Validation exceptions.
     */
    private Response handleValidationException(ConstraintViolationException ex, String correlationId) {
        List<ErrorResponse.ValidationError> validationErrors = ex.getConstraintViolations().stream()
            .map(this::mapConstraintViolation)
            .collect(Collectors.toList());
        
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setError(new ErrorResponse.ErrorDetail(
            "VALIDATION_ERROR",
            "Se encontraron errores de validación en los datos enviados",
            validationErrors,
            null, // Path will be set by filter
            null, // Method will be set by filter
            correlationId
        ));
        
        return Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).build();
    }

    /**
     * Handle database constraint violations.
     */
    private Response handleDatabaseConstraintException(org.hibernate.exception.ConstraintViolationException ex, String correlationId) {
        String errorCode = "DATABASE_CONSTRAINT_VIOLATION";
        String message = "Violación de restricción de base de datos";
        
        // Try to provide more specific error messages for common constraints
        if (ex.getConstraintName() != null) {
            if (ex.getConstraintName().contains("email")) {
                errorCode = "DUPLICATE_EMAIL";
                message = "El email ya está en uso";
            } else if (ex.getConstraintName().contains("identification")) {
                errorCode = "DUPLICATE_IDENTIFICATION";
                message = "El número de identificación ya está en uso";
            } else if (ex.getConstraintName().contains("unique")) {
                errorCode = "DUPLICATE_VALUE";
                message = "Ya existe un registro con estos datos";
            }
        }
        
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setError(new ErrorResponse.ErrorDetail(
            errorCode,
            message,
            null,
            null,
            null,
            correlationId
        ));
        
        return Response.status(Response.Status.CONFLICT).entity(errorResponse).build();
    }

    /**
     * Handle bad request exceptions.
     */
    private Response handleBadRequestException(jakarta.ws.rs.BadRequestException ex, String correlationId) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setError(new ErrorResponse.ErrorDetail(
            "BAD_REQUEST",
            "Solicitud inválida: " + ex.getMessage(),
            null,
            null,
            null,
            correlationId
        ));
        
        return Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).build();
    }

    /**
     * Handle unauthorized exceptions.
     */
    private Response handleUnauthorizedException(jakarta.ws.rs.NotAuthorizedException ex, String correlationId) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setError(new ErrorResponse.ErrorDetail(
            "INVALID_TOKEN",
            "Token de acceso inválido o expirado",
            null,
            null,
            null,
            correlationId
        ));
        
        return Response.status(Response.Status.UNAUTHORIZED).entity(errorResponse).build();
    }

    /**
     * Handle forbidden exceptions.
     */
    private Response handleForbiddenException(jakarta.ws.rs.ForbiddenException ex, String correlationId) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setError(new ErrorResponse.ErrorDetail(
            "ACCESS_DENIED",
            "Acceso denegado: permisos insuficientes",
            null,
            null,
            null,
            correlationId
        ));
        
        return Response.status(Response.Status.FORBIDDEN).entity(errorResponse).build();
    }

    /**
     * Handle not found exceptions.
     */
    private Response handleNotFoundException(jakarta.ws.rs.NotFoundException ex, String correlationId) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setError(new ErrorResponse.ErrorDetail(
            "RESOURCE_NOT_FOUND",
            "Recurso no encontrado",
            null,
            null,
            null,
            correlationId
        ));
        
        return Response.status(Response.Status.NOT_FOUND).entity(errorResponse).build();
    }

    /**
     * Handle all other exceptions.
     */
    private Response handleGeneralException(Exception ex, String correlationId) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setError(new ErrorResponse.ErrorDetail(
            "INTERNAL_ERROR",
            "Error interno del servidor",
            null,
            null,
            null,
            correlationId
        ));
        
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).build();
    }

    /**
     * Map constraint violation to validation error.
     */
    private ErrorResponse.ValidationError mapConstraintViolation(ConstraintViolation<?> violation) {
        String field = violation.getPropertyPath().toString();
        String message = violation.getMessage();
        Object invalidValue = violation.getInvalidValue();
        
        return new ErrorResponse.ValidationError(field, message, invalidValue, null);
    }

    /**
     * Map business exception error codes to HTTP status codes.
     */
    private Response.Status mapBusinessExceptionToStatus(String errorCode) {
        return switch (errorCode) {
            case "ATHLETE_NOT_FOUND", "GUARDIAN_NOT_FOUND", "VENUE_NOT_FOUND", 
                 "SPORT_NOT_FOUND", "CATEGORY_NOT_FOUND" -> Response.Status.NOT_FOUND;
            
            case "DUPLICATE_ATHLETE", "DUPLICATE_EMAIL", "CATEGORY_AGE_MISMATCH", 
                 "PRIMARY_GUARDIAN_EXISTS", "GUARDIAN_ALREADY_ASSOCIATED", 
                 "CANNOT_DELETE_ACTIVE_ENTITY" -> Response.Status.CONFLICT;
            
            case "VENUE_ACCESS_DENIED", "CLUB_ACCESS_DENIED", "ACCESS_DENIED" -> Response.Status.FORBIDDEN;
            
            case "MINOR_REQUIRES_GUARDIAN", "INVALID_CATEGORY_FOR_SPORT", 
                 "VENUE_CLUB_MISMATCH", "MULTIPLE_PRIMARY_GUARDIANS" -> Response.Status.BAD_REQUEST;
            
            default -> Response.Status.BAD_REQUEST;
        };
    }
}