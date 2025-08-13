package com.sgd.guardian.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.QueryParam;

/**
 * Filter parameters for guardian listing endpoints.
 * Supports pagination, search, and filtering by status.
 */
public class GuardianFilters {

    @QueryParam("page")
    @DefaultValue("0")
    @Min(value = 0, message = "El número de página debe ser mayor o igual a 0")
    private Integer page;

    @QueryParam("size")
    @DefaultValue("20")
    @Min(value = 1, message = "El tamaño de página debe ser mayor a 0")
    @Max(value = 50, message = "El tamaño de página no puede exceder 50")
    private Integer size;

    @QueryParam("search")
    private String search;

    @QueryParam("hasAthletes")
    private Boolean hasAthletes;

    @QueryParam("active")
    @DefaultValue("true")
    private Boolean active;

    @QueryParam("sort")
    @DefaultValue("fullName")
    @Pattern(regexp = "fullName|email|createdAt", 
             message = "Los campos de ordenamiento válidos son: fullName, email, createdAt")
    private String sort;

    @QueryParam("direction")
    @DefaultValue("ASC")
    @Pattern(regexp = "ASC|DESC", 
             message = "La dirección debe ser ASC o DESC")
    private String direction;

    // Constructors
    public GuardianFilters() {}

    public GuardianFilters(Integer page, Integer size) {
        this.page = page;
        this.size = size;
    }

    // Getters and Setters
    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getSearch() {
        return search;
    }

    public void setSearch(String search) {
        this.search = search;
    }

    public Boolean getHasAthletes() {
        return hasAthletes;
    }

    public void setHasAthletes(Boolean hasAthletes) {
        this.hasAthletes = hasAthletes;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
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

    /**
     * Check if search term is provided and not empty.
     */
    public boolean hasSearchTerm() {
        return search != null && !search.trim().isEmpty();
    }

    /**
     * Get cleaned search term for database queries.
     */
    public String getCleanSearchTerm() {
        return hasSearchTerm() ? search.trim().toLowerCase() : null;
    }

    /**
     * Check if sorting is in descending order.
     */
    public boolean isDescending() {
        return "DESC".equalsIgnoreCase(direction);
    }

    @Override
    public String toString() {
        return "GuardianFilters{" +
                "page=" + page +
                ", size=" + size +
                ", search='" + search + '\'' +
                ", hasAthletes=" + hasAthletes +
                ", active=" + active +
                ", sort='" + sort + '\'' +
                ", direction='" + direction + '\'' +
                '}';
    }
}