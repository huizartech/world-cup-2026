import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  matchNumber: integer("match_number").notNull(),
  apiMatchId: integer("api_match_id"),
  stage: varchar("stage", { length: 50 }).notNull(), // group, round_of_32, round_of_16, quarter_final, semi_final, third_place, final
  groupName: varchar("group_name", { length: 10 }), // A-L (null for knockout)
  homeTeam: varchar("home_team", { length: 100 }).notNull(),
  awayTeam: varchar("away_team", { length: 100 }).notNull(),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  matchStatus: varchar("match_status", { length: 20 }).notNull().default("scheduled"), // scheduled, live, finished
  kickoffTime: timestamp("kickoff_time", { withTimezone: true }).notNull(),
  venueCity: varchar("venue_city", { length: 100 }).notNull(),
  venueStadium: varchar("venue_stadium", { length: 200 }).notNull(),
  watchLocation: text("watch_location"),
  locationType: varchar("location_type", { length: 20 }).notNull().default("none"), // none, public, private
  locationNotes: text("location_notes"),
  interestLevel: varchar("interest_level", { length: 20 }).notNull().default("normal"), // low, normal, high, must_watch
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  googleId: varchar("google_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  image: text("image"),
  role: varchar("role", { length: 20 }).notNull().default("user"), // user, admin
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const surveyResponses = pgTable(
  "survey_responses",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    canHost: boolean("can_host").notNull().default(false),
    gamesToHost: integer("games_to_host").array(),
    gamesCareAbout: integer("games_care_about").array(),
    wantsEmailReminders: boolean("wants_email_reminders").notNull().default(false),
    wantsTextReminders: boolean("wants_text_reminders").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("survey_user_unique").on(table.userId)]
);

export const watchPartyAccess = pgTable(
  "watch_party_access",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    gameId: integer("game_id")
      .notNull()
      .references(() => games.id),
    grantedBy: integer("granted_by")
      .notNull()
      .references(() => users.id),
    grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("access_user_game_unique").on(table.userId, table.gameId)]
);

// Type exports
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type User = typeof users.$inferSelect;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type WatchPartyAccess = typeof watchPartyAccess.$inferSelect;
