package com.sgd.sport.resource;

import com.sgd.sport.dto.CategoryResponse;
import com.sgd.sport.dto.SportResponse;
import com.sgd.sport.service.SportService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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

import java.util.List;

/**
 * REST Resource for Sport and Category operations.
 * Implements endpoints for sports configuration data.
 */
@Path("/sports")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Sports", description = "Gestión de deportes y categorías")
@SecurityRequirement(name = "bearerAuth")
public class SportResource {

    @Inject
    SportService sportService;

    /**
     * GET /api/sports - Get all sports
     */
    @GET
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener deportes",
        description = "Lista todos los deportes activos con sus categorías. Los usuarios ven deportes según sus asignaciones."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de deportes recuperada exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = SportResponse.class, type = SchemaType.ARRAY)
            )
        ),
        @APIResponse(responseCode = "401", description = "Token de acceso inválido o expirado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para acceder a deportes"),
        @APIResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public Response getSports(
        @Parameter(description = "Incluir categorías en la respuesta", schema = @Schema(type = SchemaType.BOOLEAN))
        @QueryParam("includeCategories") @DefaultValue("true") Boolean includeCategories) {
        
        List<SportResponse> sports;
        if (includeCategories) {
            sports = sportService.getSportsWithCategories();
        } else {
            sports = sportService.getSportsForSelection();
        }
        
        return Response.ok(sports).build();
    }

    /**
     * GET /api/sports/{id} - Get specific sport with categories
     */
    @GET
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener deporte específico",
        description = "Obtiene los detalles completos de un deporte incluyendo todas sus categorías activas."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Deporte encontrado",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = SportResponse.class)
            )
        ),
        @APIResponse(responseCode = "404", description = "Deporte no encontrado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para ver este deporte")
    })
    public Response getSportById(
        @Parameter(description = "ID único del deporte", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id) {
        SportResponse sport = sportService.getSportById(id);
        return Response.ok(sport).build();
    }

    /**
     * GET /api/sports/{id}/categories - Get categories of specific sport
     */
    @GET
    @Path("/{id}/categories")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener categorías del deporte",
        description = "Lista todas las categorías activas del deporte. Opcionalmente filtradas por edad específica."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de categorías del deporte",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = CategoryResponse.class, type = SchemaType.ARRAY)
            )
        ),
        @APIResponse(responseCode = "404", description = "Deporte no encontrado"),
        @APIResponse(responseCode = "400", description = "Edad inválida")
    })
    public Response getSportCategories(
        @Parameter(description = "ID único del deporte", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long sportId,
        @Parameter(description = "Edad para filtrar categorías válidas", schema = @Schema(type = SchemaType.INTEGER, minimum = "0", maximum = "100"))
        @QueryParam("age") @Min(0) @Max(100) Integer age) {
        
        List<CategoryResponse> categories = sportService.getCategoriesBySportId(sportId, age);
        return Response.ok(categories).build();
    }
}