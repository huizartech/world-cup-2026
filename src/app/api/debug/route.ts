import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  const session = await auth();

  let dbUsers = null;
  try {
    dbUsers = await db.select().from(users).limit(10);
  } catch (e) {
    dbUsers = `DB error: ${e}`;
  }

  return NextResponse.json({
    session,
    dbUsers,
    env: {
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      postgresUrlPrefix: process.env.POSTGRES_URL?.substring(0, 30) + "...",
    },
  });
}
