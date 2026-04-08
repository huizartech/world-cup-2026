import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { watchPartyAccess, users, games } from "@/db/schema";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/permissions";
import { eq, and } from "drizzle-orm";

// GET all access grants
export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const access = await db
    .select({
      id: watchPartyAccess.id,
      userId: watchPartyAccess.userId,
      gameId: watchPartyAccess.gameId,
      grantedAt: watchPartyAccess.grantedAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(watchPartyAccess)
    .leftJoin(users, eq(watchPartyAccess.userId, users.id));

  return NextResponse.json(access);
}

// POST grant access
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, gameId } = await request.json();

  const result = await db
    .insert(watchPartyAccess)
    .values({
      userId,
      gameId,
      grantedBy: session!.user.id,
    })
    .onConflictDoNothing()
    .returning();

  return NextResponse.json(result[0] ?? { message: "Already granted" });
}

// DELETE revoke access
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, gameId } = await request.json();

  await db
    .delete(watchPartyAccess)
    .where(
      and(
        eq(watchPartyAccess.userId, userId),
        eq(watchPartyAccess.gameId, gameId)
      )
    );

  return NextResponse.json({ success: true });
}
