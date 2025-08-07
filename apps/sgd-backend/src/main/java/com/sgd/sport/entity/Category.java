package com.sgd.sport.entity;

import com.sgd.shared.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Check;

/**
 * Category entity representing age-based divisions within sports.
 * Each category belongs to a sport and defines min/max age ranges.
 */
@Entity
@Table(name = "categories")
@Check(constraints = "min_age <= max_age")
public class Category extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_id", nullable = false, foreignKey = @ForeignKey(name = "fk_categories_sport"))
    private Sport sport;

    @NotBlank
    @Size(min = 2, max = 255)
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Min(0)
    @Max(100)
    @Column(name = "min_age", nullable = false)
    private Integer minAge;

    @NotNull
    @Min(0)
    @Max(100)
    @Column(name = "max_age", nullable = false)
    private Integer maxAge;

    // Constructors
    public Category() {}

    public Category(Sport sport, String name, Integer minAge, Integer maxAge) {
        this.sport = sport;
        this.name = name;
        this.minAge = minAge;
        this.maxAge = maxAge;
    }

    // Getters and Setters
    public Sport getSport() {
        return sport;
    }

    public void setSport(Sport sport) {
        this.sport = sport;
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

    // Utility methods
    public boolean isValidForAge(int age) {
        return age >= minAge && age <= maxAge;
    }

    public String getAgeRange() {
        return minAge + "-" + maxAge;
    }

    @Override
    public String toString() {
        return "Category{" +
                "id=" + getId() +
                ", name='" + name + '\'' +
                ", ageRange='" + getAgeRange() + '\'' +
                ", active=" + isActive() +
                '}';
    }
}