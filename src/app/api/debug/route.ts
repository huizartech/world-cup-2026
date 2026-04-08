import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  const session = await auth();

  const rawUrl = process.env.POSTGRES_URL || "";
  const cleanedUrl = rawUrl
    .replace(/[?&]channel_binding=[^&]*/, (match) =>
      match.startsWith("?") ? "?" : ""
    )
    .replace(/\?&/, "?")
    .replace(/\?$/, "");

  let dbUsers = null;
  let dbError = null;
  try {
    dbUsers = await db.select().from(users).limit(10);
  } catch (e) {
    dbError = String(e);
  }

  return NextResponse.json({
    session,
    dbUsers,
    dbError,
    env: {
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      rawUrlEnd: "..." + rawUrl.slice(-60),
      cleanedUrlEnd: "..." + cleanedUrl.slice(-60),
    },
  });
}
