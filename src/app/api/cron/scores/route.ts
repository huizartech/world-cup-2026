import { NextRequest, NextResponse } from "next/server";
import { fetchLiveScores } from "@/lib/scores";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await fetchLiveScores();
  return NextResponse.json(result);
}
