package com.sgd.sport.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating new category.
 * Contains required fields and validation rules.
 */
public class CategoryCreateRequest {

    @NotNull(message = "El ID del deporte es obligatorio")
    @Positive(message = "El ID del deporte debe ser un número positivo")
    private Long sportId;

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    @Size(min = 2, max = 255, message = "El nombre debe tener entre 2 y 255 caracteres")
    private String name;

    @NotNull(message = "La edad mínima es obligatoria")
    @Min(value = 0, message = "La edad mínima debe ser 0 o mayor")
    @Max(value = 100, message = "La edad mínima no puede ser mayor a 100")
    private Integer minAge;

    @NotNull(message = "La edad máxima es obligatoria")
    @Min(value = 0, message = "La edad máxima debe ser 0 o mayor")
    @Max(value = 100, message = "La edad máxima no puede ser mayor a 100")
    private Integer maxAge;

    // Constructors
    public CategoryCreateRequest() {}

    public CategoryCreateRequest(Long sportId, String name, Integer minAge, Integer maxAge) {
        this.sportId = sportId;
        this.name = name;
        this.minAge = minAge;
        this.maxAge = maxAge;
    }

    // Getters and Setters
    public Long getSportId() {
        return sportId;
    }

    public void setSportId(Long sportId) {
        this.sportId = sportId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public Integer getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(Integer maxAge) {
        this.maxAge = maxAge;
    }

    /**
     * Business validation: minAge must be <= maxAge
     */
    public boolean isAgeRangeValid() {
        return minAge != null && maxAge != null && minAge <= maxAge;
    }

    public String getAgeRange() {
        if (minAge != null && maxAge != null) {
            return minAge + "-" + maxAge;
        }
        return null;
    }

    @Override
    public String toString() {
        return "CategoryCreateRequest{" +
                "sportId=" + sportId +
                ", name='" + name + '\'' +
                ", ageRange='" + getAgeRange() + '\'' +
                '}';
    }
}