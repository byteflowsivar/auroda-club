package com.sgd.athlete.service;

import com.sgd.athlete.dto.AthleteCreateRequest;
import com.sgd.athlete.dto.AthleteFilters;
import com.sgd.athlete.dto.AthleteResponse;
import com.sgd.athlete.dto.AthleteUpdateRequest;
import com.sgd.shared.dto.PageResponse;
import com.sgd.shared.exception.BusinessException;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for AthleteService.
 * Tests business logic, validation rules, and security restrictions.
 */
@QuarkusTest
public class AthleteServiceTest {

    @Inject
    AthleteService athleteService;

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthletes_AsGeneralAdmin_ShouldReturnAllAthletes() {
        // Given
        AthleteFilters filters = new AthleteFilters();
        filters.setPage(0);
        filters.setSize(10);

        // When
        PageResponse<AthleteResponse> result = athleteService.getAthletes(filters);

        // Then
        assertNotNull(result);
        assertNotNull(result.getContent());
        assertTrue(result.getContent().size() > 0);
        
        // Should include athletes from different venues since ADMIN_GENERAL has access to all
        assertTrue(result.getContent().stream()
                .anyMatch(athlete -> athlete.getVenue().getId().equals(1L)));
    }

    @Test
    @TestSecurity(user = "club_admin", roles = {"ADMIN_CLUB"})
    public void testGetAthletes_AsClubAdmin_ShouldReturnOnlyClubAthletes() {
        // Given
        AthleteFilters filters = new AthleteFilters();
        filters.setPage(0);
        filters.setSize(10);

        // When
        PageResponse<AthleteResponse> result = athleteService.getAthletes(filters);

        // Then
        assertNotNull(result);
        assertNotNull(result.getContent());
        
        // Should only return athletes from club 1 (based on test security setup)
        result.getContent().forEach(athlete -> {
            assertEquals(1L, athlete.getClub().getId());
        });
    }

    @Test
    @TestSecurity(user = "profesor", roles = {"PROFESOR"})
    public void testGetAthletes_AsProfessor_ShouldReturnOnlyVenueAthletes() {
        // Given
        AthleteFilters filters = new AthleteFilters();
        filters.setPage(0);
        filters.setSize(10);

        // When
        PageResponse<AthleteResponse> result = athleteService.getAthletes(filters);

        // Then
        assertNotNull(result);
        assertNotNull(result.getContent());
        
        // Should only return athletes from venue 1 (based on test security setup)
        result.getContent().forEach(athlete -> {
            assertEquals(1L, athlete.getVenue().getId());
        });
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthleteById_ExistingAthlete_ShouldReturnAthlete() {
        // When
        AthleteResponse result = athleteService.getAthleteById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Juan Carlos Pérez", result.getFullName());
        assertNotNull(result.getClub());
        assertNotNull(result.getVenue());
        assertNotNull(result.getSport());
        assertNotNull(result.getCategory());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthleteById_NonExistentAthlete_ShouldThrowException() {
        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, 
            () -> athleteService.getAthleteById(999L));
        
        assertEquals("ATHLETE_NOT_FOUND", exception.getErrorCode());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    @Transactional
    public void testCreateAthlete_ValidAdultAthlete_ShouldCreateSuccessfully() {
        // Given
        AthleteCreateRequest request = new AthleteCreateRequest();
        request.setFullName("Test Adult Athlete");
        request.setBirthDate(LocalDate.of(1995, 5, 15)); // Adult
        request.setGender("M");
        request.setEmail("test.adult@test.com");
        request.setPhone("+503 9999-1111");
        request.setVenueId(1L);
        request.setSportId(1L);
        request.setCategoryId(4L); // Adult category
        request.setGuardians(List.of()); // No guardians needed for adults

        // When
        AthleteResponse result = athleteService.createAthlete(request);

        // Then
        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("Test Adult Athlete", result.getFullName());
        assertEquals("test.adult@test.com", result.getEmail());
        assertEquals(1L, result.getVenue().getId());
        assertTrue(result.getAge() >= 18);
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    @Transactional
    public void testCreateAthlete_MinorWithoutGuardians_ShouldThrowException() {
        // Given
        AthleteCreateRequest request = new AthleteCreateRequest();
        request.setFullName("Test Minor Athlete");
        request.setBirthDate(LocalDate.of(2010, 5, 15)); // Minor
        request.setGender("F");
        request.setVenueId(1L);
        request.setSportId(1L);
        request.setCategoryId(2L); // Juvenil category
        request.setGuardians(List.of()); // No guardians

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, 
            () -> athleteService.createAthlete(request));
        
        assertEquals("MINOR_REQUIRES_GUARDIAN", exception.getErrorCode());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    @Transactional
    public void testCreateAthlete_MinorWithGuardians_ShouldCreateSuccessfully() {
        // Given
        AthleteCreateRequest request = new AthleteCreateRequest();
        request.setFullName("Test Minor Athlete");
        request.setBirthDate(LocalDate.of(2010, 5, 15)); // Minor
        request.setGender("F");
        request.setVenueId(1L);
        request.setSportId(1L);
        request.setCategoryId(2L); // Juvenil category
        
        AthleteCreateRequest.GuardianAssociation guardian = 
            new AthleteCreateRequest.GuardianAssociation();
        guardian.setGuardianId(1L);
        guardian.setRelationship("madre");
        guardian.setIsPrimary(true);
        
        request.setGuardians(List.of(guardian));

        // When
        AthleteResponse result = athleteService.createAthlete(request);

        // Then
        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("Test Minor Athlete", result.getFullName());
        assertTrue(result.getAge() < 18);
        assertNotNull(result.getGuardians());
        assertFalse(result.getGuardians().isEmpty());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    @Transactional
    public void testCreateAthlete_InvalidCategoryForAge_ShouldThrowException() {
        // Given
        AthleteCreateRequest request = new AthleteCreateRequest();
        request.setFullName("Test Athlete Wrong Category");
        request.setBirthDate(LocalDate.of(2010, 5, 15)); // 13-14 years old
        request.setGender("M");
        request.setVenueId(1L);
        request.setSportId(1L);
        request.setCategoryId(4L); // Adult category (19-40 years)

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, 
            () -> athleteService.createAthlete(request));
        
        assertEquals("CATEGORY_AGE_MISMATCH", exception.getErrorCode());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    @Transactional
    public void testUpdateAthlete_ValidUpdate_ShouldUpdateSuccessfully() {
        // Given
        AthleteUpdateRequest request = new AthleteUpdateRequest();
        request.setFullName("Juan Carlos Pérez Updated");
        request.setEmail("juan.updated@test.com");
        request.setPhone("+503 9999-8888");

        // When
        AthleteResponse result = athleteService.updateAthlete(1L, request);

        // Then
        assertNotNull(result);
        assertEquals("Juan Carlos Pérez Updated", result.getFullName());
        assertEquals("juan.updated@test.com", result.getEmail());
        assertEquals("+503 9999-8888", result.getPhone());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    @Transactional
    public void testDeleteAthlete_ExistingAthlete_ShouldMarkAsInactive() {
        // Given
        Long athleteId = 1L;
        
        // Verify athlete exists and is active
        AthleteResponse athlete = athleteService.getAthleteById(athleteId);
        assertTrue(athlete.getActive());

        // When
        athleteService.deleteAthlete(athleteId);

        // Then
        BusinessException exception = assertThrows(BusinessException.class, 
            () -> athleteService.getAthleteById(athleteId));
        assertEquals("ATHLETE_NOT_FOUND", exception.getErrorCode());
    }

    @Test
    @TestSecurity(user = "club_admin", roles = {"ADMIN_CLUB"})
    public void testDeleteAthlete_AsClubAdmin_ShouldThrowAccessDeniedException() {
        // When & Then
        BusinessException exception = assertThrows(BusinessException.class, 
            () -> athleteService.deleteAthlete(1L));
        
        assertEquals("ACCESS_DENIED", exception.getErrorCode());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthleteGuardians_ExistingAthlete_ShouldReturnGuardians() {
        // When
        List<AthleteResponse.GuardianInfo> guardians = athleteService.getAthleteGuardians(1L);

        // Then
        assertNotNull(guardians);
        assertFalse(guardians.isEmpty());
        
        AthleteResponse.GuardianInfo primaryGuardian = guardians.stream()
            .filter(AthleteResponse.GuardianInfo::getIsPrimary)
            .findFirst()
            .orElse(null);
        
        assertNotNull(primaryGuardian);
        assertEquals("María Elena Pérez", primaryGuardian.getFullName());
        assertEquals("madre", primaryGuardian.getRelationship());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthletes_WithSearchFilter_ShouldFilterCorrectly() {
        // Given
        AthleteFilters filters = new AthleteFilters();
        filters.setSearch("Juan");
        filters.setPage(0);
        filters.setSize(10);

        // When
        PageResponse<AthleteResponse> result = athleteService.getAthletes(filters);

        // Then
        assertNotNull(result);
        assertNotNull(result.getContent());
        assertTrue(result.getContent().stream()
                .anyMatch(athlete -> athlete.getFullName().contains("Juan")));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthletes_WithVenueFilter_ShouldFilterCorrectly() {
        // Given
        AthleteFilters filters = new AthleteFilters();
        filters.setVenueId(1L);
        filters.setPage(0);
        filters.setSize(10);

        // When
        PageResponse<AthleteResponse> result = athleteService.getAthletes(filters);

        // Then
        assertNotNull(result);
        result.getContent().forEach(athlete -> {
            assertEquals(1L, athlete.getVenue().getId());
        });
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthletes_WithAgeFilter_ShouldFilterCorrectly() {
        // Given
        AthleteFilters filters = new AthleteFilters();
        filters.setAgeMin(18);
        filters.setAgeMax(25);
        filters.setPage(0);
        filters.setSize(10);

        // When
        PageResponse<AthleteResponse> result = athleteService.getAthletes(filters);

        // Then
        assertNotNull(result);
        result.getContent().forEach(athlete -> {
            assertTrue(athlete.getAge() >= 18 && athlete.getAge() <= 25,
                    "Athlete age " + athlete.getAge() + " should be between 18 and 25");
        });
    }
}