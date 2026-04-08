"use client";

import { useState, useEffect } from "react";

interface SurveyEntry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  canHost: boolean;
  gamesToHost: number[] | null;
  gamesCareAbout: number[] | null;
  wantsEmailReminders: boolean;
  wantsTextReminders: boolean;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
}

export default function AdminResponsesPage() {
  const [responses, setResponses] = useState<SurveyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/survey/responses")
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then(setResponses)
      .catch(() => setResponses([]))
      .finally(() => setLoading(false));
  }, []);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(responses, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `survey-responses-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Survey Responses</h1>
          <p className="text-gray-500">{responses.length} response(s)</p>
        </div>
        <button
          onClick={downloadJSON}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Download JSON
        </button>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No survey responses yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Can Host</th>
                <th className="py-3 px-3">Games to Host</th>
                <th className="py-3 px-3">Games Care About</th>
                <th className="py-3 px-3">Reminders</th>
                <th className="py-3 px-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">
                    <div className="flex items-center gap-2">
                      {r.userImage && (
                        <img
                          src={r.userImage}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      {r.name}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{r.email}</td>
                  <td className="py-3 px-3 text-gray-600">{r.phone || "—"}</td>
                  <td className="py-3 px-3">
                    {r.canHost ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-gray-600">
                    {r.gamesToHost?.length
                      ? r.gamesToHost.map((g) => `#${g}`).join(", ")
                      : "—"}
                  </td>
                  <td className="py-3 px-3 text-gray-600">
                    {r.gamesCareAbout?.length ? (
                      <span title={r.gamesCareAbout.map((g) => `#${g}`).join(", ")}>
                        {r.gamesCareAbout.length} games
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 px-3 text-xs text-gray-600">
                    {[
                      r.wantsEmailReminders && "Email",
                      r.wantsTextReminders && "Text",
                    ]
                      .filter(Boolean)
                      .join(", ") || "None"}
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
