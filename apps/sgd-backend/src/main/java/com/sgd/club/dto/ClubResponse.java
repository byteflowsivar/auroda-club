package com.sgd.club.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for club data.
 * Contains club information with associated venues.
 */
public class ClubResponse {

    private Long id;

    private String name;

    private String description;

    private String email;

    private String phone;

    private String address;

    private Boolean active;

    private List<VenueInfo> venues;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;

    // Constructors
    public ClubResponse() {}

    public ClubResponse(Long id, String name, String description, String email, Boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.email = email;
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public List<VenueInfo> getVenues() {
        return venues;
    }

    public void setVenues(List<VenueInfo> venues) {
        this.venues = venues;
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
     * Nested DTO for venue information in club context.
     */
    public static class VenueInfo {
        private Long id;

        private String name;

        private String code;

        private String address;

        private String phone;

        private Boolean active;

        // Constructors
        public VenueInfo() {}

        public VenueInfo(Long id, String name, String code, Boolean active) {
            this.id = id;
            this.name = name;
            this.code = code;
            this.active = active;
        }

        public VenueInfo(Long id, String name, String code, String address, String phone, Boolean active) {
            this.id = id;
            this.name = name;
            this.code = code;
            this.address = address;
            this.phone = phone;
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

        public Boolean getActive() {
            return active;
        }

        public void setActive(Boolean active) {
            this.active = active;
        }

        @Override
        public String toString() {
            return "VenueInfo{" +
                    "id=" + id +
                    ", name='" + name + '\'' +
                    ", code='" + code + '\'' +
                    ", active=" + active +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "ClubResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", active=" + active +
                ", venuesCount=" + (venues != null ? venues.size() : 0) +
                '}';
    }
}