"use client";

import { useState, useEffect } from "react";
import type { Game } from "@/db/schema";

interface AccessGrant {
  id: number;
  userId: number;
  gameId: number;
  grantedAt: string;
  userName: string | null;
  userEmail: string | null;
}

interface UserOption {
  id: number;
  name: string | null;
  email: string;
}

export function AccessManager() {
  const [games, setGames] = useState<Game[]>([]);
  const [access, setAccess] = useState<AccessGrant[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedGame, setSelectedGame] = useState<number | "">("");
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/games").then((r) => r.json()),
      fetch("/api/admin/access").then((r) => r.json()),
      fetch("/api/survey/responses").then((r) => r.json()),
    ])
      .then(([gamesData, accessData, surveyData]) => {
        setGames(gamesData.filter((g: Game) => g.locationType === "private"));
        setAccess(accessData);
        // Extract unique users from survey responses
        const uniqueUsers = surveyData.map((s: { userId?: number; name: string; email: string }) => ({
          id: s.userId,
          name: s.name,
          email: s.email,
        }));
        setUsers(uniqueUsers);
      })
      .finally(() => setLoading(false));
  }, []);

  const grantAccess = async () => {
    if (!selectedGame || !selectedUser) return;

    const res = await fetch("/api/admin/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser, gameId: selectedGame }),
    });

    if (res.ok) {
      // Refresh access list
      const data = await fetch("/api/admin/access").then((r) => r.json());
      setAccess(data);
      setSelectedUser("");
    }
  };

  const revokeAccess = async (userId: number, gameId: number) => {
    const res = await fetch("/api/admin/access", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, gameId }),
    });

    if (res.ok) {
      setAccess(access.filter((a) => !(a.userId === userId && a.gameId === gameId)));
    }
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />;
  }

  return (
    <div className="space-y-8">
      {/* Grant access form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold">Grant Access</h2>

        {games.length === 0 ? (
          <p className="text-sm text-gray-500">
            No games with private locations yet. Set a game&apos;s location type to
            &quot;private&quot; first.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(Number(e.target.value) || "")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm flex-1 min-w-48"
            >
              <option value="">Select game...</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  #{g.matchNumber}: {g.homeTeam} vs {g.awayTeam}
                </option>
              ))}
            </select>

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(Number(e.target.value) || "")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm flex-1 min-w-48"
            >
              <option value="">Select user...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name ?? u.email}
                </option>
              ))}
            </select>

            <button
              onClick={grantAccess}
              disabled={!selectedGame || !selectedUser}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Grant Access
            </button>
          </div>
        )}
      </div>

      {/* Current access list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Current Access ({access.length})
        </h2>

        {access.length === 0 ? (
          <p className="text-sm text-gray-500">No access grants yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="py-2 px-3">User</th>
                <th className="py-2 px-3">Game</th>
                <th className="py-2 px-3">Granted</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {access.map((a) => {
                const game = games.find((g) => g.id === a.gameId);
                return (
                  <tr key={a.id} className="border-b border-gray-50">
                    <td className="py-2 px-3">
                      {a.userName ?? a.userEmail}
                    </td>
                    <td className="py-2 px-3">
                      {game
                        ? `#${game.matchNumber}: ${game.homeTeam} vs ${game.awayTeam}`
                        : `Game ${a.gameId}`}
                    </td>
                    <td className="py-2 px-3 text-gray-400 text-xs">
                      {new Date(a.grantedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => revokeAccess(a.userId, a.gameId)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
