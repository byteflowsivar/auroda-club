package com.sgd.athlete.repository;

import com.sgd.athlete.dto.AthleteFilters;
import com.sgd.athlete.entity.Athlete;
import com.sgd.dashboard.dto.DashboardSummaryResponse.CountByName;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Parameters;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Repository for Athlete entity using Panache.
 * Provides optimized data access methods for athletes with complex filtering.
 */
@ApplicationScoped
public class AthleteRepository implements PanacheRepository<Athlete> {

    /**
     * Find athlete by ID if active, with all relations loaded.
     */
    public Optional<Athlete> findActiveByIdWithRelations(Long id) {
        return find("SELECT a FROM Athlete a " +
                   "JOIN FETCH a.club c " +
                   "JOIN FETCH a.venue v " +
                   "JOIN FETCH a.sport s " +
                   "JOIN FETCH a.category cat " +
                   "LEFT JOIN FETCH a.athleteGuardians ag " +
                   "LEFT JOIN FETCH ag.guardian g " +
                   "WHERE a.id = ?1 AND a.active = true", id)
                .firstResultOptional();
    }

    /**
     * Find athlete by ID if active (basic info only).
     */
    public Optional<Athlete> findActiveById(Long id) {
        return find("id = ?1 AND active = true", id).firstResultOptional();
    }

    /**
     * Find athletes with complex filtering and pagination.
     */
    public PanacheQuery<Athlete> findWithFilters(AthleteFilters filters, List<Long> allowedVenueIds) {
        StringBuilder queryBuilder = new StringBuilder();
        Parameters params = Parameters.with("active", filters.getActive());

        // Base query with joins for better performance
        queryBuilder.append("SELECT DISTINCT a FROM Athlete a ");
        queryBuilder.append("JOIN FETCH a.club c ");
        queryBuilder.append("JOIN FETCH a.venue v ");
        queryBuilder.append("JOIN FETCH a.sport s ");
        queryBuilder.append("JOIN FETCH a.category cat ");
        queryBuilder.append("WHERE a.active = :active");

        // Venue restriction (security filter)
        if (allowedVenueIds != null && !allowedVenueIds.isEmpty()) {
            queryBuilder.append(" AND a.venue.id IN :allowedVenueIds");
            params.and("allowedVenueIds", allowedVenueIds);
        }

        // Venue filter
        if (filters.hasVenueFilter()) {
            queryBuilder.append(" AND a.venue.id = :venueId");
            params.and("venueId", filters.getVenueId());
        }

        // Sport filter
        if (filters.hasSportFilter()) {
            queryBuilder.append(" AND a.sport.id = :sportId");
            params.and("sportId", filters.getSportId());
        }

        // Category filter
        if (filters.hasCategoryFilter()) {
            queryBuilder.append(" AND a.category.id = :categoryId");
            params.and("categoryId", filters.getCategoryId());
        }

        // Age filter (calculated age)
        if (filters.getAgeMin() != null) {
            LocalDate maxBirthDate = LocalDate.now().minusYears(filters.getAgeMin());
            queryBuilder.append(" AND a.birthDate <= :maxBirthDate");
            params.and("maxBirthDate", maxBirthDate);
        }
        if (filters.getAgeMax() != null) {
            LocalDate minBirthDate = LocalDate.now().minusYears(filters.getAgeMax() + 1);
            queryBuilder.append(" AND a.birthDate > :minBirthDate");
            params.and("minBirthDate", minBirthDate);
        }

        // Text search
        if (filters.hasSearch()) {
            String searchPattern = "%" + filters.getSearch().toLowerCase() + "%";
            queryBuilder.append(" AND LOWER(a.fullName) LIKE :searchPattern");
            params.and("searchPattern", searchPattern);
        }

        // Build sort
        Sort sort = buildSort(filters);

        return find(queryBuilder.toString(), sort, params);
    }

    /**
     * Find athletes by venue IDs.
     */
    public List<Athlete> findByVenueIds(List<Long> venueIds) {
        if (venueIds == null || venueIds.isEmpty()) {
            return List.of();
        }
        return list("venue.id IN ?1 AND active = true ORDER BY fullName", venueIds);
    }

    /**
     * Find athletes by club ID.
     */
    public List<Athlete> findByClubId(Long clubId) {
        return list("club.id = ?1 AND active = true ORDER BY fullName", clubId);
    }

    /**
     * Find athletes by sport and category.
     */
    public List<Athlete> findBySportAndCategory(Long sportId, Long categoryId) {
        return list("sport.id = ?1 AND category.id = ?2 AND active = true ORDER BY fullName", 
                   sportId, categoryId);
    }

    /**
     * Find minors without active guardians (for validation).
     */
    public List<Athlete> findMinorsWithoutGuardians() {
        LocalDate eighteenYearsAgo = LocalDate.now().minusYears(18);
        return list("birthDate > ?1 AND active = true AND " +
                   "NOT EXISTS (SELECT 1 FROM AthleteGuardian ag WHERE ag.athlete = this AND ag.active = true) " +
                   "ORDER BY birthDate DESC", eighteenYearsAgo);
    }

    /**
     * Find athletes with invalid category for current age.
     */
    public List<Athlete> findWithInvalidCategories() {
        return find("SELECT a FROM Athlete a JOIN a.category c WHERE a.active = true AND " +
                   "(FUNCTION('EXTRACT', YEAR FROM CURRENT_DATE) - FUNCTION('EXTRACT', YEAR FROM a.birthDate) < c.minAge OR " +
                   "FUNCTION('EXTRACT', YEAR FROM CURRENT_DATE) - FUNCTION('EXTRACT', YEAR FROM a.birthDate) > c.maxAge)")
                .list();
    }

    /**
     * Find athlete by email (for uniqueness validation).
     */
    public Optional<Athlete> findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        return find("LOWER(email) = LOWER(?1)", email).firstResultOptional();
    }

    /**
     * Find athlete by identification number.
     */
    public Optional<Athlete> findByIdentificationNumber(String identificationNumber) {
        if (identificationNumber == null || identificationNumber.trim().isEmpty()) {
            return Optional.empty();
        }
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
     * Count athletes by various criteria for statistics.
     */
    public Map<String, Long> getStatistics(List<Long> allowedVenueIds) {
        Parameters params = Parameters.with("dummy", true);
        String baseQuery = "SELECT COUNT(a) FROM Athlete a WHERE a.active = true";
        
        if (allowedVenueIds != null && !allowedVenueIds.isEmpty()) {
            baseQuery += " AND a.venue.id IN :venueIds";
            params.and("venueIds", allowedVenueIds);
        }

        Long totalAthletes = find(baseQuery, params).project(Long.class).firstResult();
        
        // Minors count
        LocalDate eighteenYearsAgo = LocalDate.now().minusYears(18);
        String minorsQuery = baseQuery + " AND a.birthDate > :eighteenYearsAgo";
        params.and("eighteenYearsAgo", eighteenYearsAgo);
        Long minorsCount = find(minorsQuery, params).project(Long.class).firstResult();

        return Map.of(
            "total", totalAthletes,
            "minors", minorsCount,
            "adults", totalAthletes - minorsCount
        );
    }

    /**
     * Count active athletes.
     */
    public long countActive() {
        return count("active = true");
    }

    /**
     * Count athletes by venue.
     */
    public long countByVenue(Long venueId) {
        return count("venue.id = ?1 AND active = true", venueId);
    }

    /**
     * Count athletes by sport.
     */
    public long countBySport(Long sportId) {
        return count("sport.id = ?1 AND active = true", sportId);
    }

    // Dashboard statistics methods
    
    /**
     * Count total active athletes.
     */
    public Integer countActiveAthletes() {
        return Math.toIntExact(count("active = true"));
    }
    
    /**
     * Count active athletes by venues.
     */
    public Integer countActiveAthletesByVenues(Set<Long> venueIds) {
        if (venueIds.isEmpty()) return 0;
        return Math.toIntExact(count("active = true AND venue.id IN ?1", venueIds));
    }
    
    /**
     * Count new athletes since date.
     */
    public Integer countNewAthletesSince(LocalDateTime since) {
        return Math.toIntExact(count("active = true AND createdAt >= ?1", since));
    }
    
    /**
     * Count new athletes since date by venues.
     */
    public Integer countNewAthletesSinceByVenues(LocalDateTime since, Set<Long> venueIds) {
        if (venueIds.isEmpty()) return 0;
        return Math.toIntExact(count("active = true AND createdAt >= ?1 AND venue.id IN ?2", since, venueIds));
    }
    
    /**
     * Get athletes count by sport.
     */
    public List<CountByName> getAthletesCountBySport() {
        return getEntityManager()
                .createQuery("SELECT s.name, COUNT(a) " +
                           "FROM Athlete a JOIN a.sport s WHERE a.active = true " +
                           "GROUP BY s.name ORDER BY COUNT(a) DESC", Object[].class)
                .getResultList()
                .stream()
                .map(result -> new CountByName((String) result[0], ((Number) result[1]).intValue()))
                .toList();
    }
    
    /**
     * Get athletes count by sport filtered by venues and sports.
     */
    public List<CountByName> getAthletesCountBySportFiltered(Set<Long> venueIds, Set<Long> sportIds) {
        if (venueIds.isEmpty()) return List.of();
        
        String query = "SELECT s.name, COUNT(a) " +
                      "FROM Athlete a JOIN a.sport s WHERE a.active = true AND a.venue.id IN :venueIds";
        
        if (!sportIds.isEmpty()) {
            query += " AND s.id IN :sportIds";
        }
        query += " GROUP BY s.name ORDER BY COUNT(a) DESC";
        
        var typedQuery = getEntityManager().createQuery(query, Object[].class)
                .setParameter("venueIds", venueIds);
        
        if (!sportIds.isEmpty()) {
            typedQuery.setParameter("sportIds", sportIds);
        }
        
        return typedQuery.getResultList()
                .stream()
                .map(result -> new CountByName((String) result[0], ((Number) result[1]).intValue()))
                .toList();
    }
    
    /**
     * Get athletes count by venue.
     */
    public List<CountByName> getAthletesCountByVenue() {
        return getEntityManager()
                .createQuery("SELECT v.name, COUNT(a) " +
                           "FROM Athlete a JOIN a.venue v WHERE a.active = true " +
                           "GROUP BY v.name ORDER BY COUNT(a) DESC", Object[].class)
                .getResultList()
                .stream()
                .map(result -> new CountByName((String) result[0], ((Number) result[1]).intValue()))
                .toList();
    }
    
    /**
     * Get athletes count by venue filtered.
     */
    public List<CountByName> getAthletesCountByVenueFiltered(Set<Long> venueIds) {
        if (venueIds.isEmpty()) return List.of();
        
        return getEntityManager()
                .createQuery("SELECT v.name, COUNT(a) " +
                           "FROM Athlete a JOIN a.venue v WHERE a.active = true AND v.id IN :venueIds " +
                           "GROUP BY v.name ORDER BY COUNT(a) DESC", Object[].class)
                .setParameter("venueIds", venueIds)
                .getResultList()
                .stream()
                .map(result -> new CountByName((String) result[0], ((Number) result[1]).intValue()))
                .toList();
    }
    
    /**
     * Count minors without guardian.
     */
    public Integer countMinorsWithoutGuardian() {
        LocalDate eighteenYearsAgo = LocalDate.now().minusYears(18);
        return Math.toIntExact(count(
            "active = true AND birthDate > ?1 AND NOT EXISTS " +
            "(SELECT 1 FROM AthleteGuardian ag WHERE ag.athlete = this AND ag.active = true)",
            eighteenYearsAgo
        ));
    }
    
    /**
     * Count minors without guardian by venues.
     */
    public Integer countMinorsWithoutGuardianByVenues(Set<Long> venueIds) {
        if (venueIds.isEmpty()) return 0;
        LocalDate eighteenYearsAgo = LocalDate.now().minusYears(18);
        return Math.toIntExact(count(
            "active = true AND venue.id IN ?1 AND birthDate > ?2 AND NOT EXISTS " +
            "(SELECT 1 FROM AthleteGuardian ag WHERE ag.athlete = this AND ag.active = true)",
            venueIds, eighteenYearsAgo
        ));
    }

    /**
     * Build sort criteria from filters.
     */
    private Sort buildSort(AthleteFilters filters) {
        String sortField = filters.getSort();
        Sort.Direction direction = filters.isDescending() ? Sort.Direction.Descending : Sort.Direction.Ascending;

        // Map DTO field names to entity field names
        return switch (sortField) {
            case "fullName" -> Sort.by("fullName", direction);
            case "age" -> Sort.by("birthDate", direction == Sort.Direction.Ascending ? 
                                Sort.Direction.Descending : Sort.Direction.Ascending); // Invert for age
            case "registrationDate" -> Sort.by("registrationDate", direction);
            case "createdAt" -> Sort.by("createdAt", direction);
            default -> Sort.by("fullName", Sort.Direction.Ascending);
        };
    }
}