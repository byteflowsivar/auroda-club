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

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/sgd/sports/[id] - Obtener deporte específico
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const headers = await getBackendHeaders(session);

    const response = await fetch(`${BACKEND_URL}/sports/${id}`, {
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
    console.error('Error proxying sport GET:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/sgd/sports/[id] - Actualizar deporte
 * NOTA: Endpoint preparado para cuando el backend implemente UPDATE operations
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // FUTURO: Cuando el backend implemente PUT /api/sports/{id}
    return NextResponse.json(
      { 
        message: 'Funcionalidad en desarrollo',
        details: `La actualización del deporte ${id} estará disponible cuando el backend implemente esta operación.`,
        sportId: parseInt(id)
      },
      { status: 501 }
    );

  } catch (error) {
    console.error('Error in sport PUT preparation:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sgd/sports/[id] - Eliminar deporte
 * NOTA: Endpoint preparado para cuando el backend implemente DELETE operations
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // FUTURO: Verificar atletas asociados antes de eliminar
    // FUTURO: Cuando el backend implemente DELETE /api/sports/{id}
    return NextResponse.json(
      { 
        message: 'Funcionalidad en desarrollo',
        details: `La eliminación del deporte ${id} estará disponible cuando el backend implemente esta operación. Se incluirá validación de atletas asociados.`,
        sportId: parseInt(id)
      },
      { status: 501 }
    );

  } catch (error) {
    console.error('Error in sport DELETE preparation:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}