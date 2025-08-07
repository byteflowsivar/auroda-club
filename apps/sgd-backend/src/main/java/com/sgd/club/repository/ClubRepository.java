package com.sgd.club.repository;

import com.sgd.club.entity.Club;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Club entity using Panache.
 * Provides data access methods for clubs.
 */
@ApplicationScoped
public class ClubRepository implements PanacheRepository<Club> {

    /**
     * Find all active clubs.
     */
    public List<Club> findAllActive() {
        return list("active = true ORDER BY name");
    }

    /**
     * Find club by ID if active.
     */
    public Optional<Club> findActiveById(Long id) {
        return find("id = ?1 AND active = true", id).firstResultOptional();
    }

    /**
     * Find club by name (case-insensitive).
     */
    public Optional<Club> findByName(String name) {
        return find("LOWER(name) = LOWER(?1)", name).firstResultOptional();
    }

    /**
     * Check if club exists by name (excluding specific ID for updates).
     */
    public boolean existsByNameAndNotId(String name, Long excludeId) {
        if (excludeId == null) {
            return count("LOWER(name) = LOWER(?1)", name) > 0;
        }
        return count("LOWER(name) = LOWER(?1) AND id != ?2", name, excludeId) > 0;
    }

    /**
     * Count active clubs.
     */
    public long countActive() {
        return count("active = true");
    }
}