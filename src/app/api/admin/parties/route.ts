import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/permissions";
import { db } from "@/db";
import { hostParties, watchPartyAccess, users, games } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const parties = await db
    .select({
      id: hostParties.id,
      gameId: hostParties.gameId,
      hostUserId: hostParties.hostUserId,
      location: hostParties.location,
      notes: hostParties.notes,
      createdAt: hostParties.createdAt,
      hostName: users.name,
      hostEmail: users.email,
    })
    .from(hostParties)
    .leftJoin(users, eq(hostParties.hostUserId, users.id))
    .orderBy(asc(hostParties.createdAt));

  // Get game info for each party
  const gameIds = [...new Set(parties.map((p) => p.gameId))];
  const gameData =
    gameIds.length > 0
      ? await db
          .select({
            id: games.id,
            matchNumber: games.matchNumber,
            homeTeam: games.homeTeam,
            awayTeam: games.awayTeam,
          })
          .from(games)
      : [];
  const gameMap = new Map(gameData.map((g) => [g.id, g]));

  // Get attendees (watchPartyAccess) for each party's game
  const accessGrants = await db
    .select({
      gameId: watchPartyAccess.gameId,
      userId: watchPartyAccess.userId,
      userName: users.name,
      userEmail: users.email,
    })
    .from(watchPartyAccess)
    .leftJoin(users, eq(watchPartyAccess.userId, users.id));

  const attendeesByGame = new Map<number, Array<{ userId: number; name: string | null; email: string | null }>>();
  for (const a of accessGrants) {
    const existing = attendeesByGame.get(a.gameId) ?? [];
    existing.push({ userId: a.userId, name: a.userName, email: a.userEmail });
    attendeesByGame.set(a.gameId, existing);
  }

  const enriched = parties.map((p) => ({
    ...p,
    game: gameMap.get(p.gameId) ?? null,
    attendees: attendeesByGame.get(p.gameId) ?? [],
  }));

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user) || !session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { gameId, hostUserId, location, notes, attendeeIds } = await request.json();

  if (!gameId || !hostUserId || !location) {
    return NextResponse.json({ error: "gameId, hostUserId, and location are required" }, { status: 400 });
  }

  // Create the host party
  const [party] = await db
    .insert(hostParties)
    .values({
      gameId,
      hostUserId,
      location,
      notes: notes ?? null,
      createdBy: session.user.id,
    })
    .returning();

  // Update the game to have private location
  await db
    .update(games)
    .set({
      locationType: "private",
      watchLocation: location,
      locationNotes: notes ?? null,
      updatedAt: new Date(),
    })
    .where(eq(games.id, gameId));

  // Grant access to host
  await db
    .insert(watchPartyAccess)
    .values({
      userId: hostUserId,
      gameId,
      grantedBy: session.user.id,
    })
    .onConflictDoNothing();

  // Grant access to attendees
  const allAttendees: number[] = attendeeIds ?? [];
  for (const userId of allAttendees) {
    await db
      .insert(watchPartyAccess)
      .values({
        userId,
        gameId,
        grantedBy: session.user.id,
      })
      .onConflictDoNothing();
  }

  return NextResponse.json(party, { status: 201 });
}
