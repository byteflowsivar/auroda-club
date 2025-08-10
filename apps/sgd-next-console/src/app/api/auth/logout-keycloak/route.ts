import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getClearCookieSettings, applyCookieSettings } from '@/lib/cookie-utils'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const forceLocal = requestUrl.searchParams.get('force_local') === 'true'
    
    // SIEMPRE limpiar la sesión local primero (principio fail-safe)
    // Utilidad centralizada para configuración de cookies
    
    // Si se fuerza logout local únicamente
    if (forceLocal) {
        console.log('Forced local logout - skipping Keycloak')
        const response = NextResponse.redirect(new URL('/', request.url))
        const cookieSettings = getClearCookieSettings()
        applyCookieSettings(response, cookieSettings)
        return response
    }
    
    try {
        // Obtener el JWT token del servidor (que contiene el id_token)
        const token = await getToken({ 
            req: request,
            secret: process.env.NEXTAUTH_SECRET 
        })
        
        // Obtener variables de entorno del servidor
        const keycloakIssuer = process.env.KEYCLOAK_ISSUER
        const postLogoutRedirectUri = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        
        if (!keycloakIssuer) {
            console.error('KEYCLOAK_ISSUER environment variable is not set - falling back to local logout')
            return NextResponse.redirect(new URL('/api/auth/logout-local', request.url))
        }
        
        // Construir parámetros de logout
        const logoutParams = new URLSearchParams({
            post_logout_redirect_uri: postLogoutRedirectUri
        })
        
        // Si hay token y id_token disponible, incluir id_token_hint
        if (token && token.idToken) {
            logoutParams.append('id_token_hint', token.idToken as string)
            console.log('Including id_token_hint in logout request')
        } else {
            console.warn('No id_token available for logout - proceeding without hint')
        }
        
        // Construir URL de logout de Keycloak
        const keycloakLogoutUrl = `${keycloakIssuer}/protocol/openid-connect/logout?${logoutParams.toString()}`
        
        console.log('Attempting Keycloak logout:', keycloakLogoutUrl.replace(/id_token_hint=[^&]*/, 'id_token_hint=***'))
        
        // Crear respuesta de redirección a Keycloak con limpieza garantizada de cookies
        const response = NextResponse.redirect(keycloakLogoutUrl)
        
        // Aplicar limpieza de cookies SIEMPRE usando utilidad centralizada
        const cookieSettings = getClearCookieSettings()
        applyCookieSettings(response, cookieSettings)
        
        console.log('Local session cleared, redirecting to Keycloak logout')
        return response
        
    } catch (error) {
        console.error('Error during Keycloak logout - falling back to local logout:', error)
        
        // Fallback GARANTIZADO: siempre limpiar cookies locales
        return NextResponse.redirect(new URL('/api/auth/logout-local', request.url))
    }
}