import { db } from "@/db";
import { watchPartyAccess } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { Game } from "@/db/schema";

type SessionUser = { id: number; role: string } | undefined;

export function isAdmin(user: SessionUser): boolean {
  return user?.role === "admin";
}

export function canSeePrivateLocation(
  user: SessionUser,
  hasAccess: boolean
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return hasAccess;
}

export async function getUserAccessibleGameIds(
  userId: number
): Promise<Set<number>> {
  const access = await db
    .select({ gameId: watchPartyAccess.gameId })
    .from(watchPartyAccess)
    .where(eq(watchPartyAccess.userId, userId));
  return new Set(access.map((a) => a.gameId));
}

export function filterGameForUser(
  game: Game,
  user: SessionUser,
  accessibleGameIds: Set<number>
): Game {
  if (game.locationType !== "private") return game;
  if (isAdmin(user)) return game;
  if (user && accessibleGameIds.has(game.id)) return game;

  // Hide private location details
  return {
    ...game,
    watchLocation: null,
    locationNotes: null,
  };
}
