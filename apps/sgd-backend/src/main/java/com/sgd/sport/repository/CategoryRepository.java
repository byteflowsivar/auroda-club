package com.sgd.sport.repository;

import com.sgd.sport.entity.Category;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Category entity using Panache.
 * Provides data access methods for categories.
 */
@ApplicationScoped
public class CategoryRepository implements PanacheRepository<Category> {

    /**
     * Find all active categories.
     */
    public List<Category> findAllActive() {
        return list("active = true ORDER BY sport.name, minAge");
    }

    /**
     * Find categories by sport ID.
     */
    public List<Category> findBySportId(Long sportId) {
        return list("sport.id = ?1 AND active = true ORDER BY minAge", sportId);
    }

    /**
     * Find category by ID if active.
     */
    public Optional<Category> findActiveById(Long id) {
        return find("id = ?1 AND active = true", id).firstResultOptional();
    }

    /**
     * Find category by ID with sport loaded.
     */
    public Optional<Category> findByIdWithSport(Long id) {
        return find("SELECT c FROM Category c JOIN FETCH c.sport WHERE c.id = ?1 AND c.active = true", id)
                .firstResultOptional();
    }

    /**
     * Find categories valid for specific age.
     */
    public List<Category> findValidForAge(int age) {
        return list("?1 BETWEEN minAge AND maxAge AND active = true ORDER BY sport.name, minAge", age);
    }

    /**
     * Find categories valid for specific age and sport.
     */
    public List<Category> findValidForAgeAndSport(int age, Long sportId) {
        return list("sport.id = ?1 AND ?2 BETWEEN minAge AND maxAge AND active = true ORDER BY minAge", 
                   sportId, age);
    }

    /**
     * Check if category is valid for age.
     */
    public boolean isValidForAge(Long categoryId, int age) {
        return count("id = ?1 AND ?2 BETWEEN minAge AND maxAge AND active = true", categoryId, age) > 0;
    }

    /**
     * Check if category belongs to sport.
     */
    public boolean belongsToSport(Long categoryId, Long sportId) {
        return count("id = ?1 AND sport.id = ?2 AND active = true", categoryId, sportId) > 0;
    }

    /**
     * Find overlapping categories in same sport (for validation).
     */
    public List<Category> findOverlapping(Long sportId, int minAge, int maxAge, Long excludeId) {
        String query = "sport.id = ?1 AND active = true AND " +
                      "((minAge <= ?2 AND maxAge >= ?2) OR (minAge <= ?3 AND maxAge >= ?3) OR " +
                      "(minAge >= ?2 AND maxAge <= ?3))";
        
        if (excludeId != null) {
            query += " AND id != ?4";
            return list(query, sportId, minAge, maxAge, excludeId);
        } else {
            return list(query, sportId, minAge, maxAge);
        }
    }

    /**
     * Count categories by sport.
     */
    public long countBySport(Long sportId) {
        return count("sport.id = ?1 AND active = true", sportId);
    }
}