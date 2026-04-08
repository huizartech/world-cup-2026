"use client";

import { useState, useEffect } from "react";
import { staticGames, type StaticGame } from "@/lib/static-games";

interface SurveyFormProps {
  initialData?: {
    name: string;
    email: string;
    phone: string | null;
    canHost: boolean;
    gamesToHost: number[] | null;
    gamesCareAbout: number[] | null;
    wantsEmailReminders: boolean;
    wantsTextReminders: boolean;
  } | null;
  userEmail: string;
  userName: string;
}

export function SurveyForm({ initialData, userEmail, userName }: SurveyFormProps) {
  const [games, setGames] = useState<StaticGame[]>(staticGames);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: initialData?.name ?? userName ?? "",
    email: initialData?.email ?? userEmail ?? "",
    phone: initialData?.phone ?? "",
    canHost: initialData?.canHost ?? false,
    gamesToHost: new Set<number>(initialData?.gamesToHost ?? []),
    gamesCareAbout: new Set<number>(initialData?.gamesCareAbout ?? []),
    wantsEmailReminders: initialData?.wantsEmailReminders ?? false,
    wantsTextReminders: initialData?.wantsTextReminders ?? true,
  });

  // Try to load games from API, fall back to static
  useEffect(() => {
    fetch("/api/games")
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error();
      })
      .then((data) => {
        if (data.length > 0) setGames(data);
      })
      .catch(() => {
        // static games already loaded
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          canHost: form.canHost,
          gamesToHost: Array.from(form.gamesToHost),
          gamesCareAbout: Array.from(form.gamesCareAbout),
          wantsEmailReminders: form.wantsEmailReminders,
          wantsTextReminders: form.wantsTextReminders,
        }),
      });

      if (res.ok) {
        setSaved(true);
      } else {
        setError("Failed to save. Make sure the database is connected.");
      }
    } catch {
      setError("Failed to save. Make sure the database is connected.");
    }
    setSaving(false);
  };

  const toggleGame = (set: "gamesToHost" | "gamesCareAbout", matchNumber: number) => {
    setForm((prev) => {
      const newSet = new Set(prev[set]);
      if (newSet.has(matchNumber)) newSet.delete(matchNumber);
      else newSet.add(matchNumber);
      return { ...prev, [set]: newSet };
    });
  };

  const selectAllGames = (set: "gamesToHost" | "gamesCareAbout", matchNumbers: number[]) => {
    setForm((prev) => {
      const newSet = new Set(prev[set]);
      for (const n of matchNumbers) newSet.add(n);
      return { ...prev, [set]: newSet };
    });
  };

  const clearGames = (set: "gamesToHost" | "gamesCareAbout", matchNumbers: number[]) => {
    setForm((prev) => {
      const newSet = new Set(prev[set]);
      for (const n of matchNumbers) newSet.delete(n);
      return { ...prev, [set]: newSet };
    });
  };

  const clearAllGames = (set: "gamesToHost" | "gamesCareAbout") => {
    setForm((prev) => ({ ...prev, [set]: new Set<number>() }));
  };

  const groupStageGames = games.filter((g) => g.stage === "group");
  const knockoutGames = games.filter((g) => g.stage !== "group");

  function groupByDate(list: StaticGame[]) {
    return list.reduce(
      (acc, game) => {
        const date = new Date(game.kickoffTime).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
        if (!acc[date]) acc[date] = [];
        acc[date].push(game);
        return acc;
      },
      {} as Record<string, StaticGame[]>
    );
  }

  const groupStageByDate = groupByDate(groupStageGames);
  const knockoutByDate = groupByDate(knockoutGames);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Contact Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone (for text reminders)
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Hosting */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Hosting</h2>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.canHost}
            onChange={(e) => setForm({ ...form, canHost: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            I can host watch parties at my place
          </span>
        </label>
      </div>

      {/* Games I Can Host — Group Stage */}
      {form.canHost && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Games I Can Host — Group Stage ({groupStageGames.filter((g) => form.gamesToHost.has(g.matchNumber)).length} selected)
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectAllGames("gamesToHost", groupStageGames.map((g) => g.matchNumber))}
                className="text-xs text-green-600 hover:text-green-800"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => clearGames("gamesToHost", groupStageGames.map((g) => g.matchNumber))}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Which group stage games could you host a watch party for?
          </p>

          <div className="space-y-6 max-h-96 overflow-y-auto">
            {Object.entries(groupStageByDate).map(([date, dateGames]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-2 sticky top-0 bg-white py-1">
                  {date}
                </h3>
                <div className="space-y-1">
                  {dateGames.map((game) => (
                    <label
                      key={game.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        form.gamesToHost.has(game.matchNumber)
                          ? "bg-green-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.gamesToHost.has(game.matchNumber)}
                        onChange={() => toggleGame("gamesToHost", game.matchNumber)}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm flex-1">
                        <span className="text-gray-400 mr-2">#{game.matchNumber}</span>
                        <span className="font-medium">{game.homeTeam}</span>
                        <span className="text-gray-400 mx-1">vs</span>
                        <span className="font-medium">{game.awayTeam}</span>
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(game.kickoffTime).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Games I Can Host — Playoffs */}
      {form.canHost && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Games I Can Host — Playoffs ({knockoutGames.filter((g) => form.gamesToHost.has(g.matchNumber)).length} selected)
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectAllGames("gamesToHost", knockoutGames.map((g) => g.matchNumber))}
                className="text-xs text-green-600 hover:text-green-800"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => clearGames("gamesToHost", knockoutGames.map((g) => g.matchNumber))}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-sm text-amber-800">
              Playoff matchups are TBD until the group stage finishes. An updated survey will be sent once the group stage is complete so you can pick specific knockout round games to host.
            </p>
          </div>

          <div className="space-y-6 max-h-96 overflow-y-auto">
            {Object.entries(knockoutByDate).map(([date, dateGames]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-2 sticky top-0 bg-white py-1">
                  {date}
                </h3>
                <div className="space-y-1">
                  {dateGames.map((game) => (
                    <label
                      key={game.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        form.gamesToHost.has(game.matchNumber)
                          ? "bg-green-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.gamesToHost.has(game.matchNumber)}
                        onChange={() => toggleGame("gamesToHost", game.matchNumber)}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm flex-1">
                        <span className="text-gray-400 mr-2">#{game.matchNumber}</span>
                        <span className="font-medium">{game.homeTeam}</span>
                        <span className="text-gray-400 mx-1">vs</span>
                        <span className="font-medium">{game.awayTeam}</span>
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(game.kickoffTime).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Games I Care About — Group Stage */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Games I Want to Watch — Group Stage ({groupStageGames.filter((g) => form.gamesCareAbout.has(g.matchNumber)).length} selected)
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => selectAllGames("gamesCareAbout", groupStageGames.map((g) => g.matchNumber))}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={() => clearGames("gamesCareAbout", groupStageGames.map((g) => g.matchNumber))}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Select the group stage games you definitely want to watch.
        </p>

        <div className="space-y-6 max-h-96 overflow-y-auto">
          {Object.entries(groupStageByDate).map(([date, dateGames]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-500 mb-2 sticky top-0 bg-white py-1">
                {date}
              </h3>
              <div className="space-y-1">
                {dateGames.map((game) => (
                  <label
                    key={game.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      form.gamesCareAbout.has(game.matchNumber)
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.gamesCareAbout.has(game.matchNumber)}
                      onChange={() => toggleGame("gamesCareAbout", game.matchNumber)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm flex-1">
                      <span className="text-gray-400 mr-2">#{game.matchNumber}</span>
                      <span className="font-medium">{game.homeTeam}</span>
                      <span className="text-gray-400 mx-1">vs</span>
                      <span className="font-medium">{game.awayTeam}</span>
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(game.kickoffTime).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Games I Care About — Playoffs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Games I Want to Watch — Playoffs ({knockoutGames.filter((g) => form.gamesCareAbout.has(g.matchNumber)).length} selected)
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => selectAllGames("gamesCareAbout", knockoutGames.map((g) => g.matchNumber))}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={() => clearGames("gamesCareAbout", knockoutGames.map((g) => g.matchNumber))}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-sm text-amber-800">
            Playoff matchups are TBD until the group stage finishes. An updated survey will be sent once the group stage is complete so you can pick specific knockout round games.
          </p>
        </div>

        <div className="space-y-6 max-h-96 overflow-y-auto">
          {Object.entries(knockoutByDate).map(([date, dateGames]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-500 mb-2 sticky top-0 bg-white py-1">
                {date}
              </h3>
              <div className="space-y-1">
                {dateGames.map((game) => (
                  <label
                    key={game.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      form.gamesCareAbout.has(game.matchNumber)
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.gamesCareAbout.has(game.matchNumber)}
                      onChange={() => toggleGame("gamesCareAbout", game.matchNumber)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm flex-1">
                      <span className="text-gray-400 mr-2">#{game.matchNumber}</span>
                      <span className="font-medium">{game.homeTeam}</span>
                      <span className="text-gray-400 mx-1">vs</span>
                      <span className="font-medium">{game.awayTeam}</span>
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(game.kickoffTime).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Reminders</h2>
        <p className="text-sm text-gray-500">
          How would you like to be reminded about upcoming games?
        </p>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.wantsEmailReminders}
              onChange={(e) =>
                setForm({ ...form, wantsEmailReminders: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm text-gray-700 font-medium">Email reminders</span>
              <p className="text-xs text-gray-400">Get an email on game days for games you care about</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.wantsTextReminders}
              onChange={(e) =>
                setForm({ ...form, wantsTextReminders: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm text-gray-700 font-medium">Text message reminders</span>
              <p className="text-xs text-gray-400">Get a text before kickoff (requires phone number above)</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : initialData ? "Update Response" : "Submit Survey"}
        </button>
        {saved && (
          <span className="text-green-600 text-sm font-medium">
            Saved successfully!
          </span>
        )}
        {error && (
          <span className="text-red-600 text-sm font-medium">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}
