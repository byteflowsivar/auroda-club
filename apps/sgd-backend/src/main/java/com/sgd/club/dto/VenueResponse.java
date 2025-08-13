package com.sgd.club.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

/**
 * Response DTO for venue data.
 * Contains venue information with club details.
 */
public class VenueResponse {

    private Long id;

    private String name;

    private String code;

    private String address;

    private String phone;

    private Boolean active;

    private ClubInfo club;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;

    // Constructors
    public VenueResponse() {}

    public VenueResponse(Long id, String name, String code, Boolean active) {
        this.id = id;
        this.name = name;
        this.code = code;
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

    public ClubInfo getClub() {
        return club;
    }

    public void setClub(ClubInfo club) {
        this.club = club;
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
     * Nested DTO for club information in venue context.
     */
    public static class ClubInfo {
        private Long id;

        private String name;

        private String email;

        private String phone;

        private Boolean active;

        // Constructors
        public ClubInfo() {}

        public ClubInfo(Long id, String name, String email, Boolean active) {
            this.id = id;
            this.name = name;
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

        public Boolean getActive() {
            return active;
        }

        public void setActive(Boolean active) {
            this.active = active;
        }

        @Override
        public String toString() {
            return "ClubInfo{" +
                    "id=" + id +
                    ", name='" + name + '\'' +
                    ", active=" + active +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "VenueResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", club=" + (club != null ? club.getName() : "null") +
                ", active=" + active +
                '}';
    }
}