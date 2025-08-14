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
 * GET /api/sgd/athletes/[id] - Obtener atleta específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const headers = await getBackendHeaders(session);

    const response = await fetch(`${BACKEND_URL}/athletes/${resolvedParams.id}`, {
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
    console.error(`Error proxying athlete GET:`, error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/sgd/athletes/[id] - Actualizar atleta
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const headers = await getBackendHeaders(session);

    const response = await fetch(`${BACKEND_URL}/athletes/${resolvedParams.id}`, {
      method: 'PUT',
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
    return NextResponse.json(data);

  } catch (error) {
    console.error(`Error proxying athlete PUT:`, error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sgd/athletes/[id] - Eliminar atleta (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const headers = await getBackendHeaders(session);

    const response = await fetch(`${BACKEND_URL}/athletes/${resolvedParams.id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    // DELETE retorna 204 No Content
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error(`Error proxying athlete DELETE:`, error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}