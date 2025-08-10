import { NextRequest, NextResponse } from 'next/server'
import { applyCookieSettings, getClearCookieSettings } from '@/lib/cookie-utils'

/**
 * Endpoint de fallback para logout local únicamente
 * Se usa cuando Keycloak no responde o hay problemas de conectividad
 */
export async function GET(request: NextRequest) {
  console.log('Performing local logout fallback')

  // Crear respuesta de redirección a home
  const response = NextResponse.redirect(new URL('/', request.url))

  // Limpiar todas las cookies usando utilidad centralizada
  const cookieSettings = getClearCookieSettings()
  applyCookieSettings(response, cookieSettings)

  console.log('Local session cleared successfully')
  return response
}