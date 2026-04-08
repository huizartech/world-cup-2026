"use client";

import { useState } from "react";

function formatPhoneNumber(value: string): string {
  // Strip everything except digits
  const digits = value.replace(/\D/g, "");

  // If user typed a leading 1, treat it as country code
  const hasCountryCode = digits.length > 10 || (digits.length === 11 && digits[0] === "1");
  const d = hasCountryCode && digits[0] === "1" ? digits.slice(1) : digits;

  if (d.length === 0) return "";
  if (d.length <= 3) return `+1 (${d}`;
  if (d.length <= 6) return `+1 (${d.slice(0, 3)}) ${d.slice(3)}`;
  return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

export function PhonePromptModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (phone: string) => void;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate we have 10 digits
    const digits = phone.replace(/\D/g, "");
    const cleanDigits = digits.startsWith("1") && digits.length === 11 ? digits.slice(1) : digits;
    if (cleanDigits.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setSaving(true);
    setError("");

    const formatted = `+1 (${cleanDigits.slice(0, 3)}) ${cleanDigits.slice(3, 6)}-${cleanDigits.slice(6, 10)}`;

    try {
      const res = await fetch("/api/user/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formatted }),
      });
      if (!res.ok) throw new Error("Failed to save");
      onSubmit(formatted);
    } catch {
      setError("Failed to save phone number. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl p-6 max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Add your phone number</h2>
        <p className="text-sm text-gray-500 mb-4">
          We need your phone number so the group can coordinate watch parties via text.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="tel"
            value={phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
