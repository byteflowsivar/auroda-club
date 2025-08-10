import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
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
            console.error('KEYCLOAK_ISSUER environment variable is not set')
            return NextResponse.redirect(new URL('/', request.url))
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
        
        console.log('Redirecting to Keycloak logout:', keycloakLogoutUrl.replace(/id_token_hint=[^&]*/, 'id_token_hint=***'))
        
        // Crear respuesta de redirección a Keycloak con limpieza de cookies
        const response = NextResponse.redirect(keycloakLogoutUrl)
        
        // Limpiar todas las cookies de NextAuth
        const cookieNames = [
            'next-auth.session-token',
            '__Secure-next-auth.session-token',
            'next-auth.csrf-token', 
            '__Secure-next-auth.csrf-token',
            'next-auth.callback-url',
            '__Secure-next-auth.callback-url',
            // También limpiar cookies chunked si existen
            'next-auth.session-token.0',
            'next-auth.session-token.1', 
            '__Secure-next-auth.session-token.0',
            '__Secure-next-auth.session-token.1',
        ]
        
        cookieNames.forEach(cookieName => {
            response.cookies.set(cookieName, '', {
                expires: new Date(0),
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            })
        })
        
        return response
    } catch (error) {
        console.error('Error during Keycloak logout:', error)
        
        // Fallback: limpiar cookies y redirigir a home
        const response = NextResponse.redirect(new URL('/', request.url))
        
        const cookieNames = [
            'next-auth.session-token',
            '__Secure-next-auth.session-token',
            'next-auth.csrf-token', 
            '__Secure-next-auth.csrf-token',
        ]
        
        cookieNames.forEach(cookieName => {
            response.cookies.set(cookieName, '', {
                expires: new Date(0),
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            })
        })
        
        return response
    }
}