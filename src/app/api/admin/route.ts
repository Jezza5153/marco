import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const ADMIN_PWD = process.env.ADMIN_PASSWORD || "dikkepiemel";

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("x-admin-password");
  return authHeader === ADMIN_PWD;
}

// Verify admin password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password === ADMIN_PWD) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json(
      { error: "Verkeerd wachtwoord" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// Get all RSVPs (admin)
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM rsvps ORDER BY created_at DESC`;

    const totalResponses = rows.length;
    const attending = rows.filter((r) => r.attending);
    const totalGuests = attending.reduce(
      (sum, r) => sum + (r.guests_count || 1),
      0
    );
    const totalDeclined = rows.filter((r) => !r.attending).length;

    return NextResponse.json({
      entries: rows,
      stats: {
        totalResponses,
        totalGuests,
        totalAttending: attending.length,
        totalDeclined,
      },
    });
  } catch (error) {
    console.error("Admin fetch failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Delete RSVP entry
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const sql = getDb();
    await sql`DELETE FROM rsvps WHERE id = ${Number(id)}`;

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
