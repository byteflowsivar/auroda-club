package com.sgd.athlete.entity;

import com.sgd.guardian.entity.Guardian;
import com.sgd.shared.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Junction entity for many-to-many relationship between Athletes and Guardians.
 * Includes relationship-specific attributes like relationship type and primary status.
 */
@Entity
@Table(name = "athlete_guardians", uniqueConstraints = {
    @UniqueConstraint(name = "uk_athlete_guardians", columnNames = {"athlete_id", "guardian_id"})
})
public class AthleteGuardian extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "athlete_id", nullable = false, foreignKey = @ForeignKey(name = "fk_athlete_guardians_athlete"))
    private Athlete athlete;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guardian_id", nullable = false, foreignKey = @ForeignKey(name = "fk_athlete_guardians_guardian"))
    private Guardian guardian;

    @NotBlank
    @Size(min = 2, max = 50)
    @Column(name = "relationship", nullable = false)
    private String relationship;

    @Column(name = "is_primary", nullable = false)
    private boolean isPrimary = false;

    // Constructors
    public AthleteGuardian() {}

    public AthleteGuardian(Athlete athlete, Guardian guardian, String relationship) {
        this.athlete = athlete;
        this.guardian = guardian;
        this.relationship = relationship;
    }

    public AthleteGuardian(Athlete athlete, Guardian guardian, String relationship, boolean isPrimary) {
        this.athlete = athlete;
        this.guardian = guardian;
        this.relationship = relationship;
        this.isPrimary = isPrimary;
    }

    // Getters and Setters
    public Athlete getAthlete() {
        return athlete;
    }

    public void setAthlete(Athlete athlete) {
        this.athlete = athlete;
    }

    public Guardian getGuardian() {
        return guardian;
    }

    public void setGuardian(Guardian guardian) {
        this.guardian = guardian;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    // Utility methods
    public void makePrimary() {
        this.isPrimary = true;
    }

    public void makeSecondary() {
        this.isPrimary = false;
    }

    @Override
    public String toString() {
        return "AthleteGuardian{" +
                "id=" + getId() +
                ", athleteId=" + (athlete != null ? athlete.getId() : "null") +
                ", guardianId=" + (guardian != null ? guardian.getId() : "null") +
                ", relationship='" + relationship + '\'' +
                ", isPrimary=" + isPrimary +
                ", active=" + isActive() +
                '}';
    }
}