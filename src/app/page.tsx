"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { GameTable } from "@/components/game-table";
import { FilterBar, type Filters } from "@/components/filter-bar";
import { KnockoutBracket } from "@/components/knockout-bracket";
import { RankingsTable } from "@/components/rankings-table";
import { SignInPromptModal } from "@/components/sign-in-prompt-modal";
import { PhonePromptModal } from "@/components/phone-prompt-modal";
import { staticGames, type StaticGame } from "@/lib/static-games";

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

export default function HomePage() {
  const { data: session, update: updateSession } = useSession();
  const [dbGames, setDbGames] = useState<EnrichedGame[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{ gameId: number; type: "watch" | "host" } | null>(null);
  const [filters, setFilters] = useState<Filters>({
    stage: "",
    groups: new Set<string>(),
    date: "",
    interest: "",
    timeOfDay: new Set<string>(),
  });

  const fetchGames = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.stage) params.set("stage", filters.stage);
      if (filters.date) params.set("date", filters.date);
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
  }, [filters.stage, filters.date, filters.interest]);

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

  const handleToggle = useCallback(async (gameId: number, type: "watch" | "host") => {
    // Check auth
    if (!session?.user) {
      setPendingToggle({ gameId, type });
      setShowSignIn(true);
      return;
    }

    // Check phone
    if (!session.user.phone) {
      setPendingToggle({ gameId, type });
      setShowPhone(true);
      return;
    }

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
        // Reconcile with server
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
      // Revert on error by refetching
      fetchGames();
    }
  }, [session, fetchGames]);

  const handlePhoneSubmit = useCallback(async (phone: string) => {
    setShowPhone(false);
    // Update session to reflect new phone
    await updateSession();
    // Execute pending toggle
    if (pendingToggle) {
      // Small delay to let session update propagate
      setTimeout(() => {
        handleToggle(pendingToggle.gameId, pendingToggle.type);
        setPendingToggle(null);
      }, 500);
    }
  }, [pendingToggle, handleToggle, updateSession]);

  // Apply filters and sorting
  const games = useMemo(() => {
    const source = dbGames ?? staticGames;

    const filtered = source.filter((game) => {
      if (filters.stage && game.stage !== filters.stage) return false;
      if (filters.groups.size > 0) {
        if (!game.groupName || !filters.groups.has(game.groupName)) return false;
      }
      if (filters.interest && game.interestLevel !== filters.interest) return false;
      if (filters.date) {
        const gameDate = new Date(game.kickoffTime).toISOString().split("T")[0];
        if (gameDate !== filters.date) return false;
      }
      if (filters.timeOfDay.size > 0 && !matchesTimeOfDay(game.kickoffTime, filters.timeOfDay)) {
        return false;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          FIFA World Cup 2026
        </h1>
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
