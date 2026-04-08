import { auth } from "@/auth";
import { isAdmin } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { games } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AdminGameEditor } from "@/components/admin-game-editor";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const session = await auth();
  if (!isAdmin(session?.user)) redirect("/");

  const { gameId } = await params;
  const game = await db
    .select()
    .from(games)
    .where(eq(games.id, parseInt(gameId)))
    .limit(1);

  if (game.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Game not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Edit Game #{game[0].matchNumber}
      </h1>
      <p className="text-gray-500 mb-8">
        {game[0].homeTeam} vs {game[0].awayTeam}
      </p>
      <AdminGameEditor game={game[0]} />
    </div>
  );
}
