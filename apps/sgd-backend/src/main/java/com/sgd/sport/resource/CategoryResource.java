package com.sgd.sport.resource;

import com.sgd.sport.dto.CategoryResponse;
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
 * REST Resource for Category operations.
 * Implements endpoints for category configuration data.
 */
@Path("/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Categories", description = "Gestión de categorías deportivas")
@SecurityRequirement(name = "bearerAuth")
public class CategoryResource {

    @Inject
    SportService sportService;

    /**
     * GET /api/categories - Get categories with optional filters
     */
    @GET
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener categorías",
        description = "Lista categorías activas con filtros opcionales por deporte y/o edad."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de categorías recuperada exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = CategoryResponse.class, type = SchemaType.ARRAY)
            )
        ),
        @APIResponse(responseCode = "400", description = "Parámetros de consulta inválidos"),
        @APIResponse(responseCode = "401", description = "Token de acceso inválido o expirado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para acceder a categorías")
    })
    public Response getCategories(
        @Parameter(description = "ID del deporte para filtrar", schema = @Schema(type = SchemaType.INTEGER))
        @QueryParam("sportId") @Positive Long sportId,
        @Parameter(description = "Edad para filtrar categorías válidas", schema = @Schema(type = SchemaType.INTEGER, minimum = "0", maximum = "100"))
        @QueryParam("age") @Min(0) @Max(100) Integer age) {
        
        List<CategoryResponse> categories = sportService.getCategoriesForSelection(sportId, age);
        return Response.ok(categories).build();
    }

    /**
     * GET /api/categories/{id} - Get specific category
     */
    @GET
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener categoría específica",
        description = "Obtiene los detalles completos de una categoría incluyendo información del deporte."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Categoría encontrada",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = CategoryResponse.class)
            )
        ),
        @APIResponse(responseCode = "404", description = "Categoría no encontrada"),
        @APIResponse(responseCode = "403", description = "Sin permisos para ver esta categoría")
    })
    public Response getCategoryById(
        @Parameter(description = "ID único de la categoría", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id) {
        CategoryResponse category = sportService.getCategoryById(id);
        return Response.ok(category).build();
    }

    /**
     * GET /api/categories/by-age/{age} - Get categories valid for specific age
     */
    @GET
    @Path("/by-age/{age}")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener categorías por edad",
        description = "Lista todas las categorías válidas para una edad específica en todos los deportes."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de categorías válidas para la edad",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = CategoryResponse.class, type = SchemaType.ARRAY)
            )
        ),
        @APIResponse(responseCode = "400", description = "Edad inválida"),
        @APIResponse(responseCode = "401", description = "Token de acceso inválido"),
        @APIResponse(responseCode = "403", description = "Sin permisos para acceder a categorías")
    })
    public Response getCategoriesByAge(
        @Parameter(description = "Edad del atleta", required = true, schema = @Schema(type = SchemaType.INTEGER, minimum = "0", maximum = "100"))
        @PathParam("age") @Min(0) @Max(100) Integer age) {
        
        List<CategoryResponse> categories = sportService.getCategoriesByAge(age);
        return Response.ok(categories).build();
    }
}