"use client";

import { useState, useEffect } from "react";

interface SelectionUser {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
}

interface SelectionGame {
  id: number;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
  kickoffTime: string;
  stage: string;
  groupName: string | null;
}

interface Selection {
  userId: number;
  gameId: number;
  watching: boolean;
  hosting: boolean;
}

export default function SelectionsOverviewPage() {
  const [users, setUsers] = useState<SelectionUser[]>([]);
  const [games, setGames] = useState<SelectionGame[]>([]);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/selections")
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then((data) => {
        setUsers(data.users);
        setGames(data.games);
        setSelections(data.selections);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Build a lookup: `${userId}-${gameId}` → selection
  const selMap = new Map<string, Selection>();
  for (const s of selections) {
    selMap.set(`${s.userId}-${s.gameId}`, s);
  }

  // Filter to only users who have at least one selection
  const activeUsers = users.filter((u) =>
    selections.some((s) => s.userId === u.id && (s.watching || s.hosting))
  );

  // Compute totals
  const userTotals = new Map<number, { watch: number; host: number }>();
  const gameTotals = new Map<number, { watch: number; host: number }>();

  for (const s of selections) {
    if (s.watching || s.hosting) {
      const ut = userTotals.get(s.userId) ?? { watch: 0, host: 0 };
      if (s.watching) ut.watch++;
      if (s.hosting) ut.host++;
      userTotals.set(s.userId, ut);

      const gt = gameTotals.get(s.gameId) ?? { watch: 0, host: 0 };
      if (s.watching) gt.watch++;
      if (s.hosting) gt.host++;
      gameTotals.set(s.gameId, gt);
    }
  }

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify({ users, games, selections }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `selections-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-full mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Only show games that have at least one selection
  const activeGames = games.filter((g) => gameTotals.has(g.id));

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Selections Overview</h1>
          <p className="text-gray-500">
            {selections.filter((s) => s.watching || s.hosting).length} selection(s) from{" "}
            {activeUsers.length} user(s)
          </p>
        </div>
        <button
          onClick={downloadJSON}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Download JSON
        </button>
      </div>

      {activeUsers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No selections yet. Users can click Watch/Host buttons on the game table.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="text-xs border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white z-10 py-2 px-2 text-left border-b border-r border-gray-200 min-w-[180px]">
                  Game
                </th>
                <th className="py-2 px-2 text-center border-b border-r border-gray-200 min-w-[40px]">
                  Total
                </th>
                {activeUsers.map((u) => (
                  <th key={u.id} className="py-2 px-1 text-center border-b border-gray-200 min-w-[60px]">
                    <div className="flex flex-col items-center gap-0.5">
                      {u.image && (
                        <img src={u.image} alt="" className="w-5 h-5 rounded-full" />
                      )}
                      <span className="truncate max-w-[56px]">{u.name?.split(" ")[0] ?? u.email.split("@")[0]}</span>
                    </div>
                  </th>
                ))}
              </tr>
              {/* Summary row: totals per user */}
              <tr className="bg-gray-50">
                <td className="sticky left-0 bg-gray-50 z-10 py-1 px-2 font-medium border-b border-r border-gray-200">
                  Total
                </td>
                <td className="py-1 px-2 text-center border-b border-r border-gray-200" />
                {activeUsers.map((u) => {
                  const t = userTotals.get(u.id);
                  return (
                    <td key={u.id} className="py-1 px-1 text-center border-b border-gray-200">
                      {t && (
                        <span>
                          {t.watch > 0 && <span className="text-blue-600">{t.watch}w</span>}
                          {t.watch > 0 && t.host > 0 && " "}
                          {t.host > 0 && <span className="text-green-600">{t.host}h</span>}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {activeGames.map((game) => {
                const gt = gameTotals.get(game.id);
                return (
                  <tr key={game.id} className="hover:bg-gray-50">
                    <td className="sticky left-0 bg-white z-10 py-1.5 px-2 border-b border-r border-gray-200 whitespace-nowrap">
                      <span className="text-gray-400">#{game.matchNumber}</span>{" "}
                      <span className="font-medium">{game.homeTeam}</span>
                      <span className="text-gray-400"> vs </span>
                      <span className="font-medium">{game.awayTeam}</span>
                    </td>
                    <td className="py-1.5 px-2 text-center border-b border-r border-gray-200">
                      {gt && (
                        <span>
                          {gt.watch > 0 && <span className="text-blue-600">{gt.watch}</span>}
                          {gt.watch > 0 && gt.host > 0 && "/"}
                          {gt.host > 0 && <span className="text-green-600">{gt.host}</span>}
                        </span>
                      )}
                    </td>
                    {activeUsers.map((u) => {
                      const sel = selMap.get(`${u.id}-${game.id}`);
                      const w = sel?.watching;
                      const h = sel?.hosting;
                      let bg = "";
                      if (w && h) bg = "bg-purple-50";
                      else if (w) bg = "bg-blue-50";
                      else if (h) bg = "bg-green-50";
                      return (
                        <td key={u.id} className={`py-1.5 px-1 text-center border-b border-gray-100 ${bg}`}>
                          {w && <span title="Watching" className="text-blue-500">👁</span>}
                          {h && <span title="Hosting" className="text-green-500">🏠</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
