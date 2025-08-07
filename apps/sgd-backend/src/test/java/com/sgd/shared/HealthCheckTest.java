package com.sgd.shared;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;

/**
 * Test health check endpoints.
 */
@QuarkusTest
public class HealthCheckTest {

    @Test
    public void testHealthEndpoint() {
        given()
            .when()
                .get("/q/health")
            .then()
                .statusCode(200)
                .body("status", equalTo("UP"));
    }

    @Test
    public void testReadinessEndpoint() {
        given()
            .when()
                .get("/q/health/ready")
            .then()
                .statusCode(200)
                .body("status", equalTo("UP"));
    }

    @Test
    public void testLivenessEndpoint() {
        given()
            .when()
                .get("/q/health/live")
            .then()
                .statusCode(200)
                .body("status", equalTo("UP"));
    }
}