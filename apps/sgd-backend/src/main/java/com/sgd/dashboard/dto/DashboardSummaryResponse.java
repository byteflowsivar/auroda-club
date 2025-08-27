package com.sgd.dashboard.dto;

import java.util.List;

public record DashboardSummaryResponse(
    Integer totalActiveAthletes,
    Integer newAthletesLast30Days,
    Integer totalActiveVenues,
    Integer totalActiveSports,
    List<CountByName> athletesBySport,
    List<CountByName> athletesByVenue,
    Integer athletesWithoutGuardian
) {
    
    public record CountByName(
        String name,
        Integer value
    ) {}
}