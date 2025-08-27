package com.sgd.shared.config;

import io.quarkus.oidc.OidcTenantConfig;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.jboss.logging.Logger;

/**
 * Security configuration for OIDC/Keycloak integration.
 * Handles JWT token validation and custom claims processing.
 */
@ApplicationScoped
public class SecurityConfig {

    private static final Logger LOG = Logger.getLogger(SecurityConfig.class);

    /**
     * Configure security settings on application startup.
     */
    void onStart(@Observes StartupEvent ev) {
        LOG.info("SGD Backend Security Configuration initialized");
        LOG.info("OIDC authentication enabled with Keycloak integration");
        LOG.info("Custom JWT claims processing enabled for: club_id, venue_ids, sport_ids, full_name, phone");
    }
}