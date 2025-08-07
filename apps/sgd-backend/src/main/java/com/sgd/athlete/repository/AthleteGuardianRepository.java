package com.sgd.athlete.repository;

import com.sgd.athlete.entity.AthleteGuardian;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

/**
 * Repository for AthleteGuardian entity using Panache.
 * Manages the many-to-many relationship between athletes and guardians.
 */
@ApplicationScoped
public class AthleteGuardianRepository implements PanacheRepository<AthleteGuardian> {

    /**
     * Find association between athlete and guardian.
     */
    public Optional<AthleteGuardian> findByAthleteAndGuardian(Long athleteId, Long guardianId) {
        return find("athlete.id = ?1 AND guardian.id = ?2", athleteId, guardianId)
                .firstResultOptional();
    }

    /**
     * Find active guardians for athlete.
     */
    public List<AthleteGuardian> findActiveByAthlete(Long athleteId) {
        return list("athlete.id = ?1 AND active = true ORDER BY isPrimary DESC, guardian.fullName", 
                   athleteId);
    }

    /**
     * Find active guardians for athlete with guardian details loaded.
     */
    public List<AthleteGuardian> findActiveByAthleteWithGuardians(Long athleteId) {
        return find("SELECT ag FROM AthleteGuardian ag JOIN FETCH ag.guardian " +
                   "WHERE ag.athlete.id = ?1 AND ag.active = true " +
                   "ORDER BY ag.isPrimary DESC, ag.guardian.fullName", athleteId)
                .list();
    }

    /**
     * Find active athletes for guardian.
     */
    public List<AthleteGuardian> findActiveByGuardian(Long guardianId) {
        return list("guardian.id = ?1 AND active = true ORDER BY athlete.fullName", guardianId);
    }

    /**
     * Find active athletes for guardian with athlete details loaded.
     */
    public List<AthleteGuardian> findActiveByGuardianWithAthletes(Long guardianId) {
        return find("SELECT ag FROM AthleteGuardian ag " +
                   "JOIN FETCH ag.athlete a " +
                   "JOIN FETCH a.sport s " +
                   "JOIN FETCH a.venue v " +
                   "WHERE ag.guardian.id = ?1 AND ag.active = true " +
                   "ORDER BY a.fullName", guardianId)
                .list();
    }

    /**
     * Find primary guardian for athlete.
     */
    public Optional<AthleteGuardian> findPrimaryByAthlete(Long athleteId) {
        return find("athlete.id = ?1 AND isPrimary = true AND active = true", athleteId)
                .firstResultOptional();
    }

    /**
     * Check if athlete has any active guardians.
     */
    public boolean hasActiveGuardians(Long athleteId) {
        return count("athlete.id = ?1 AND active = true", athleteId) > 0;
    }

    /**
     * Check if athlete has primary guardian.
     */
    public boolean hasPrimaryGuardian(Long athleteId) {
        return count("athlete.id = ?1 AND isPrimary = true AND active = true", athleteId) > 0;
    }

    /**
     * Check if guardian has any active athletes.
     */
    public boolean hasActiveAthletes(Long guardianId) {
        return count("guardian.id = ?1 AND active = true", guardianId) > 0;
    }

    /**
     * Count active guardians for athlete.
     */
    public long countActiveByAthlete(Long athleteId) {
        return count("athlete.id = ?1 AND active = true", athleteId);
    }

    /**
     * Count active athletes for guardian.
     */
    public long countActiveByGuardian(Long guardianId) {
        return count("guardian.id = ?1 AND active = true", guardianId);
    }

    /**
     * Deactivate all guardian associations for athlete (for deletion scenarios).
     */
    public void deactivateAllByAthlete(Long athleteId) {
        update("active = false WHERE athlete.id = ?1", athleteId);
    }

    /**
     * Deactivate all athlete associations for guardian (for deletion scenarios).
     */
    public void deactivateAllByGuardian(Long guardianId) {
        update("active = false WHERE guardian.id = ?1", guardianId);
    }

    /**
     * Remove primary status from all guardians of athlete (when setting new primary).
     */
    public void removePrimaryStatusFromAthlete(Long athleteId) {
        update("isPrimary = false WHERE athlete.id = ?1 AND active = true", athleteId);
    }

    /**
     * Find athletes without primary guardian (for validation/reporting).
     */
    public List<AthleteGuardian> findAthletesWithoutPrimaryGuardian() {
        return find("SELECT DISTINCT ag1 FROM AthleteGuardian ag1 " +
                   "WHERE ag1.active = true " +
                   "AND NOT EXISTS (SELECT 1 FROM AthleteGuardian ag2 " +
                   "WHERE ag2.athlete = ag1.athlete AND ag2.isPrimary = true AND ag2.active = true) " +
                   "ORDER BY ag1.athlete.fullName")
                .list();
    }

    /**
     * Find all associations for an athlete (including inactive for history).
     */
    public List<AthleteGuardian> findAllByAthlete(Long athleteId) {
        return find("SELECT ag FROM AthleteGuardian ag JOIN FETCH ag.guardian " +
                   "WHERE ag.athlete.id = ?1 ORDER BY ag.active DESC, ag.isPrimary DESC, ag.guardian.fullName", 
                   athleteId)
                .list();
    }

    /**
     * Find all associations for a guardian (including inactive for history).
     */
    public List<AthleteGuardian> findAllByGuardian(Long guardianId) {
        return find("SELECT ag FROM AthleteGuardian ag JOIN FETCH ag.athlete a " +
                   "WHERE ag.guardian.id = ?1 ORDER BY ag.active DESC, a.fullName", guardianId)
                .list();
    }
}