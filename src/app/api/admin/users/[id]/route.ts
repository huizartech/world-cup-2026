import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/permissions";
import { db } from "@/db";
import { users, gameSelections, hostParties, watchPartyAccess } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  // Don't allow deleting yourself
  if (session?.user && (session.user as { id: number }).id === userId) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  // Delete all related records first (foreign key constraints)
  await db.delete(gameSelections).where(eq(gameSelections.userId, userId));
  await db.delete(hostParties).where(eq(hostParties.hostUserId, userId));
  await db.delete(watchPartyAccess).where(eq(watchPartyAccess.userId, userId));
  await db.delete(users).where(eq(users.id, userId));

  return NextResponse.json({ success: true });
}
