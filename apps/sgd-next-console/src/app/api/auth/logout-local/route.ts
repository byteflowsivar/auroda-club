import { NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint de fallback para logout local únicamente
 * Se usa cuando Keycloak no responde o hay problemas de conectividad
 */
export async function GET(request: NextRequest) {
    console.log('Performing local logout fallback')
    
    // Crear respuesta de redirección a home
    const response = NextResponse.redirect(new URL('/', request.url))
    
    // Limpiar todas las cookies de NextAuth (garantizado)
    const cookieNames = [
        'next-auth.session-token',
        '__Secure-next-auth.session-token',
        'next-auth.csrf-token', 
        '__Secure-next-auth.csrf-token',
        'next-auth.callback-url',
        '__Secure-next-auth.callback-url',
        // También cookies chunked
        'next-auth.session-token.0',
        'next-auth.session-token.1',
        'next-auth.session-token.2',
        '__Secure-next-auth.session-token.0',
        '__Secure-next-auth.session-token.1',
        '__Secure-next-auth.session-token.2',
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
    
    console.log('Local session cleared successfully')
    return response
}