"use client";

import { useState, useEffect } from "react";

interface HostPartyData {
  id: number;
  gameId: number;
  hostUserId: number;
  location: string;
  notes: string | null;
  createdAt: string;
  hostName: string | null;
  hostEmail: string | null;
  game: { id: number; matchNumber: number; homeTeam: string; awayTeam: string } | null;
  attendees: Array<{ userId: number; name: string | null; email: string | null }>;
}

interface UserOption {
  id: number;
  name: string | null;
  email: string;
}

interface GameOption {
  id: number;
  matchNumber: number;
  homeTeam: string;
  awayTeam: string;
}

export function AccessManager() {
  const [parties, setParties] = useState<HostPartyData[]>([]);
  const [allUsers, setAllUsers] = useState<UserOption[]>([]);
  const [allGames, setAllGames] = useState<GameOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formGame, setFormGame] = useState<number | "">("");
  const [formHost, setFormHost] = useState<number | "">("");
  const [formLocation, setFormLocation] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formAttendees, setFormAttendees] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [partiesRes, usersRes, gamesRes] = await Promise.all([
        fetch("/api/admin/parties").then((r) => r.json()),
        fetch("/api/admin/users").then((r) => r.json()),
        fetch("/api/games").then((r) => r.json()),
      ]);
      setParties(partiesRes);
      setAllUsers(usersRes);
      setAllGames(
        gamesRes.map((g: GameOption) => ({
          id: g.id,
          matchNumber: g.matchNumber,
          homeTeam: g.homeTeam,
          awayTeam: g.awayTeam,
        }))
      );
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createParty = async () => {
    if (!formGame || !formHost || !formLocation) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: formGame,
          hostUserId: formHost,
          location: formLocation,
          notes: formNotes || null,
          attendeeIds: formAttendees,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setFormGame("");
        setFormHost("");
        setFormLocation("");
        setFormNotes("");
        setFormAttendees([]);
        fetchData();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const deleteParty = async (partyId: number) => {
    if (!confirm("Delete this host party? All access grants will be removed.")) return;
    await fetch(`/api/admin/parties/${partyId}`, { method: "DELETE" });
    fetchData();
  };

  const toggleAttendee = (userId: number) => {
    setFormAttendees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />;
  }

  return (
    <div className="space-y-8">
      {/* Create Host Party */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Create Host Party
          </button>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">New Host Party</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={formGame}
                onChange={(e) => setFormGame(Number(e.target.value) || "")}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">Select game...</option>
                {allGames.map((g) => (
                  <option key={g.id} value={g.id}>
                    #{g.matchNumber}: {g.homeTeam} vs {g.awayTeam}
                  </option>
                ))}
              </select>
              <select
                value={formHost}
                onChange={(e) => setFormHost(Number(e.target.value) || "")}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">Select host...</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name ?? u.email}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              placeholder="Location (address or description)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <div>
              <p className="text-sm text-gray-600 mb-2">Attendees (optional):</p>
              <div className="flex flex-wrap gap-2">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => toggleAttendee(u.id)}
                    className={`px-2 py-1 rounded-full text-xs transition-colors ${
                      formAttendees.includes(u.id)
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {u.name ?? u.email}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={createParty}
                disabled={!formGame || !formHost || !formLocation || saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Creating..." : "Create Party"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Party List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Host Parties ({parties.length})
        </h2>

        {parties.length === 0 ? (
          <p className="text-sm text-gray-500">No host parties created yet.</p>
        ) : (
          parties.map((party) => (
            <div
              key={party.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">
                    {party.game
                      ? `#${party.game.matchNumber}: ${party.game.homeTeam} vs ${party.game.awayTeam}`
                      : `Game ${party.gameId}`}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    hosted by {party.hostName ?? party.hostEmail}
                  </span>
                </div>
                <button
                  onClick={() => deleteParty(party.id)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Delete
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-green-700">{party.location}</span>
                {party.notes && (
                  <span className="text-gray-400 ml-2">· {party.notes}</span>
                )}
              </div>
              {party.attendees.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {party.attendees.map((a) => (
                    <span
                      key={a.userId}
                      className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700"
                    >
                      {a.name ?? a.email}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
