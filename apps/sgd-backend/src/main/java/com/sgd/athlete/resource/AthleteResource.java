package com.sgd.athlete.resource;

import com.sgd.athlete.dto.*;
import com.sgd.athlete.service.AthleteService;
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
 * REST Resource for Athlete operations.
 * Implements all endpoints defined in the API contract.
 */
@Path("/athletes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Athletes", description = "Gestión de atletas deportivos")
@SecurityRequirement(name = "bearerAuth")
public class AthleteResource {

    @Inject
    AthleteService athleteService;

    /**
     * GET /api/athletes - List athletes with filters and pagination
     */
    @GET
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Listar atletas",
        description = "Obtiene una lista paginada de atletas con filtros opcionales. Los usuarios solo ven atletas de sus sedes asignadas."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de atletas recuperada exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = AthletePageResponse.class)
            )
        ),
        @APIResponse(responseCode = "400", description = "Parámetros de consulta inválidos"),
        @APIResponse(responseCode = "401", description = "Token de acceso inválido o expirado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para acceder a atletas de estas sedes"),
        @APIResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public Response getAthletes(@BeanParam @Valid AthleteFilters filters) {
        PageResponse<AthleteResponse> result = athleteService.getAthletes(filters);
        return Response.ok(result).build();
    }

    /**
     * POST /api/athletes - Create new athlete
     */
    @POST
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB"})
    @Operation(
        summary = "Crear nuevo atleta",
        description = "Crea un nuevo atleta con validaciones automáticas de edad, categoría y tutores obligatorios para menores."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "201",
            description = "Atleta creado exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = AthleteResponse.class)
            )
        ),
        @APIResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @APIResponse(responseCode = "401", description = "Token inválido"),
        @APIResponse(responseCode = "403", description = "Sin permisos para crear atletas en esta sede"),
        @APIResponse(responseCode = "409", description = "Conflicto - atleta ya existe o email duplicado")
    })
    public Response createAthlete(@Valid @NotNull AthleteCreateRequest request) {
        AthleteResponse created = athleteService.createAthlete(request);
        URI location = URI.create("/api/athletes/" + created.getId());
        return Response.created(location).entity(created).build();
    }

    /**
     * GET /api/athletes/{id} - Get specific athlete
     */
    @GET
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener atleta específico",
        description = "Obtiene los detalles completos de un atleta incluyendo información de tutores y relaciones."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Atleta encontrado",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = AthleteResponse.class)
            )
        ),
        @APIResponse(responseCode = "404", description = "Atleta no encontrado o sin acceso"),
        @APIResponse(responseCode = "403", description = "Sin permisos para ver este atleta")
    })
    public Response getAthleteById(
        @Parameter(description = "ID único del atleta", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id) {
        AthleteResponse athlete = athleteService.getAthleteById(id);
        return Response.ok(athlete).build();
    }

    /**
     * PUT /api/athletes/{id} - Update existing athlete
     */
    @PUT
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB"})
    @Operation(
        summary = "Actualizar atleta existente",
        description = "Actualiza los datos de un atleta existente. Nota: fecha de nacimiento y club no pueden cambiarse."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Atleta actualizado exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = AthleteResponse.class)
            )
        ),
        @APIResponse(responseCode = "400", description = "Datos inválidos"),
        @APIResponse(responseCode = "404", description = "Atleta no encontrado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para actualizar este atleta"),
        @APIResponse(responseCode = "409", description = "Conflicto con datos existentes")
    })
    public Response updateAthlete(
        @Parameter(description = "ID único del atleta", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id,
        @Valid @NotNull AthleteUpdateRequest request) {
        AthleteResponse updated = athleteService.updateAthlete(id, request);
        return Response.ok(updated).build();
    }

    /**
     * DELETE /api/athletes/{id} - Soft delete athlete
     */
    @DELETE
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL"})
    @Operation(
        summary = "Eliminar atleta (soft delete)",
        description = "Marca un atleta como inactivo preservando los datos históricos. Solo disponible para ADMIN_GENERAL."
    )
    @APIResponses({
        @APIResponse(responseCode = "204", description = "Atleta eliminado exitosamente"),
        @APIResponse(responseCode = "404", description = "Atleta no encontrado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para eliminar atletas"),
        @APIResponse(responseCode = "409", description = "No se puede eliminar - atleta tiene dependencias activas")
    })
    public Response deleteAthlete(
        @Parameter(description = "ID único del atleta", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id) {
        athleteService.deleteAthlete(id);
        return Response.noContent().build();
    }

    /**
     * GET /api/athletes/{id}/guardians - Get athlete's guardians
     */
    @GET
    @Path("/{id}/guardians")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener tutores del atleta",
        description = "Lista todos los tutores activos asociados al atleta con información de contacto y relación."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de tutores del atleta",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = AthleteResponse.GuardianInfo.class, type = SchemaType.ARRAY)
            )
        ),
        @APIResponse(responseCode = "404", description = "Atleta no encontrado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para ver tutores de este atleta")
    })
    public Response getAthleteGuardians(
        @Parameter(description = "ID único del atleta", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id) {
        List<AthleteResponse.GuardianInfo> guardians = athleteService.getAthleteGuardians(id);
        return Response.ok(guardians).build();
    }

    /**
     * POST /api/athletes/{id}/guardians - Associate guardian to athlete
     */
    @POST
    @Path("/{id}/guardians")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB"})
    @Operation(
        summary = "Asociar tutor al atleta",
        description = "Asocia un tutor existente al atleta especificando el tipo de parentesco. Solo un tutor puede ser primario."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "201",
            description = "Tutor asociado exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = GuardianAssociationResponse.class)
            )
        ),
        @APIResponse(responseCode = "400", description = "Datos inválidos o tutor ya asociado"),
        @APIResponse(responseCode = "404", description = "Atleta o tutor no encontrado"),
        @APIResponse(responseCode = "409", description = "Ya existe un tutor primario para este atleta")
    })
    public Response associateGuardian(
        @Parameter(description = "ID único del atleta", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long athleteId,
        @Valid @NotNull GuardianAssociationRequest request) {
        athleteService.associateGuardian(athleteId, request);
        
        // Create success response
        GuardianAssociationResponse response = new GuardianAssociationResponse(
            "Tutor asociado exitosamente",
            athleteId,
            request.getGuardianId(),
            request.getRelationship()
        );
        
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    // Helper classes for OpenAPI documentation

    /**
     * OpenAPI schema for paginated athlete response.
     */
    @Schema(name = "AthletePageResponse", description = "Respuesta paginada de atletas")
    public static class AthletePageResponse extends PageResponse<AthleteResponse> {
        // This class exists only for OpenAPI documentation
    }

    /**
     * Response DTO for successful guardian association.
     */
    @Schema(name = "GuardianAssociationResponse", description = "Respuesta de asociación de tutor")
    public static class GuardianAssociationResponse {
        @Schema(description = "Mensaje de confirmación")
        private String message;
        
        @Schema(description = "ID del atleta")
        private Long athleteId;
        
        @Schema(description = "ID del tutor")
        private Long guardianId;
        
        @Schema(description = "Tipo de parentesco")
        private String relationship;

        public GuardianAssociationResponse() {}

        public GuardianAssociationResponse(String message, Long athleteId, Long guardianId, String relationship) {
            this.message = message;
            this.athleteId = athleteId;
            this.guardianId = guardianId;
            this.relationship = relationship;
        }

        // Getters and setters
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Long getAthleteId() { return athleteId; }
        public void setAthleteId(Long athleteId) { this.athleteId = athleteId; }
        public Long getGuardianId() { return guardianId; }
        public void setGuardianId(Long guardianId) { this.guardianId = guardianId; }
        public String getRelationship() { return relationship; }
        public void setRelationship(String relationship) { this.relationship = relationship; }
    }
}