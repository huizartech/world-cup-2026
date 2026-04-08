import { NextResponse } from "next/server";
import { db } from "@/db";
import { gameSelections, users, games } from "@/db/schema";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/permissions";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const selections = await db
    .select({
      id: gameSelections.id,
      userId: gameSelections.userId,
      gameId: gameSelections.gameId,
      watching: gameSelections.watching,
      hosting: gameSelections.hosting,
      createdAt: gameSelections.createdAt,
      userName: users.name,
      userEmail: users.email,
      userPhone: users.phone,
    })
    .from(gameSelections)
    .leftJoin(users, eq(gameSelections.userId, users.id))
    .orderBy(asc(gameSelections.createdAt));

  return NextResponse.json(selections);
}
