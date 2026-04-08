"use client";

import { useState } from "react";
import { teamRankings, type TeamRanking } from "@/lib/rankings";

const confColors: Record<string, string> = {
  UEFA: "bg-blue-100 text-blue-700",
  CONMEBOL: "bg-green-100 text-green-700",
  CONCACAF: "bg-yellow-100 text-yellow-700",
  AFC: "bg-red-100 text-red-700",
  CAF: "bg-orange-100 text-orange-700",
  OFC: "bg-purple-100 text-purple-700",
  TBD: "bg-gray-100 text-gray-400",
};

export function RankingsTable() {
  const [sortBy, setSortBy] = useState<"rank" | "group">("rank");
  const [filterConf, setFilterConf] = useState("");

  const sorted = [...teamRankings]
    .filter((t) => !filterConf || t.confederation === filterConf)
    .sort((a, b) => {
      if (sortBy === "group") {
        const groupCmp = a.group.localeCompare(b.group);
        return groupCmp !== 0 ? groupCmp : a.rank - b.rank;
      }
      return a.rank - b.rank;
    });

  const confederations = ["UEFA", "CONMEBOL", "CONCACAF", "AFC", "CAF", "OFC"];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1">
          <button
            onClick={() => setSortBy("rank")}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              sortBy === "rank"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            By Rank
          </button>
          <button
            onClick={() => setSortBy("group")}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              sortBy === "group"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            By Group
          </button>
        </div>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFilterConf("")}
            className={`px-2 py-1 rounded text-xs ${
              !filterConf ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {confederations.map((c) => (
            <button
              key={c}
              onClick={() => setFilterConf(filterConf === c ? "" : c)}
              className={`px-2 py-1 rounded text-xs ${
                filterConf === c
                  ? "bg-gray-900 text-white"
                  : `${confColors[c]} hover:opacity-80`
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-2 px-3 w-16">Rank</th>
              <th className="py-2 px-3">Team</th>
              <th className="py-2 px-3 w-20">Group</th>
              <th className="py-2 px-3 w-20">Points</th>
              <th className="py-2 px-3 w-28">Confederation</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team) => (
              <RankingRow key={team.team} team={team} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {sorted.map((team) => (
          <RankingCard key={team.team} team={team} />
        ))}
      </div>
    </div>
  );
}

function RankingRow({ team }: { team: TeamRanking }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="py-2 px-3 text-gray-400 font-mono">{team.points > 0 ? team.rank : "—"}</td>
      <td className="py-2 px-3 font-medium">{team.team}</td>
      <td className="py-2 px-3">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
          {team.group}
        </span>
      </td>
      <td className="py-2 px-3 text-gray-600 font-mono">{team.points || "—"}</td>
      <td className="py-2 px-3">
        <span className={`px-2 py-0.5 rounded text-xs ${confColors[team.confederation]}`}>
          {team.confederation}
        </span>
      </td>
    </tr>
  );
}

function RankingCard({ team }: { team: TeamRanking }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
      <span className="text-gray-400 font-mono text-sm w-8 text-right">
        {team.points > 0 ? `#${team.rank}` : "—"}
      </span>
      <span className="font-medium flex-1">{team.team}</span>
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
        {team.group}
      </span>
      <span className={`px-2 py-0.5 rounded text-xs ${confColors[team.confederation]}`}>
        {team.confederation}
      </span>
    </div>
  );
}
