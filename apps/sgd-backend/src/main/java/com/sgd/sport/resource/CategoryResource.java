package com.sgd.sport.resource;

import com.sgd.sport.dto.CategoryCreateRequest;
import com.sgd.sport.dto.CategoryResponse;
import com.sgd.sport.dto.CategoryUpdateRequest;
import com.sgd.sport.service.SportService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
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

    // ===== CREATE, UPDATE, DELETE OPERATIONS =====

    /**
     * POST /api/categories - Create new category
     */
    @POST
    @RolesAllowed({"ADMIN_GENERAL"})
    @Operation(
        summary = "Crear nueva categoría",
        description = "Crea una nueva categoría deportiva. Solo disponible para ADMIN_GENERAL."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "201",
            description = "Categoría creada exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = CategoryResponse.class)
            )
        ),
        @APIResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @APIResponse(responseCode = "401", description = "Token de acceso inválido o expirado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para crear categorías"),
        @APIResponse(responseCode = "404", description = "Deporte no encontrado"),
        @APIResponse(responseCode = "409", description = "Rango de edad se superpone con categoría existente"),
        @APIResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public Response createCategory(@Valid CategoryCreateRequest request) {
        try {
            CategoryResponse category = sportService.createCategory(request);
            return Response.status(Response.Status.CREATED).entity(category).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * PUT /api/categories/{id} - Update existing category
     */
    @PUT
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL"})
    @Operation(
        summary = "Actualizar categoría existente",
        description = "Actualiza los datos de una categoría existente. Solo disponible para ADMIN_GENERAL."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Categoría actualizada exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = CategoryResponse.class)
            )
        ),
        @APIResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @APIResponse(responseCode = "401", description = "Token de acceso inválido o expirado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para actualizar categorías"),
        @APIResponse(responseCode = "404", description = "Categoría o deporte no encontrado"),
        @APIResponse(responseCode = "409", description = "Rango de edad se superpone con categoría existente"),
        @APIResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public Response updateCategory(
        @Parameter(description = "ID único de la categoría", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id,
        @Valid CategoryUpdateRequest request) {
        try {
            CategoryResponse category = sportService.updateCategory(id, request);
            return Response.ok(category).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * DELETE /api/categories/{id} - Delete category (soft delete)
     */
    @DELETE
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL"})
    @Operation(
        summary = "Eliminar categoría",
        description = "Elimina una categoría del sistema (soft delete). Solo disponible para ADMIN_GENERAL."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "204",
            description = "Categoría eliminada exitosamente"
        ),
        @APIResponse(responseCode = "400", description = "No se puede eliminar la categoría (tiene atletas asociados)"),
        @APIResponse(responseCode = "401", description = "Token de acceso inválido o expirado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para eliminar categorías"),
        @APIResponse(responseCode = "404", description = "Categoría no encontrada"),
        @APIResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public Response deleteCategory(
        @Parameter(description = "ID único de la categoría", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id) {
        try {
            sportService.deleteCategory(id);
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}