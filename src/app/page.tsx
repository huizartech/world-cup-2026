"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { GameTable } from "@/components/game-table";
import { FilterBar, type Filters } from "@/components/filter-bar";
import { KnockoutBracket } from "@/components/knockout-bracket";
import { RankingsTable } from "@/components/rankings-table";
import { GroupStandings } from "@/components/group-standings";
import { SignInPromptModal } from "@/components/sign-in-prompt-modal";
import { PhonePromptModal } from "@/components/phone-prompt-modal";
import { staticGames, type StaticGame } from "@/lib/static-games";
import { SD_WATCH_PARTIES } from "@/lib/watch-venues";

type EnrichedGame = StaticGame & {
  watchCount?: number;
  userWatching?: boolean;
  userHosting?: boolean;
};

// Returns local hour (0-23) for a UTC time string
function getLocalHour(kickoffTime: string): number {
  return new Date(kickoffTime).getHours();
}

function matchesTimeOfDay(kickoffTime: string, slots: Set<string>): boolean {
  const hour = getLocalHour(kickoffTime);
  for (const slot of slots) {
    switch (slot) {
      case "morning":
        if (hour >= 0 && hour < 12) return true;
        break;
      case "afternoon":
        if (hour >= 12 && hour < 17) return true;
        break;
      case "evening":
        if (hour >= 17 && hour < 21) return true;
        break;
      case "late_night":
        if (hour >= 21) return true;
        break;
    }
  }
  return false;
}

const FIRST_MATCH = new Date("2026-06-11T19:00:00Z"); // Match 1 kickoff

function Countdown() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = FIRST_MATCH.getTime() - now.getTime();
  if (diff <= 0) return null;

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  parts.push(`${hours}h`, `${minutes}m`, `${seconds}s`);

  return (
    <span className="text-sm font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full whitespace-nowrap">
      {parts.join(" ")} to kickoff
    </span>
  );
}

export default function HomePage() {
  const { data: session, update: updateSession } = useSession();
  const [dbGames, setDbGames] = useState<EnrichedGame[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [phoneConfirmed, setPhoneConfirmed] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{ gameId: number; type: "watch" | "host" } | null>(null);
  const [filters, setFilters] = useState<Filters>({
    stage: "",
    groups: new Set<string>(),
    interest: "",
    timeOfDay: new Set<string>(),
    dayType: "",
  });

  const fetchGames = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.stage) params.set("stage", filters.stage);
      if (filters.interest) params.set("interest", filters.interest);

      const res = await fetch(`/api/games?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setDbGames(data);
        }
      }
    } catch {
      // API unavailable — static data will be used
    }
    setLoading(false);
  }, [filters.stage, filters.interest]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Poll for live score updates every 60 seconds (only if DB is connected)
  useEffect(() => {
    if (!dbGames) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/scores");
        if (res.ok) fetchGames();
      } catch {
        // ignore
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [dbGames, fetchGames]);

  const executeToggle = useCallback(async (gameId: number, type: "watch" | "host") => {
    // Optimistic update
    setDbGames((prev) => {
      if (!prev) return prev;
      return prev.map((g) => {
        if (g.id !== gameId) return g;
        const newWatching = type === "watch" ? !g.userWatching : g.userWatching;
        const newHosting = type === "host" ? !g.userHosting : g.userHosting;
        const watchDelta = type === "watch" ? (newWatching ? 1 : -1) : 0;
        return {
          ...g,
          userWatching: newWatching,
          userHosting: newHosting,
          watchCount: (g.watchCount ?? 0) + watchDelta,
        };
      });
    });

    try {
      const res = await fetch(`/api/games/${gameId}/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        const { watching, hosting, watchCount } = await res.json();
        setDbGames((prev) => {
          if (!prev) return prev;
          return prev.map((g) =>
            g.id === gameId
              ? { ...g, userWatching: watching, userHosting: hosting, watchCount }
              : g
          );
        });
      }
    } catch {
      fetchGames();
    }
  }, [fetchGames]);

  const handleToggle = useCallback(async (gameId: number, type: "watch" | "host") => {
    if (!session?.user) {
      setPendingToggle({ gameId, type });
      setShowSignIn(true);
      return;
    }

    if (!session.user.phone && !phoneConfirmed) {
      setPendingToggle({ gameId, type });
      setShowPhone(true);
      return;
    }

    executeToggle(gameId, type);
  }, [session, phoneConfirmed, executeToggle]);

  const handlePhoneSubmit = useCallback(async (_phone: string) => {
    setShowPhone(false);
    setPhoneConfirmed(true);
    updateSession();
    // Execute the pending toggle directly — phone is now saved in DB,
    // the API will accept it even if the session hasn't refreshed yet
    if (pendingToggle) {
      executeToggle(pendingToggle.gameId, pendingToggle.type);
      setPendingToggle(null);
    }
  }, [pendingToggle, executeToggle, updateSession]);

  // Apply filters and sorting
  const games = useMemo(() => {
    const source = dbGames ?? staticGames;

    const filtered = source.filter((game) => {
      if (filters.stage && game.stage !== filters.stage) return false;
      if (filters.groups.size > 0) {
        if (!game.groupName || !filters.groups.has(game.groupName)) return false;
      }
      if (filters.interest && game.interestLevel !== filters.interest) return false;
      if (filters.timeOfDay.size > 0 && !matchesTimeOfDay(game.kickoffTime, filters.timeOfDay)) {
        return false;
      }
      if (filters.dayType) {
        const day = new Date(game.kickoffTime).getDay(); // 0=Sun, 6=Sat
        const isWeekend = day === 0 || day === 6;
        if (filters.dayType === "weekend" && !isWeekend) return false;
        if (filters.dayType === "weekday" && isWeekend) return false;
      }
      return true;
    });

    // Sort by date then match number
    return [...filtered].sort((a, b) => {
      const timeCmp =
        new Date(a.kickoffTime).getTime() - new Date(b.kickoffTime).getTime();
      if (timeCmp !== 0) return timeCmp;
      return a.matchNumber - b.matchNumber;
    });
  }, [dbGames, filters]);

  const gameCount = games.length;
  const liveCount = games.filter((g) => g.matchStatus === "live").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            FIFA World Cup 2026
          </h1>
          <Countdown />
        </div>
        <p className="text-gray-500">
          {gameCount} match{gameCount !== 1 ? "es" : ""}
          {liveCount > 0 && (
            <span className="text-red-600 font-medium">
              {" "} · {liveCount} live now
            </span>
          )}
          {" "} · June 11 – July 19, 2026
        </p>
      </div>

      <div className="mb-6">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* San Diego Public Watch Parties */}
      <div className="mb-8 bg-purple-50 rounded-xl border border-purple-100 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-3">
          San Diego Public Watch Parties
        </h2>
        <p className="text-sm text-purple-700 mb-3">
          These venues will be showing World Cup matches all tournament long:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SD_WATCH_PARTIES.map((wp) => (
            <a
              key={wp.venue}
              href={`https://maps.apple.com/?q=${encodeURIComponent(wp.venue + ", San Diego, CA")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col px-3 py-2 rounded-lg bg-white border border-purple-100 hover:border-purple-300 transition-colors"
            >
              <span className="text-sm font-medium text-purple-800">{wp.venue}</span>
              <span className="text-xs text-purple-500">{wp.neighborhood}</span>
              {wp.notes && <span className="text-xs text-gray-400 mt-0.5">{wp.notes}</span>}
            </a>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-white rounded-xl animate-pulse border border-gray-100"
            />
          ))}
        </div>
      ) : (
        <GameTable games={games} onToggle={handleToggle} />
      )}

      {/* Group Stage Standings */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Group Stage Standings
        </h2>
        <p className="text-gray-500 mb-6">
          12 groups of 4 teams. Top 2 from each group (highlighted) advance to the Round of 32.
        </p>
        <GroupStandings games={dbGames ?? staticGames} />
      </div>

      {/* Knockout Bracket */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Knockout Stage
        </h2>
        <p className="text-gray-500 mb-6">
          Round of 32 through the Final. Navigate between rounds with the arrows.
        </p>
        <KnockoutBracket games={dbGames ?? staticGames} />
      </div>

      {/* Team Rankings */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Team Rankings
        </h2>
        <p className="text-gray-500 mb-6">
          FIFA rankings for all 48 qualified teams. Sort by rank or group, filter by confederation.
        </p>
        <RankingsTable />
      </div>

      {/* Modals */}
      {showSignIn && (
        <SignInPromptModal onClose={() => { setShowSignIn(false); setPendingToggle(null); }} />
      )}
      {showPhone && (
        <PhonePromptModal
          onSubmit={handlePhoneSubmit}
          onClose={() => { setShowPhone(false); setPendingToggle(null); }}
        />
      )}
    </div>
  );
}
