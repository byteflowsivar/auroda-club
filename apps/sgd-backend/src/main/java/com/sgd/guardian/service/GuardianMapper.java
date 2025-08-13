package com.sgd.guardian.service;

import com.sgd.athlete.entity.AthleteGuardian;
import com.sgd.guardian.dto.GuardianCreateRequest;
import com.sgd.guardian.dto.GuardianResponse;
import com.sgd.guardian.dto.GuardianUpdateRequest;
import com.sgd.guardian.entity.Guardian;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for Guardian entity and DTOs.
 * Handles conversion between domain entities and response/request DTOs.
 */
@ApplicationScoped
public class GuardianMapper {

    /**
     * Convert Guardian entity to simple response DTO (for list views).
     */
    public GuardianResponse toSimpleResponse(Guardian guardian) {
        if (guardian == null) {
            return null;
        }

        GuardianResponse response = new GuardianResponse();
        response.setId(guardian.getId());
        response.setFullName(guardian.getFullName());
        response.setEmail(guardian.getEmail());
        response.setPhone(guardian.getPhone());
        response.setSecondaryPhone(guardian.getSecondaryPhone());
        response.setAddress(guardian.getAddress());
        response.setIdentificationNumber(guardian.getIdentificationNumber());
        response.setActive(guardian.isActive());
        response.setCreatedAt(guardian.getCreatedAt());
        response.setUpdatedAt(guardian.getUpdatedAt());

        return response;
    }

    /**
     * Convert Guardian entity to full response DTO (with athletes).
     */
    public GuardianResponse toResponse(Guardian guardian) {
        if (guardian == null) {
            return null;
        }

        GuardianResponse response = toSimpleResponse(guardian);
        
        // Map athlete associations
        if (guardian.getAthleteGuardians() != null) {
            List<GuardianResponse.AthleteInfo> athletes = guardian.getAthleteGuardians().stream()
                    .filter(AthleteGuardian::isActive)
                    .map(this::mapAthleteInfo)
                    .collect(Collectors.toList());
            response.setAthletes(athletes);
        }

        return response;
    }

    /**
     * Map list of AthleteGuardian associations to AthleteInfo DTOs.
     */
    public List<GuardianResponse.AthleteInfo> mapAthleteInfoList(List<AthleteGuardian> athleteGuardians) {
        if (athleteGuardians == null) {
            return List.of();
        }

        return athleteGuardians.stream()
                .map(this::mapAthleteInfo)
                .collect(Collectors.toList());
    }

    /**
     * Map single AthleteGuardian to AthleteInfo DTO.
     */
    private GuardianResponse.AthleteInfo mapAthleteInfo(AthleteGuardian athleteGuardian) {
        if (athleteGuardian == null || athleteGuardian.getAthlete() == null) {
            return null;
        }

        var athlete = athleteGuardian.getAthlete();
        
        GuardianResponse.AthleteInfo athleteInfo = new GuardianResponse.AthleteInfo();
        athleteInfo.setId(athlete.getId());
        athleteInfo.setFullName(athlete.getFullName());
        athleteInfo.setAge(athlete.getAge());
        athleteInfo.setSport(athlete.getSport() != null ? athlete.getSport().getName() : null);
        athleteInfo.setVenue(athlete.getVenue() != null ? athlete.getVenue().getName() : null);
        athleteInfo.setRelationship(athleteGuardian.getRelationship());
        athleteInfo.setIsPrimary(athleteGuardian.isPrimary());
        athleteInfo.setActive(athlete.isActive());

        return athleteInfo;
    }

    /**
     * Update Guardian entity from GuardianUpdateRequest.
     */
    public void updateGuardianFromRequest(Guardian guardian, GuardianUpdateRequest request) {
        if (guardian == null || request == null) {
            return;
        }

        // Update only non-null fields
        if (request.getFullName() != null) {
            guardian.setFullName(request.getFullName());
        }
        
        if (request.getEmail() != null) {
            guardian.setEmail(cleanString(request.getEmail()));
        }
        
        if (request.getPhone() != null) {
            guardian.setPhone(cleanString(request.getPhone()));
        }
        
        if (request.getSecondaryPhone() != null) {
            guardian.setSecondaryPhone(cleanString(request.getSecondaryPhone()));
        }
        
        if (request.getAddress() != null) {
            guardian.setAddress(cleanString(request.getAddress()));
        }
        
        if (request.getIdentificationNumber() != null) {
            guardian.setIdentificationNumber(cleanString(request.getIdentificationNumber()));
        }
    }

    /**
     * Create Guardian entity from GuardianCreateRequest.
     */
    public Guardian fromCreateRequest(GuardianCreateRequest request) {
        if (request == null) {
            return null;
        }

        Guardian guardian = new Guardian();
        guardian.setFullName(request.getFullName());
        guardian.setEmail(cleanString(request.getEmail()));
        guardian.setPhone(cleanString(request.getPhone()));
        guardian.setSecondaryPhone(cleanString(request.getSecondaryPhone()));
        guardian.setAddress(cleanString(request.getAddress()));
        guardian.setIdentificationNumber(cleanString(request.getIdentificationNumber()));

        return guardian;
    }

    /**
     * Clean string values - convert empty strings to null.
     */
    private String cleanString(String value) {
        return (value != null && value.trim().isEmpty()) ? null : value;
    }
}