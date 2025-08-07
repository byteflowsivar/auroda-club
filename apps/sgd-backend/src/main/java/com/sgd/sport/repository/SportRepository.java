package com.sgd.sport.repository;

import com.sgd.sport.entity.Sport;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Sport entity using Panache.
 * Provides data access methods for sports.
 */
@ApplicationScoped
public class SportRepository implements PanacheRepository<Sport> {

    /**
     * Find all active sports.
     */
    public List<Sport> findAllActive() {
        return list("active = true ORDER BY name");
    }

    /**
     * Find sports with categories loaded.
     */
    public List<Sport> findAllActiveWithCategories() {
        return find("SELECT DISTINCT s FROM Sport s LEFT JOIN FETCH s.categories c " +
                   "WHERE s.active = true AND (c.active = true OR c.id IS NULL) ORDER BY s.name")
                .list();
    }

    /**
     * Find sport by ID if active.
     */
    public Optional<Sport> findActiveById(Long id) {
        return find("id = ?1 AND active = true", id).firstResultOptional();
    }

    /**
     * Find sport by ID with categories.
     */
    public Optional<Sport> findByIdWithCategories(Long id) {
        return find("SELECT s FROM Sport s LEFT JOIN FETCH s.categories c " +
                   "WHERE s.id = ?1 AND s.active = true AND (c.active = true OR c.id IS NULL)", id)
                .firstResultOptional();
    }

    /**
     * Find sport by name.
     */
    public Optional<Sport> findByName(String name) {
        return find("LOWER(name) = LOWER(?1)", name).firstResultOptional();
    }

    /**
     * Find sports by IDs (for user restrictions).
     */
    public List<Sport> findByIds(List<Long> sportIds) {
        if (sportIds == null || sportIds.isEmpty()) {
            return List.of();
        }
        return list("id IN ?1 AND active = true ORDER BY name", sportIds);
    }

    /**
     * Check if sport exists by name (excluding specific ID for updates).
     */
    public boolean existsByNameAndNotId(String name, Long excludeId) {
        if (excludeId == null) {
            return count("LOWER(name) = LOWER(?1)", name) > 0;
        }
        return count("LOWER(name) = LOWER(?1) AND id != ?2", name, excludeId) > 0;
    }

    /**
     * Count active sports.
     */
    public long countActive() {
        return count("active = true");
    }
}