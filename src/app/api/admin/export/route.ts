import { NextResponse } from "next/server";
import { db } from "@/db";
import { surveyResponses, users } from "@/db/schema";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/permissions";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const responses = await db
    .select({
      id: surveyResponses.id,
      userId: surveyResponses.userId,
      name: surveyResponses.name,
      email: surveyResponses.email,
      phone: surveyResponses.phone,
      canHost: surveyResponses.canHost,
      gamesToHost: surveyResponses.gamesToHost,
      gamesCareAbout: surveyResponses.gamesCareAbout,
      wantsEmailReminders: surveyResponses.wantsEmailReminders,
      wantsTextReminders: surveyResponses.wantsTextReminders,
      createdAt: surveyResponses.createdAt,
      updatedAt: surveyResponses.updatedAt,
      userName: users.name,
      userEmail: users.email,
      userImage: users.image,
    })
    .from(surveyResponses)
    .leftJoin(users, eq(surveyResponses.userId, users.id))
    .orderBy(surveyResponses.createdAt);

  return NextResponse.json(responses);
}
