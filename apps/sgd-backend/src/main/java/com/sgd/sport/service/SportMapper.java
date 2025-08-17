package com.sgd.sport.service;

import com.sgd.sport.dto.CategoryCreateRequest;
import com.sgd.sport.dto.CategoryResponse;
import com.sgd.sport.dto.CategoryUpdateRequest;
import com.sgd.sport.dto.SportCreateRequest;
import com.sgd.sport.dto.SportResponse;
import com.sgd.sport.dto.SportUpdateRequest;
import com.sgd.sport.entity.Category;
import com.sgd.sport.entity.Sport;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for Sport and Category entities and DTOs.
 * Handles conversion between domain entities and response DTOs.
 */
@ApplicationScoped
public class SportMapper {

    /**
     * Convert Sport entity to response DTO with categories.
     */
    public SportResponse toResponse(Sport sport) {
        if (sport == null) {
            return null;
        }

        SportResponse response = new SportResponse();
        response.setId(sport.getId());
        response.setName(sport.getName());
        response.setDescription(sport.getDescription());
        response.setActive(sport.isActive());
        response.setCreatedAt(sport.getCreatedAt());
        response.setUpdatedAt(sport.getUpdatedAt());

        // Map categories if loaded
        if (sport.getCategories() != null) {
            List<SportResponse.CategoryInfo> categoryInfos = sport.getCategories().stream()
                    .filter(Category::isActive)
                    .map(this::mapCategoryInfo)
                    .collect(Collectors.toList());
            response.setCategories(categoryInfos);
        }

        return response;
    }

    /**
     * Convert Sport entity to simple response DTO (without categories).
     */
    public SportResponse toSimpleResponse(Sport sport) {
        if (sport == null) {
            return null;
        }

        SportResponse response = new SportResponse();
        response.setId(sport.getId());
        response.setName(sport.getName());
        response.setDescription(sport.getDescription());
        response.setActive(sport.isActive());
        response.setCreatedAt(sport.getCreatedAt());
        response.setUpdatedAt(sport.getUpdatedAt());

        return response;
    }

    /**
     * Convert Category entity to response DTO with sport info.
     */
    public CategoryResponse toCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }

        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setMinAge(category.getMinAge());
        response.setMaxAge(category.getMaxAge());
        response.setActive(category.isActive());
        response.setCreatedAt(category.getCreatedAt());
        response.setUpdatedAt(category.getUpdatedAt());

        // Map sport info if loaded
        if (category.getSport() != null) {
            response.setSport(mapSportInfo(category.getSport()));
        }

        return response;
    }

    /**
     * Convert Category entity to simple response DTO (without sport details).
     */
    public CategoryResponse toSimpleCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }

        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setMinAge(category.getMinAge());
        response.setMaxAge(category.getMaxAge());
        response.setActive(category.isActive());
        response.setCreatedAt(category.getCreatedAt());
        response.setUpdatedAt(category.getUpdatedAt());

        return response;
    }

    /**
     * Map Category to CategoryInfo for sport response.
     */
    private SportResponse.CategoryInfo mapCategoryInfo(Category category) {
        if (category == null) {
            return null;
        }

        SportResponse.CategoryInfo categoryInfo = new SportResponse.CategoryInfo();
        categoryInfo.setId(category.getId());
        categoryInfo.setName(category.getName());
        categoryInfo.setMinAge(category.getMinAge());
        categoryInfo.setMaxAge(category.getMaxAge());
        categoryInfo.setActive(category.isActive());

        return categoryInfo;
    }

    /**
     * Map Sport to SportInfo for category response.
     */
    private CategoryResponse.SportInfo mapSportInfo(Sport sport) {
        if (sport == null) {
            return null;
        }

        CategoryResponse.SportInfo sportInfo = new CategoryResponse.SportInfo();
        sportInfo.setId(sport.getId());
        sportInfo.setName(sport.getName());
        sportInfo.setDescription(sport.getDescription());
        sportInfo.setActive(sport.isActive());

        return sportInfo;
    }

    /**
     * Convert list of sports to response DTOs.
     */
    public List<SportResponse> toResponseList(List<Sport> sports) {
        if (sports == null) {
            return List.of();
        }

        return sports.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert list of sports to simple response DTOs.
     */
    public List<SportResponse> toSimpleResponseList(List<Sport> sports) {
        if (sports == null) {
            return List.of();
        }

        return sports.stream()
                .map(this::toSimpleResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert list of categories to response DTOs.
     */
    public List<CategoryResponse> toCategoryResponseList(List<Category> categories) {
        if (categories == null) {
            return List.of();
        }

        return categories.stream()
                .map(this::toCategoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convert list of categories to simple response DTOs.
     */
    public List<CategoryResponse> toSimpleCategoryResponseList(List<Category> categories) {
        if (categories == null) {
            return List.of();
        }

        return categories.stream()
                .map(this::toSimpleCategoryResponse)
                .collect(Collectors.toList());
    }

    // ===== CREATE/UPDATE MAPPERS =====

    /**
     * Convert SportCreateRequest to Sport entity.
     */
    public Sport toEntity(SportCreateRequest request) {
        if (request == null) {
            return null;
        }

        Sport sport = new Sport();
        sport.setName(request.getName());
        sport.setDescription(request.getDescription());
        sport.setActive(true); // New sports are active by default

        return sport;
    }

    /**
     * Update Sport entity from SportUpdateRequest.
     */
    public void updateEntity(Sport sport, SportUpdateRequest request) {
        if (sport == null || request == null) {
            return;
        }

        sport.setName(request.getName());
        sport.setDescription(request.getDescription());
    }

    /**
     * Convert CategoryCreateRequest to Category entity.
     * Note: Sport must be set separately via service.
     */
    public Category toEntity(CategoryCreateRequest request) {
        if (request == null) {
            return null;
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setMinAge(request.getMinAge());
        category.setMaxAge(request.getMaxAge());
        category.setActive(true); // New categories are active by default

        return category;
    }

    /**
     * Update Category entity from CategoryUpdateRequest.
     * Note: Sport relationship must be handled separately via service.
     */
    public void updateEntity(Category category, CategoryUpdateRequest request) {
        if (category == null || request == null) {
            return;
        }

        category.setName(request.getName());
        category.setMinAge(request.getMinAge());
        category.setMaxAge(request.getMaxAge());
    }
}