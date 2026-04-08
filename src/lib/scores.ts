import { db } from "@/db";
import { games } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

const API_BASE = "https://api.football-data.org/v4";
const COMPETITION_ID = 2000; // FIFA World Cup

// Map football-data.org team names to our DB team names
const API_TEAM_MAP: Record<string, string> = {
  "South Korea": "Korea Republic",
  "Turkey": "Türkiye",
  "Iran": "IR Iran",
  "Ivory Coast": "Côte d'Ivoire",
  "Cape Verde": "Cabo Verde",
  "DR Congo": "Congo DR",
  "Curacao": "Curaçao",
  "Bosnia-Herzegovina": "Bosnia and Herzegovina",
};

function normalizeTeamName(apiName: string): string {
  return API_TEAM_MAP[apiName] ?? apiName;
}

// Cache last fetch timestamp to avoid redundant calls
let lastFetchedAt = 0;
const MIN_FETCH_INTERVAL = 30_000; // 30 seconds

export async function fetchLiveScores(): Promise<{
  updated: number;
  matches: number;
}> {
  const now = Date.now();
  if (now - lastFetchedAt < MIN_FETCH_INTERVAL) {
    return { updated: 0, matches: 0 };
  }

  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    console.warn("FOOTBALL_API_KEY not set, skipping live score fetch");
    return { updated: 0, matches: 0 };
  }

  try {
    const res = await fetch(`${API_BASE}/competitions/${COMPETITION_ID}/matches`, {
      headers: { "X-Auth-Token": apiKey },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("Football API error:", res.status, await res.text());
      return { updated: 0, matches: 0 };
    }

    const data = await res.json();
    lastFetchedAt = Date.now();

    let updated = 0;
    for (const match of data.matches ?? []) {
      const status = mapStatus(match.status);
      const homeTeam = normalizeTeamName(match.homeTeam?.name ?? "");
      const awayTeam = normalizeTeamName(match.awayTeam?.name ?? "");

      // Try fast path: match by apiMatchId if previously saved
      if (match.id) {
        const byId = await db
          .update(games)
          .set({
            homeScore: match.score?.fullTime?.home ?? match.score?.halfTime?.home,
            awayScore: match.score?.fullTime?.away ?? match.score?.halfTime?.away,
            matchStatus: status,
            updatedAt: new Date(),
          })
          .where(eq(games.apiMatchId, match.id));
        if (byId.rowCount && byId.rowCount > 0) {
          updated++;
          continue;
        }
      }

      // Slow path: match by team names, then save apiMatchId for next time
      if (!homeTeam || !awayTeam) continue;
      const byName = await db
        .update(games)
        .set({
          homeScore: match.score?.fullTime?.home ?? match.score?.halfTime?.home,
          awayScore: match.score?.fullTime?.away ?? match.score?.halfTime?.away,
          matchStatus: status,
          apiMatchId: match.id,
          updatedAt: new Date(),
        })
        .where(
          and(eq(games.homeTeam, homeTeam), eq(games.awayTeam, awayTeam))
        );
      if (byName.rowCount && byName.rowCount > 0) updated++;
    }

    return { updated, matches: data.matches?.length ?? 0 };
  } catch (error) {
    console.error("Failed to fetch live scores:", error);
    return { updated: 0, matches: 0 };
  }
}

function mapStatus(apiStatus: string): string {
  switch (apiStatus) {
    case "SCHEDULED":
    case "TIMED":
      return "scheduled";
    case "IN_PLAY":
    case "PAUSED":
      return "live";
    case "FINISHED":
      return "finished";
    default:
      return "scheduled";
  }
}

export async function fetchTodaysMatches() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 86400000);

  return db
    .select()
    .from(games)
    .where(
      and(
        gte(games.kickoffTime, startOfDay),
        lte(games.kickoffTime, endOfDay)
      )
    );
}
