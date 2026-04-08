import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { games, gameSelections } from "@/db/schema";
import { auth } from "@/auth";
import { getUserAccessibleGameIds, filterGameForUser } from "@/lib/permissions";
import { SD_WATCH_PARTIES } from "@/lib/watch-venues";
import { asc, eq, and, gte, lte, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  const searchParams = request.nextUrl.searchParams;
  const stage = searchParams.get("stage");
  const group = searchParams.get("group");
  const date = searchParams.get("date");
  const interest = searchParams.get("interest");

  const conditions = [];
  if (stage) conditions.push(eq(games.stage, stage));
  if (group) conditions.push(eq(games.groupName, group));
  if (interest) conditions.push(eq(games.interestLevel, interest));
  if (date) {
    const start = new Date(date);
    const end = new Date(start.getTime() + 86400000);
    conditions.push(gte(games.kickoffTime, start));
    conditions.push(lte(games.kickoffTime, end));
  }

  const allGames = await db
    .select()
    .from(games)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(games.kickoffTime), asc(games.matchNumber));

  // Get watch counts per game
  const watchCounts = await db
    .select({
      gameId: gameSelections.gameId,
      watchCount: count(),
    })
    .from(gameSelections)
    .where(eq(gameSelections.watching, true))
    .groupBy(gameSelections.gameId);

  const watchCountMap = new Map(watchCounts.map((wc) => [wc.gameId, wc.watchCount]));

  // Get user's own selections if authenticated
  let userSelectionMap = new Map<number, { watching: boolean; hosting: boolean }>();
  if (user?.id) {
    const userSelections = await db
      .select({
        gameId: gameSelections.gameId,
        watching: gameSelections.watching,
        hosting: gameSelections.hosting,
      })
      .from(gameSelections)
      .where(eq(gameSelections.userId, user.id));

    userSelectionMap = new Map(
      userSelections.map((s) => [s.gameId, { watching: s.watching, hosting: s.hosting }])
    );
  }

  // Filter private locations based on user access
  const accessibleIds = user ? await getUserAccessibleGameIds(user.id) : new Set<number>();

  const filtered = allGames.map((game) =>
    filterGameForUser(game, user, accessibleIds)
  );

  // Attach watch parties, counts, and user selections
  const enriched = filtered.map((game) => {
    const userSel = userSelectionMap.get(game.id);
    return {
      ...game,
      watchParties: SD_WATCH_PARTIES,
      watchCount: watchCountMap.get(game.id) ?? 0,
      userWatching: userSel?.watching ?? false,
      userHosting: userSel?.hosting ?? false,
    };
  });

  return NextResponse.json(enriched);
}
