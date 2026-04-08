import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const rawUrl = process.env.POSTGRES_URL || "";
  const cleanedUrl = rawUrl
    .replace(/[?&]channel_binding=[^&]*/, (match) =>
      match.startsWith("?") ? "?" : ""
    )
    .replace(/\?&/, "?")
    .replace(/\?$/, "");

  const results: Record<string, unknown> = {
    cleanedUrlEnd: "..." + cleanedUrl.slice(-60),
  };

  try {
    const sql = neon(cleanedUrl);
    const ping = await sql`SELECT 1 as ok`;
    results.ping = ping;
  } catch (e) {
    results.pingError = String(e);
  }

  try {
    const sql = neon(cleanedUrl);
    const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
    results.tables = tables;
  } catch (e) {
    results.tablesError = String(e);
  }

  return NextResponse.json(results);
}
