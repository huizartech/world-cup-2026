import * as schema from "./schema";

// Lazy-init: only connects when a query is actually executed.
// This lets pages import `db` without crashing when POSTGRES_URL is missing.
let _db: ReturnType<typeof import("drizzle-orm/vercel-postgres").drizzle> | null = null;

function getDb() {
  if (!_db) {
    // Strip channel_binding param that can cause connection issues
    if (process.env.POSTGRES_URL) {
      const url = new URL(process.env.POSTGRES_URL);
      url.searchParams.delete("channel_binding");
      process.env.POSTGRES_URL = url.toString();
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { sql } = require("@vercel/postgres");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/vercel-postgres");
    _db = drizzle(sql, { schema });
  }
  return _db!;
}

export const db = new Proxy({} as ReturnType<typeof import("drizzle-orm/vercel-postgres").drizzle>, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
