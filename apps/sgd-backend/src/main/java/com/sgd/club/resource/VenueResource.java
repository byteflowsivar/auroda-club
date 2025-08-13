package com.sgd.club.resource;

import com.sgd.club.dto.VenueResponse;
import com.sgd.club.service.ClubService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
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
 * REST Resource for Venue operations.
 * Implements endpoints for venue configuration data with proper security filtering.
 */
@Path("/venues")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Venues", description = "Gestión de sedes deportivas")
@SecurityRequirement(name = "bearerAuth")
public class VenueResource {

    @Inject
    ClubService clubService;

    /**
     * GET /api/venues - Get venues accessible by current user
     */
    @GET
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener sedes",
        description = "Lista sedes accesibles según el rol del usuario. ADMIN_GENERAL ve todas, ADMIN_CLUB ve las de su club, PROFESOR solo las asignadas."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de sedes recuperada exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = VenueResponse.class, type = SchemaType.ARRAY)
            )
        ),
        @APIResponse(responseCode = "401", description = "Token de acceso inválido o expirado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para acceder a sedes"),
        @APIResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public Response getVenues() {
        List<VenueResponse> venues = clubService.getVenues();
        return Response.ok(venues).build();
    }

    /**
     * GET /api/venues/{id} - Get specific venue
     */
    @GET
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener sede específica",
        description = "Obtiene los detalles completos de una sede incluyendo información del club."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Sede encontrada",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = VenueResponse.class)
            )
        ),
        @APIResponse(responseCode = "404", description = "Sede no encontrada o sin acceso"),
        @APIResponse(responseCode = "403", description = "Sin permisos para ver esta sede")
    })
    public Response getVenueById(
        @Parameter(description = "ID único de la sede", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id) {
        VenueResponse venue = clubService.getVenueById(id);
        return Response.ok(venue).build();
    }
}