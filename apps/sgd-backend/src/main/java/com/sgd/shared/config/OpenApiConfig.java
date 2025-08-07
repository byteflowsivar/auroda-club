package com.sgd.shared.config;

import jakarta.ws.rs.core.Application;
import org.eclipse.microprofile.openapi.annotations.ExternalDocumentation;
import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeIn;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeType;
import org.eclipse.microprofile.openapi.annotations.info.Contact;
import org.eclipse.microprofile.openapi.annotations.info.Info;
import org.eclipse.microprofile.openapi.annotations.info.License;
import org.eclipse.microprofile.openapi.annotations.security.SecurityScheme;
import org.eclipse.microprofile.openapi.annotations.servers.Server;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

/**
 * OpenAPI configuration for the SGD Backend API.
 * Defines API metadata, security schemes, and documentation structure.
 */
@OpenAPIDefinition(
    info = @Info(
        title = "SGD Backend API",
        version = "1.0.0",
        description = "Sistema de Gestión Deportiva - API Backend para la gestión de atletas, tutores y configuraciones deportivas",
        contact = @Contact(
            name = "SGD Development Team",
            email = "dev@sgd.com",
            url = "https://sgd.com/support"
        ),
        license = @License(
            name = "Proprietary",
            url = "https://sgd.com/license"
        )
    ),
    servers = {
        @Server(
            url = "http://localhost:8080/api",
            description = "Servidor de desarrollo"
        ),
        @Server(
            url = "https://api.sgd.com",
            description = "Servidor de producción"
        )
    },
    tags = {
        @Tag(name = "Athletes", description = "Operaciones relacionadas con atletas deportivos"),
        @Tag(name = "Guardians", description = "Operaciones relacionadas con tutores/guardianes"),
        @Tag(name = "Configuration", description = "Configuraciones del sistema (deportes, categorías, sedes)"),
        @Tag(name = "Health", description = "Endpoints de estado y monitoreo")
    },
    externalDocs = @ExternalDocumentation(
        description = "Documentación completa de la API",
        url = "https://docs.sgd.com/api"
    )
)
@SecurityScheme(
    securitySchemeName = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "JWT token obtenido a través de Keycloak. " +
                 "El token debe incluir los roles necesarios (ADMIN_GENERAL, ADMIN_CLUB, PROFESOR) " +
                 "y los claims personalizados (club_id, venue_ids, sport_ids)."
)
public class OpenApiConfig extends Application {
    // This class provides OpenAPI configuration through annotations
}