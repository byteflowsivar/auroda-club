package com.sgd.club.repository;

import com.sgd.club.entity.Venue;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Venue entity using Panache.
 * Provides data access methods for venues.
 */
@ApplicationScoped
public class VenueRepository implements PanacheRepository<Venue> {

    /**
     * Find all active venues.
     */
    public List<Venue> findAllActive() {
        return list("active = true ORDER BY name");
    }

    /**
     * Find venues by club ID.
     */
    public List<Venue> findByClubId(Long clubId) {
        return list("club.id = ?1 AND active = true ORDER BY name", clubId);
    }

    /**
     * Find venues by club IDs (for multi-club access).
     */
    public List<Venue> findByClubIds(List<Long> clubIds) {
        if (clubIds == null || clubIds.isEmpty()) {
            return List.of();
        }
        return list("club.id IN ?1 AND active = true ORDER BY name", clubIds);
    }

    /**
     * Find venues by specific venue IDs (for user restrictions).
     */
    public List<Venue> findByIds(List<Long> venueIds) {
        if (venueIds == null || venueIds.isEmpty()) {
            return List.of();
        }
        return list("id IN ?1 AND active = true ORDER BY name", venueIds);
    }

    /**
     * Find venue by ID if active.
     */
    public Optional<Venue> findActiveById(Long id) {
        return find("id = ?1 AND active = true", id).firstResultOptional();
    }

    /**
     * Find venue by ID with club loaded.
     */
    public Optional<Venue> findByIdWithClub(Long id) {
        return find("SELECT v FROM Venue v JOIN FETCH v.club WHERE v.id = ?1", id)
                .firstResultOptional();
    }

    /**
     * Find venue by code.
     */
    public Optional<Venue> findByCode(String code) {
        return find("code = ?1", code).firstResultOptional();
    }

    /**
     * Check if venue exists by code (excluding specific ID for updates).
     */
    public boolean existsByCodeAndNotId(String code, Long excludeId) {
        if (excludeId == null) {
            return count("code = ?1", code) > 0;
        }
        return count("code = ?1 AND id != ?2", code, excludeId) > 0;
    }

    /**
     * Check if venue belongs to specific club.
     */
    public boolean belongsToClub(Long venueId, Long clubId) {
        return count("id = ?1 AND club.id = ?2 AND active = true", venueId, clubId) > 0;
    }

    /**
     * Check if venues belong to specific clubs.
     */
    public boolean allBelongToClubs(List<Long> venueIds, List<Long> clubIds) {
        if (venueIds == null || venueIds.isEmpty() || clubIds == null || clubIds.isEmpty()) {
            return false;
        }
        long matchingCount = count("id IN ?1 AND club.id IN ?2 AND active = true", venueIds, clubIds);
        return matchingCount == venueIds.size();
    }
    
    // Dashboard statistics methods
    
    /**
     * Count total active venues.
     */
    public Integer countActiveVenues() {
        return Math.toIntExact(count("active = true"));
    }
    
    /**
     * Count active venues by club.
     */
    public Integer countActiveVenuesByClub(Long clubId) {
        return Math.toIntExact(count("active = true AND club.id = ?1", clubId));
    }
}