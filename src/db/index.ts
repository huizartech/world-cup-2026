import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getConnectionString() {
  const url = process.env.POSTGRES_URL;
  if (!url) throw new Error("POSTGRES_URL is not set");
  // Strip channel_binding param using string replacement
  return url
    .replace(/[?&]channel_binding=[^&]*/, (match) =>
      match.startsWith("?") ? "?" : ""
    )
    .replace(/\?&/, "?")
    .replace(/\?$/, "");
}

let _db: ReturnType<typeof drizzle> | null = null;

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    if (!_db) {
      const sql = neon(getConnectionString());
      _db = drizzle(sql, { schema });
    }
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});
