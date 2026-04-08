import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { gameSelections, users } from "@/db/schema";
import { and, eq, count } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check phone number
  const [dbUser] = await db
    .select({ phone: users.phone })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!dbUser?.phone) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  const { gameId: gameIdStr } = await params;
  const gameId = parseInt(gameIdStr, 10);
  const { type } = await request.json();

  if (type !== "watch" && type !== "host") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  // Get existing selection
  const existing = await db
    .select()
    .from(gameSelections)
    .where(
      and(
        eq(gameSelections.userId, session.user.id),
        eq(gameSelections.gameId, gameId)
      )
    )
    .limit(1);

  let watching: boolean;
  let hosting: boolean;

  if (existing.length === 0) {
    // Insert new
    watching = type === "watch";
    hosting = type === "host";
    await db.insert(gameSelections).values({
      userId: session.user.id,
      gameId,
      watching,
      hosting,
    });
  } else {
    // Toggle the relevant boolean
    watching = type === "watch" ? !existing[0].watching : existing[0].watching;
    hosting = type === "host" ? !existing[0].hosting : existing[0].hosting;
    await db
      .update(gameSelections)
      .set({ watching, hosting, updatedAt: new Date() })
      .where(eq(gameSelections.id, existing[0].id));
  }

  // Get updated watch count for this game
  const [watchCountResult] = await db
    .select({ count: count() })
    .from(gameSelections)
    .where(
      and(
        eq(gameSelections.gameId, gameId),
        eq(gameSelections.watching, true)
      )
    );

  return NextResponse.json({
    watching,
    hosting,
    watchCount: watchCountResult.count,
  });
}
