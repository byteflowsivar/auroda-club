package com.sgd.athlete.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

/**
 * Request DTO for updating existing athletes.
 * Note: birthDate and club assignment cannot be changed.
 */
public class AthleteUpdateRequest {

    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(min = 2, max = 255, message = "El nombre debe tener entre 2 y 255 caracteres")
    @JsonProperty("fullName")
    private String fullName;

    @Email(message = "El formato del email no es válido")
    @Size(max = 255, message = "El email no puede exceder 255 caracteres")
    private String email;

    @Size(max = 50, message = "El teléfono no puede exceder 50 caracteres")
    @Pattern(regexp = "^\\+503\\s[0-9]{4}-[0-9]{4}$|^$", 
            message = "El formato del teléfono debe ser +503 XXXX-XXXX")
    private String phone;

    @Size(max = 1000, message = "La dirección no puede exceder 1000 caracteres")
    private String address;

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

    @Positive(message = "El ID de sede debe ser positivo")
    @JsonProperty("venueId")
    private Long venueId;

    @Positive(message = "El ID de categoría debe ser positivo")
    @JsonProperty("categoryId")
    private Long categoryId;

    // Constructors
    public AthleteUpdateRequest() {}

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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}