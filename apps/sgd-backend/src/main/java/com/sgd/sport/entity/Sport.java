package com.sgd.sport.entity;

import com.sgd.shared.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

/**
 * Sport entity representing different sports disciplines.
 * Each sport can have multiple categories based on age ranges.
 */
@Entity
@Table(name = "sports")
public class Sport extends BaseEntity {

    @NotBlank
    @Size(min = 2, max = 255)
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Relationships
    @OneToMany(mappedBy = "sport", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Category> categories = new ArrayList<>();

    // Constructors
    public Sport() {}

    public Sport(String name) {
        this.name = name;
    }

    public Sport(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
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

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    // Utility methods
    public void addCategory(Category category) {
        categories.add(category);
        category.setSport(this);
    }

    public void removeCategory(Category category) {
        categories.remove(category);
        category.setSport(null);
    }

    @Override
    public String toString() {
        return "Sport{" +
                "id=" + getId() +
                ", name='" + name + '\'' +
                ", active=" + isActive() +
                '}';
    }
}