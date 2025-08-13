package com.sgd.sport.service;

import com.sgd.sport.dto.CategoryResponse;
import com.sgd.sport.dto.SportResponse;
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
}