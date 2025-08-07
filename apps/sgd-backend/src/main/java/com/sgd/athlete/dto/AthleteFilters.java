package com.sgd.athlete.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.QueryParam;

/**
 * Filter parameters for athlete search and listing operations.
 * Used as query parameters in GET /api/athletes endpoint.
 */
public class AthleteFilters {

    @QueryParam("page")
    @DefaultValue("0")
    @Min(value = 0, message = "El número de página debe ser mayor o igual a 0")
    private int page = 0;

    @QueryParam("size")
    @DefaultValue("20")
    @Min(value = 1, message = "El tamaño de página debe ser mayor a 0")
    @Max(value = 50, message = "El tamaño de página no puede exceder 50")
    private int size = 20;

    @QueryParam("venueId")
    @Min(value = 1, message = "El ID de sede debe ser positivo")
    private Long venueId;

    @QueryParam("sportId")
    @Min(value = 1, message = "El ID de deporte debe ser positivo")
    private Long sportId;

    @QueryParam("categoryId")
    @Min(value = 1, message = "El ID de categoría debe ser positivo")
    private Long categoryId;

    @QueryParam("active")
    @DefaultValue("true")
    private Boolean active = true;

    @QueryParam("search")
    @Size(max = 100, message = "El término de búsqueda no puede exceder 100 caracteres")
    private String search;

    @QueryParam("ageMin")
    @Min(value = 0, message = "La edad mínima debe ser mayor o igual a 0")
    @Max(value = 100, message = "La edad mínima no puede exceder 100")
    private Integer ageMin;

    @QueryParam("ageMax")
    @Min(value = 0, message = "La edad máxima debe ser mayor o igual a 0")
    @Max(value = 100, message = "La edad máxima no puede exceder 100")
    private Integer ageMax;

    @QueryParam("sort")
    @DefaultValue("fullName")
    private String sort = "fullName";

    @QueryParam("direction")
    @DefaultValue("ASC")
    private String direction = "ASC";

    // Constructors
    public AthleteFilters() {}

    // Getters and Setters
    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public Long getVenueId() {
        return venueId;
    }

    public void setVenueId(Long venueId) {
        this.venueId = venueId;
    }

    public Long getSportId() {
        return sportId;
    }

    public void setSportId(Long sportId) {
        this.sportId = sportId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }

    public Integer getAgeMin() {
        return ageMin;
    }

    public void setAgeMin(Integer ageMin) {
        this.ageMin = ageMin;
    }

    public Integer getAgeMax() {
        return ageMax;
    }

    public void setAgeMax(Integer ageMax) {
        this.ageMax = ageMax;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    // Utility methods
    public boolean hasSearch() {
        return search != null && !search.trim().isEmpty();
    }

    public boolean hasAgeFilter() {
        return ageMin != null || ageMax != null;
    }

    public boolean hasVenueFilter() {
        return venueId != null;
    }

    public boolean hasSportFilter() {
        return sportId != null;
    }

    public boolean hasCategoryFilter() {
        return categoryId != null;
    }

    public boolean isDescending() {
        return "DESC".equalsIgnoreCase(direction);
    }

    // Validation method for age range
    public boolean isValidAgeRange() {
        if (ageMin == null || ageMax == null) {
            return true;
        }
        return ageMin <= ageMax;
    }

    // Validation for sort field
    public boolean isValidSortField() {
        return sort != null && (
            "fullName".equals(sort) ||
            "age".equals(sort) ||
            "registrationDate".equals(sort) ||
            "createdAt".equals(sort)
        );
    }

    @Override
    public String toString() {
        return "AthleteFilters{" +
                "page=" + page +
                ", size=" + size +
                ", venueId=" + venueId +
                ", sportId=" + sportId +
                ", categoryId=" + categoryId +
                ", active=" + active +
                ", search='" + search + '\'' +
                ", ageMin=" + ageMin +
                ", ageMax=" + ageMax +
                ", sort='" + sort + '\'' +
                ", direction='" + direction + '\'' +
                '}';
    }
}