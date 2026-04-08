import type { StaticGame } from "@/lib/static-games";
import { WatchHostButtons } from "./watch-host-buttons";

// Works with both DB Game type and StaticGame, extended with selection data
type GameLike = StaticGame & {
  watchCount?: number;
  userWatching?: boolean;
  userHosting?: boolean;
};

const interestColors: Record<string, string> = {
  must_watch: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  normal: "bg-gray-100 text-gray-600",
  low: "bg-gray-50 text-gray-400",
};

const statusColors: Record<string, string> = {
  scheduled: "text-gray-500",
  live: "text-red-600 font-bold animate-pulse",
  finished: "text-gray-700",
};

function formatTime(date: string | Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(date));
}

function stageLabel(stage: string, groupName: string | null): string {
  switch (stage) {
    case "group": return `Group ${groupName}`;
    case "round_of_32": return "Round of 32";
    case "round_of_16": return "Round of 16";
    case "quarter_final": return "Quarter Final";
    case "semi_final": return "Semi Final";
    case "third_place": return "3rd Place";
    case "final": return "Final";
    default: return stage;
  }
}

export function LiveScoreBadge({ status }: { status: string }) {
  if (status !== "live") return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-white" />
      LIVE
    </span>
  );
}

export function GameTable({
  games,
  onToggle,
}: {
  games: GameLike[];
  onToggle?: (gameId: number, type: "watch" | "host") => void;
}) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No matches found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Stage</th>
              <th className="py-3 px-3">Match</th>
              <th className="py-3 px-3">Score</th>
              <th className="py-3 px-3">Date & Time</th>
              <th className="py-3 px-3">Venue</th>
              <th className="py-3 px-3">Watch Location</th>
              <th className="py-3 px-3">San Diego Public Watch Parties</th>
              <th className="py-3 px-3">Interest</th>
              <th className="py-3 px-3">Watch / Host</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr
                key={game.id}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  game.matchStatus === "live" ? "bg-red-50/50" : ""
                }`}
              >
                <td className="py-3 px-3 text-gray-400">{game.matchNumber}</td>
                <td className="py-3 px-3 text-xs">
                  {stageLabel(game.stage, game.groupName)}
                </td>
                <td className="py-3 px-3 font-medium">
                  <span>{game.homeTeam}</span>
                  <span className="text-gray-400 mx-2">vs</span>
                  <span>{game.awayTeam}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className={statusColors[game.matchStatus]}>
                      {game.matchStatus === "scheduled"
                        ? "—"
                        : `${game.homeScore ?? 0} - ${game.awayScore ?? 0}`}
                    </span>
                    <LiveScoreBadge status={game.matchStatus} />
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                  {formatTime(game.kickoffTime)}
                </td>
                <td className="py-3 px-3 text-gray-600 text-xs">
                  <div>{game.venueStadium}</div>
                  <div className="text-gray-400">{game.venueCity}</div>
                </td>
                <td className="py-3 px-3">
                  {game.watchLocation ? (
                    <div>
                      <span className="text-green-700">{game.watchLocation}</span>
                      {game.locationNotes && (
                        <div className="text-xs text-gray-400">{game.locationNotes}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  {game.watchParties && game.watchParties.length > 0 ? (
                    <div className="text-xs space-y-0.5 max-w-[200px]">
                      {game.watchParties.slice(0, 3).map((wp) => (
                        <div key={wp.venue}>
                          <span className="text-purple-700 font-medium">{wp.venue}</span>
                          <span className="text-gray-400 ml-1">({wp.neighborhood})</span>
                        </div>
                      ))}
                      {game.watchParties.length > 3 && (
                        <div className="text-gray-400">+{game.watchParties.length - 3} more</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      interestColors[game.interestLevel]
                    }`}
                  >
                    {game.interestLevel === "must_watch"
                      ? "Must Watch"
                      : game.interestLevel.charAt(0).toUpperCase() +
                        game.interestLevel.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <WatchHostButtons
                    gameId={game.id}
                    watchCount={game.watchCount ?? 0}
                    userWatching={game.userWatching ?? false}
                    userHosting={game.userHosting ?? false}
                    onToggle={onToggle ?? (() => {})}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onToggle={onToggle} />
        ))}
      </div>
    </>
  );
}

function GameCard({ game, onToggle }: { game: GameLike; onToggle?: (gameId: number, type: "watch" | "host") => void }) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        game.matchStatus === "live"
          ? "border-red-200 bg-red-50/50"
          : "border-gray-100 bg-white"
      } shadow-sm`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">
          #{game.matchNumber} · {stageLabel(game.stage, game.groupName)}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              interestColors[game.interestLevel]
            }`}
          >
            {game.interestLevel === "must_watch"
              ? "Must Watch"
              : game.interestLevel.charAt(0).toUpperCase() +
                game.interestLevel.slice(1)}
          </span>
          <LiveScoreBadge status={game.matchStatus} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-3">
        <span className="font-semibold text-right flex-1">{game.homeTeam}</span>
        <div className={`text-lg font-bold ${statusColors[game.matchStatus]}`}>
          {game.matchStatus === "scheduled"
            ? "vs"
            : `${game.homeScore ?? 0} - ${game.awayScore ?? 0}`}
        </div>
        <span className="font-semibold text-left flex-1">{game.awayTeam}</span>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <div>{formatTime(game.kickoffTime)}</div>
        <div>
          {game.venueStadium}, {game.venueCity}
        </div>
        {game.watchLocation && (
          <div className="text-green-700 font-medium">
            {game.watchLocation}
            {game.locationNotes && (
              <span className="text-gray-400 font-normal">
                {" "}
                · {game.locationNotes}
              </span>
            )}
          </div>
        )}
        {game.watchParties && game.watchParties.length > 0 && (
          <div className="mt-1">
            <span className="text-purple-700 font-medium">Watch Parties: </span>
            {game.watchParties.slice(0, 2).map((wp, i) => (
              <span key={wp.venue} className="text-gray-600">
                {i > 0 && ", "}
                {wp.venue}
              </span>
            ))}
            {game.watchParties.length > 2 && (
              <span className="text-gray-400"> +{game.watchParties.length - 2} more</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <WatchHostButtons
          gameId={game.id}
          watchCount={game.watchCount ?? 0}
          userWatching={game.userWatching ?? false}
          userHosting={game.userHosting ?? false}
          onToggle={onToggle ?? (() => {})}
        />
      </div>
    </div>
  );
}
