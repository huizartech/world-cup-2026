import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/permissions";
import { db } from "@/db";
import { gameSelections, users, games } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      phone: users.phone,
    })
    .from(users)
    .orderBy(asc(users.name));

  const allGames = await db
    .select({
      id: games.id,
      matchNumber: games.matchNumber,
      homeTeam: games.homeTeam,
      awayTeam: games.awayTeam,
      kickoffTime: games.kickoffTime,
      stage: games.stage,
      groupName: games.groupName,
    })
    .from(games)
    .orderBy(asc(games.kickoffTime), asc(games.matchNumber));

  const selections = await db
    .select({
      userId: gameSelections.userId,
      gameId: gameSelections.gameId,
      watching: gameSelections.watching,
      hosting: gameSelections.hosting,
    })
    .from(gameSelections);

  return NextResponse.json({ users: allUsers, games: allGames, selections });
}
