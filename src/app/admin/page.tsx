import { auth } from "@/auth";
import { isAdmin } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { games, users, gameSelections, hostParties } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();
  if (!isAdmin(session?.user)) redirect("/");

  let stats = [
    { label: "Total Games", value: 104, href: "/" },
    { label: "Live Now", value: 0, color: "text-red-600" },
    { label: "Users", value: 0 },
    { label: "Selections", value: 0, href: "/admin/responses" },
    { label: "Host Parties", value: 0, href: "/admin/parties" },
  ];

  try {
    const [gameCount] = await db.select({ count: count() }).from(games);
    const [userCount] = await db.select({ count: count() }).from(users);
    const [selectionCount] = await db.select({ count: count() }).from(gameSelections);
    const [liveGames] = await db
      .select({ count: count() })
      .from(games)
      .where(eq(games.matchStatus, "live"));
    const [partyCount] = await db.select({ count: count() }).from(hostParties);

    stats = [
      { label: "Total Games", value: gameCount.count, href: "/" },
      { label: "Live Now", value: liveGames.count, color: "text-red-600" },
      { label: "Users", value: userCount.count },
      { label: "Selections", value: selectionCount.count, href: "/admin/responses" },
      { label: "Host Parties", value: partyCount.count, href: "/admin/parties" },
    ];
  } catch {
    // No database connected — show defaults
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
          >
            <div className={`text-2xl font-bold ${stat.color ?? "text-gray-900"}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/responses"
          className="block bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Selections Overview
          </h2>
          <p className="text-sm text-gray-500">
            View all watch/host selections in a matrix view
          </p>
        </Link>

        <Link
          href="/admin/parties"
          className="block bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Host Parties
          </h2>
          <p className="text-sm text-gray-500">
            Create and manage private host party locations
          </p>
        </Link>

        <Link
          href="/"
          className="block bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Game Sheet</h2>
          <p className="text-sm text-gray-500">
            View and edit all 104 matches
          </p>
        </Link>
      </div>
    </div>
  );
}
