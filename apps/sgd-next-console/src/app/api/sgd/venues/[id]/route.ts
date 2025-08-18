import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080/api';

async function getBackendHeaders(session: { accessToken?: string } | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  return headers;
}

// GET /api/sgd/venues/[id] - Get a single venue
export async function GET(request: NextRequest,
                          { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const headers = await getBackendHeaders(session);

    const response = await fetch(`${BACKEND_API_URL}/venues/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/sgd/venues/[id] - Update a venue
export async function PUT(request: NextRequest,
                          { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json(); // Use request.json()
    const headers = await getBackendHeaders(session);

    const response = await fetch(`${BACKEND_API_URL}/venues/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    revalidateTag('venues');
    revalidateTag(`venue:${id}`);

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error(`Error updating venue ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/sgd/venues/[id] - Delete a venue
export async function DELETE(request: NextRequest,
                             { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const headers = await getBackendHeaders(session);

    const response = await fetch(`${BACKEND_API_URL}/venues/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const textError = await response.text();
      return NextResponse.json({ message: textError || 'Failed to delete venue' }, { status: response.status });
    }

    revalidateTag('venues');
    revalidateTag(`venue:${id}`);

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error(`Error deleting venue ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}