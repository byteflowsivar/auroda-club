package com.sgd.club.entity;

import com.sgd.shared.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

/**
 * Club entity representing sports organizations.
 * Each club can have multiple venues and athletes.
 */
@Entity
@Table(name = "clubs")
public class Club extends BaseEntity {

    @NotBlank
    @Size(min = 2, max = 255)
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Email
    @Size(max = 255)
    @Column(name = "email")
    private String email;

    @Size(max = 50)
    @Column(name = "phone")
    private String phone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    // Relationships
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Venue> venues = new ArrayList<>();

    // Constructors
    public Club() {}

    public Club(String name) {
        this.name = name;
    }

    public Club(String name, String description, String email, String phone, String address) {
        this.name = name;
        this.description = description;
        this.email = email;
        this.phone = phone;
        this.address = address;
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

    public List<Venue> getVenues() {
        return venues;
    }

    public void setVenues(List<Venue> venues) {
        this.venues = venues;
    }

    // Utility methods
    public void addVenue(Venue venue) {
        venues.add(venue);
        venue.setClub(this);
    }

    public void removeVenue(Venue venue) {
        venues.remove(venue);
        venue.setClub(null);
    }

    @Override
    public String toString() {
        return "Club{" +
                "id=" + getId() +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", active=" + isActive() +
                '}';
    }
}