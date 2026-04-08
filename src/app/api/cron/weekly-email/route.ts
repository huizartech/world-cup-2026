import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { games, surveyResponses, users } from "@/db/schema";
import { sendEmail, buildWeeklyAdminEmail } from "@/lib/email";
import { and, gte, lte, eq, inArray } from "drizzle-orm";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only send on Mondays (1 = Monday)
  const today = new Date();
  if (today.getDay() !== 1) {
    return NextResponse.json({ message: "Not Monday, skipping" });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return NextResponse.json({ error: "ADMIN_EMAIL not set" }, { status: 500 });
  }

  // Get games for this week (Mon-Sun)
  const startOfWeek = new Date(today);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const weekGames = await db
    .select()
    .from(games)
    .where(
      and(
        gte(games.kickoffTime, startOfWeek),
        lte(games.kickoffTime, endOfWeek)
      )
    )
    .orderBy(games.kickoffTime);

  if (weekGames.length === 0) {
    return NextResponse.json({ message: "No games this week" });
  }

  // Get survey responses with phone numbers for people who care about these games
  const allResponses = await db
    .select()
    .from(surveyResponses)
    .where(eq(surveyResponses.wantsEmailReminders, true));

  const emailGames = weekGames.map((game) => {
    // Find people who care about this game
    const interestedPeople = allResponses.filter(
      (r) => r.gamesCareAbout?.includes(game.matchNumber)
    );
    const phoneNumbers = interestedPeople
      .filter((r) => r.phone)
      .map((r) => `${r.name}: ${r.phone}`);

    return {
      matchNumber: game.matchNumber,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      kickoffTime: game.kickoffTime,
      watchLocation: game.watchLocation,
      phoneNumbers,
    };
  });

  const html = buildWeeklyAdminEmail(emailGames);

  await sendEmail({
    to: adminEmail,
    subject: `World Cup Watch Party — Week of ${startOfWeek.toLocaleDateString()}`,
    html,
  });

  return NextResponse.json({
    message: "Weekly email sent",
    gamesCount: weekGames.length,
  });
}
