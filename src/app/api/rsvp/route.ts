import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
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
    console.error("Failed to fetch RSVPs:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, attending, guests_count, message } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Naam is verplicht" },
        { status: 400 }
      );
    }

    if (typeof attending !== "boolean") {
      return NextResponse.json(
        { error: "Geef aan of je komt" },
        { status: 400 }
      );
    }

    const guestCount = attending ? Math.max(1, Number(guests_count) || 1) : 0;
    const trimmedMessage = message?.trim() || null;

    const sql = getDb();
    const result = await sql`
      INSERT INTO rsvps (name, attending, guests_count, message)
      VALUES (${name.trim()}, ${attending}, ${guestCount}, ${trimmedMessage})
      RETURNING *
    `;

    return NextResponse.json({ entry: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Failed to save RSVP:", error);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
