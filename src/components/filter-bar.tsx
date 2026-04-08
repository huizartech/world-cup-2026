"use client";

const STAGES = [
  { value: "", label: "All Stages" },
  { value: "group", label: "Group Stage" },
  { value: "round_of_32", label: "Round of 32" },
  { value: "round_of_16", label: "Round of 16" },
  { value: "quarter_final", label: "Quarter Finals" },
  { value: "semi_final", label: "Semi Finals" },
  { value: "third_place", label: "3rd Place" },
  { value: "final", label: "Final" },
];

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const INTEREST = [
  { value: "", label: "All Interest" },
  { value: "must_watch", label: "Must Watch" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
];

// Time-of-day ranges in the user's local timezone
const TIME_SLOTS = [
  { value: "morning", label: "Morning", desc: "Before 12pm" },
  { value: "afternoon", label: "Afternoon", desc: "12pm – 5pm" },
  { value: "evening", label: "Evening", desc: "5pm – 9pm" },
  { value: "late_night", label: "Late Night", desc: "After 9pm" },
];

export interface Filters {
  stage: string;
  groups: Set<string>;
  interest: string;
  timeOfDay: Set<string>;
  dayType: string; // "" | "weekday" | "weekend"
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const update = (key: string, value: unknown) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleGroup = (group: string) => {
    const next = new Set(filters.groups);
    if (next.has(group)) {
      next.delete(group);
    } else {
      next.add(group);
    }
    update("groups", next);
  };

  const toggleTime = (slot: string) => {
    const next = new Set(filters.timeOfDay);
    if (next.has(slot)) {
      next.delete(slot);
    } else {
      next.add(slot);
    }
    update("timeOfDay", next);
  };

  const hasFilters =
    filters.stage ||
    filters.groups.size > 0 ||
    filters.interest ||
    filters.timeOfDay.size > 0 ||
    filters.dayType;

  return (
    <div className="space-y-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Row 1: Stage, Date, Interest */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.stage}
          onChange={(e) => update("stage", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={filters.interest}
          onChange={(e) => update("interest", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {INTEREST.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() =>
              onChange({
                stage: "",
                groups: new Set(),
                interest: "",
                timeOfDay: new Set(),
                dayType: "",
              })
            }
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Row 2: Day type + Time of Day */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wider mr-1">
          Day
        </span>
        {([
          { value: "weekday", label: "Weekday" },
          { value: "weekend", label: "Weekend" },
        ] as const).map((opt) => (
          <button
            key={opt.value}
            onClick={() => update("dayType", filters.dayType === opt.value ? "" : opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filters.dayType === opt.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}

        <span className="text-gray-200 mx-1">|</span>

        <span className="text-xs text-gray-400 uppercase tracking-wider mr-1">
          Time
        </span>
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.value}
            onClick={() => toggleTime(slot.value)}
            title={slot.desc}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filters.timeOfDay.has(slot.value)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {slot.label}
          </button>
        ))}
        {filters.timeOfDay.size > 0 && (
          <button
            onClick={() => update("timeOfDay", new Set())}
            className="text-xs text-gray-400 hover:text-gray-600 ml-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Row 3: Groups (multi-select chips) */}
      {(filters.stage === "" || filters.stage === "group") && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider mr-1">
            Groups
          </span>
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => toggleGroup(g)}
              className={`w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                filters.groups.has(g)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {g}
            </button>
          ))}
          {filters.groups.size > 0 && (
            <button
              onClick={() => update("groups", new Set())}
              className="text-xs text-gray-400 hover:text-gray-600 ml-1"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
