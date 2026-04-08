import { db } from "@/db";
import { games, gameSelections, hostParties, watchPartyAccess, type NewGame } from "@/db/schema";

// FIFA World Cup 2026 — All 104 matches
// Official schedule from FIFA "Scores & Fixtures" PDF
// PDF times are PDT (UTC-7), converted to UTC by adding 7 hours
// 48 teams, 12 groups (A-L), hosted by USA/Mexico/Canada

function m(
  matchNumber: number,
  stage: string,
  groupName: string | null,
  homeTeam: string,
  awayTeam: string,
  date: string,
  timeUtc: string,
  city: string,
  stadium: string,
  interest: string = "normal"
): NewGame {
  return {
    matchNumber,
    stage,
    groupName,
    homeTeam,
    awayTeam,
    kickoffTime: new Date(`${date}T${timeUtc}:00Z`),
    venueCity: city,
    venueStadium: stadium,
    matchStatus: "scheduled",
    locationType: "none",
    interestLevel: interest,
  };
}

// =============================================
// GROUP STAGE — 72 matches (June 11–27)
// =============================================

const groupStageMatches: NewGame[] = [
  // === MATCHDAY 1 ===

  // June 11 (Wed) — PDT 12:00→UTC 19:00, PDT 19:00→UTC 02:00+1
  m(1,  "group", "A", "Mexico", "South Africa", "2026-06-11", "19:00", "Mexico City", "Estadio Azteca", "must_watch"),
  m(2,  "group", "A", "Korea Republic", "Czechia", "2026-06-12", "02:00", "Guadalajara", "Estadio Akron"),

  // June 12 (Thu) — PDT 12:00→UTC 19:00, PDT 18:00→UTC 01:00+1
  m(3,  "group", "B", "Canada", "Bosnia and Herzegovina", "2026-06-12", "19:00", "Toronto", "BMO Field"),
  m(4,  "group", "D", "USA", "Paraguay", "2026-06-13", "01:00", "Los Angeles", "SoFi Stadium", "must_watch"),

  // June 13 (Fri) — PDT 12:00/15:00/18:00/21:00
  m(8,  "group", "B", "Qatar", "Switzerland", "2026-06-13", "19:00", "San Francisco", "Levi's Stadium"),
  m(7,  "group", "C", "Brazil", "Morocco", "2026-06-13", "22:00", "New York/New Jersey", "MetLife Stadium", "high"),
  m(5,  "group", "C", "Haiti", "Scotland", "2026-06-14", "01:00", "Boston", "Gillette Stadium"),
  m(6,  "group", "D", "Australia", "Türkiye", "2026-06-14", "04:00", "Vancouver", "BC Place"),

  // June 14 (Sat) — PDT 10:00/13:00/16:00/19:00
  m(10, "group", "E", "Germany", "Curaçao", "2026-06-14", "17:00", "Houston", "NRG Stadium", "high"),
  m(11, "group", "F", "Netherlands", "Japan", "2026-06-14", "20:00", "Dallas", "AT&T Stadium", "high"),
  m(9,  "group", "E", "Côte d'Ivoire", "Ecuador", "2026-06-14", "23:00", "Philadelphia", "Lincoln Financial Field"),
  m(12, "group", "F", "Sweden", "Tunisia", "2026-06-15", "02:00", "Monterrey", "Estadio BBVA"),

  // June 15 (Sun) — PDT 09:00/12:00/15:00/18:00
  m(14, "group", "H", "Spain", "Cabo Verde", "2026-06-15", "16:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  m(16, "group", "G", "Belgium", "Egypt", "2026-06-15", "19:00", "Seattle", "Lumen Field", "high"),
  m(13, "group", "H", "Saudi Arabia", "Uruguay", "2026-06-15", "22:00", "Miami", "Hard Rock Stadium", "high"),
  m(15, "group", "G", "IR Iran", "New Zealand", "2026-06-16", "01:00", "Los Angeles", "SoFi Stadium"),

  // June 16 (Mon) — PDT 12:00/15:00/18:00/21:00
  m(17, "group", "I", "France", "Senegal", "2026-06-16", "19:00", "New York/New Jersey", "MetLife Stadium", "high"),
  m(18, "group", "I", "Iraq", "Norway", "2026-06-16", "22:00", "Boston", "Gillette Stadium"),
  m(19, "group", "J", "Argentina", "Algeria", "2026-06-17", "01:00", "Kansas City", "Arrowhead Stadium", "high"),
  m(20, "group", "J", "Austria", "Jordan", "2026-06-17", "04:00", "San Francisco", "Levi's Stadium"),

  // June 17 (Tue) — PDT 10:00/13:00/16:00/19:00
  m(23, "group", "K", "Portugal", "Congo DR", "2026-06-17", "17:00", "Houston", "NRG Stadium", "high"),
  m(22, "group", "L", "England", "Croatia", "2026-06-17", "20:00", "Dallas", "AT&T Stadium", "high"),
  m(21, "group", "L", "Ghana", "Panama", "2026-06-17", "23:00", "Toronto", "BMO Field"),
  m(24, "group", "K", "Uzbekistan", "Colombia", "2026-06-18", "02:00", "Mexico City", "Estadio Azteca"),

  // === MATCHDAY 2 ===

  // June 18 (Wed) — PDT 09:00/12:00/15:00/18:00
  m(25, "group", "A", "Czechia", "South Africa", "2026-06-18", "16:00", "Atlanta", "Mercedes-Benz Stadium"),
  m(26, "group", "B", "Switzerland", "Bosnia and Herzegovina", "2026-06-18", "19:00", "Los Angeles", "SoFi Stadium"),
  m(27, "group", "B", "Canada", "Qatar", "2026-06-18", "22:00", "Vancouver", "BC Place"),
  m(28, "group", "A", "Mexico", "Korea Republic", "2026-06-19", "01:00", "Guadalajara", "Estadio Akron", "high"),

  // June 19 (Thu) — PDT 12:00/15:00/17:30/20:00
  m(32, "group", "D", "USA", "Australia", "2026-06-19", "19:00", "Seattle", "Lumen Field", "must_watch"),
  m(30, "group", "C", "Scotland", "Morocco", "2026-06-19", "22:00", "Boston", "Gillette Stadium"),
  m(29, "group", "C", "Brazil", "Haiti", "2026-06-20", "00:30", "Philadelphia", "Lincoln Financial Field", "high"),
  m(31, "group", "D", "Türkiye", "Paraguay", "2026-06-20", "03:00", "San Francisco", "Levi's Stadium"),

  // June 20 (Fri) — PDT 10:00/13:00/17:00/21:00
  m(35, "group", "F", "Netherlands", "Sweden", "2026-06-20", "17:00", "Houston", "NRG Stadium", "high"),
  m(33, "group", "E", "Germany", "Côte d'Ivoire", "2026-06-20", "20:00", "Toronto", "BMO Field", "high"),
  m(34, "group", "E", "Ecuador", "Curaçao", "2026-06-21", "00:00", "Kansas City", "Arrowhead Stadium"),
  m(36, "group", "F", "Tunisia", "Japan", "2026-06-21", "04:00", "Monterrey", "Estadio BBVA"),

  // June 21 (Sat) — PDT 09:00/12:00/15:00/18:00
  m(38, "group", "H", "Spain", "Saudi Arabia", "2026-06-21", "16:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  m(39, "group", "G", "Belgium", "IR Iran", "2026-06-21", "19:00", "Los Angeles", "SoFi Stadium", "high"),
  m(37, "group", "H", "Uruguay", "Cabo Verde", "2026-06-21", "22:00", "Miami", "Hard Rock Stadium"),
  m(40, "group", "G", "New Zealand", "Egypt", "2026-06-22", "01:00", "Vancouver", "BC Place"),

  // June 22 (Sun) — PDT 10:00/14:00/17:00/20:00
  m(43, "group", "J", "Argentina", "Austria", "2026-06-22", "17:00", "Dallas", "AT&T Stadium", "high"),
  m(42, "group", "I", "France", "Iraq", "2026-06-22", "21:00", "Philadelphia", "Lincoln Financial Field", "high"),
  m(41, "group", "I", "Norway", "Senegal", "2026-06-23", "00:00", "New York/New Jersey", "MetLife Stadium"),
  m(44, "group", "J", "Jordan", "Algeria", "2026-06-23", "03:00", "San Francisco", "Levi's Stadium"),

  // June 23 (Mon) — PDT 10:00/13:00/16:00/19:00
  m(47, "group", "K", "Portugal", "Uzbekistan", "2026-06-23", "17:00", "Houston", "NRG Stadium", "high"),
  m(45, "group", "L", "England", "Ghana", "2026-06-23", "20:00", "Boston", "Gillette Stadium", "high"),
  m(46, "group", "L", "Panama", "Croatia", "2026-06-23", "23:00", "Toronto", "BMO Field"),
  m(48, "group", "K", "Colombia", "Congo DR", "2026-06-24", "02:00", "Guadalajara", "Estadio Akron"),

  // === MATCHDAY 3 (simultaneous kickoffs per group) ===

  // June 24 (Tue) — Groups B, C, A
  m(51, "group", "B", "Switzerland", "Canada", "2026-06-24", "19:00", "Vancouver", "BC Place"),
  m(52, "group", "B", "Bosnia and Herzegovina", "Qatar", "2026-06-24", "19:00", "Seattle", "Lumen Field"),
  m(49, "group", "C", "Scotland", "Brazil", "2026-06-24", "22:00", "Miami", "Hard Rock Stadium", "high"),
  m(50, "group", "C", "Morocco", "Haiti", "2026-06-24", "22:00", "Atlanta", "Mercedes-Benz Stadium"),
  m(53, "group", "A", "Czechia", "Mexico", "2026-06-25", "01:00", "Mexico City", "Estadio Azteca", "must_watch"),
  m(54, "group", "A", "South Africa", "Korea Republic", "2026-06-25", "01:00", "Monterrey", "Estadio BBVA"),

  // June 25 (Wed) — Groups E, F, D
  m(55, "group", "E", "Curaçao", "Côte d'Ivoire", "2026-06-25", "20:00", "Philadelphia", "Lincoln Financial Field"),
  m(56, "group", "E", "Ecuador", "Germany", "2026-06-25", "20:00", "New York/New Jersey", "MetLife Stadium", "high"),
  m(57, "group", "F", "Japan", "Sweden", "2026-06-25", "23:00", "Dallas", "AT&T Stadium"),
  m(58, "group", "F", "Tunisia", "Netherlands", "2026-06-25", "23:00", "Kansas City", "Arrowhead Stadium", "high"),
  m(59, "group", "D", "Türkiye", "USA", "2026-06-26", "02:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  m(60, "group", "D", "Paraguay", "Australia", "2026-06-26", "02:00", "San Francisco", "Levi's Stadium"),

  // June 26 (Thu) — Groups I, H, G
  m(61, "group", "I", "Norway", "France", "2026-06-26", "19:00", "Boston", "Gillette Stadium", "high"),
  m(62, "group", "I", "Senegal", "Iraq", "2026-06-26", "19:00", "Toronto", "BMO Field"),
  m(65, "group", "H", "Cabo Verde", "Saudi Arabia", "2026-06-27", "00:00", "Houston", "NRG Stadium"),
  m(66, "group", "H", "Uruguay", "Spain", "2026-06-27", "00:00", "Guadalajara", "Estadio Akron", "must_watch"),
  m(63, "group", "G", "Egypt", "IR Iran", "2026-06-27", "03:00", "Seattle", "Lumen Field"),
  m(64, "group", "G", "New Zealand", "Belgium", "2026-06-27", "03:00", "Vancouver", "BC Place", "high"),

  // June 27 (Fri) — Groups L, K, J
  m(67, "group", "L", "Panama", "England", "2026-06-27", "21:00", "New York/New Jersey", "MetLife Stadium", "high"),
  m(68, "group", "L", "Croatia", "Ghana", "2026-06-27", "21:00", "Philadelphia", "Lincoln Financial Field"),
  m(71, "group", "K", "Colombia", "Portugal", "2026-06-27", "23:30", "Miami", "Hard Rock Stadium", "must_watch"),
  m(72, "group", "K", "Congo DR", "Uzbekistan", "2026-06-27", "23:30", "Atlanta", "Mercedes-Benz Stadium"),
  m(69, "group", "J", "Algeria", "Austria", "2026-06-28", "02:00", "Kansas City", "Arrowhead Stadium"),
  m(70, "group", "J", "Jordan", "Argentina", "2026-06-28", "02:00", "Dallas", "AT&T Stadium", "high"),
];

// =============================================
// KNOCKOUT STAGE — 32 matches (June 28 – July 19)
// =============================================

const knockoutMatches: NewGame[] = [
  // Round of 32 (16 matches)
  m(73,  "round_of_32", null, "2A", "2B", "2026-06-28", "19:00", "Los Angeles", "SoFi Stadium", "high"),

  m(76,  "round_of_32", null, "1C", "2F", "2026-06-29", "17:00", "Houston", "NRG Stadium", "high"),
  m(74,  "round_of_32", null, "1E", "3A/B/C/D/F", "2026-06-29", "20:30", "Boston", "Gillette Stadium", "high"),
  m(75,  "round_of_32", null, "1F", "2C", "2026-06-30", "01:00", "Monterrey", "Estadio BBVA", "high"),

  m(78,  "round_of_32", null, "2E", "2I", "2026-06-30", "17:00", "Dallas", "AT&T Stadium", "high"),
  m(77,  "round_of_32", null, "1I", "3C/D/F/G/H", "2026-06-30", "21:00", "New York/New Jersey", "MetLife Stadium", "high"),
  m(79,  "round_of_32", null, "1A", "3C/E/F/H/I", "2026-07-01", "01:00", "Mexico City", "Estadio Azteca", "high"),

  m(80,  "round_of_32", null, "1L", "3E/H/I/J/K", "2026-07-01", "16:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  m(82,  "round_of_32", null, "1G", "3A/E/H/I/J", "2026-07-01", "20:00", "Seattle", "Lumen Field", "high"),
  m(81,  "round_of_32", null, "1D", "3B/E/F/I/J", "2026-07-02", "00:00", "San Francisco", "Levi's Stadium", "high"),

  m(84,  "round_of_32", null, "1H", "2J", "2026-07-02", "19:00", "Los Angeles", "SoFi Stadium", "high"),
  m(83,  "round_of_32", null, "2K", "2L", "2026-07-02", "23:00", "Toronto", "BMO Field", "high"),
  m(85,  "round_of_32", null, "1B", "3E/F/G/I/J", "2026-07-03", "03:00", "Vancouver", "BC Place", "high"),

  m(88,  "round_of_32", null, "2D", "2G", "2026-07-03", "18:00", "Dallas", "AT&T Stadium", "high"),
  m(86,  "round_of_32", null, "1J", "2H", "2026-07-03", "22:00", "Miami", "Hard Rock Stadium", "high"),
  m(87,  "round_of_32", null, "1K", "3D/E/I/J/L", "2026-07-04", "01:30", "Kansas City", "Arrowhead Stadium", "high"),

  // Round of 16 (8 matches)
  m(90,  "round_of_16", null, "W73", "W75", "2026-07-04", "17:00", "Houston", "NRG Stadium", "must_watch"),
  m(89,  "round_of_16", null, "W74", "W77", "2026-07-04", "21:00", "Philadelphia", "Lincoln Financial Field", "must_watch"),

  m(91,  "round_of_16", null, "W76", "W78", "2026-07-05", "20:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
  m(92,  "round_of_16", null, "W79", "W80", "2026-07-06", "00:00", "Mexico City", "Estadio Azteca", "must_watch"),

  m(93,  "round_of_16", null, "W83", "W84", "2026-07-06", "19:00", "Dallas", "AT&T Stadium", "must_watch"),
  m(94,  "round_of_16", null, "W81", "W82", "2026-07-07", "00:00", "Seattle", "Lumen Field", "must_watch"),

  m(95,  "round_of_16", null, "W86", "W88", "2026-07-07", "16:00", "Atlanta", "Mercedes-Benz Stadium", "must_watch"),
  m(96,  "round_of_16", null, "W85", "W87", "2026-07-07", "20:00", "Vancouver", "BC Place", "must_watch"),

  // Quarter-finals (4 matches)
  m(97,  "quarter_final", null, "W89", "W90", "2026-07-09", "20:00", "Boston", "Gillette Stadium", "must_watch"),
  m(98,  "quarter_final", null, "W93", "W94", "2026-07-10", "19:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  m(99,  "quarter_final", null, "W91", "W92", "2026-07-11", "21:00", "Miami", "Hard Rock Stadium", "must_watch"),
  m(100, "quarter_final", null, "W95", "W96", "2026-07-12", "01:00", "Kansas City", "Arrowhead Stadium", "must_watch"),

  // Semi-finals (2 matches)
  m(101, "semi_final", null, "W97", "W98", "2026-07-14", "19:00", "Dallas", "AT&T Stadium", "must_watch"),
  m(102, "semi_final", null, "W99", "W100", "2026-07-15", "19:00", "Atlanta", "Mercedes-Benz Stadium", "must_watch"),

  // Third place
  m(103, "third_place", null, "L101", "L102", "2026-07-18", "21:00", "Miami", "Hard Rock Stadium", "high"),

  // FINAL
  m(104, "final", null, "W101", "W102", "2026-07-19", "19:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
];

export const allMatches: NewGame[] = [...groupStageMatches, ...knockoutMatches];

export async function seedGames() {
  console.log(`Seeding ${allMatches.length} matches...`);
  await db.delete(watchPartyAccess);
  await db.delete(hostParties);
  await db.delete(gameSelections);
  await db.delete(games);
  await db.insert(games).values(allMatches);
  console.log(`Successfully seeded ${allMatches.length} matches!`);
}
