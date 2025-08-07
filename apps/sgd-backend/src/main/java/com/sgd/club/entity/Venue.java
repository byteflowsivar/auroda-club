package com.sgd.club.entity;

import com.sgd.shared.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Venue entity representing physical locations where athletes train.
 * Each venue belongs to a club.
 */
@Entity
@Table(name = "venues", uniqueConstraints = {
    @UniqueConstraint(name = "uk_venues_code", columnNames = "code")
})
public class Venue extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false, foreignKey = @ForeignKey(name = "fk_venues_club"))
    private Club club;

    @NotBlank
    @Size(min = 2, max = 255)
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank
    @Size(min = 3, max = 50)
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Size(max = 50)
    @Column(name = "phone")
    private String phone;

    // Constructors
    public Venue() {}

    public Venue(Club club, String name, String code) {
        this.club = club;
        this.name = name;
        this.code = code;
    }

    public Venue(Club club, String name, String code, String address, String phone) {
        this.club = club;
        this.name = name;
        this.code = code;
        this.address = address;
        this.phone = phone;
    }

    // Getters and Setters
    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Override
    public String toString() {
        return "Venue{" +
                "id=" + getId() +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", active=" + isActive() +
                '}';
    }
}