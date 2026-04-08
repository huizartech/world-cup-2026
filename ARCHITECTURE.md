# World Cup 2026 Watch Party — Architecture Summary

## Overview

A Next.js web app for organizing FIFA World Cup 2026 watch parties in San Diego. Users browse the full 104-match schedule, mark games they want to watch or host, and see live scores. An admin manages private/public watch locations and receives weekly email summaries with attendee phone numbers.

**Tech stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Vercel Postgres · Drizzle ORM · NextAuth v5 (Google) · football-data.org API · Resend email

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              Root layout (SessionProvider, Nav)
│   ├── page.tsx                Home page (schedule, filters, standings, bracket)
│   ├── globals.css             Tailwind v4 imports + CSS vars
│   ├── admin/
│   │   ├── page.tsx            Admin dashboard (stats)
│   │   ├── responses/page.tsx  Selections matrix (users × games)
│   │   ├── parties/page.tsx    Host party manager
│   │   └── games/[gameId]/page.tsx  Edit single game
│   └── api/
│       ├── auth/[...nextauth]/route.ts   NextAuth handler
│       ├── games/route.ts                GET all games (filtered)
│       ├── games/[gameId]/route.ts       GET/PATCH single game
│       ├── games/[gameId]/select/route.ts  POST watch/host toggle
│       ├── scores/route.ts               GET live scores
│       ├── user/phone/route.ts           POST save phone number
│       ├── admin/users/route.ts          GET all users
│       ├── admin/selections/route.ts     GET selections matrix data
│       ├── admin/export/route.ts         GET full JSON export
│       ├── admin/access/route.ts         GET/POST/DELETE access grants
│       ├── admin/parties/route.ts        GET/POST host parties
│       ├── admin/parties/[partyId]/route.ts  PATCH/DELETE host party
│       └── cron/
│           ├── scores/route.ts           Cron: update live scores
│           └── weekly-email/route.ts     Cron: Monday admin email
├── components/
│   ├── access-manager.tsx      Admin: create/edit/delete host parties + public toggle
│   ├── admin-game-editor.tsx   Admin: edit game fields (location, scores, interest)
│   ├── filter-bar.tsx          Stage/group/interest/time filters
│   ├── game-table.tsx          Main schedule table + mobile cards (with flag emojis)
│   ├── group-standings.tsx     12-group standings tables
│   ├── knockout-bracket.tsx    Visual bracket (R32 through Final)
│   ├── login-button.tsx        Google sign-in button
│   ├── nav.tsx                 Top nav bar
│   ├── phone-prompt-modal.tsx  Phone number collection modal
│   ├── providers.tsx           SessionProvider wrapper
│   ├── rankings-table.tsx      48-team FIFA ranking table
│   ├── sign-in-prompt-modal.tsx  Sign-in prompt modal
│   └── watch-host-buttons.tsx  Watch/Host toggle buttons with counts
├── db/
│   ├── index.ts                Neon serverless DB connection (lazy singleton)
│   └── schema.ts               5 Drizzle table definitions
├── lib/
│   ├── email.ts                Resend email builder (weekly admin summary)
│   ├── group-standings.ts      Compute W-D-L standings from game results
│   ├── permissions.ts          isAdmin, canSeePrivateLocation, filterGameForUser
│   ├── rankings.ts             48-team ranking data
│   ├── scores.ts               football-data.org client (30s cache)
│   ├── seed-games.ts           104-match seed data
│   ├── static-games.ts         Client-side fallback game data
│   └── watch-venues.ts         San Diego public watch party venues
├── types/
│   └── next-auth.d.ts          Session/JWT type augmentation
└── auth.ts                     NextAuth v5 config (Google, upsert, role in JWT)

scripts/
└── seed.ts                     Entry point for `npm run db:seed`

Root config: package.json · tsconfig.json · next.config.ts · drizzle.config.ts
             vercel.json · postcss.config.mjs · eslint.config.mjs
```

---

## Database Schema (5 tables)

### `games` — 104 World Cup matches
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| matchNumber | integer | 1–104 |
| apiMatchId | integer | football-data.org match ID (nullable) |
| stage | text | group, round_of_32, round_of_16, quarter_final, semi_final, third_place, final |
| groupName | text | A–L (null for knockout) |
| homeTeam, awayTeam | text | Team names or placeholders (e.g. "1A", "W73") |
| homeScore, awayScore | integer | Nullable until match starts |
| matchStatus | text | scheduled, live, finished |
| kickoffTime | timestamp w/tz | UTC |
| venueCity, venueStadium | text | |
| watchLocation | text | Admin-set watch party address (nullable) |
| locationType | text | none, public, private |
| locationNotes | text | Nullable |
| interestLevel | text | low, normal, high, must_watch |
| createdAt, updatedAt | timestamp | Auto-managed |

### `users` — OAuth users
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| googleId | text | Unique |
| email | text | Unique |
| name, image | text | From Google profile |
| phone | text | Collected via modal, nullable |
| role | text | "user" or "admin" (set on sign-in if email = ADMIN_EMAIL) |
| createdAt, updatedAt | timestamp | |

### `gameSelections` — Watch/host preferences
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| userId → users.id | integer | |
| gameId → games.id | integer | |
| watching | boolean | |
| hosting | boolean | |
| Unique | (userId, gameId) | |

### `hostParties` — Admin-created watch parties
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| gameId → games.id | integer | |
| hostUserId → users.id | integer | |
| createdBy → users.id | integer | |
| location | text | Address/description |
| notes | text | Nullable |
| createdAt, updatedAt | timestamp | |

### `watchPartyAccess` — Private party access grants
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| userId → users.id | integer | |
| gameId → games.id | integer | |
| grantedBy → users.id | integer | |
| grantedAt | timestamp | |
| Unique | (userId, gameId) | |

---

## API Routes

### Public (no auth)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/games` | All games with filters (`stage`, `group`, `date`, `interest`). Includes watch counts, user selections, venue list. Private locations filtered per user. |
| GET | `/api/games/[gameId]` | Single game by ID |
| GET | `/api/scores` | Fetch + update live scores from football-data.org |

### Authenticated (session required)

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/games/[gameId]/select` | Toggle watch/host. Body: `{ type: "watch" | "host" }`. Requires phone number. |
| POST | `/api/user/phone` | Save phone. Body: `{ phone: string }` |

### Admin only (role = "admin")

| Method | Route | Purpose |
|--------|-------|---------|
| PATCH | `/api/games/[gameId]` | Edit game fields (location, scores, interest, teams, status) |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/selections` | Users + games + selections for matrix view |
| GET | `/api/admin/export` | Full JSON backup |
| GET | `/api/admin/access` | List access grants |
| POST | `/api/admin/access` | Grant access to user for game |
| DELETE | `/api/admin/access` | Revoke access |
| GET | `/api/admin/parties` | List host parties with game info + attendees |
| POST | `/api/admin/parties` | Create party. Body: `{ gameId, hostUserId, location, notes, attendeeIds, isPublic }` |
| PATCH | `/api/admin/parties/[partyId]` | Update party (location, notes, attendees, visibility) |
| DELETE | `/api/admin/parties/[partyId]` | Delete party + revoke access + reset game location |

### Cron (Bearer token = CRON_SECRET)

| Method | Route | Schedule | Purpose |
|--------|-------|----------|---------|
| GET | `/api/cron/scores` | Manual or scheduled | Update scores from football-data.org |
| GET | `/api/cron/weekly-email` | Daily 14:00 UTC (vercel.json) | Sends admin email on Mondays only — upcoming games, attendee phones, SMS template |

---

## External APIs

### football-data.org (live scores)
- **Endpoint:** `https://api.football-data.org/v4/competitions/2000/matches`
- **Competition 2000** = FIFA World Cup
- **Auth:** `X-Auth-Token` header with `FOOTBALL_API_KEY`
- **Cache:** 30-second minimum between fetches
- **Team name mapping:** API names normalized to DB names (e.g. "South Korea" → "Korea Republic", "Ivory Coast" → "Côte d'Ivoire")
- **Match linking:** Fast path by `apiMatchId`, slow path by team name matching
- **Status mapping:** SCHEDULED/TIMED → scheduled, IN_PLAY/PAUSED → live, FINISHED → finished
- **Used by:** `/api/scores` (client polling) and `/api/cron/scores`

### Resend (email)
- **Package:** `resend` npm module
- **From:** `World Cup Watch Party <onboarding@resend.dev>`
- **Auth:** `RESEND_API_KEY` env var
- **Used by:** `/api/cron/weekly-email` — sends HTML email to ADMIN_EMAIL on Mondays
- **Graceful:** Silently skips if API key not set

### Google OAuth (authentication)
- **Provider:** NextAuth v5 Google provider
- **Auth:** `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET`
- **Flow:** Sign-in → upsert user in DB → set role if ADMIN_EMAIL match → JWT with dbId/role/phone

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `POSTGRES_URL` | Yes | Vercel Postgres connection string |
| `AUTH_SECRET` | Yes | NextAuth session encryption key |
| `AUTH_GOOGLE_ID` | Yes | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Yes | Google OAuth client secret |
| `ADMIN_EMAIL` | Yes | Email that gets admin role |
| `FOOTBALL_API_KEY` | No | football-data.org API key (scores disabled if missing) |
| `RESEND_API_KEY` | No | Resend email key (emails skipped if missing) |
| `CRON_SECRET` | No | Bearer token for cron endpoints |
| `NEXT_PUBLIC_APP_URL` | No | Public URL (default: http://localhost:3000) |

---

## Key Data

### 48 Teams (12 groups of 4)
- **A:** Mexico, South Africa, Korea Republic, Czechia
- **B:** Canada, Bosnia and Herzegovina, Qatar, Switzerland
- **C:** Brazil, Morocco, Haiti, Scotland
- **D:** USA, Paraguay, Australia, Türkiye
- **E:** Germany, Curaçao, Côte d'Ivoire, Ecuador
- **F:** Netherlands, Japan, Sweden, Tunisia
- **G:** Belgium, Egypt, IR Iran, New Zealand
- **H:** Spain, Cabo Verde, Saudi Arabia, Uruguay
- **I:** France, Senegal, Iraq, Norway
- **J:** Argentina, Algeria, Austria, Jordan
- **K:** Portugal, Congo DR, Uzbekistan, Colombia
- **L:** England, Croatia, Ghana, Panama

### 104 Matches
- 48 group stage (3 matchdays × 12 groups ÷ 2)
- 16 Round of 32
- 8 Round of 16
- 4 Quarter finals
- 2 Semi finals
- 1 Third place
- 1 Final

### San Diego Watch Venues (watch-venues.ts)
1. Shakespeare Pub — Mission Hills
2. Bluefoot Bar & Lounge — North Park
3. The Harp — Ocean Beach
4. Queenstown Public House — Little Italy
5. Proud Mary's — Kearny Mesa
6. The Local Eatery & Drinking Hole — Pacific Beach
7. Rabbit Hole — Normal Heights
8. Novo Brazil Brewing — Chula Vista

---

## Auth & Permissions

### Role assignment
- On Google sign-in, `auth.ts` signIn callback upserts user
- If `user.email === process.env.ADMIN_EMAIL` → `role = "admin"`
- Role stored in both `users.role` (DB) and JWT token

### Private location visibility
- `filterGameForUser()` in `permissions.ts` checks `locationType`
- If `"private"`: redacts `watchLocation` + `locationNotes` unless user is admin or has a `watchPartyAccess` row
- If `"public"` or `"none"`: returned as-is (visible to everyone including anonymous)

### Watch/host selections
- Require authenticated session + phone number on file
- Phone collected via modal on first toggle attempt

---

## Graceful Degradation
- **No DB:** Falls back to `static-games.ts` (browsing works, no selections)
- **No FOOTBALL_API_KEY:** Score fetches silently fail; games stay "scheduled"
- **No RESEND_API_KEY:** Weekly email silently skipped
- **No auth:** Can browse schedule, standings, bracket; cannot select or see private locations

---

## NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Local dev server |
| `build` | `next build` | Production build |
| `start` | `next start` | Production server |
| `lint` | `eslint` | Linting |
| `db:push` | `drizzle-kit push` | Push schema to DB |
| `db:seed` | `npx tsx scripts/seed.ts` | Seed 104 matches |
| `db:studio` | `drizzle-kit studio` | Drizzle Studio UI |
| `db:generate` | `drizzle-kit generate` | Generate migrations |
| `db:migrate` | `drizzle-kit migrate` | Run migrations |

---

## Known Limitations
- Build requires network access (fails in Apple sandbox, works on Vercel)
- NextAuth v5 is beta — may have breaking changes
- Single admin only (ADMIN_EMAIL env var)
- Phone numbers collected but no SMS sending — only used in admin email summaries
- Polling-based live scores (60s client, 30s server cache) — not real-time WebSocket
- Static fixture data must be manually updated if FIFA changes the schedule
