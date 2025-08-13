package com.sgd.guardian.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for updating existing guardians.
 * All fields are optional, but at least one contact method must remain after update.
 */
public class GuardianUpdateRequest {

    @Size(min = 2, max = 255, message = "El nombre debe tener entre 2 y 255 caracteres")
    @JsonProperty("fullName")
    private String fullName;

    @Email(message = "El formato del email no es válido")
    @Size(max = 255, message = "El email no puede exceder 255 caracteres")
    private String email;

    @Size(max = 50, message = "El teléfono no puede exceder 50 caracteres")
    private String phone;

    @Size(max = 50, message = "El teléfono secundario no puede exceder 50 caracteres")
    @JsonProperty("secondaryPhone")
    private String secondaryPhone;

    @Size(max = 1000, message = "La dirección no puede exceder 1000 caracteres")
    private String address;

    @Size(max = 50, message = "El número de identificación no puede exceder 50 caracteres")
    @JsonProperty("identificationNumber")
    private String identificationNumber;

    // Constructors
    public GuardianUpdateRequest() {}

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

    /**
     * Check if this update would leave the guardian without contact info.
     */
    public boolean hasValidContactInfo() {
        return (email != null && !email.trim().isEmpty()) || 
               (phone != null && !phone.trim().isEmpty());
    }

    /**
     * Check if any field is being updated.
     */
    public boolean hasUpdates() {
        return fullName != null || email != null || phone != null || 
               secondaryPhone != null || address != null || identificationNumber != null;
    }

    @Override
    public String toString() {
        return "GuardianUpdateRequest{" +
                "fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", identificationNumber='" + identificationNumber + '\'' +
                '}';
    }
}