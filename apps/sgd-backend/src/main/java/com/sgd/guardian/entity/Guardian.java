package com.sgd.guardian.entity;

import com.sgd.athlete.entity.AthleteGuardian;
import com.sgd.shared.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

/**
 * Guardian entity representing parents/guardians of athletes.
 * Guardians can be associated with multiple athletes through many-to-many relationship.
 */
@Entity
@Table(name = "guardians")
public class Guardian extends BaseEntity {

    @NotBlank
    @Size(min = 2, max = 255)
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Email
    @Size(max = 255)
    @Column(name = "email")
    private String email;

    @Size(max = 50)
    @Column(name = "phone")
    private String phone;

    @Size(max = 50)
    @Column(name = "secondary_phone")
    private String secondaryPhone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Size(max = 50)
    @Column(name = "identification_number")
    private String identificationNumber;

    // Relationships
    @OneToMany(mappedBy = "guardian", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AthleteGuardian> athleteGuardians = new ArrayList<>();

    // Constructors
    public Guardian() {}

    public Guardian(String fullName) {
        this.fullName = fullName;
    }

    public Guardian(String fullName, String email, String phone) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
    }

    public Guardian(String fullName, String email, String phone, String secondaryPhone, 
                   String address, String identificationNumber) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.secondaryPhone = secondaryPhone;
        this.address = address;
        this.identificationNumber = identificationNumber;
    }

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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

    public String getSecondaryPhone() {
        return secondaryPhone;
    }

    public void setSecondaryPhone(String secondaryPhone) {
        this.secondaryPhone = secondaryPhone;
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

    public List<AthleteGuardian> getAthleteGuardians() {
        return athleteGuardians;
    }

    public void setAthleteGuardians(List<AthleteGuardian> athleteGuardians) {
        this.athleteGuardians = athleteGuardians;
    }

    // Utility methods
    public boolean hasContactInfo() {
        return (email != null && !email.trim().isEmpty()) || 
               (phone != null && !phone.trim().isEmpty());
    }

    public String getPrimaryContact() {
        if (phone != null && !phone.trim().isEmpty()) {
            return phone;
        }
        return email;
    }

    @Override
    public String toString() {
        return "Guardian{" +
                "id=" + getId() +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", active=" + isActive() +
                '}';
    }
}