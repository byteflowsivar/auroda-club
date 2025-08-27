package com.sgd.dashboard.resource;

import com.sgd.dashboard.dto.DashboardSummaryResponse;
import com.sgd.dashboard.service.DashboardService;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

/**
 * REST resource for dashboard statistics and summary data.
 * Provides aggregated KPIs and metrics for the main dashboard view.
 */
@Path("/dashboard")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
@Tag(name = "Dashboard", description = "Dashboard statistics and summary data")
@SecurityRequirement(name = "Keycloak")
public class DashboardResource {

    @Inject
    DashboardService dashboardService;

    /**
     * Get dashboard summary with statistics and KPIs.
     * Returns different data based on user roles:
     * - ADMIN_GENERAL: Global statistics for all system
     * - ADMIN_CLUB: Statistics for assigned club and venues
     * - PROFESOR: Limited statistics for assigned venues and sports
     */
    @GET
    @Path("/summary")
    @RolesAllowed({"ADMIN_GENERAL", "ADMIN_CLUB", "PROFESOR"})
    @Operation(
        summary = "Get dashboard summary",
        description = "Retrieves aggregated statistics and KPIs for the dashboard. " +
                     "Data is filtered based on user roles and permissions. " +
                     "ADMIN_GENERAL sees all data, ADMIN_CLUB sees club data, " +
                     "PROFESOR sees limited data for assigned venues."
    )
    @APIResponse(
        responseCode = "200",
        description = "Dashboard summary retrieved successfully"
    )
    @APIResponse(
        responseCode = "401",
        description = "User not authenticated"
    )
    @APIResponse(
        responseCode = "403",
        description = "User does not have required permissions"
    )
    public DashboardSummaryResponse getDashboardSummary() {
        return dashboardService.getDashboardSummary();
    }
}