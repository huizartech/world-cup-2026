"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Nav() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-2xl">⚽</span>
              <span className="hidden sm:inline">WC 2026 Watch Parties</span>
              <span className="sm:hidden">WC 2026</span>
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm text-yellow-300 hover:text-yellow-100 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse" />
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300 hidden sm:inline">
                  {session.user.name}
                </span>
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
