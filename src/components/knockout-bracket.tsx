"use client";

import { useState } from "react";
import type { StaticGame } from "@/lib/static-games";

const ROUNDS = [
  { key: "round_of_32", label: "Round of 32", short: "R32" },
  { key: "round_of_16", label: "Round of 16", short: "R16" },
  { key: "quarter_final", label: "Quarter Finals", short: "QF" },
  { key: "semi_final", label: "Semi Finals", short: "SF" },
  { key: "third_place", label: "Third Place", short: "3rd" },
  { key: "final", label: "Final", short: "F" },
];

function formatDate(kickoffTime: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(kickoffTime));
}

function formatTime(kickoffTime: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(kickoffTime));
}

function MatchCard({ game }: { game: StaticGame }) {
  const isLive = game.matchStatus === "live";
  const isFinished = game.matchStatus === "finished";

  return (
    <div
      className={`rounded-xl border-2 transition-all ${
        isLive
          ? "border-red-400 bg-red-50 shadow-lg shadow-red-100"
          : isFinished
          ? "border-gray-200 bg-white"
          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
      }`}
    >
      {/* Match header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <span className="text-xs text-gray-400">#{game.matchNumber}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {formatDate(game.kickoffTime)}
          </span>
          {isLive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              LIVE
            </span>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="px-4 py-3 space-y-2">
        <TeamRow
          team={game.homeTeam}
          score={game.homeScore}
          isWinner={isFinished && game.homeScore != null && game.awayScore != null && game.homeScore > game.awayScore}
          showScore={isLive || isFinished}
        />
        <div className="border-t border-dashed border-gray-200" />
        <TeamRow
          team={game.awayTeam}
          score={game.awayScore}
          isWinner={isFinished && game.homeScore != null && game.awayScore != null && game.awayScore > game.homeScore}
          showScore={isLive || isFinished}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-400 truncate max-w-[60%]">
            {game.venueStadium}
          </span>
          <span className="text-[11px] text-gray-500">
            {formatTime(game.kickoffTime)}
          </span>
        </div>
      </div>
    </div>
  );
}

function TeamRow({
  team,
  score,
  isWinner,
  showScore,
}: {
  team: string;
  score: number | null;
  isWinner: boolean;
  showScore: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${
          isWinner ? "font-bold text-gray-900" : "font-medium text-gray-700"
        }`}
      >
        {team}
      </span>
      {showScore ? (
        <span
          className={`text-lg font-bold tabular-nums ${
            isWinner ? "text-blue-600" : "text-gray-400"
          }`}
        >
          {score ?? 0}
        </span>
      ) : (
        <span className="text-sm text-gray-300">—</span>
      )}
    </div>
  );
}

export function KnockoutBracket({ games }: { games: StaticGame[] }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const currentRound = ROUNDS[roundIndex];

  const roundGames = games
    .filter((g) => g.stage === currentRound.key)
    .sort(
      (a, b) =>
        new Date(a.kickoffTime).getTime() - new Date(b.kickoffTime).getTime()
    );

  const canGoLeft = roundIndex > 0;
  const canGoRight = roundIndex < ROUNDS.length - 1;

  // Grid columns based on number of matches
  const gridCols =
    roundGames.length >= 8
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : roundGames.length >= 4
      ? "grid-cols-1 sm:grid-cols-2"
      : roundGames.length >= 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 max-w-md mx-auto";

  return (
    <div>
      {/* Round navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setRoundIndex((i) => i - 1)}
          disabled={!canGoLeft}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            canGoLeft
              ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {canGoLeft && (
            <span className="hidden sm:inline">{ROUNDS[roundIndex - 1].label}</span>
          )}
        </button>

        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900">
            {currentRound.label}
          </h3>
          <p className="text-sm text-gray-500">
            {roundGames.length} match{roundGames.length !== 1 ? "es" : ""}
          </p>
        </div>

        <button
          onClick={() => setRoundIndex((i) => i + 1)}
          disabled={!canGoRight}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            canGoRight
              ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          {canGoRight && (
            <span className="hidden sm:inline">{ROUNDS[roundIndex + 1].label}</span>
          )}
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Round dots */}
      <div className="flex justify-center gap-1.5 mb-6">
        {ROUNDS.map((round, i) => (
          <button
            key={round.key}
            onClick={() => setRoundIndex(i)}
            title={round.label}
            className={`h-2 rounded-full transition-all ${
              i === roundIndex
                ? "w-8 bg-blue-600"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Match cards grid */}
      <div className={`grid ${gridCols} gap-4`}>
        {roundGames.map((game) => (
          <MatchCard key={game.id} game={game} />
        ))}
      </div>

      {/* Bracket flow hint */}
      {canGoRight && roundGames.length > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Winners advance to</span>
            <button
              onClick={() => setRoundIndex((i) => i + 1)}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              {ROUNDS[roundIndex + 1].label} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
