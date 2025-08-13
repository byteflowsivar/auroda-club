package com.sgd.sport.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for sport data.
 * Contains sport information with associated categories.
 */
public class SportResponse {

    private Long id;

    private String name;

    private String description;

    private Boolean active;

    private List<CategoryInfo> categories;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;

    // Constructors
    public SportResponse() {}

    public SportResponse(Long id, String name, String description, Boolean active) {
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

    public List<CategoryInfo> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryInfo> categories) {
        this.categories = categories;
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
     * Nested DTO for category information in sport context.
     */
    public static class CategoryInfo {
        private Long id;

        private String name;

        @JsonProperty("minAge")
        private Integer minAge;

        @JsonProperty("maxAge")
        private Integer maxAge;

        @JsonProperty("ageRange")
        private String ageRange;

        private Boolean active;

        // Constructors
        public CategoryInfo() {}

        public CategoryInfo(Long id, String name, Integer minAge, Integer maxAge, Boolean active) {
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

        private void updateAgeRange() {
            if (minAge != null && maxAge != null) {
                this.ageRange = minAge + "-" + maxAge;
            }
        }

        @Override
        public String toString() {
            return "CategoryInfo{" +
                    "id=" + id +
                    ", name='" + name + '\'' +
                    ", ageRange='" + ageRange + '\'' +
                    ", active=" + active +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "SportResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", active=" + active +
                ", categoriesCount=" + (categories != null ? categories.size() : 0) +
                '}';
    }
}