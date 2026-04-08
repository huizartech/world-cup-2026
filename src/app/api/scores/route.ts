import { NextResponse } from "next/server";
import { fetchLiveScores } from "@/lib/scores";
import { db } from "@/db";
import { games } from "@/db/schema";
import { asc, inArray } from "drizzle-orm";

export async function GET() {
  // Fetch and update scores from football-data.org
  const result = await fetchLiveScores();

  // Return all live and today's games
  const liveGames = await db
    .select()
    .from(games)
    .where(inArray(games.matchStatus, ["live", "scheduled"]))
    .orderBy(asc(games.kickoffTime));

  return NextResponse.json({
    ...result,
    games: liveGames,
  });
}
