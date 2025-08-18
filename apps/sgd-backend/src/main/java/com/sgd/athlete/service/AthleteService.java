package com.sgd.athlete.service;

import com.sgd.athlete.dto.*;
import com.sgd.athlete.entity.Athlete;
import com.sgd.athlete.entity.AthleteGuardian;
import com.sgd.athlete.repository.AthleteGuardianRepository;
import com.sgd.athlete.repository.AthleteRepository;
import com.sgd.club.entity.Club;
import com.sgd.club.entity.Venue;
import com.sgd.club.repository.ClubRepository;
import com.sgd.club.repository.VenueRepository;
import com.sgd.guardian.entity.Guardian;
import com.sgd.guardian.repository.GuardianRepository;
import com.sgd.shared.dto.PageResponse;
import com.sgd.shared.exception.BusinessException;
import com.sgd.shared.security.SecurityContext;
import com.sgd.sport.entity.Category;
import com.sgd.sport.entity.Sport;
import com.sgd.sport.repository.CategoryRepository;
import com.sgd.sport.repository.SportRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for Athlete operations.
 * Contains business logic, validation rules, and transaction management.
 */
@ApplicationScoped
public class AthleteService {

    @Inject
    AthleteRepository athleteRepository;

    @Inject
    AthleteGuardianRepository athleteGuardianRepository;

    @Inject
    ClubRepository clubRepository;

    @Inject
    VenueRepository venueRepository;

    @Inject
    SportRepository sportRepository;

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    GuardianRepository guardianRepository;

    @Inject
    SecurityContext securityContext;

    @Inject
    AthleteMapper athleteMapper;
    
    @Inject
    EntityManager entityManager;

    /**
     * Get paginated list of athletes with filters and security restrictions.
     */
    public PageResponse<AthleteResponse> getAthletes(@Valid AthleteFilters filters) {
        // Apply security filtering based on user role
        List<Long> allowedVenueIds = securityContext.getAllowedVenuesForFiltering();
        
        // Get paginated query with filters
        PanacheQuery<Athlete> query = athleteRepository.findWithFilters(filters, allowedVenueIds);
        
        // Execute pagination
        PageResponse<Athlete> athletePage = PageResponse.of(query, filters.getPage(), filters.getSize());
        
        // Convert to DTOs (using simple response for list view performance)
        List<AthleteResponse> athleteResponses = athletePage.getContent().stream()
                .map(athleteMapper::toSimpleResponse)
                .toList();
        
        return new PageResponse<>(athleteResponses, athletePage.getPagination());
    }

    /**
     * Get athlete by ID with full details.
     */
    public AthleteResponse getAthleteById(Long athleteId) {
        Athlete athlete = athleteRepository.findActiveByIdWithRelations(athleteId)
                .orElseThrow(() -> new BusinessException.AthleteNotFound(athleteId));
        
        // Check access permissions
        validateAthleteAccess(athlete);
        
        return athleteMapper.toResponse(athlete);
    }

    /**
     * Create new athlete with validation and guardian associations.
     */
    @Transactional
    public AthleteResponse createAthlete(@Valid AthleteCreateRequest request) {
        // Validate and load related entities
        Club club = null;
        Venue venue = loadAndValidateVenue(request.getVenueId());
        Sport sport = loadAndValidateSport(request.getSportId());
        Category category = loadAndValidateCategory(request.getCategoryId(), sport);
        
        // Get club from venue
        if (venue != null) {
            club = venue.getClub();
        }

        // Validate business rules
        validateAthleteCreation(request, venue, club, category);
        
        // Create athlete entity
        Athlete athlete = new Athlete();
        athlete.setFullName(request.getFullName());
        athlete.setBirthDate(request.getBirthDate());
        athlete.setGender(request.getGender());
        athlete.setEmail(cleanString(request.getEmail()));
        athlete.setPhone(cleanString(request.getPhone()));
        athlete.setAddress(cleanString(request.getAddress()));
        athlete.setIdentificationNumber(cleanString(request.getIdentificationNumber()));
        athlete.setEmergencyContact(cleanString(request.getEmergencyContact()));
        athlete.setEmergencyPhone(cleanString(request.getEmergencyPhone()));
        athlete.setMedicalNotes(cleanString(request.getMedicalNotes()));
        athlete.setClub(club);
        athlete.setVenue(venue);
        athlete.setSport(sport);
        athlete.setCategory(category);

        // Save athlete
        athleteRepository.persist(athlete);
        
        // Handle guardian associations
        if (request.getGuardians() != null && !request.getGuardians().isEmpty()) {
            associateGuardians(athlete, request.getGuardians());
            // Flush to ensure associations are persisted
            entityManager.flush();
            // Refresh athlete to get updated relationships
            entityManager.refresh(athlete);
        }

        // Validate minor guardian requirement after associations
        validateMinorGuardianRequirement(athlete);
        
        // Reload with relationships for response
        final Long athleteId = athlete.getId();
        athlete = athleteRepository.findActiveByIdWithRelations(athleteId)
                .orElseThrow(() -> new BusinessException.AthleteNotFound(athleteId));
        
        return athleteMapper.toResponse(athlete);
    }

    /**
     * Update existing athlete.
     */
    @Transactional
    public AthleteResponse updateAthlete(Long athleteId, @Valid AthleteUpdateRequest request) {
        Athlete athlete = athleteRepository.findActiveById(athleteId)
                .orElseThrow(() -> new BusinessException.AthleteNotFound(athleteId));
        
        // Check access permissions
        validateAthleteAccess(athlete);
        
        // Validate business rules for update
        validateAthleteUpdate(request, athlete);
        
        // Update basic fields
        athleteMapper.updateAthleteFromRequest(athlete, request);
        
        // Handle venue change
        if (request.getVenueId() != null && !request.getVenueId().equals(athlete.getVenue().getId())) {
            Venue newVenue = loadAndValidateVenue(request.getVenueId());
            // Ensure venue belongs to same club
            if (!newVenue.getClub().getId().equals(athlete.getClub().getId())) {
                throw new BusinessException("VENUE_CLUB_MISMATCH", 
                    "La nueva sede debe pertenecer al mismo club del atleta");
            }
            athlete.setVenue(newVenue);
        }
        
        // Handle category change
        if (request.getCategoryId() != null && !request.getCategoryId().equals(athlete.getCategory().getId())) {
            Category newCategory = loadAndValidateCategory(request.getCategoryId(), athlete.getSport());
            // Validate age compatibility
            if (!newCategory.isValidForAge(athlete.getAge())) {
                throw new BusinessException.CategoryAgeMismatch(
                    athlete.getAge(), newCategory.getName(), 
                    newCategory.getMinAge(), newCategory.getMaxAge());
            }
            athlete.setCategory(newCategory);
        }
        
        // Save changes
        athleteRepository.persist(athlete);
        
        // Reload with relationships for response
        final Long athleteIdForReload = athlete.getId();
        athlete = athleteRepository.findActiveByIdWithRelations(athleteIdForReload)
                .orElseThrow(() -> new BusinessException.AthleteNotFound(athleteIdForReload));
        
        return athleteMapper.toResponse(athlete);
    }

    /**
     * Soft delete athlete.
     */
    @Transactional
    public void deleteAthlete(Long athleteId) {
        Athlete athlete = athleteRepository.findActiveById(athleteId)
                .orElseThrow(() -> new BusinessException.AthleteNotFound(athleteId));
        
        // Check access permissions (only ADMIN_GENERAL can delete)
        if (!securityContext.canDeleteAthletes()) {
            throw new BusinessException("ACCESS_DENIED", "Sin permisos para eliminar atletas");
        }
        
        // Check if athlete can be deleted
        if (!athlete.canBeDeleted()) {
            throw new BusinessException.CannotDeleteActiveEntity(
                "atleta", athlete.getFullName(), "el atleta tiene dependencias activas");
        }
        
        // Soft delete athlete and guardian associations
        athlete.deactivate();
        athleteGuardianRepository.deactivateAllByAthlete(athleteId);
        
        athleteRepository.persist(athlete);
    }

    /**
     * Get guardians of specific athlete.
     */
    public List<AthleteResponse.GuardianInfo> getAthleteGuardians(Long athleteId) {
        Athlete athlete = athleteRepository.findActiveById(athleteId)
                .orElseThrow(() -> new BusinessException.AthleteNotFound(athleteId));
        
        // Check access permissions
        validateAthleteAccess(athlete);
        
        List<AthleteGuardian> athleteGuardians = athleteGuardianRepository
                .findActiveByAthleteWithGuardians(athleteId);
        
        return athleteMapper.mapGuardianInfoList(athleteGuardians);
    }

    /**
     * Associate guardian to athlete.
     */
    @Transactional
    public void associateGuardian(Long athleteId, @Valid GuardianAssociationRequest request) {
        Athlete athlete = athleteRepository.findActiveById(athleteId)
                .orElseThrow(() -> new BusinessException.AthleteNotFound(athleteId));
        
        Guardian guardian = guardianRepository.findActiveById(request.getGuardianId())
                .orElseThrow(() -> new BusinessException.GuardianNotFound(request.getGuardianId()));
        
        // Check access permissions
        validateAthleteAccess(athlete);
        
        // Check if association already exists
        Optional<AthleteGuardian> existingAssociation = athleteGuardianRepository
                .findByAthleteAndGuardian(athleteId, request.getGuardianId());
        
        if (existingAssociation.isPresent()) {
            if (existingAssociation.get().isActive()) {
                throw new BusinessException.GuardianAlreadyAssociated(
                    athlete.getFullName(), guardian.getFullName());
            } else {
                // Reactivate existing association
                AthleteGuardian association = existingAssociation.get();
                association.setRelationship(request.getRelationship());
                association.setIsPrimary(request.getIsPrimary());
                association.activate();
                
                // Handle primary guardian logic
                if (request.getIsPrimary()) {
                    athleteGuardianRepository.removePrimaryStatusFromAthlete(athleteId);
                    association.setIsPrimary(true);
                }
                
                athleteGuardianRepository.persist(association);
                return;
            }
        }
        
        // Check primary guardian constraint
        if (request.getIsPrimary() && athleteGuardianRepository.hasPrimaryGuardian(athleteId)) {
            throw new BusinessException.PrimaryGuardianExists(athlete.getFullName());
        }
        
        // Create new association
        AthleteGuardian association = new AthleteGuardian(athlete, guardian, 
                                                         request.getRelationship(), 
                                                         request.getIsPrimary());
        
        // Handle primary guardian logic
        if (request.getIsPrimary()) {
            athleteGuardianRepository.removePrimaryStatusFromAthlete(athleteId);
        }
        
        athleteGuardianRepository.persist(association);
    }

    // Private helper methods

    private void validateAthleteCreation(AthleteCreateRequest request, Venue venue, 
                                       Club club, Category category) {
        // Check email uniqueness
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (athleteRepository.existsByEmailAndNotId(request.getEmail(), null)) {
                throw new BusinessException.DuplicateEmail(request.getEmail());
            }
        }
        
        // Check identification number uniqueness
        if (request.getIdentificationNumber() != null && !request.getIdentificationNumber().trim().isEmpty()) {
            if (athleteRepository.existsByIdentificationAndNotId(request.getIdentificationNumber(), null)) {
                throw new BusinessException.DuplicateAthlete(request.getIdentificationNumber());
            }
        }
        
        // Check age vs category compatibility
        int age = java.time.Period.between(request.getBirthDate(), java.time.LocalDate.now()).getYears();
        if (!category.isValidForAge(age)) {
            throw new BusinessException.CategoryAgeMismatch(
                age, category.getName(), category.getMinAge(), category.getMaxAge());
        }
        
        // Check venue access
        if (!securityContext.canAccessVenue(venue.getId())) {
            throw new BusinessException.VenueAccessDenied(venue.getId());
        }
        
        // Check club access
        if (!securityContext.canAccessClub(club.getId())) {
            throw new BusinessException.ClubAccessDenied(club.getId());
        }
    }

    private void validateAthleteUpdate(AthleteUpdateRequest request, Athlete athlete) {
        // Check email uniqueness
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (athleteRepository.existsByEmailAndNotId(request.getEmail(), athlete.getId())) {
                throw new BusinessException.DuplicateEmail(request.getEmail());
            }
        }
        
        // Venue change validation handled in update method
    }

    private void validateAthleteAccess(Athlete athlete) {
        if (!securityContext.canAccessVenue(athlete.getVenue().getId())) {
            throw new BusinessException.VenueAccessDenied(athlete.getVenue().getId());
        }
    }

    private void validateMinorGuardianRequirement(Athlete athlete) {
        if (athlete.isMinor() && !athlete.hasActiveGuardians()) {
            throw new BusinessException.MinorRequiresGuardian(athlete.getFullName(), athlete.getAge());
        }
    }

    private Venue loadAndValidateVenue(Long venueId) {
        return venueRepository.findByIdWithClub(venueId)
                .orElseThrow(() -> new BusinessException.VenueNotFound(venueId));
    }

    private Sport loadAndValidateSport(Long sportId) {
        return sportRepository.findActiveById(sportId)
                .orElseThrow(() -> new BusinessException.SportNotFound(sportId));
    }

    private Category loadAndValidateCategory(Long categoryId, Sport expectedSport) {
        Category category = categoryRepository.findByIdWithSport(categoryId)
                .orElseThrow(() -> new BusinessException.CategoryNotFound(categoryId));
        
        if (!category.getSport().getId().equals(expectedSport.getId())) {
            throw new BusinessException.InvalidCategoryForSport(
                category.getName(), expectedSport.getName());
        }
        
        return category;
    }

    private void associateGuardians(Athlete athlete, List<AthleteCreateRequest.GuardianAssociation> guardianAssociations) {
        boolean hasPrimary = false;
        
        for (AthleteCreateRequest.GuardianAssociation guardianAssoc : guardianAssociations) {
            Guardian guardian = guardianRepository.findActiveById(guardianAssoc.getGuardianId())
                    .orElseThrow(() -> new BusinessException.GuardianNotFound(guardianAssoc.getGuardianId()));
            
            // Check primary constraint
            if (guardianAssoc.getIsPrimary()) {
                if (hasPrimary) {
                    throw new BusinessException("MULTIPLE_PRIMARY_GUARDIANS", 
                        "Solo se puede asignar un tutor primario por atleta");
                }
                hasPrimary = true;
            }
            
            AthleteGuardian association = new AthleteGuardian(athlete, guardian, 
                                                           guardianAssoc.getRelationship(), 
                                                           guardianAssoc.getIsPrimary());
            athleteGuardianRepository.persist(association);
        }
    }

    private String cleanString(String value) {
        return (value != null && value.trim().isEmpty()) ? null : value;
    }
}