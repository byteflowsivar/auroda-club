package com.sgd.guardian.service;

import com.sgd.athlete.entity.AthleteGuardian;
import com.sgd.athlete.repository.AthleteGuardianRepository;
import com.sgd.guardian.dto.*;
import com.sgd.guardian.entity.Guardian;
import com.sgd.guardian.repository.GuardianRepository;
import com.sgd.shared.dto.PageResponse;
import com.sgd.shared.exception.BusinessException;
import com.sgd.shared.security.SecurityContext;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for Guardian operations.
 * Contains business logic, validation rules, and transaction management.
 */
@ApplicationScoped
public class GuardianService {

    @Inject
    GuardianRepository guardianRepository;

    @Inject
    AthleteGuardianRepository athleteGuardianRepository;

    @Inject
    SecurityContext securityContext;

    @Inject
    GuardianMapper guardianMapper;

    /**
     * Get paginated list of guardians with filters.
     */
    public PageResponse<GuardianResponse> getGuardians(@Valid GuardianFilters filters) {
        // Build query based on filters
        PanacheQuery<Guardian> query = buildFilteredQuery(filters);
        
        // Execute pagination
        PageResponse<Guardian> guardianPage = PageResponse.of(query, filters.getPage(), filters.getSize());
        
        // Convert to DTOs (using simple response for list view performance)
        List<GuardianResponse> guardianResponses = guardianPage.getContent().stream()
                .map(guardianMapper::toSimpleResponse)
                .toList();
        
        return new PageResponse<>(guardianResponses, guardianPage.getPagination());
    }

    /**
     * Get guardian by ID with full details including athletes.
     */
    public GuardianResponse getGuardianById(Long guardianId) {
        Guardian guardian = guardianRepository.findByIdWithAthletes(guardianId)
                .orElseThrow(() -> new BusinessException.GuardianNotFound(guardianId));
        
        // Check access permissions - guardians visible to users who can see associated athletes
        validateGuardianAccess(guardian);
        
        return guardianMapper.toResponse(guardian);
    }

    /**
     * Create new guardian with validation.
     */
    @Transactional
    public GuardianResponse createGuardian(@Valid GuardianCreateRequest request) {
        // Validate business rules
        validateGuardianCreation(request);
        
        // Create guardian entity
        Guardian guardian = new Guardian();
        guardian.setFullName(request.getFullName());
        guardian.setEmail(cleanString(request.getEmail()));
        guardian.setPhone(cleanString(request.getPhone()));
        guardian.setSecondaryPhone(cleanString(request.getSecondaryPhone()));
        guardian.setAddress(cleanString(request.getAddress()));
        guardian.setIdentificationNumber(cleanString(request.getIdentificationNumber()));

        // Save guardian
        guardianRepository.persist(guardian);
        
        return guardianMapper.toSimpleResponse(guardian);
    }

    /**
     * Update existing guardian.
     */
    @Transactional
    public GuardianResponse updateGuardian(Long guardianId, @Valid GuardianUpdateRequest request) {
        Guardian guardian = guardianRepository.findActiveById(guardianId)
                .orElseThrow(() -> new BusinessException.GuardianNotFound(guardianId));
        
        // Check access permissions
        validateGuardianAccess(guardian);
        
        // Validate business rules for update
        validateGuardianUpdate(request, guardian);
        
        // Update fields
        guardianMapper.updateGuardianFromRequest(guardian, request);
        
        // Validate that guardian still has contact info after update
        if (!guardian.hasContactInfo()) {
            throw new BusinessException("INVALID_CONTACT_INFO", 
                "El tutor debe tener al menos un método de contacto (email o teléfono)");
        }
        
        // Save changes
        guardianRepository.persist(guardian);
        
        // Reload with relationships for response
        final Long guardianIdForReload = guardian.getId();
        guardian = guardianRepository.findByIdWithAthletes(guardianIdForReload)
                .orElseThrow(() -> new BusinessException.GuardianNotFound(guardianIdForReload));
        
        return guardianMapper.toResponse(guardian);
    }

    /**
     * Get athletes associated with a guardian.
     */
    public List<GuardianResponse.AthleteInfo> getGuardianAthletes(Long guardianId) {
        Guardian guardian = guardianRepository.findActiveById(guardianId)
                .orElseThrow(() -> new BusinessException.GuardianNotFound(guardianId));
        
        // Check access permissions
        validateGuardianAccess(guardian);
        
        List<AthleteGuardian> athleteGuardians = athleteGuardianRepository
                .findActiveByGuardianWithAthletes(guardianId);
        
        // Filter athletes based on user permissions
        List<AthleteGuardian> accessibleAthleteGuardians = athleteGuardians.stream()
                .filter(ag -> securityContext.canAccessVenue(ag.getAthlete().getVenue().getId()))
                .toList();
        
        return guardianMapper.mapAthleteInfoList(accessibleAthleteGuardians);
    }

    /**
     * Soft delete guardian.
     */
    @Transactional
    public void deleteGuardian(Long guardianId) {
        Guardian guardian = guardianRepository.findActiveById(guardianId)
                .orElseThrow(() -> new BusinessException.GuardianNotFound(guardianId));
        
        // Check access permissions (only ADMIN_GENERAL can delete)
        if (!securityContext.canDeleteGuardians()) {
            throw new BusinessException("ACCESS_DENIED", "Sin permisos para eliminar tutores");
        }
        
        // Check if guardian can be deleted
        if (!guardian.canBeDeleted()) {
            throw new BusinessException.CannotDeleteActiveEntity(
                "tutor", guardian.getFullName(), "el tutor tiene atletas asociados activos");
        }
        
        // Soft delete guardian and associations
        guardian.deactivate();
        athleteGuardianRepository.deactivateAllByGuardian(guardianId);
        
        guardianRepository.persist(guardian);
    }

    // Private helper methods

    private PanacheQuery<Guardian> buildFilteredQuery(GuardianFilters filters) {
        // Start with base query
        PanacheQuery<Guardian> query;
        
        // Apply search filter
        if (filters.hasSearchTerm()) {
            query = guardianRepository.searchByNameOrEmail(filters.getCleanSearchTerm());
        } else {
            query = guardianRepository.findAllActivePaged();
        }
        
        // Apply hasAthletes filter if specified
        if (filters.getHasAthletes() != null) {
            if (filters.getHasAthletes()) {
                query = guardianRepository.findWithActiveAthletes();
            } else {
                query = guardianRepository.findWithoutAthletes();
            }
            
            // If we also have a search term, combine with search
            if (filters.hasSearchTerm()) {
                String searchPattern = "%" + filters.getCleanSearchTerm() + "%";
                String hasAthletesCondition = filters.getHasAthletes() 
                    ? "EXISTS (SELECT 1 FROM AthleteGuardian ag WHERE ag.guardian = g AND ag.active = true)"
                    : "NOT EXISTS (SELECT 1 FROM AthleteGuardian ag WHERE ag.guardian = g AND ag.active = true)";
                
                query = guardianRepository.find(
                    "SELECT g FROM Guardian g WHERE g.active = true AND " +
                    "(LOWER(g.fullName) LIKE ?1 OR LOWER(g.email) LIKE ?1) AND " +
                    hasAthletesCondition + " ORDER BY g." + filters.getSort() + 
                    (filters.isDescending() ? " DESC" : " ASC"),
                    searchPattern
                );
            }
        }
        
        // Apply active filter
        if (filters.getActive() != null && !filters.getActive()) {
            // If requesting inactive guardians, modify query
            String baseCondition = filters.hasSearchTerm() 
                ? "(LOWER(fullName) LIKE ?1 OR LOWER(email) LIKE ?1) AND active = false"
                : "active = false";
            query = guardianRepository.find(baseCondition + " ORDER BY " + filters.getSort() + 
                                          (filters.isDescending() ? " DESC" : " ASC"));
        }
        
        return query;
    }

    private void validateGuardianCreation(GuardianCreateRequest request) {
        // Check contact info requirement
        if (!request.hasValidContactInfo()) {
            throw new BusinessException("INVALID_CONTACT_INFO", 
                "El tutor debe tener al menos un método de contacto (email o teléfono)");
        }
        
        // Check email uniqueness
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (guardianRepository.existsByEmailAndNotId(request.getEmail(), null)) {
                throw new BusinessException.DuplicateEmail(request.getEmail());
            }
        }
        
        // Check identification number uniqueness
        if (request.getIdentificationNumber() != null && !request.getIdentificationNumber().trim().isEmpty()) {
            if (guardianRepository.existsByIdentificationAndNotId(request.getIdentificationNumber(), null)) {
                throw new BusinessException("DUPLICATE_IDENTIFICATION", 
                    "Ya existe un tutor con este número de identificación: " + request.getIdentificationNumber());
            }
        }
    }

    private void validateGuardianUpdate(GuardianUpdateRequest request, Guardian guardian) {
        // If request doesn't have updates, that's OK
        if (!request.hasUpdates()) {
            return;
        }
        
        // Check email uniqueness
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (guardianRepository.existsByEmailAndNotId(request.getEmail(), guardian.getId())) {
                throw new BusinessException.DuplicateEmail(request.getEmail());
            }
        }
        
        // Check identification number uniqueness
        if (request.getIdentificationNumber() != null && !request.getIdentificationNumber().trim().isEmpty()) {
            if (guardianRepository.existsByIdentificationAndNotId(request.getIdentificationNumber(), guardian.getId())) {
                throw new BusinessException("DUPLICATE_IDENTIFICATION", 
                    "Ya existe un tutor con este número de identificación: " + request.getIdentificationNumber());
            }
        }
        
        // Check that update won't remove all contact info
        String newEmail = request.getEmail() != null ? request.getEmail() : guardian.getEmail();
        String newPhone = request.getPhone() != null ? request.getPhone() : guardian.getPhone();
        
        if ((newEmail == null || newEmail.trim().isEmpty()) && 
            (newPhone == null || newPhone.trim().isEmpty())) {
            throw new BusinessException("INVALID_CONTACT_INFO", 
                "El tutor debe mantener al menos un método de contacto (email o teléfono)");
        }
    }

    private void validateGuardianAccess(Guardian guardian) {
        // Guardians are accessible if user can access any of their associated athletes
        List<AthleteGuardian> athleteGuardians = athleteGuardianRepository
                .findActiveByGuardianWithAthletes(guardian.getId());
        
        boolean hasAccess = athleteGuardians.stream()
                .anyMatch(ag -> securityContext.canAccessVenue(ag.getAthlete().getVenue().getId()));
        
        if (!hasAccess && !securityContext.isAdminGeneral()) {
            throw new BusinessException("ACCESS_DENIED", 
                "Sin permisos para acceder a este tutor");
        }
    }

    private String cleanString(String value) {
        return (value != null && value.trim().isEmpty()) ? null : value;
    }
}