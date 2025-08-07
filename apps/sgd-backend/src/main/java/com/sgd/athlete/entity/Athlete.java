package com.sgd.athlete.entity;

import com.sgd.club.entity.Club;
import com.sgd.club.entity.Venue;
import com.sgd.shared.entity.BaseEntity;
import com.sgd.sport.entity.Category;
import com.sgd.sport.entity.Sport;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

/**
 * Athlete entity representing sports participants.
 * Core entity of the system with relationships to all major components.
 */
@Entity
@Table(name = "athletes")
public class Athlete extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false, foreignKey = @ForeignKey(name = "fk_athletes_club"))
    private Club club;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false, foreignKey = @ForeignKey(name = "fk_athletes_venue"))
    private Venue venue;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_id", nullable = false, foreignKey = @ForeignKey(name = "fk_athletes_sport"))
    private Sport sport;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false, foreignKey = @ForeignKey(name = "fk_athletes_category"))
    private Category category;

    @NotBlank
    @Size(min = 2, max = 255)
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotNull
    @Past
    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Size(max = 10)
    @Column(name = "gender")
    private String gender;

    @Email
    @Size(max = 255)
    @Column(name = "email")
    private String email;

    @Size(max = 50)
    @Column(name = "phone")
    private String phone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Size(max = 50)
    @Column(name = "identification_number")
    private String identificationNumber;

    @Size(max = 255)
    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Size(max = 50)
    @Column(name = "emergency_phone")
    private String emergencyPhone;

    @Column(name = "medical_notes", columnDefinition = "TEXT")
    private String medicalNotes;

    @Column(name = "registration_date")
    private LocalDate registrationDate = LocalDate.now();

    // Relationships
    @OneToMany(mappedBy = "athlete", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AthleteGuardian> athleteGuardians = new ArrayList<>();

    // Constructors
    public Athlete() {}

    public Athlete(String fullName, LocalDate birthDate, Club club, Venue venue, Sport sport, Category category) {
        this.fullName = fullName;
        this.birthDate = birthDate;
        this.club = club;
        this.venue = venue;
        this.sport = sport;
        this.category = category;
    }

    // Getters and Setters
    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public Sport getSport() {
        return sport;
    }

    public void setSport(Sport sport) {
        this.sport = sport;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getIdentificationNumber() {
        return identificationNumber;
    }

    public void setIdentificationNumber(String identificationNumber) {
        this.identificationNumber = identificationNumber;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getEmergencyPhone() {
        return emergencyPhone;
    }

    public void setEmergencyPhone(String emergencyPhone) {
        this.emergencyPhone = emergencyPhone;
    }

    public String getMedicalNotes() {
        return medicalNotes;
    }

    public void setMedicalNotes(String medicalNotes) {
        this.medicalNotes = medicalNotes;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    public List<AthleteGuardian> getAthleteGuardians() {
        return athleteGuardians;
    }

    public void setAthleteGuardians(List<AthleteGuardian> athleteGuardians) {
        this.athleteGuardians = athleteGuardians;
    }

    // Calculated properties
    public int getAge() {
        if (birthDate == null) {
            return 0;
        }
        return Period.between(birthDate, LocalDate.now()).getYears();
    }

    public boolean isMinor() {
        return getAge() < 18;
    }

    public boolean hasActiveGuardians() {
        return athleteGuardians.stream()
                .anyMatch(ag -> ag.isActive());
    }

    public boolean hasValidCategoryForAge() {
        if (category == null) return false;
        int age = getAge();
        return age >= category.getMinAge() && age <= category.getMaxAge();
    }

    // Business logic validation
    public boolean canBeDeleted() {
        // Add business rules for deletion if needed
        return true;
    }

    public boolean requiresGuardian() {
        return isMinor();
    }

    @Override
    public String toString() {
        return "Athlete{" +
                "id=" + getId() +
                ", fullName='" + fullName + '\'' +
                ", age=" + getAge() +
                ", sport='" + (sport != null ? sport.getName() : "null") + '\'' +
                ", active=" + isActive() +
                '}';
    }
}