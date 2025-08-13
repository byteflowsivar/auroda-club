package com.sgd.guardian.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating new guardians.
 * Validates that at least one contact method (email or phone) is provided.
 */
public class GuardianCreateRequest {

    @NotBlank(message = "El nombre completo es requerido")
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
    public GuardianCreateRequest() {}

    public GuardianCreateRequest(String fullName, String email, String phone) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
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

    /**
     * Business validation: At least one contact method must be provided.
     */
    public boolean hasValidContactInfo() {
        return (email != null && !email.trim().isEmpty()) || 
               (phone != null && !phone.trim().isEmpty());
    }

    @Override
    public String toString() {
        return "GuardianCreateRequest{" +
                "fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", identificationNumber='" + identificationNumber + '\'' +
                '}';
    }
}