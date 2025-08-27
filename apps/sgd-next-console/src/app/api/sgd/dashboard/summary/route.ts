import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

/**
 * BFF route to securely fetch dashboard summary data.
 * It gets the user's session token and forwards it to the backend API.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "Error al obtener los datos del dashboard" },
        { status: response.status }
      );
    }

    const summaryData = await response.json();
    return NextResponse.json(summaryData);

  } catch (error: any) {
    console.error("[API_DASHBOARD_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}