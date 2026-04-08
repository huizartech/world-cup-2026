"use client";

import { useState } from "react";
import type { Game } from "@/db/schema";

export function AdminGameEditor({ game }: { game: Game }) {
  const [form, setForm] = useState({
    watchLocation: game.watchLocation ?? "",
    locationType: game.locationType,
    locationNotes: game.locationNotes ?? "",
    interestLevel: game.interestLevel,
    homeTeam: game.homeTeam,
    awayTeam: game.awayTeam,
    matchStatus: game.matchStatus,
    homeScore: game.homeScore ?? "",
    awayScore: game.awayScore ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch(`/api/games/${game.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        watchLocation: form.watchLocation || null,
        locationType: form.locationType,
        locationNotes: form.locationNotes || null,
        interestLevel: form.interestLevel,
        homeTeam: form.homeTeam,
        awayTeam: form.awayTeam,
        matchStatus: form.matchStatus,
        homeScore: form.homeScore === "" ? null : Number(form.homeScore),
        awayScore: form.awayScore === "" ? null : Number(form.awayScore),
      }),
    });

    setSaving(false);
    if (res.ok) setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold">Teams</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Home Team
            </label>
            <input
              value={form.homeTeam}
              onChange={(e) => setForm({ ...form, homeTeam: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Away Team
            </label>
            <input
              value={form.awayTeam}
              onChange={(e) => setForm({ ...form, awayTeam: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={form.matchStatus}
              onChange={(e) => setForm({ ...form, matchStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Home Score
            </label>
            <input
              type="number"
              min="0"
              value={form.homeScore}
              onChange={(e) => setForm({ ...form, homeScore: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Away Score
            </label>
            <input
              type="number"
              min="0"
              value={form.awayScore}
              onChange={(e) => setForm({ ...form, awayScore: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold">Watch Location</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            value={form.watchLocation}
            onChange={(e) => setForm({ ...form, watchLocation: e.target.value })}
            placeholder="e.g., John's house, The Sports Bar"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location Type
          </label>
          <select
            value={form.locationType}
            onChange={(e) => setForm({ ...form, locationType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          >
            <option value="none">None</option>
            <option value="public">Public (visible to all)</option>
            <option value="private">Private (approved users only)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={form.locationNotes}
            onChange={(e) => setForm({ ...form, locationNotes: e.target.value })}
            placeholder="Additional details..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold">Interest Level</h2>
        <select
          value={form.interestLevel}
          onChange={(e) => setForm({ ...form, interestLevel: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="must_watch">Must Watch</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {saved && (
          <span className="text-green-600 text-sm font-medium">Saved!</span>
        )}
      </div>
    </form>
  );
}
