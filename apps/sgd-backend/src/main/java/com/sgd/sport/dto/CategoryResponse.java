package com.sgd.sport.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

/**
 * Response DTO for category data.
 * Contains category information with sport details.
 */
public class CategoryResponse {

    private Long id;

    private String name;

    @JsonProperty("minAge")
    private Integer minAge;

    @JsonProperty("maxAge")
    private Integer maxAge;

    @JsonProperty("ageRange")
    private String ageRange;

    private Boolean active;

    private SportInfo sport;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;

    // Constructors
    public CategoryResponse() {}

    public CategoryResponse(Long id, String name, Integer minAge, Integer maxAge, Boolean active) {
        this.id = id;
        this.name = name;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.ageRange = minAge + "-" + maxAge;
        this.active = active;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        updateAgeRange();
    }

    public Integer getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(Integer maxAge) {
        this.maxAge = maxAge;
        updateAgeRange();
    }

    public String getAgeRange() {
        return ageRange;
    }

    public void setAgeRange(String ageRange) {
        this.ageRange = ageRange;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public SportInfo getSport() {
        return sport;
    }

    public void setSport(SportInfo sport) {
        this.sport = sport;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Check if this category is valid for given age.
     */
    public boolean isValidForAge(int age) {
        return minAge != null && maxAge != null && age >= minAge && age <= maxAge;
    }

    private void updateAgeRange() {
        if (minAge != null && maxAge != null) {
            this.ageRange = minAge + "-" + maxAge;
        }
    }

    /**
     * Nested DTO for sport information in category context.
     */
    public static class SportInfo {
        private Long id;

        private String name;

        private String description;

        private Boolean active;

        // Constructors
        public SportInfo() {}

        public SportInfo(Long id, String name, String description, Boolean active) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.active = active;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Boolean getActive() {
            return active;
        }

        public void setActive(Boolean active) {
            this.active = active;
        }

        @Override
        public String toString() {
            return "SportInfo{" +
                    "id=" + id +
                    ", name='" + name + '\'' +
                    ", active=" + active +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "CategoryResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", ageRange='" + ageRange + '\'' +
                ", sport=" + (sport != null ? sport.getName() : "null") +
                ", active=" + active +
                '}';
    }
}