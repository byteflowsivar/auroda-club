package com.sgd.club.service;

import com.sgd.club.dto.ClubResponse;
import com.sgd.club.dto.VenueResponse;
import com.sgd.club.entity.Club;
import com.sgd.club.entity.Venue;
import com.sgd.club.repository.ClubRepository;
import com.sgd.club.repository.VenueRepository;
import com.sgd.shared.exception.BusinessException;
import com.sgd.shared.security.SecurityContext;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

/**
 * Service layer for Club operations.
 * Contains business logic for club and venue management with security restrictions.
 */
@ApplicationScoped
public class ClubService {

    @Inject
    ClubRepository clubRepository;

    @Inject
    VenueRepository venueRepository;

    @Inject
    SecurityContext securityContext;

    @Inject
    ClubMapper clubMapper;

    /**
     * Get all clubs accessible by current user.
     * ADMIN_GENERAL sees all clubs, others see only their club.
     */
    public List<ClubResponse> getClubs() {
        List<Club> clubs;
        
        if (securityContext.isGeneralAdmin()) {
            // Admin general can see all clubs
            clubs = clubRepository.findAllActive();
        } else {
            // Other users see only their assigned club
            Long userClubId = securityContext.getCurrentUserClubId()
                    .orElseThrow(() -> new BusinessException("NO_CLUB_ACCESS", 
                        "Usuario no tiene club asignado"));
            
            Club userClub = clubRepository.findActiveById(userClubId)
                    .orElseThrow(() -> new BusinessException.ClubAccessDenied(userClubId));
            
            clubs = List.of(userClub);
        }
        
        return clubs.stream()
                .map(clubMapper::toResponse)
                .toList();
    }

    /**
     * Get club by ID with security validation.
     */
    public ClubResponse getClubById(Long clubId) {
        Club club = clubRepository.findActiveById(clubId)
                .orElseThrow(() -> new BusinessException("CLUB_NOT_FOUND", 
                    "Club con ID " + clubId + " no encontrado"));
        
        // Check access permissions
        validateClubAccess(club);
        
        return clubMapper.toResponse(club);
    }

    /**
     * Get all venues accessible by current user.
     * Applies security filtering based on user role and assignments.
     */
    public List<VenueResponse> getVenues() {
        List<Venue> venues;
        
        if (securityContext.isGeneralAdmin()) {
            // Admin general can see all venues
            venues = venueRepository.findAllActive();
        } else if (securityContext.isClubAdmin()) {
            // Club admin can see all venues of their club
            Long userClubId = securityContext.getCurrentUserClubId()
                    .orElseThrow(() -> new BusinessException("NO_CLUB_ACCESS", 
                        "Usuario no tiene club asignado"));
            
            venues = venueRepository.findByClubId(userClubId);
        } else {
            // Professors see only their assigned venues
            List<Long> allowedVenueIds = securityContext.getCurrentUserVenueIds();
            if (allowedVenueIds.isEmpty()) {
                throw new BusinessException("NO_VENUE_ACCESS", 
                    "Usuario no tiene sedes asignadas");
            }
            
            venues = venueRepository.findByIds(allowedVenueIds);
        }
        
        return venues.stream()
                .map(clubMapper::toVenueResponse)
                .toList();
    }

    /**
     * Get venues by club ID with security validation.
     */
    public List<VenueResponse> getVenuesByClubId(Long clubId) {
        // Validate club access first
        Club club = clubRepository.findActiveById(clubId)
                .orElseThrow(() -> new BusinessException("CLUB_NOT_FOUND", 
                    "Club con ID " + clubId + " no encontrado"));
        
        validateClubAccess(club);
        
        List<Venue> venues;
        
        if (securityContext.isGeneralAdmin() || securityContext.isClubAdmin()) {
            // Admin can see all venues of the club
            venues = venueRepository.findByClubId(clubId);
        } else {
            // Professors see only their assigned venues within the club
            List<Long> allowedVenueIds = securityContext.getCurrentUserVenueIds();
            venues = venueRepository.findByClubId(clubId).stream()
                    .filter(venue -> allowedVenueIds.contains(venue.getId()))
                    .toList();
        }
        
        return venues.stream()
                .map(clubMapper::toVenueResponse)
                .toList();
    }

    /**
     * Get venue by ID with security validation.
     */
    public VenueResponse getVenueById(Long venueId) {
        Venue venue = venueRepository.findByIdWithClub(venueId)
                .orElseThrow(() -> new BusinessException("VENUE_NOT_FOUND", 
                    "Sede con ID " + venueId + " no encontrada"));
        
        // Check access permissions
        validateVenueAccess(venue);
        
        return clubMapper.toVenueResponse(venue);
    }

    /**
     * Get simplified club list for dropdowns/selectors.
     * Returns only basic information without venues.
     */
    public List<ClubResponse> getClubsForSelection() {
        List<Club> clubs;
        
        if (securityContext.isGeneralAdmin()) {
            clubs = clubRepository.findAllActive();
        } else {
            Long userClubId = securityContext.getCurrentUserClubId()
                    .orElseThrow(() -> new BusinessException("NO_CLUB_ACCESS", 
                        "Usuario no tiene club asignado"));
            
            Club userClub = clubRepository.findActiveById(userClubId)
                    .orElseThrow(() -> new BusinessException.ClubAccessDenied(userClubId));
            
            clubs = List.of(userClub);
        }
        
        return clubs.stream()
                .map(clubMapper::toSimpleResponse)
                .toList();
    }

    /**
     * Get simplified venue list for dropdowns/selectors.
     * Returns only basic information without club details.
     */
    public List<VenueResponse> getVenuesForSelection() {
        List<Venue> venues = getAccessibleVenues();
        
        return venues.stream()
                .map(clubMapper::toSimpleVenueResponse)
                .toList();
    }

    /**
     * Check if current user can access a specific club.
     */
    public boolean canAccessClub(Long clubId) {
        if (securityContext.isGeneralAdmin()) {
            return true;
        }
        
        return securityContext.getCurrentUserClubId()
                .map(userClubId -> userClubId.equals(clubId))
                .orElse(false);
    }

    /**
     * Check if current user can access a specific venue.
     */
    public boolean canAccessVenue(Long venueId) {
        if (securityContext.isGeneralAdmin()) {
            return true;
        }
        
        if (securityContext.isClubAdmin()) {
            // Club admin can access any venue of their club
            Long userClubId = securityContext.getCurrentUserClubId().orElse(null);
            if (userClubId == null) return false;
            
            return venueRepository.belongsToClub(venueId, userClubId);
        }
        
        // Professors can only access their assigned venues
        List<Long> allowedVenueIds = securityContext.getCurrentUserVenueIds();
        return allowedVenueIds.contains(venueId);
    }

    // Private helper methods

    private void validateClubAccess(Club club) {
        if (!securityContext.canAccessClub(club.getId())) {
            throw new BusinessException.ClubAccessDenied(club.getId());
        }
    }

    private void validateVenueAccess(Venue venue) {
        if (!securityContext.canAccessVenue(venue.getId())) {
            throw new BusinessException.VenueAccessDenied(venue.getId());
        }
    }

    private List<Venue> getAccessibleVenues() {
        if (securityContext.isGeneralAdmin()) {
            return venueRepository.findAllActive();
        } else if (securityContext.isClubAdmin()) {
            Long userClubId = securityContext.getCurrentUserClubId()
                    .orElseThrow(() -> new BusinessException("NO_CLUB_ACCESS", 
                        "Usuario no tiene club asignado"));
            
            return venueRepository.findByClubId(userClubId);
        } else {
            List<Long> allowedVenueIds = securityContext.getCurrentUserVenueIds();
            if (allowedVenueIds.isEmpty()) {
                return List.of();
            }
            
            return venueRepository.findByIds(allowedVenueIds);
        }
    }
}