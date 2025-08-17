import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080/api';

async function getBackendHeaders(session: { accessToken?: string }) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  return headers;
}

/**
 * GET /api/sgd/sports - Lista deportes activos
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const backendUrl = new URL(`${BACKEND_URL}/sports`);
    
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const headers = await getBackendHeaders(session);

    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error proxying sports GET:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sgd/sports - Crear nuevo deporte
 * NOTA: Endpoint preparado para cuando el backend implemente CREATE operations
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // FUTURO: Cuando el backend implemente POST /api/sports
    return NextResponse.json(
      { 
        message: 'Funcionalidad en desarrollo',
        details: 'El backend aún no soporta la creación de deportes. Esta funcionalidad estará disponible en una futura actualización.'
      },
      { status: 501 }
    );

    /* CODIGO PREPARADO PARA EL FUTURO:
    const body = await request.json();
    const headers = await getBackendHeaders(session);

    const response = await fetch(`${BACKEND_URL}/sports`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
    */

  } catch (error) {
    console.error('Error in sport POST preparation:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}