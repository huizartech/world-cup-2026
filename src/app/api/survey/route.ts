import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { surveyResponses } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

// GET own survey response
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const response = await db
    .select()
    .from(surveyResponses)
    .where(eq(surveyResponses.userId, session.user.id))
    .limit(1);

  if (response.length === 0) {
    return NextResponse.json(null);
  }

  return NextResponse.json(response[0]);
}

// POST / update survey response
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    const data = {
      userId: session.user.id,
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      canHost: body.canHost ?? false,
      gamesToHost: body.gamesToHost || [],
      gamesCareAbout: body.gamesCareAbout || [],
      wantsEmailReminders: body.wantsEmailReminders ?? true,
      wantsTextReminders: body.wantsTextReminders ?? false,
      updatedAt: new Date(),
    };

    // Upsert: try update first, then insert
    const existing = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.userId, session.user.id))
      .limit(1);

    let result;
    if (existing.length > 0) {
      result = await db
        .update(surveyResponses)
        .set(data)
        .where(eq(surveyResponses.userId, session.user.id))
        .returning();
    } else {
      result = await db
        .insert(surveyResponses)
        .values(data)
        .returning();
    }

    return NextResponse.json(result[0]);
  } catch (err) {
    console.error("Survey POST error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
