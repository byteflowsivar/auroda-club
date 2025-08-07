package com.sgd.athlete.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO for creating new athletes.
 * Contains validation rules and nested guardian associations.
 */
public class AthleteCreateRequest {

    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(min = 2, max = 255, message = "El nombre debe tener entre 2 y 255 caracteres")
    @JsonProperty("fullName")
    private String fullName;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento no puede ser futura")
    @JsonProperty("birthDate")
    private LocalDate birthDate;

    @Size(max = 10, message = "El género no puede exceder 10 caracteres")
    private String gender;

    @Email(message = "El formato del email no es válido")
    @Size(max = 255, message = "El email no puede exceder 255 caracteres")
    private String email;

    @Size(max = 50, message = "El teléfono no puede exceder 50 caracteres")
    @Pattern(regexp = "^\\+503\\s[0-9]{4}-[0-9]{4}$|^$", 
            message = "El formato del teléfono debe ser +503 XXXX-XXXX")
    private String phone;

    @Size(max = 1000, message = "La dirección no puede exceder 1000 caracteres")
    private String address;

    @Size(max = 50, message = "El número de identificación no puede exceder 50 caracteres")
    @JsonProperty("identificationNumber")
    private String identificationNumber;

    @Size(max = 255, message = "El contacto de emergencia no puede exceder 255 caracteres")
    @JsonProperty("emergencyContact")
    private String emergencyContact;

    @Size(max = 50, message = "El teléfono de emergencia no puede exceder 50 caracteres")
    @Pattern(regexp = "^\\+503\\s[0-9]{4}-[0-9]{4}$|^$", 
            message = "El formato del teléfono de emergencia debe ser +503 XXXX-XXXX")
    @JsonProperty("emergencyPhone")
    private String emergencyPhone;

    @Size(max = 2000, message = "Las notas médicas no pueden exceder 2000 caracteres")
    @JsonProperty("medicalNotes")
    private String medicalNotes;

    @NotNull(message = "La sede es obligatoria")
    @Positive(message = "El ID de sede debe ser positivo")
    @JsonProperty("venueId")
    private Long venueId;

    @NotNull(message = "El deporte es obligatorio")
    @Positive(message = "El ID de deporte debe ser positivo")
    @JsonProperty("sportId")
    private Long sportId;

    @NotNull(message = "La categoría es obligatoria")
    @Positive(message = "El ID de categoría debe ser positivo")
    @JsonProperty("categoryId")
    private Long categoryId;

    @Valid
    private List<GuardianAssociation> guardians;

    // Constructors
    public AthleteCreateRequest() {}

    // Getters and Setters
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

    public Long getVenueId() {
        return venueId;
    }

    public void setVenueId(Long venueId) {
        this.venueId = venueId;
    }

    public Long getSportId() {
        return sportId;
    }

    public void setSportId(Long sportId) {
        this.sportId = sportId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public List<GuardianAssociation> getGuardians() {
        return guardians;
    }

    public void setGuardians(List<GuardianAssociation> guardians) {
        this.guardians = guardians;
    }

    /**
     * DTO for guardian association during athlete creation.
     */
    public static class GuardianAssociation {

        @NotNull(message = "El ID del tutor es obligatorio")
        @Positive(message = "El ID del tutor debe ser positivo")
        @JsonProperty("guardianId")
        private Long guardianId;

        @NotBlank(message = "El parentesco es obligatorio")
        @Size(min = 2, max = 50, message = "El parentesco debe tener entre 2 y 50 caracteres")
        private String relationship;

        @JsonProperty("isPrimary")
        private Boolean isPrimary = false;

        // Constructors
        public GuardianAssociation() {}

        public GuardianAssociation(Long guardianId, String relationship, Boolean isPrimary) {
            this.guardianId = guardianId;
            this.relationship = relationship;
            this.isPrimary = isPrimary;
        }

        // Getters and Setters
        public Long getGuardianId() {
            return guardianId;
        }

        public void setGuardianId(Long guardianId) {
            this.guardianId = guardianId;
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