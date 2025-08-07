package com.sgd.athlete.service;

import com.sgd.athlete.dto.AthleteResponse;
import com.sgd.athlete.entity.Athlete;
import com.sgd.athlete.entity.AthleteGuardian;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

/**
 * Mapper utility for converting between Athlete entities and DTOs.
 * Handles complex object mapping and nested relationships.
 */
@ApplicationScoped
public class AthleteMapper {

    /**
     * Convert Athlete entity to AthleteResponse DTO.
     */
    public AthleteResponse toResponse(Athlete athlete) {
        if (athlete == null) {
            return null;
        }

        AthleteResponse response = new AthleteResponse();
        response.setId(athlete.getId());
        response.setFullName(athlete.getFullName());
        response.setBirthDate(athlete.getBirthDate());
        response.setAge(athlete.getAge());
        response.setGender(athlete.getGender());
        response.setEmail(athlete.getEmail());
        response.setPhone(athlete.getPhone());
        response.setAddress(athlete.getAddress());
        response.setIdentificationNumber(athlete.getIdentificationNumber());
        response.setEmergencyContact(athlete.getEmergencyContact());
        response.setEmergencyPhone(athlete.getEmergencyPhone());
        response.setMedicalNotes(athlete.getMedicalNotes());
        response.setRegistrationDate(athlete.getRegistrationDate());
        response.setActive(athlete.isActive());
        response.setCreatedAt(athlete.getCreatedAt());
        response.setUpdatedAt(athlete.getUpdatedAt());

        // Map nested entities
        if (athlete.getClub() != null) {
            response.setClub(new AthleteResponse.ClubInfo(
                athlete.getClub().getId(),
                athlete.getClub().getName(),
                athlete.getClub().getEmail()
            ));
        }

        if (athlete.getVenue() != null) {
            response.setVenue(new AthleteResponse.VenueInfo(
                athlete.getVenue().getId(),
                athlete.getVenue().getName(),
                athlete.getVenue().getCode(),
                athlete.getVenue().getAddress()
            ));
        }

        if (athlete.getSport() != null) {
            response.setSport(new AthleteResponse.SportInfo(
                athlete.getSport().getId(),
                athlete.getSport().getName(),
                athlete.getSport().getDescription()
            ));
        }

        if (athlete.getCategory() != null) {
            response.setCategory(new AthleteResponse.CategoryInfo(
                athlete.getCategory().getId(),
                athlete.getCategory().getName(),
                athlete.getCategory().getMinAge(),
                athlete.getCategory().getMaxAge(),
                athlete.getSport() != null ? athlete.getSport().getName() : null
            ));
        }

        // Map guardians
        if (athlete.getAthleteGuardians() != null && !athlete.getAthleteGuardians().isEmpty()) {
            List<AthleteResponse.GuardianInfo> guardians = athlete.getAthleteGuardians().stream()
                .filter(AthleteGuardian::isActive)
                .map(this::mapGuardianInfo)
                .toList();
            response.setGuardians(guardians);
        }

        return response;
    }

    /**
     * Convert list of Athlete entities to list of AthleteResponse DTOs.
     */
    public List<AthleteResponse> toResponseList(List<Athlete> athletes) {
        if (athletes == null) {
            return List.of();
        }
        return athletes.stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Create a simplified AthleteResponse for list views (without all relations loaded).
     */
    public AthleteResponse toSimpleResponse(Athlete athlete) {
        if (athlete == null) {
            return null;
        }

        AthleteResponse response = new AthleteResponse();
        response.setId(athlete.getId());
        response.setFullName(athlete.getFullName());
        response.setAge(athlete.getAge());
        response.setGender(athlete.getGender());
        response.setEmail(athlete.getEmail());
        response.setPhone(athlete.getPhone());
        response.setActive(athlete.isActive());
        response.setRegistrationDate(athlete.getRegistrationDate());
        response.setCreatedAt(athlete.getCreatedAt());
        response.setUpdatedAt(athlete.getUpdatedAt());

        // Only basic info for related entities
        if (athlete.getClub() != null) {
            response.setClub(new AthleteResponse.ClubInfo(
                athlete.getClub().getId(),
                athlete.getClub().getName(),
                null
            ));
        }

        if (athlete.getVenue() != null) {
            response.setVenue(new AthleteResponse.VenueInfo(
                athlete.getVenue().getId(),
                athlete.getVenue().getName(),
                athlete.getVenue().getCode(),
                null
            ));
        }

        if (athlete.getSport() != null) {
            response.setSport(new AthleteResponse.SportInfo(
                athlete.getSport().getId(),
                athlete.getSport().getName(),
                null
            ));
        }

        if (athlete.getCategory() != null) {
            response.setCategory(new AthleteResponse.CategoryInfo(
                athlete.getCategory().getId(),
                athlete.getCategory().getName(),
                athlete.getCategory().getMinAge(),
                athlete.getCategory().getMaxAge(),
                athlete.getSport() != null ? athlete.getSport().getName() : null
            ));
        }

        return response;
    }

    /**
     * Map AthleteGuardian to GuardianInfo DTO.
     */
    private AthleteResponse.GuardianInfo mapGuardianInfo(AthleteGuardian athleteGuardian) {
        if (athleteGuardian == null || athleteGuardian.getGuardian() == null) {
            return null;
        }

        return new AthleteResponse.GuardianInfo(
            athleteGuardian.getGuardian().getId(),
            athleteGuardian.getGuardian().getFullName(),
            athleteGuardian.getGuardian().getEmail(),
            athleteGuardian.getGuardian().getPhone(),
            athleteGuardian.getRelationship(),
            athleteGuardian.isPrimary()
        );
    }

    /**
     * Create guardian info for the athlete's guardians endpoint.
     */
    public List<AthleteResponse.GuardianInfo> mapGuardianInfoList(List<AthleteGuardian> athleteGuardians) {
        if (athleteGuardians == null) {
            return List.of();
        }
        
        return athleteGuardians.stream()
                .filter(AthleteGuardian::isActive)
                .map(this::mapGuardianInfo)
                .toList();
    }

    /**
     * Update athlete entity from update request (partial update).
     */
    public void updateAthleteFromRequest(Athlete athlete, com.sgd.athlete.dto.AthleteUpdateRequest request) {
        if (request.getFullName() != null) {
            athlete.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            athlete.setEmail(request.getEmail().trim().isEmpty() ? null : request.getEmail());
        }
        if (request.getPhone() != null) {
            athlete.setPhone(request.getPhone().trim().isEmpty() ? null : request.getPhone());
        }
        if (request.getAddress() != null) {
            athlete.setAddress(request.getAddress().trim().isEmpty() ? null : request.getAddress());
        }
        if (request.getEmergencyContact() != null) {
            athlete.setEmergencyContact(request.getEmergencyContact().trim().isEmpty() ? null : request.getEmergencyContact());
        }
        if (request.getEmergencyPhone() != null) {
            athlete.setEmergencyPhone(request.getEmergencyPhone().trim().isEmpty() ? null : request.getEmergencyPhone());
        }
        if (request.getMedicalNotes() != null) {
            athlete.setMedicalNotes(request.getMedicalNotes().trim().isEmpty() ? null : request.getMedicalNotes());
        }
        // Note: venueId and categoryId are handled separately in the service with validation
    }
}