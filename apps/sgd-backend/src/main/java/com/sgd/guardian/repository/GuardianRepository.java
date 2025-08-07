package com.sgd.guardian.repository;

import com.sgd.guardian.entity.Guardian;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Guardian entity using Panache.
 * Provides data access methods for guardians/tutors.
 */
@ApplicationScoped
public class GuardianRepository implements PanacheRepository<Guardian> {

    /**
     * Find all active guardians with pagination.
     */
    public PanacheQuery<Guardian> findAllActivePaged() {
        return find("active = true ORDER BY fullName");
    }

    /**
     * Find guardian by ID if active.
     */
    public Optional<Guardian> findActiveById(Long id) {
        return find("id = ?1 AND active = true", id).firstResultOptional();
    }

    /**
     * Find guardian by ID with athlete associations loaded.
     */
    public Optional<Guardian> findByIdWithAthletes(Long id) {
        return find("SELECT g FROM Guardian g LEFT JOIN FETCH g.athleteGuardians ag " +
                   "LEFT JOIN FETCH ag.athlete a WHERE g.id = ?1 AND g.active = true", id)
                .firstResultOptional();
    }

    /**
     * Search guardians by name or email.
     */
    public PanacheQuery<Guardian> searchByNameOrEmail(String searchTerm) {
        String pattern = "%" + searchTerm.toLowerCase() + "%";
        return find("(LOWER(fullName) LIKE ?1 OR LOWER(email) LIKE ?1) AND active = true ORDER BY fullName", 
                   pattern);
    }

    /**
     * Find guardians with active athlete associations.
     */
    public PanacheQuery<Guardian> findWithActiveAthletes() {
        return find("SELECT DISTINCT g FROM Guardian g JOIN g.athleteGuardians ag " +
                   "WHERE g.active = true AND ag.active = true ORDER BY g.fullName");
    }

    /**
     * Find guardians without athlete associations.
     */
    public PanacheQuery<Guardian> findWithoutAthletes() {
        return find("SELECT g FROM Guardian g WHERE g.active = true AND " +
                   "NOT EXISTS (SELECT 1 FROM AthleteGuardian ag WHERE ag.guardian = g AND ag.active = true) " +
                   "ORDER BY g.fullName");
    }

    /**
     * Find guardian by email.
     */
    public Optional<Guardian> findByEmail(String email) {
        return find("LOWER(email) = LOWER(?1)", email).firstResultOptional();
    }

    /**
     * Find guardian by phone number.
     */
    public Optional<Guardian> findByPhone(String phone) {
        return find("phone = ?1 OR secondaryPhone = ?1", phone).firstResultOptional();
    }

    /**
     * Find guardian by identification number.
     */
    public Optional<Guardian> findByIdentificationNumber(String identificationNumber) {
        return find("identificationNumber = ?1", identificationNumber).firstResultOptional();
    }

    /**
     * Check if email is already used (excluding specific ID for updates).
     */
    public boolean existsByEmailAndNotId(String email, Long excludeId) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        if (excludeId == null) {
            return count("LOWER(email) = LOWER(?1)", email) > 0;
        }
        return count("LOWER(email) = LOWER(?1) AND id != ?2", email, excludeId) > 0;
    }

    /**
     * Check if identification number is already used (excluding specific ID for updates).
     */
    public boolean existsByIdentificationAndNotId(String identificationNumber, Long excludeId) {
        if (identificationNumber == null || identificationNumber.trim().isEmpty()) {
            return false;
        }
        if (excludeId == null) {
            return count("identificationNumber = ?1", identificationNumber) > 0;
        }
        return count("identificationNumber = ?1 AND id != ?2", identificationNumber, excludeId) > 0;
    }

    /**
     * Find guardians with at least one contact method.
     */
    public List<Guardian> findWithContactInfo() {
        return list("(email IS NOT NULL AND email != '') OR (phone IS NOT NULL AND phone != '') " +
                   "AND active = true ORDER BY fullName");
    }

    /**
     * Count active guardians.
     */
    public long countActive() {
        return count("active = true");
    }

    /**
     * Count guardians with active athletes.
     */
    public long countWithActiveAthletes() {
        return find("SELECT COUNT(DISTINCT g) FROM Guardian g JOIN g.athleteGuardians ag " +
                   "WHERE g.active = true AND ag.active = true").project(Long.class).firstResult();
    }
}