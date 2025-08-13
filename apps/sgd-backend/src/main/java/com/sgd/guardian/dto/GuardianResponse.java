package com.sgd.guardian.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for guardian data.
 * Contains guardian information with associated athletes.
 */
public class GuardianResponse {

    private Long id;

    @JsonProperty("fullName")
    private String fullName;

    private String email;

    private String phone;

    @JsonProperty("secondaryPhone")
    private String secondaryPhone;

    private String address;

    @JsonProperty("identificationNumber")
    private String identificationNumber;

    private Boolean active;

    private List<AthleteInfo> athletes;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;

    // Constructors
    public GuardianResponse() {}

    public GuardianResponse(Long id, String fullName, String email, String phone, Boolean active) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public List<AthleteInfo> getAthletes() {
        return athletes;
    }

    public void setAthletes(List<AthleteInfo> athletes) {
        this.athletes = athletes;
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
     * Nested DTO for athlete information in guardian context.
     */
    public static class AthleteInfo {
        private Long id;

        @JsonProperty("fullName")
        private String fullName;

        private Integer age;

        private String sport;

        private String venue;

        private String relationship;

        @JsonProperty("isPrimary")
        private Boolean isPrimary;

        private Boolean active;

        // Constructors
        public AthleteInfo() {}

        public AthleteInfo(Long id, String fullName, Integer age, String sport, String venue, 
                          String relationship, Boolean isPrimary, Boolean active) {
            this.id = id;
            this.fullName = fullName;
            this.age = age;
            this.sport = sport;
            this.venue = venue;
            this.relationship = relationship;
            this.isPrimary = isPrimary;
            this.active = active;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public Integer getAge() {
            return age;
        }

        public void setAge(Integer age) {
            this.age = age;
        }

        public String getSport() {
            return sport;
        }

        public void setSport(String sport) {
            this.sport = sport;
        }

        public String getVenue() {
            return venue;
        }

        public void setVenue(String venue) {
            this.venue = venue;
        }

        public String getRelationship() {
            return relationship;
        }

        public void setRelationship(String relationship) {
            this.relationship = relationship;
        }

        public Boolean getIsPrimary() {
            return isPrimary;
        }

        public void setIsPrimary(Boolean isPrimary) {
            this.isPrimary = isPrimary;
        }

        public Boolean getActive() {
            return active;
        }

        public void setActive(Boolean active) {
            this.active = active;
        }

        @Override
        public String toString() {
            return "AthleteInfo{" +
                    "id=" + id +
                    ", fullName='" + fullName + '\'' +
                    ", age=" + age +
                    ", sport='" + sport + '\'' +
                    ", relationship='" + relationship + '\'' +
                    ", isPrimary=" + isPrimary +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "GuardianResponse{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", active=" + active +
                ", athletesCount=" + (athletes != null ? athletes.size() : 0) +
                '}';
    }
}