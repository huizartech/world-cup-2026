import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { games } from "@/db/schema";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/permissions";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const game = await db
    .select()
    .from(games)
    .where(eq(games.id, parseInt(gameId)))
    .limit(1);

  if (game.length === 0) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json(game[0]);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { gameId } = await params;
  const body = await request.json();

  // Build update object using Drizzle column names (camelCase JS properties)
  const updates: Partial<typeof games.$inferInsert> = {
    updatedAt: new Date(),
  };

  if ("watchLocation" in body) updates.watchLocation = body.watchLocation;
  if ("locationType" in body) updates.locationType = body.locationType;
  if ("locationNotes" in body) updates.locationNotes = body.locationNotes;
  if ("interestLevel" in body) updates.interestLevel = body.interestLevel;
  if ("homeTeam" in body) updates.homeTeam = body.homeTeam;
  if ("awayTeam" in body) updates.awayTeam = body.awayTeam;
  if ("homeScore" in body) updates.homeScore = body.homeScore;
  if ("awayScore" in body) updates.awayScore = body.awayScore;
  if ("matchStatus" in body) updates.matchStatus = body.matchStatus;

  const result = await db
    .update(games)
    .set(updates)
    .where(eq(games.id, parseInt(gameId)))
    .returning();

  if (result.length === 0) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}
