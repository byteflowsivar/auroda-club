package com.sgd.club.resource;

import com.sgd.club.dto.ClubResponse;
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
 * REST Resource for Club and Venue operations.
 * Implements endpoints for configuration data with proper security filtering.
 */
@Path("/clubs")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Clubs", description = "Gestión de clubes y sedes deportivas")
@SecurityRequirement(name = "bearerAuth")
public class ClubResource {

    @Inject
    ClubService clubService;

    /**
     * GET /api/clubs - Get clubs accessible by current user
     */
    @GET
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener clubes",
        description = "Lista clubes accesibles según el rol del usuario. ADMIN_GENERAL ve todos, otros solo su club asignado."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de clubes recuperada exitosamente",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = ClubResponse.class, type = SchemaType.ARRAY)
            )
        ),
        @APIResponse(responseCode = "401", description = "Token de acceso inválido o expirado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para acceder a clubes"),
        @APIResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public Response getClubs() {
        List<ClubResponse> clubs = clubService.getClubs();
        return Response.ok(clubs).build();
    }

    /**
     * GET /api/clubs/{id} - Get specific club
     */
    @GET
    @Path("/{id}")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener club específico",
        description = "Obtiene los detalles completos de un club incluyendo sus sedes activas."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Club encontrado",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = ClubResponse.class)
            )
        ),
        @APIResponse(responseCode = "404", description = "Club no encontrado o sin acceso"),
        @APIResponse(responseCode = "403", description = "Sin permisos para ver este club")
    })
    public Response getClubById(
        @Parameter(description = "ID único del club", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long id) {
        ClubResponse club = clubService.getClubById(id);
        return Response.ok(club).build();
    }

    /**
     * GET /api/clubs/{id}/venues - Get venues of specific club
     */
    @GET
    @Path("/{id}/venues")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Obtener sedes del club",
        description = "Lista todas las sedes activas del club. Los profesores solo ven sus sedes asignadas."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Lista de sedes del club",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = VenueResponse.class, type = SchemaType.ARRAY)
            )
        ),
        @APIResponse(responseCode = "404", description = "Club no encontrado"),
        @APIResponse(responseCode = "403", description = "Sin permisos para ver sedes de este club")
    })
    public Response getClubVenues(
        @Parameter(description = "ID único del club", required = true, schema = @Schema(type = SchemaType.INTEGER))
        @PathParam("id") @Positive Long clubId) {
        List<VenueResponse> venues = clubService.getVenuesByClubId(clubId);
        return Response.ok(venues).build();
    }
}