package com.sgd.guardian.resource;

import com.sgd.guardian.dto.*;
import com.sgd.guardian.service.GuardianService;
import com.sgd.shared.dto.PageResponse;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.net.URI;
import java.util.List;

/**
 * REST Resource for Guardian operations.
 * Implements all endpoints defined in the API contract for guardian/tutor management.
 */
@Path("/guardians")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Guardians", description = "Gestión de tutores y guardianes")
@SecurityRequirement(name = "bearerAuth")
public class GuardianResource {

    @Inject
    GuardianService guardianService;

    /**
     * GET /api/guardians - List guardians with filters and pagination
     */
    @GET
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB"})
    @Operation(
        summary = "Listar tutores",
        description = "Obtiene una lista paginada de tutores con filtros opcionales. Incluye búsqueda por nombre y email."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de tutores recuperada exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = GuardianPageResponse.class)
            )
        ),
        @APIResponse(responseCode = "400", description = "Parámetros de consulta inválidos"),
        @APIResponse(responseCode = "401", description = "Token de acceso inválido o expirado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para acceder a tutores"),
        @APIResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public Response getGuardians(@BeanParam @Valid GuardianFilters filters) {
        PageResponse<GuardianResponse> result = guardianService.getGuardians(filters);
        return Response.ok(result).build();
    }

    /**
     * POST /api/guardians - Create new guardian
     */
    @POST
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB"})
    @Operation(
        summary = "Crear nuevo tutor",
        description = "Crea un nuevo tutor con validación de información de contacto obligatoria (email o teléfono)."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "201",
            description = "Tutor creado exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = GuardianResponse.class)
            )
        ),
        @APIResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @APIResponse(responseCode = "401", description = "Token inválido"),
        @APIResponse(responseCode = "403", description = "Sin permisos para crear tutores"),
        @APIResponse(responseCode = "409", description = "Conflicto - email o documento duplicado")
    })
    public Response createGuardian(@Valid @NotNull GuardianCreateRequest request) {
        GuardianResponse created = guardianService.createGuardian(request);
        URI location = URI.create("/api/guardians/" + created.getId());
        return Response.created(location).entity(created).build();
    }

    /**
     * GET /api/guardians/{id} - Get specific guardian with athletes
     */
    @GET
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener tutor específico",
        description = "Obtiene los detalles completos de un tutor incluyendo información de atletas asociados."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Tutor encontrado",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = GuardianResponse.class)
            )
        ),
        @APIResponse(responseCode = "404", description = "Tutor no encontrado o sin acceso"),
        @APIResponse(responseCode = "403", description = "Sin permisos para ver este tutor")
    })
    public Response getGuardianById(
        @Parameter(description = "ID único del tutor", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id) {
        GuardianResponse guardian = guardianService.getGuardianById(id);
        return Response.ok(guardian).build();
    }

    /**
     * PUT /api/guardians/{id} - Update existing guardian
     */
    @PUT
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB"})
    @Operation(
        summary = "Actualizar tutor existente",
        description = "Actualiza los datos de un tutor existente. Debe mantener al menos un método de contacto válido."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Tutor actualizado exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = GuardianResponse.class)
            )
        ),
        @APIResponse(responseCode = "400", description = "Datos inválidos"),
        @APIResponse(responseCode = "404", description = "Tutor no encontrado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para actualizar este tutor"),
        @APIResponse(responseCode = "409", description = "Conflicto con datos existentes")
    })
    public Response updateGuardian(
        @Parameter(description = "ID único del tutor", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id,
        @Valid @NotNull GuardianUpdateRequest request) {
        GuardianResponse updated = guardianService.updateGuardian(id, request);
        return Response.ok(updated).build();
    }

    /**
     * DELETE /api/guardians/{id} - Soft delete guardian
     */
    @DELETE
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL"})
    @Operation(
        summary = "Eliminar tutor (soft delete)",
        description = "Marca un tutor como inactivo preservando los datos históricos. Solo disponible para ADMIN_GENERAL."
    )
    @APIResponses({
        @APIResponse(responseCode = "204", description = "Tutor eliminado exitosamente"),
        @APIResponse(responseCode = "404", description = "Tutor no encontrado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para eliminar tutores"),
        @APIResponse(responseCode = "409", description = "No se puede eliminar - tutor tiene atletas asociados activos")
    })
    public Response deleteGuardian(
        @Parameter(description = "ID único del tutor", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id) {
        guardianService.deleteGuardian(id);
        return Response.noContent().build();
    }

    /**
     * GET /api/guardians/{id}/athletes - Get guardian's athletes
     */
    @GET
    @Path("/{id}/athletes")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener atletas del tutor",
        description = "Lista todos los atletas activos bajo la tutela de este guardian con información de relación."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de atletas del tutor",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = GuardianResponse.AthleteInfo.class, type = SchemaType.ARRAY)
            )
        ),
        @APIResponse(responseCode = "404", description = "Tutor no encontrado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para ver atletas de este tutor")
    })
    public Response getGuardianAthletes(
        @Parameter(description = "ID único del tutor", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id) {
        List<GuardianResponse.AthleteInfo> athletes = guardianService.getGuardianAthletes(id);
        return Response.ok(athletes).build();
    }

    // Helper classes for OpenAPI documentation

    /**
     * OpenAPI schema for paginated guardian response.
     */
    @Schema(name = "GuardianPageResponse", description = "Respuesta paginada de tutores")
    public static class GuardianPageResponse extends PageResponse<GuardianResponse> {
        // This class exists only for OpenAPI documentation
    }

    /**
     * Response DTO for successful guardian operations.
     */
    @Schema(name = "GuardianOperationResponse", description = "Respuesta de operación de tutor")
    public static class GuardianOperationResponse {
        @Schema(description = "Mensaje de confirmación")
        private String message;
        
        @Schema(description = "ID del tutor")
        private Long guardianId;
        
        @Schema(description = "Detalles adicionales")
        private String details;

        public GuardianOperationResponse() {}

        public GuardianOperationResponse(String message, Long guardianId) {
            this.message = message;
            this.guardianId = guardianId;
        }

        public GuardianOperationResponse(String message, Long guardianId, String details) {
            this.message = message;
            this.guardianId = guardianId;
            this.details = details;
        }

        // Getters and setters
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Long getGuardianId() { return guardianId; }
        public void setGuardianId(Long guardianId) { this.guardianId = guardianId; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
    }
}