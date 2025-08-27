package com.sgd.dashboard.service;

import com.sgd.athlete.repository.AthleteRepository;
import com.sgd.club.repository.VenueRepository;
import com.sgd.dashboard.dto.DashboardSummaryResponse;
import com.sgd.dashboard.dto.DashboardSummaryResponse.CountByName;
import com.sgd.shared.security.SecurityContext;
import com.sgd.sport.repository.SportRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class DashboardService {

    @Inject
    AthleteRepository athleteRepository;

    @Inject
    VenueRepository venueRepository;

    @Inject
    SportRepository sportRepository;

    @Inject
    SecurityContext securityContext;

    public DashboardSummaryResponse getDashboardSummary() {
        Set<Long> userVenueIds = new HashSet<>(securityContext.getCurrentUserVenueIds());
        Set<Long> userSportIds = new HashSet<>(securityContext.getCurrentUserSportIds());
        Long userClubId = securityContext.getCurrentUserClubId().orElse(null);
        boolean isGeneralAdmin = securityContext.hasRole("ADMIN_GENERAL");

        // Total active athletes
        Integer totalActiveAthletes = getTotalActiveAthletes(isGeneralAdmin, userVenueIds);

        // New athletes in last 30 days
        Integer newAthletesLast30Days = getNewAthletesLast30Days(isGeneralAdmin, userVenueIds);

        // Total active venues
        Integer totalActiveVenues = getTotalActiveVenues(isGeneralAdmin, userClubId, userVenueIds);

        // Total active sports
        Integer totalActiveSports = getTotalActiveSports(isGeneralAdmin, userSportIds);

        // Athletes by sport
        List<CountByName> athletesBySport = getAthletesBySport(isGeneralAdmin, userVenueIds, userSportIds);

        // Athletes by venue
        List<CountByName> athletesByVenue = getAthletesByVenue(isGeneralAdmin, userVenueIds);

        // Athletes without guardian (minors without guardians)
        Integer athletesWithoutGuardian = getAthletesWithoutGuardian(isGeneralAdmin, userVenueIds);

        return new DashboardSummaryResponse(
            totalActiveAthletes,
            newAthletesLast30Days,
            totalActiveVenues,
            totalActiveSports,
            athletesBySport,
            athletesByVenue,
            athletesWithoutGuardian
        );
    }

    private Integer getTotalActiveAthletes(boolean isGeneralAdmin, Set<Long> userVenueIds) {
        if (isGeneralAdmin) {
            return athleteRepository.countActiveAthletes();
        }
        return athleteRepository.countActiveAthletesByVenues(userVenueIds);
    }

    private Integer getNewAthletesLast30Days(boolean isGeneralAdmin, Set<Long> userVenueIds) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        if (isGeneralAdmin) {
            return athleteRepository.countNewAthletesSince(thirtyDaysAgo);
        }
        return athleteRepository.countNewAthletesSinceByVenues(thirtyDaysAgo, userVenueIds);
    }

    private Integer getTotalActiveVenues(boolean isGeneralAdmin, Long userClubId, Set<Long> userVenueIds) {
        if (isGeneralAdmin) {
            return venueRepository.countActiveVenues();
        }
        if (userClubId != null) {
            return venueRepository.countActiveVenuesByClub(userClubId);
        }
        return userVenueIds.size();
    }

    private Integer getTotalActiveSports(boolean isGeneralAdmin, Set<Long> userSportIds) {
        if (isGeneralAdmin) {
            return sportRepository.countActiveSports();
        }
        return userSportIds.size();
    }

    private List<CountByName> getAthletesBySport(boolean isGeneralAdmin, Set<Long> userVenueIds, Set<Long> userSportIds) {
        if (isGeneralAdmin) {
            return athleteRepository.getAthletesCountBySport();
        }
        return athleteRepository.getAthletesCountBySportFiltered(userVenueIds, userSportIds);
    }

    private List<CountByName> getAthletesByVenue(boolean isGeneralAdmin, Set<Long> userVenueIds) {
        if (isGeneralAdmin) {
            return athleteRepository.getAthletesCountByVenue();
        }
        return athleteRepository.getAthletesCountByVenueFiltered(userVenueIds);
    }

    private Integer getAthletesWithoutGuardian(boolean isGeneralAdmin, Set<Long> userVenueIds) {
        if (isGeneralAdmin) {
            return athleteRepository.countMinorsWithoutGuardian();
        }
        return athleteRepository.countMinorsWithoutGuardianByVenues(userVenueIds);
    }
}