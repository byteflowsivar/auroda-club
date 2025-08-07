package com.sgd.athlete.resource;

import com.sgd.athlete.dto.AthleteCreateRequest;
import com.sgd.athlete.dto.GuardianAssociationRequest;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.lessThan;
import static org.hamcrest.Matchers.lessThanOrEqualTo;

/**
 * Integration tests for AthleteResource.
 * Tests REST endpoints, serialization, and HTTP status codes.
 */
@QuarkusTest
public class AthleteResourceTest {

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthletes_WithoutFilters_ShouldReturn200() {
        given()
            .when()
                .get("/athletes")
            .then()
                .statusCode(200)
                .body("content", notNullValue())
                .body("content.size()", greaterThan(0))
                .body("pagination", notNullValue())
                .body("pagination.page", equalTo(0))
                .body("pagination.size", equalTo(20))
                .body("pagination.totalElements", greaterThan(0));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthletes_WithPagination_ShouldReturn200() {
        given()
            .queryParam("page", 0)
            .queryParam("size", 2)
            .when()
                .get("/athletes")
            .then()
                .statusCode(200)
                .body("content.size()", lessThanOrEqualTo(2))
                .body("pagination.page", equalTo(0))
                .body("pagination.size", equalTo(2));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthletes_WithSearchFilter_ShouldReturn200() {
        given()
            .queryParam("search", "Juan")
            .when()
                .get("/athletes")
            .then()
                .statusCode(200)
                .body("content.find { it.fullName.contains('Juan') }", notNullValue());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthletes_WithVenueFilter_ShouldReturn200() {
        given()
            .queryParam("venueId", 1)
            .when()
                .get("/athletes")
            .then()
                .statusCode(200)
                .body("content.every { it.venue.id == 1 }", equalTo(true));
    }

    @Test
    @TestSecurity(user = "profesor", roles = {"PROFESOR"})
    public void testGetAthletes_AsProfessor_ShouldReturn200WithRestrictedData() {
        given()
            .when()
                .get("/athletes")
            .then()
                .statusCode(200)
                .body("content", notNullValue())
                // Should only see athletes from venue 1 (based on test security setup)
                .body("content.every { it.venue.id == 1 }", equalTo(true));
    }

    @Test
    public void testGetAthletes_WithoutAuth_ShouldReturn401() {
        given()
            .when()
                .get("/athletes")
            .then()
                .statusCode(401);
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthleteById_ExistingAthlete_ShouldReturn200() {
        given()
            .when()
                .get("/athletes/1")
            .then()
                .statusCode(200)
                .body("id", equalTo(1))
                .body("fullName", equalTo("Juan Carlos Pérez"))
                .body("age", greaterThan(0))
                .body("club", notNullValue())
                .body("venue", notNullValue())
                .body("sport", notNullValue())
                .body("category", notNullValue())
                .body("guardians", notNullValue());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthleteById_NonExistentAthlete_ShouldReturn404() {
        given()
            .when()
                .get("/athletes/999")
            .then()
                .statusCode(404)
                .body("error.code", equalTo("ATHLETE_NOT_FOUND"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testCreateAthlete_ValidAdultAthlete_ShouldReturn201() {
        AthleteCreateRequest request = new AthleteCreateRequest();
        request.setFullName("Test API Adult");
        request.setBirthDate(LocalDate.of(1995, 6, 15));
        request.setGender("M");
        request.setEmail("test.api.adult@test.com");
        request.setPhone("+503 9999-0000");
        request.setVenueId(1L);
        request.setSportId(1L);
        request.setCategoryId(4L); // Adult category
        request.setGuardians(List.of());

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .when()
                .post("/athletes")
            .then()
                .statusCode(201)
                .header("Location", notNullValue())
                .body("id", notNullValue())
                .body("fullName", equalTo("Test API Adult"))
                .body("email", equalTo("test.api.adult@test.com"))
                .body("age", greaterThan(18));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testCreateAthlete_MinorWithGuardians_ShouldReturn201() {
        AthleteCreateRequest.GuardianAssociation guardian = 
            new AthleteCreateRequest.GuardianAssociation();
        guardian.setGuardianId(1L);
        guardian.setRelationship("padre");
        guardian.setIsPrimary(true);

        AthleteCreateRequest request = new AthleteCreateRequest();
        request.setFullName("Test API Minor");
        request.setBirthDate(LocalDate.of(2010, 6, 15));
        request.setGender("F");
        request.setVenueId(1L);
        request.setSportId(1L);
        request.setCategoryId(2L); // Juvenil category
        request.setGuardians(List.of(guardian));

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .when()
                .post("/athletes")
            .then()
                .statusCode(201)
                .body("fullName", equalTo("Test API Minor"))
                .body("age", lessThan(18))
                .body("guardians.size()", equalTo(1));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testCreateAthlete_InvalidData_ShouldReturn400() {
        AthleteCreateRequest request = new AthleteCreateRequest();
        // Missing required fields

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .when()
                .post("/athletes")
            .then()
                .statusCode(400)
                .body("error.code", equalTo("VALIDATION_ERROR"))
                .body("error.details", notNullValue())
                .body("error.details.size()", greaterThan(0));
    }

    @Test
    @TestSecurity(user = "profesor", roles = {"PROFESOR"})
    public void testCreateAthlete_AsProfessor_ShouldReturn403() {
        AthleteCreateRequest request = new AthleteCreateRequest();
        request.setFullName("Test Professor Access");
        request.setBirthDate(LocalDate.of(1995, 6, 15));
        request.setVenueId(1L);
        request.setSportId(1L);
        request.setCategoryId(4L);

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .when()
                .post("/athletes")
            .then()
                .statusCode(403);
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testUpdateAthlete_ValidUpdate_ShouldReturn200() {
        String updateJson = """
            {
                "fullName": "Juan Carlos Updated",
                "email": "juan.updated.api@test.com",
                "phone": "+503 9999-7777"
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(updateJson)
            .when()
                .put("/athletes/1")
            .then()
                .statusCode(200)
                .body("fullName", equalTo("Juan Carlos Updated"))
                .body("email", equalTo("juan.updated.api@test.com"))
                .body("phone", equalTo("+503 9999-7777"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testUpdateAthlete_NonExistentAthlete_ShouldReturn404() {
        String updateJson = """
            {
                "fullName": "Non Existent"
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(updateJson)
            .when()
                .put("/athletes/999")
            .then()
                .statusCode(404)
                .body("error.code", equalTo("ATHLETE_NOT_FOUND"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testDeleteAthlete_ExistingAthlete_ShouldReturn204() {
        given()
            .when()
                .delete("/athletes/2")
            .then()
                .statusCode(204);

        // Verify athlete is no longer accessible
        given()
            .when()
                .get("/athletes/2")
            .then()
                .statusCode(404);
    }

    @Test
    @TestSecurity(user = "club_admin", roles = {"ADMIN_CLUB"})
    public void testDeleteAthlete_AsClubAdmin_ShouldReturn403() {
        given()
            .when()
                .delete("/athletes/1")
            .then()
                .statusCode(403)
                .body("error.code", equalTo("ACCESS_DENIED"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthleteGuardians_ExistingAthlete_ShouldReturn200() {
        given()
            .when()
                .get("/athletes/1/guardians")
            .then()
                .statusCode(200)
                .body("size()", greaterThan(0))
                .body("[0].id", notNullValue())
                .body("[0].fullName", notNullValue())
                .body("[0].relationship", notNullValue())
                .body("find { it.isPrimary == true }", notNullValue());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testAssociateGuardian_ValidRequest_ShouldReturn201() {
        GuardianAssociationRequest request = new GuardianAssociationRequest();
        request.setGuardianId(2L);
        request.setRelationship("tío");
        request.setIsPrimary(false);

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .when()
                .post("/athletes/2/guardians")
            .then()
                .statusCode(201)
                .body("message", equalTo("Tutor asociado exitosamente"))
                .body("athleteId", equalTo(2))
                .body("guardianId", equalTo(2))
                .body("relationship", equalTo("tío"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testAssociateGuardian_InvalidRequest_ShouldReturn400() {
        GuardianAssociationRequest request = new GuardianAssociationRequest();
        // Missing required fields

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .when()
                .post("/athletes/1/guardians")
            .then()
                .statusCode(400)
                .body("error.code", equalTo("VALIDATION_ERROR"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testAssociateGuardian_NonExistentGuardian_ShouldReturn404() {
        GuardianAssociationRequest request = new GuardianAssociationRequest();
        request.setGuardianId(999L);
        request.setRelationship("padre");

        given()
            .contentType(ContentType.JSON)
            .body(request)
            .when()
                .post("/athletes/1/guardians")
            .then()
                .statusCode(404)
                .body("error.code", equalTo("GUARDIAN_NOT_FOUND"));
    }

    @Test
    public void testInvalidPathParameter_ShouldReturn400() {
        given()
            .when()
                .get("/athletes/invalid")
            .then()
                .statusCode(400);
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN_GENERAL"})
    public void testGetAthletes_WithInvalidSizeParameter_ShouldReturn400() {
        given()
            .queryParam("size", 100) // Exceeds max size of 50
            .when()
                .get("/athletes")
            .then()
                .statusCode(400)
                .body("error.code", equalTo("VALIDATION_ERROR"));
    }
}