package com.sgd.athlete.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for athlete data.
 * Contains all athlete information with nested related entities.
 */
public class AthleteResponse {

    private Long id;

    @JsonProperty("fullName")
    private String fullName;

    @JsonProperty("birthDate")
    private LocalDate birthDate;

    private Integer age;

    private String gender;

    private String email;

    private String phone;

    private String address;

    @JsonProperty("identificationNumber")
    private String identificationNumber;

    @JsonProperty("emergencyContact")
    private String emergencyContact;

    @JsonProperty("emergencyPhone")
    private String emergencyPhone;

    @JsonProperty("medicalNotes")
    private String medicalNotes;

    @JsonProperty("registrationDate")
    private LocalDate registrationDate;

    private Boolean active;

    private ClubInfo club;

    private VenueInfo venue;

    private SportInfo sport;

    private CategoryInfo category;

    private List<GuardianInfo> guardians;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;

    // Constructors
    public AthleteResponse() {}

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

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
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

    public VenueInfo getVenue() {
        return venue;
    }

    public void setVenue(VenueInfo venue) {
        this.venue = venue;
    }

    public SportInfo getSport() {
        return sport;
    }

    public void setSport(SportInfo sport) {
        this.sport = sport;
    }

    public CategoryInfo getCategory() {
        return category;
    }

    public void setCategory(CategoryInfo category) {
        this.category = category;
    }

    public List<GuardianInfo> getGuardians() {
        return guardians;
    }

    public void setGuardians(List<GuardianInfo> guardians) {
        this.guardians = guardians;
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
     * Nested DTOs for related entities
     */
    public static class ClubInfo {
        private Long id;
        private String name;
        private String email;

        // Constructors, getters and setters
        public ClubInfo() {}

        public ClubInfo(Long id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }

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
    }

    public static class VenueInfo {
        private Long id;
        private String name;
        private String code;
        private String address;

        public VenueInfo() {}

        public VenueInfo(Long id, String name, String code, String address) {
            this.id = id;
            this.name = name;
            this.code = code;
            this.address = address;
        }

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
    }

    public static class SportInfo {
        private Long id;
        private String name;
        private String description;

        public SportInfo() {}

        public SportInfo(Long id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
        }

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
    }

    public static class CategoryInfo {
        private Long id;
        private String name;
        private Integer minAge;
        private Integer maxAge;
        private String sport;

        public CategoryInfo() {}

        public CategoryInfo(Long id, String name, Integer minAge, Integer maxAge, String sport) {
            this.id = id;
            this.name = name;
            this.minAge = minAge;
            this.maxAge = maxAge;
            this.sport = sport;
        }

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

        public String getSport() {
            return sport;
        }

        public void setSport(String sport) {
            this.sport = sport;
        }
    }

    public static class GuardianInfo {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String relationship;
        private Boolean isPrimary;

        public GuardianInfo() {}

        public GuardianInfo(Long id, String fullName, String email, String phone, 
                           String relationship, Boolean isPrimary) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.phone = phone;
            this.relationship = relationship;
            this.isPrimary = isPrimary;
        }

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
    }
}