package com.sgd.club.service;

import com.sgd.club.dto.ClubResponse;
import com.sgd.club.dto.VenueResponse;
import com.sgd.club.entity.Club;
import com.sgd.club.entity.Venue;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for Club and Venue entities and DTOs.
 * Handles conversion between domain entities and response DTOs.
 */
@ApplicationScoped
public class ClubMapper {

    /**
     * Convert Club entity to response DTO with venues.
     */
    public ClubResponse toResponse(Club club) {
        if (club == null) {
            return null;
        }

        ClubResponse response = new ClubResponse();
        response.setId(club.getId());
        response.setName(club.getName());
        response.setDescription(club.getDescription());
        response.setEmail(club.getEmail());
        response.setPhone(club.getPhone());
        response.setAddress(club.getAddress());
        response.setActive(club.isActive());
        response.setCreatedAt(club.getCreatedAt());
        response.setUpdatedAt(club.getUpdatedAt());

        // Map venues if loaded
        if (club.getVenues() != null) {
            List<ClubResponse.VenueInfo> venueInfos = club.getVenues().stream()
                    .filter(Venue::isActive)
                    .map(this::mapVenueInfo)
                    .collect(Collectors.toList());
            response.setVenues(venueInfos);
        }

        return response;
    }

    /**
     * Convert Club entity to simple response DTO (without venues).
     */
    public ClubResponse toSimpleResponse(Club club) {
        if (club == null) {
            return null;
        }

        ClubResponse response = new ClubResponse();
        response.setId(club.getId());
        response.setName(club.getName());
        response.setDescription(club.getDescription());
        response.setEmail(club.getEmail());
        response.setPhone(club.getPhone());
        response.setAddress(club.getAddress());
        response.setActive(club.isActive());
        response.setCreatedAt(club.getCreatedAt());
        response.setUpdatedAt(club.getUpdatedAt());

        return response;
    }

    /**
     * Convert Venue entity to response DTO with club info.
     */
    public VenueResponse toVenueResponse(Venue venue) {
        if (venue == null) {
            return null;
        }

        VenueResponse response = new VenueResponse();
        response.setId(venue.getId());
        response.setName(venue.getName());
        response.setCode(venue.getCode());
        response.setAddress(venue.getAddress());
        response.setPhone(venue.getPhone());
        response.setActive(venue.isActive());
        response.setCreatedAt(venue.getCreatedAt());
        response.setUpdatedAt(venue.getUpdatedAt());

        // Map club info if loaded
        if (venue.getClub() != null) {
            response.setClub(mapClubInfo(venue.getClub()));
        }

        return response;
    }

    /**
     * Convert Venue entity to simple response DTO (without club details).
     */
    public VenueResponse toSimpleVenueResponse(Venue venue) {
        if (venue == null) {
            return null;
        }

        VenueResponse response = new VenueResponse();
        response.setId(venue.getId());
        response.setName(venue.getName());
        response.setCode(venue.getCode());
        response.setAddress(venue.getAddress());
        response.setPhone(venue.getPhone());
        response.setActive(venue.isActive());
        response.setCreatedAt(venue.getCreatedAt());
        response.setUpdatedAt(venue.getUpdatedAt());

        return response;
    }

    /**
     * Map Venue to VenueInfo for club response.
     */
    private ClubResponse.VenueInfo mapVenueInfo(Venue venue) {
        if (venue == null) {
            return null;
        }

        ClubResponse.VenueInfo venueInfo = new ClubResponse.VenueInfo();
        venueInfo.setId(venue.getId());
        venueInfo.setName(venue.getName());
        venueInfo.setCode(venue.getCode());
        venueInfo.setAddress(venue.getAddress());
        venueInfo.setPhone(venue.getPhone());
        venueInfo.setActive(venue.isActive());

        return venueInfo;
    }

    /**
     * Map Club to ClubInfo for venue response.
     */
    private VenueResponse.ClubInfo mapClubInfo(Club club) {
        if (club == null) {
            return null;
        }

        VenueResponse.ClubInfo clubInfo = new VenueResponse.ClubInfo();
        clubInfo.setId(club.getId());
        clubInfo.setName(club.getName());
        clubInfo.setEmail(club.getEmail());
        clubInfo.setPhone(club.getPhone());
        clubInfo.setActive(club.isActive());

        return clubInfo;
    }

    /**
     * Convert list of clubs to simple response DTOs.
     */
    public List<ClubResponse> toSimpleResponseList(List<Club> clubs) {
        if (clubs == null) {
            return List.of();
        }

        return clubs.stream()
                .map(this::toSimpleResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert list of venues to response DTOs.
     */
    public List<VenueResponse> toVenueResponseList(List<Venue> venues) {
        if (venues == null) {
            return List.of();
        }

        return venues.stream()
                .map(this::toVenueResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert list of venues to simple response DTOs.
     */
    public List<VenueResponse> toSimpleVenueResponseList(List<Venue> venues) {
        if (venues == null) {
            return List.of();
        }

        return venues.stream()
                .map(this::toSimpleVenueResponse)
                .collect(Collectors.toList());
    }

    /**
     * Create Venue entity from create request.
     */
    public Venue fromRequest(com.sgd.club.dto.VenueCreateRequest request) {
        if (request == null) {
            return null;
        }
        Venue venue = new Venue();
        venue.setName(request.getName());
        venue.setCode(request.getCode());
        venue.setAddress(request.getAddress());
        venue.setPhone(request.getPhone());
        return venue;
    }

    /**
     * Update Venue entity from update request.
     */
    public void updateFromRequest(Venue venue, com.sgd.club.dto.VenueUpdateRequest request) {
        if (request == null || venue == null) {
            return;
        }
        venue.setName(request.getName());
        venue.setAddress(request.getAddress());
        venue.setPhone(request.getPhone());
        if (request.getActive() != null) {
            venue.setActive(request.getActive());
        }
    }
}