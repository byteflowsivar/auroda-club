package com.sgd.shared.security;

import io.quarkus.oidc.runtime.OidcJwtCallerPrincipal;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.RequestScoped;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Security context helper to extract user information from JWT tokens.
 * Provides easy access to user claims and roles.
 */
@RequestScoped
public class SecurityContext {

    @Inject
    SecurityIdentity securityIdentity;

    @Inject
    Instance<JsonWebToken> jwtInstance;

    /**
     * Get JWT token safely, returns empty if not available (e.g., during tests).
     */
    private Optional<JsonWebToken> getJwt() {
        try {
            if (jwtInstance.isResolvable()) {
                return Optional.of(jwtInstance.get());
            }
        } catch (Exception e) {
            // JWT not available, probably in test context
        }
        return Optional.empty();
    }

    /**
     * Get current user's club ID from JWT claims.
     */
    public Optional<Long> getCurrentUserClubId() {
        return getJwt().flatMap(jwt -> {
            try {
                if (jwt.containsClaim("club_id")) {
                    Object clubIdClaim = jwt.getClaim("club_id");
                    if (clubIdClaim instanceof Number) {
                        return Optional.of(((Number) clubIdClaim).longValue());
                    }
                    if (clubIdClaim instanceof String) {
                        return Optional.of(Long.parseLong((String) clubIdClaim));
                    }
                }
            } catch (Exception e) {
                // Log error but don't throw
            }
            return Optional.empty();
        });
    }

    /**
     * Get current user's allowed venue IDs from JWT claims.
     */
    public List<Long> getCurrentUserVenueIds() {
        return getJwt().map(jwt -> {
            try {
                if (jwt.containsClaim("venue_ids")) {
                    Object venueIdsClaim = jwt.getClaim("venue_ids");
                    if (venueIdsClaim instanceof List<?> list) {
                        return list.stream()
                                .filter(obj -> obj instanceof Number)
                                .map(obj -> ((Number) obj).longValue())
                                .toList();
                    }
                }
            } catch (Exception e) {
                // Log error but return empty list
            }
            return List.<Long>of();
        }).orElse(List.of());
    }

    /**
     * Get current user's allowed sport IDs from JWT claims.
     */
    public List<Long> getCurrentUserSportIds() {
        return getJwt().map(jwt -> {
            try {
                if (jwt.containsClaim("sport_ids")) {
                    Object sportIdsClaim = jwt.getClaim("sport_ids");
                    if (sportIdsClaim instanceof List<?> list) {
                        return list.stream()
                                .filter(obj -> obj instanceof Number)
                                .map(obj -> ((Number) obj).longValue())
                                .toList();
                    }
                }
            } catch (Exception e) {
                // Log error but return empty list
            }
            return List.<Long>of();
        }).orElse(List.of());
    }

    /**
     * Get current user's full name from JWT claims.
     */
    public Optional<String> getCurrentUserFullName() {
        return getJwt().flatMap(jwt -> {
            try {
                if (jwt.containsClaim("full_name")) {
                    return Optional.of(jwt.getClaim("full_name").toString());
                }
            } catch (Exception e) {
                // Log error but don't throw
            }
            return Optional.empty();
        });
    }

    /**
     * Get current user's phone from JWT claims.
     */
    public Optional<String> getCurrentUserPhone() {
        return getJwt().flatMap(jwt -> {
            try {
                if (jwt.containsClaim("phone")) {
                    return Optional.of(jwt.getClaim("phone").toString());
                }
            } catch (Exception e) {
                // Log error but don't throw
            }
            return Optional.empty();
        });
    }

    /**
     * Get current user's roles.
     */
    public Set<String> getCurrentUserRoles() {
        return securityIdentity.getRoles();
    }

    /**
     * Check if current user has specific role.
     */
    public boolean hasRole(String role) {
        return securityIdentity.hasRole(role);
    }

    /**
     * Check if current user is ADMIN_GENERAL.
     */
    public boolean isGeneralAdmin() {
        return hasRole("ADMIN_GENERAL");
    }

    /**
     * Check if current user is ADMIN_CLUB.
     */
    public boolean isClubAdmin() {
        return hasRole("ADMIN_CLUB");
    }

    /**
     * Check if current user is PROFESOR.
     */
    public boolean isProfessor() {
        return hasRole("PROFESOR");
    }

    /**
     * Check if current user can write athletes data.
     */
    public boolean canWriteAthletes() {
        return isGeneralAdmin() || isClubAdmin();
    }

    /**
     * Check if current user can delete athletes data.
     */
    public boolean canDeleteAthletes() {
        return isGeneralAdmin();
    }

    /**
     * Check if current user can access venue.
     */
    public boolean canAccessVenue(Long venueId) {
        if (isGeneralAdmin()) {
            return true;
        }
        
        List<Long> allowedVenues = getCurrentUserVenueIds();
        return allowedVenues.contains(venueId);
    }

    /**
     * Check if current user can access club.
     */
    public boolean canAccessClub(Long clubId) {
        if (isGeneralAdmin()) {
            return true;
        }
        
        Optional<Long> userClubId = getCurrentUserClubId();
        return userClubId.map(id -> id.equals(clubId)).orElse(false);
    }

    /**
     * Get current user ID from JWT subject.
     */
    public Optional<String> getCurrentUserId() {
        return getJwt().flatMap(jwt -> {
            try {
                return Optional.ofNullable(jwt.getSubject());
            } catch (Exception e) {
                return Optional.empty();
            }
        });
    }

    /**
     * Get current user's username/preferred_username.
     */
    public Optional<String> getCurrentUsername() {
        return getJwt().flatMap(jwt -> {
            try {
                if (jwt.containsClaim("preferred_username")) {
                    return Optional.of(jwt.getClaim("preferred_username").toString());
                }
                if (jwt.containsClaim("username")) {
                    return Optional.of(jwt.getClaim("username").toString());
                }
            } catch (Exception e) {
                // Log error but don't throw
            }
            return Optional.empty();
        });
    }

    /**
     * Get allowed venues for filtering queries.
     * Returns null for ADMIN_GENERAL (no restrictions), list of venue IDs for others.
     */
    public List<Long> getAllowedVenuesForFiltering() {
        if (isGeneralAdmin()) {
            return null; // No restrictions
        }
        return getCurrentUserVenueIds();
    }

    /**
     * Get allowed club IDs for filtering queries.
     * Returns null for ADMIN_GENERAL (no restrictions), single club ID for others.
     */
    public List<Long> getAllowedClubsForFiltering() {
        if (isGeneralAdmin()) {
            return null; // No restrictions
        }
        return getCurrentUserClubId()
                .map(List::of)
                .orElse(List.of());
    }
}