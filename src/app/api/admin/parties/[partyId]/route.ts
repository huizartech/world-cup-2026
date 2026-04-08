import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/permissions";
import { db } from "@/db";
import { hostParties, watchPartyAccess } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ partyId: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user) || !session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { partyId: partyIdStr } = await params;
  const partyId = parseInt(partyIdStr, 10);
  const { location, notes, attendeeIds } = await request.json();

  // Get party to find gameId
  const [party] = await db
    .select()
    .from(hostParties)
    .where(eq(hostParties.id, partyId))
    .limit(1);

  if (!party) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Update party details if provided
  if (location || notes !== undefined) {
    await db
      .update(hostParties)
      .set({
        ...(location ? { location } : {}),
        ...(notes !== undefined ? { notes } : {}),
        updatedAt: new Date(),
      })
      .where(eq(hostParties.id, partyId));
  }

  // Update attendees if provided
  if (Array.isArray(attendeeIds)) {
    // Remove all existing access for this game (except host)
    const existingAccess = await db
      .select()
      .from(watchPartyAccess)
      .where(eq(watchPartyAccess.gameId, party.gameId));

    for (const a of existingAccess) {
      if (a.userId !== party.hostUserId) {
        await db
          .delete(watchPartyAccess)
          .where(
            and(
              eq(watchPartyAccess.userId, a.userId),
              eq(watchPartyAccess.gameId, party.gameId)
            )
          );
      }
    }

    // Add new attendees
    for (const userId of attendeeIds) {
      if (userId !== party.hostUserId) {
        await db
          .insert(watchPartyAccess)
          .values({
            userId,
            gameId: party.gameId,
            grantedBy: session.user.id,
          })
          .onConflictDoNothing();
      }
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ partyId: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user) || !session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { partyId: partyIdStr } = await params;
  const partyId = parseInt(partyIdStr, 10);

  const [party] = await db
    .select()
    .from(hostParties)
    .where(eq(hostParties.id, partyId))
    .limit(1);

  if (!party) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Remove all access grants for this game
  await db
    .delete(watchPartyAccess)
    .where(eq(watchPartyAccess.gameId, party.gameId));

  // Delete the party
  await db.delete(hostParties).where(eq(hostParties.id, partyId));

  return NextResponse.json({ success: true });
}
