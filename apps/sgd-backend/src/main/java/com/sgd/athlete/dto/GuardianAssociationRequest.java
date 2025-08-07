package com.sgd.athlete.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for associating a guardian to an athlete.
 * Used in POST /api/athletes/{id}/guardians endpoint.
 */
public class GuardianAssociationRequest {

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
    public GuardianAssociationRequest() {}

    public GuardianAssociationRequest(Long guardianId, String relationship) {
        this.guardianId = guardianId;
        this.relationship = relationship;
    }

    public GuardianAssociationRequest(Long guardianId, String relationship, Boolean isPrimary) {
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

    @Override
    public String toString() {
        return "GuardianAssociationRequest{" +
                "guardianId=" + guardianId +
                ", relationship='" + relationship + '\'' +
                ", isPrimary=" + isPrimary +
                '}';
    }
}

/**
 * Response DTO for successful guardian association.
 */
class GuardianAssociationResponse {

    private String message;
    private Long athleteId;
    private Long guardianId;
    private String relationship;

    // Constructors
    public GuardianAssociationResponse() {}

    public GuardianAssociationResponse(String message, Long athleteId, Long guardianId, String relationship) {
        this.message = message;
        this.athleteId = athleteId;
        this.guardianId = guardianId;
        this.relationship = relationship;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getAthleteId() {
        return athleteId;
    }

    public void setAthleteId(Long athleteId) {
        this.athleteId = athleteId;
    }

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
}