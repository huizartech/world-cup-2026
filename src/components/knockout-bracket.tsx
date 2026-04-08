"use client";

import { useState } from "react";
import type { StaticGame } from "@/lib/static-games";

// --- Shared helpers ---

function formatDate(kickoffTime: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(kickoffTime));
}

// --- Bracket constants ---

const CARD_W = 155;
const CARD_H = 50;
const BASE_GAP = 6;
const UNIT = CARD_H + BASE_GAP;
const COL_GAP = 36;
const COL_STEP = CARD_W + COL_GAP;

const BRACKET_STAGES = [
  "round_of_32",
  "round_of_16",
  "quarter_final",
  "semi_final",
  "final",
];

function matchTop(round: number, index: number): number {
  if (round === 0) return index * UNIT;
  const top = matchTop(round - 1, index * 2);
  const bottom = matchTop(round - 1, index * 2 + 1);
  return (top + bottom) / 2;
}

// --- Compact match card for bracket ---

function BracketCard({
  game,
  x,
  y,
}: {
  game: StaticGame;
  x: number;
  y: number;
}) {
  const isLive = game.matchStatus === "live";
  const isFinished = game.matchStatus === "finished";

  return (
    <div
      className={`absolute rounded-lg border text-[11px] overflow-hidden ${
        isLive
          ? "border-red-400 bg-red-50 shadow-md"
          : isFinished
          ? "border-gray-300 bg-white"
          : "border-gray-200 bg-white"
      }`}
      style={{ left: x, top: y, width: CARD_W, height: CARD_H }}
    >
      <div className="h-full flex flex-col justify-center px-2 gap-0.5">
        <BracketTeamRow
          team={game.homeTeam}
          score={game.homeScore}
          isWinner={isFinished && (game.homeScore ?? 0) > (game.awayScore ?? 0)}
          showScore={isLive || isFinished}
        />
        <div className="border-t border-gray-100" />
        <BracketTeamRow
          team={game.awayTeam}
          score={game.awayScore}
          isWinner={isFinished && (game.awayScore ?? 0) > (game.homeScore ?? 0)}
          showScore={isLive || isFinished}
        />
      </div>
      {isLive && (
        <div className="absolute top-0 right-0 px-1 py-0.5 bg-red-600 text-white text-[8px] font-bold rounded-bl">
          LIVE
        </div>
      )}
    </div>
  );
}

function BracketTeamRow({
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
    <div className="flex items-center justify-between gap-1">
      <span
        className={`truncate ${
          isWinner ? "font-bold text-gray-900" : "text-gray-600"
        }`}
      >
        {team}
      </span>
      {showScore && (
        <span
          className={`font-bold tabular-nums flex-shrink-0 ${
            isWinner ? "text-blue-600" : "text-gray-400"
          }`}
        >
          {score ?? 0}
        </span>
      )}
    </div>
  );
}

// --- SVG connector lines ---

function BracketConnectors({
  roundGames,
  totalWidth,
  totalHeight,
}: {
  roundGames: StaticGame[][];
  totalWidth: number;
  totalHeight: number;
}) {
  const paths: string[] = [];

  for (let r = 0; r < roundGames.length - 1; r++) {
    const nextCount = roundGames[r + 1].length;
    for (let j = 0; j < nextCount; j++) {
      const y1 = matchTop(r, j * 2) + CARD_H / 2;
      const y2 = matchTop(r, j * 2 + 1) + CARD_H / 2;
      const y3 = matchTop(r + 1, j) + CARD_H / 2;
      const x1 = r * COL_STEP + CARD_W;
      const x2 = (r + 1) * COL_STEP;
      const mx = (x1 + x2) / 2;

      paths.push(`M${x1},${y1} H${mx}`);
      paths.push(`M${x1},${y2} H${mx}`);
      paths.push(`M${mx},${y1} V${y2}`);
      paths.push(`M${mx},${y3} H${x2}`);
    }
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={totalWidth}
      height={totalHeight}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#d1d5db"
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
}

// --- Visual bracket (desktop) ---

function VisualBracket({ games }: { games: StaticGame[] }) {
  const roundGames = BRACKET_STAGES.map((stage) =>
    games
      .filter((g) => g.stage === stage)
      .sort((a, b) => a.matchNumber - b.matchNumber)
  );

  const thirdPlace = games.find((g) => g.stage === "third_place");

  const r32Count = roundGames[0].length; // 16
  const totalHeight = (r32Count - 1) * UNIT + CARD_H;
  const totalWidth = BRACKET_STAGES.length * COL_STEP - COL_GAP;

  return (
    <div className="space-y-6">
      {/* Round labels */}
      <div className="relative" style={{ width: totalWidth, height: 28 }}>
        {BRACKET_STAGES.map((stage, r) => (
          <div
            key={stage}
            className="absolute text-xs font-semibold text-gray-500 uppercase tracking-wider text-center"
            style={{ left: r * COL_STEP, width: CARD_W }}
          >
            {stage === "round_of_32"
              ? "R32"
              : stage === "round_of_16"
              ? "R16"
              : stage === "quarter_final"
              ? "QF"
              : stage === "semi_final"
              ? "SF"
              : "Final"}
          </div>
        ))}
      </div>

      {/* Bracket body */}
      <div
        className="relative"
        style={{ width: totalWidth, height: totalHeight }}
      >
        <BracketConnectors
          roundGames={roundGames}
          totalWidth={totalWidth}
          totalHeight={totalHeight}
        />
        {roundGames.map((round, r) =>
          round.map((game, i) => (
            <BracketCard
              key={game.id}
              game={game}
              x={r * COL_STEP}
              y={matchTop(r, i)}
            />
          ))
        )}
      </div>

      {/* Third place */}
      {thirdPlace && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Third Place
          </div>
          <div className="relative" style={{ width: CARD_W, height: CARD_H }}>
            <BracketCard game={thirdPlace} x={0} y={0} />
          </div>
        </div>
      )}
    </div>
  );
}

// --- Mobile round-by-round view ---

const ROUNDS = [
  { key: "round_of_32", label: "Round of 32" },
  { key: "round_of_16", label: "Round of 16" },
  { key: "quarter_final", label: "Quarter Finals" },
  { key: "semi_final", label: "Semi Finals" },
  { key: "third_place", label: "Third Place" },
  { key: "final", label: "Final" },
];

function MobileMatchCard({ game }: { game: StaticGame }) {
  const isLive = game.matchStatus === "live";
  const isFinished = game.matchStatus === "finished";

  return (
    <div
      className={`rounded-xl border-2 ${
        isLive
          ? "border-red-400 bg-red-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <span className="text-xs text-gray-400">#{game.matchNumber}</span>
        <span className="text-xs text-gray-500">{formatDate(game.kickoffTime)}</span>
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isFinished && (game.homeScore ?? 0) > (game.awayScore ?? 0) ? "font-bold" : "font-medium text-gray-700"}`}>
            {game.homeTeam}
          </span>
          {(isLive || isFinished) && (
            <span className={`text-lg font-bold tabular-nums ${isFinished && (game.homeScore ?? 0) > (game.awayScore ?? 0) ? "text-blue-600" : "text-gray-400"}`}>
              {game.homeScore ?? 0}
            </span>
          )}
        </div>
        <div className="border-t border-dashed border-gray-200" />
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isFinished && (game.awayScore ?? 0) > (game.homeScore ?? 0) ? "font-bold" : "font-medium text-gray-700"}`}>
            {game.awayTeam}
          </span>
          {(isLive || isFinished) && (
            <span className={`text-lg font-bold tabular-nums ${isFinished && (game.awayScore ?? 0) > (game.homeScore ?? 0) ? "text-blue-600" : "text-gray-400"}`}>
              {game.awayScore ?? 0}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileBracket({ games }: { games: StaticGame[] }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const currentRound = ROUNDS[roundIndex];

  const roundGames = games
    .filter((g) => g.stage === currentRound.key)
    .sort((a, b) => new Date(a.kickoffTime).getTime() - new Date(b.kickoffTime).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setRoundIndex((i) => i - 1)}
          disabled={roundIndex === 0}
          className={`p-2 rounded-lg ${roundIndex > 0 ? "text-gray-700 hover:bg-gray-100" : "text-gray-300"}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900">{currentRound.label}</h3>
          <p className="text-xs text-gray-500">{roundGames.length} match{roundGames.length !== 1 ? "es" : ""}</p>
        </div>
        <button
          onClick={() => setRoundIndex((i) => i + 1)}
          disabled={roundIndex === ROUNDS.length - 1}
          className={`p-2 rounded-lg ${roundIndex < ROUNDS.length - 1 ? "text-gray-700 hover:bg-gray-100" : "text-gray-300"}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="flex justify-center gap-1.5 mb-4">
        {ROUNDS.map((round, i) => (
          <button
            key={round.key}
            onClick={() => setRoundIndex(i)}
            className={`h-2 rounded-full transition-all ${i === roundIndex ? "w-8 bg-blue-600" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roundGames.map((game) => (
          <MobileMatchCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

// --- Main export ---

export function KnockoutBracket({ games }: { games: StaticGame[] }) {
  const knockoutGames = games.filter((g) =>
    [...BRACKET_STAGES, "third_place"].includes(g.stage)
  );

  return (
    <>
      {/* Desktop: visual bracket */}
      <div className="hidden lg:block overflow-x-auto pb-4">
        <VisualBracket games={knockoutGames} />
      </div>

      {/* Mobile/tablet: round-by-round */}
      <div className="lg:hidden">
        <MobileBracket games={knockoutGames} />
      </div>
    </>
  );
}
