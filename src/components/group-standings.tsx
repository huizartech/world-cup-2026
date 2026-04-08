"use client";

import { computeGroupStandings, type GroupStanding } from "@/lib/group-standings";
import type { StaticGame } from "@/lib/static-games";

export function GroupStandings({ games }: { games: StaticGame[] }) {
  const standings = computeGroupStandings(games);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {standings.map((group) => (
        <GroupCard key={group.group} group={group} />
      ))}
    </div>
  );
}

function GroupCard({ group }: { group: GroupStanding }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-900 text-white px-4 py-2 text-sm font-bold">
        Group {group.group}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
            <th className="py-1.5 px-3 text-left">Team</th>
            <th className="py-1.5 px-1 text-center w-8">Pts</th>
            <th className="py-1.5 px-1 text-center w-7">W</th>
            <th className="py-1.5 px-1 text-center w-7">D</th>
            <th className="py-1.5 px-1 text-center w-7">L</th>
            <th className="py-1.5 px-1 text-center w-8">GF</th>
            <th className="py-1.5 px-1 text-center w-8">GA</th>
            <th className="py-1.5 px-1 text-center w-8">GD</th>
          </tr>
        </thead>
        <tbody>
          {group.teams.map((team, i) => (
            <tr
              key={team.team}
              className={`border-b border-gray-50 ${
                i < 2 ? "bg-green-50/50" : ""
              }`}
            >
              <td className="py-1.5 px-3 font-medium truncate max-w-[120px]">
                {team.team}
              </td>
              <td className="py-1.5 px-1 text-center font-bold">{team.points}</td>
              <td className="py-1.5 px-1 text-center text-gray-600">{team.wins}</td>
              <td className="py-1.5 px-1 text-center text-gray-600">{team.draws}</td>
              <td className="py-1.5 px-1 text-center text-gray-600">{team.losses}</td>
              <td className="py-1.5 px-1 text-center text-gray-600">{team.goalsFor}</td>
              <td className="py-1.5 px-1 text-center text-gray-600">{team.goalsAgainst}</td>
              <td className="py-1.5 px-1 text-center text-gray-600">
                {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
