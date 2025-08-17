package com.sgd.sport.service;

import com.sgd.shared.security.SecurityContext;
import com.sgd.sport.dto.CategoryCreateRequest;
import com.sgd.sport.dto.CategoryResponse;
import com.sgd.sport.dto.CategoryUpdateRequest;
import com.sgd.sport.dto.SportCreateRequest;
import com.sgd.sport.dto.SportResponse;
import com.sgd.sport.dto.SportUpdateRequest;
import com.sgd.sport.entity.Category;
import com.sgd.sport.entity.Sport;
import com.sgd.sport.repository.CategoryRepository;
import com.sgd.sport.repository.SportRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

/**
 * Service layer for Sport operations.
 * Contains business logic for sport and category management.
 */
@ApplicationScoped
public class SportService {

    @Inject
    SportRepository sportRepository;

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    SecurityContext securityContext;

    @Inject
    SportMapper sportMapper;

    /**
     * Get all sports accessible by current user.
     * All authenticated users can see all active sports.
     */
    public List<SportResponse> getSports() {
        List<Sport> sports;
        
        if (shouldIncludeCategories()) {
            // Load sports with categories for detailed view
            sports = sportRepository.findAllActiveWithCategories();
        } else {
            // Simple sports list without categories
            sports = sportRepository.findAllActive();
        }
        
        return filterSportsByUserAccess(sports);
    }

    /**
     * Get sports with categories included.
     */
    public List<SportResponse> getSportsWithCategories() {
        List<Sport> sports = sportRepository.findAllActiveWithCategories();
        return filterSportsByUserAccess(sports);
    }

    /**
     * Get sport by ID with categories.
     */
    public SportResponse getSportById(Long sportId) {
        Sport sport = sportRepository.findByIdWithCategories(sportId)
                .orElseThrow(() -> new RuntimeException("Sport con ID " + sportId + " no encontrado"));
        
        return sportMapper.toResponse(sport);
    }

    /**
     * Get categories by sport ID.
     * Optionally filter by age if provided.
     */
    public List<CategoryResponse> getCategoriesBySportId(Long sportId, Integer age) {
        // Verify sport exists
        Sport sport = sportRepository.findActiveById(sportId)
                .orElseThrow(() -> new RuntimeException("Sport con ID " + sportId + " no encontrado"));
        
        List<Category> categories;
        
        if (age != null) {
            // Filter categories valid for specific age
            categories = categoryRepository.findValidForAgeAndSport(age, sportId);
        } else {
            // Get all categories for the sport
            categories = categoryRepository.findBySportId(sportId);
        }
        
        return categories.stream()
                .map(sportMapper::toCategoryResponse)
                .toList();
    }

    /**
     * Get category by ID.
     */
    public CategoryResponse getCategoryById(Long categoryId) {
        Category category = categoryRepository.findByIdWithSport(categoryId)
                .orElseThrow(() -> new RuntimeException("Category con ID " + categoryId + " no encontrada"));
        
        return sportMapper.toCategoryResponse(category);
    }

    /**
     * Get categories valid for specific age across all sports.
     */
    public List<CategoryResponse> getCategoriesByAge(Integer age) {
        if (age == null || age < 0 || age > 100) {
            throw new IllegalArgumentException("Edad debe estar entre 0 y 100 años");
        }
        
        List<Category> categories = categoryRepository.findValidForAge(age);
        
        return categories.stream()
                .map(sportMapper::toCategoryResponse)
                .toList();
    }

    /**
     * Get simple sports list for dropdowns/selectors.
     * Returns only basic information without categories.
     */
    public List<SportResponse> getSportsForSelection() {
        List<Sport> sports = getUserAccessibleSports();
        
        return sports.stream()
                .map(sportMapper::toSimpleResponse)
                .toList();
    }

    /**
     * Get simple categories list for dropdowns/selectors.
     * Optionally filtered by sport and/or age.
     */
    public List<CategoryResponse> getCategoriesForSelection(Long sportId, Integer age) {
        List<Category> categories;
        
        if (sportId != null && age != null) {
            categories = categoryRepository.findValidForAgeAndSport(age, sportId);
        } else if (sportId != null) {
            categories = categoryRepository.findBySportId(sportId);
        } else if (age != null) {
            categories = categoryRepository.findValidForAge(age);
        } else {
            categories = categoryRepository.findAllActive();
        }
        
        return categories.stream()
                .map(sportMapper::toSimpleCategoryResponse)
                .toList();
    }

    /**
     * Validate if category is valid for athlete age.
     */
    public boolean isCategoryValidForAge(Long categoryId, int age) {
        return categoryRepository.isValidForAge(categoryId, age);
    }

    /**
     * Validate if category belongs to sport.
     */
    public boolean categoryBelongsToSport(Long categoryId, Long sportId) {
        return categoryRepository.belongsToSport(categoryId, sportId);
    }

    // Private helper methods

    private boolean shouldIncludeCategories() {
        // For now, include categories by default
        // This could be controlled by a query parameter in the future
        return true;
    }

    private List<SportResponse> filterSportsByUserAccess(List<Sport> sports) {
        List<Long> userSportIds = securityContext.getCurrentUserSportIds();
        
        if (securityContext.isGeneralAdmin() || userSportIds.isEmpty()) {
            // Admin or users without sport restrictions see all sports
            return sports.stream()
                    .map(sportMapper::toResponse)
                    .toList();
        } else {
            // Filter sports by user access
            return sports.stream()
                    .filter(sport -> userSportIds.contains(sport.getId()))
                    .map(sportMapper::toResponse)
                    .toList();
        }
    }

    private List<Sport> getUserAccessibleSports() {
        List<Long> userSportIds = securityContext.getCurrentUserSportIds();
        
        if (securityContext.isGeneralAdmin() || userSportIds.isEmpty()) {
            // Admin or users without sport restrictions see all sports
            return sportRepository.findAllActive();
        } else {
            // Filter sports by user access
            return sportRepository.findByIds(userSportIds);
        }
    }

    // ===== CRUD OPERATIONS =====

    /**
     * Create new sport.
     */
    @Transactional
    public SportResponse createSport(SportCreateRequest request) {
        // Validate business rules
        validateSportCreateRequest(request);

        // Check if sport name already exists
        if (sportRepository.existsByNameAndNotId(request.getName(), null)) {
            throw new IllegalArgumentException("Ya existe un deporte con el nombre: " + request.getName());
        }

        // Create and save sport
        Sport sport = sportMapper.toEntity(request);
        sportRepository.persist(sport);

        return sportMapper.toResponse(sport);
    }

    /**
     * Update existing sport.
     */
    @Transactional
    public SportResponse updateSport(Long sportId, SportUpdateRequest request) {
        // Validate business rules
        validateSportUpdateRequest(request);

        // Find existing sport
        Sport sport = sportRepository.findActiveById(sportId)
                .orElseThrow(() -> new RuntimeException("Sport con ID " + sportId + " no encontrado"));

        // Check if sport name already exists (excluding current sport)
        if (sportRepository.existsByNameAndNotId(request.getName(), sportId)) {
            throw new IllegalArgumentException("Ya existe un deporte con el nombre: " + request.getName());
        }

        // Update sport
        sportMapper.updateEntity(sport, request);
        sportRepository.persist(sport);

        return sportMapper.toResponse(sport);
    }

    /**
     * Delete sport (soft delete).
     * Only allowed if sport has no active categories.
     */
    @Transactional
    public void deleteSport(Long sportId) {
        Sport sport = sportRepository.findActiveById(sportId)
                .orElseThrow(() -> new RuntimeException("Sport con ID " + sportId + " no encontrado"));

        // Check if sport has active categories
        long activeCategoriesCount = categoryRepository.countBySport(sportId);
        if (activeCategoriesCount > 0) {
            throw new IllegalArgumentException("No se puede eliminar el deporte porque tiene " + 
                    activeCategoriesCount + " categorías activas asociadas");
        }

        // Soft delete
        sport.setActive(false);
        sportRepository.persist(sport);
    }

    /**
     * Create new category.
     */
    @Transactional
    public CategoryResponse createCategory(CategoryCreateRequest request) {
        // Validate business rules
        validateCategoryCreateRequest(request);

        // Find sport
        Sport sport = sportRepository.findActiveById(request.getSportId())
                .orElseThrow(() -> new RuntimeException("Sport con ID " + request.getSportId() + " no encontrado"));

        // Check for overlapping age ranges
        List<Category> overlapping = categoryRepository.findOverlapping(
                request.getSportId(), request.getMinAge(), request.getMaxAge(), null);
        if (!overlapping.isEmpty()) {
            throw new IllegalArgumentException("El rango de edad " + request.getAgeRange() + 
                    " se superpone con la categoría existente: " + overlapping.get(0).getName());
        }

        // Create and save category
        Category category = sportMapper.toEntity(request);
        category.setSport(sport);
        categoryRepository.persist(category);

        return sportMapper.toCategoryResponse(category);
    }

    /**
     * Update existing category.
     */
    @Transactional
    public CategoryResponse updateCategory(Long categoryId, CategoryUpdateRequest request) {
        // Validate business rules
        validateCategoryUpdateRequest(request);

        // Find existing category
        Category category = categoryRepository.findActiveById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category con ID " + categoryId + " no encontrada"));

        // Find sport (can be changed)
        Sport sport = sportRepository.findActiveById(request.getSportId())
                .orElseThrow(() -> new RuntimeException("Sport con ID " + request.getSportId() + " no encontrado"));

        // Check for overlapping age ranges (excluding current category)
        List<Category> overlapping = categoryRepository.findOverlapping(
                request.getSportId(), request.getMinAge(), request.getMaxAge(), categoryId);
        if (!overlapping.isEmpty()) {
            throw new IllegalArgumentException("El rango de edad " + request.getAgeRange() + 
                    " se superpone con la categoría existente: " + overlapping.get(0).getName());
        }

        // Update category
        sportMapper.updateEntity(category, request);
        category.setSport(sport);
        categoryRepository.persist(category);

        return sportMapper.toCategoryResponse(category);
    }

    /**
     * Delete category (soft delete).
     */
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findActiveById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category con ID " + categoryId + " no encontrada"));

        // TODO: Check if category has associated athletes when that module is implemented
        // For now, allow deletion without checking

        // Soft delete
        category.setActive(false);
        categoryRepository.persist(category);
    }

    // ===== VALIDATION METHODS =====

    private void validateSportCreateRequest(SportCreateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Los datos del deporte son obligatorios");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del deporte es obligatorio");
        }
    }

    private void validateSportUpdateRequest(SportUpdateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Los datos del deporte son obligatorios");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del deporte es obligatorio");
        }
    }

    private void validateCategoryCreateRequest(CategoryCreateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Los datos de la categoría son obligatorios");
        }
        if (request.getSportId() == null) {
            throw new IllegalArgumentException("El ID del deporte es obligatorio");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la categoría es obligatorio");
        }
        if (request.getMinAge() == null || request.getMaxAge() == null) {
            throw new IllegalArgumentException("Las edades mínima y máxima son obligatorias");
        }
        if (!request.isAgeRangeValid()) {
            throw new IllegalArgumentException("La edad mínima debe ser menor o igual a la edad máxima");
        }
    }

    private void validateCategoryUpdateRequest(CategoryUpdateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Los datos de la categoría son obligatorios");
        }
        if (request.getSportId() == null) {
            throw new IllegalArgumentException("El ID del deporte es obligatorio");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la categoría es obligatorio");
        }
        if (request.getMinAge() == null || request.getMaxAge() == null) {
            throw new IllegalArgumentException("Las edades mínima y máxima son obligatorias");
        }
        if (!request.isAgeRangeValid()) {
            throw new IllegalArgumentException("La edad mínima debe ser menor o igual a la edad máxima");
        }
    }
}