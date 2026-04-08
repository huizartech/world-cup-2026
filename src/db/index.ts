import * as schema from "./schema";

// Lazy-init: only connects when a query is actually executed.
// This lets pages import `db` without crashing when POSTGRES_URL is missing.
let _db: ReturnType<typeof import("drizzle-orm/vercel-postgres").drizzle> | null = null;

function getDb() {
  if (!_db) {
    // These imports will throw if POSTGRES_URL is missing,
    // but that only happens inside a try/catch at the call site.
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
