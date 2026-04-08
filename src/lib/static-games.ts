// Static game data for client-side use (no database needed)
// Generated from the official FIFA World Cup 2026 schedule

import { SD_WATCH_PARTIES, type WatchParty } from "./watch-venues";

export type { WatchParty };

export interface StaticGame {
  id: number;
  matchNumber: number;
  stage: string;
  groupName: string | null;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  matchStatus: string;
  kickoffTime: string;
  venueCity: string;
  venueStadium: string;
  watchLocation: string | null;
  locationType: string;
  locationNotes: string | null;
  interestLevel: string;
  watchParties: WatchParty[];
}

function g(
  id: number,
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
): StaticGame {
  return {
    id,
    matchNumber,
    stage,
    groupName,
    homeTeam,
    awayTeam,
    homeScore: null,
    awayScore: null,
    matchStatus: "scheduled",
    kickoffTime: `${date}T${timeUtc}:00Z`,
    venueCity: city,
    venueStadium: stadium,
    watchLocation: null,
    locationType: "none",
    locationNotes: null,
    interestLevel: interest,
    watchParties: SD_WATCH_PARTIES,
  };
}

export const staticGames: StaticGame[] = [
  // === GROUP STAGE — MATCHDAY 1 ===

  // June 11
  g(1, 1, "group", "A", "Mexico", "South Africa", "2026-06-11", "18:00", "Mexico City", "Estadio Azteca", "must_watch"),
  g(2, 2, "group", "A", "Korea Republic", "Czechia", "2026-06-11", "21:00", "Guadalajara", "Estadio Akron"),

  // June 12
  g(3, 3, "group", "B", "Canada", "Bosnia and Herzegovina", "2026-06-12", "18:00", "Toronto", "BMO Field"),
  g(4, 4, "group", "D", "USA", "Paraguay", "2026-06-12", "21:00", "Los Angeles", "SoFi Stadium", "must_watch"),

  // June 13
  g(5, 5, "group", "C", "Haiti", "Scotland", "2026-06-13", "15:00", "Boston", "Gillette Stadium"),
  g(6, 6, "group", "D", "Australia", "Türkiye", "2026-06-13", "18:00", "Vancouver", "BC Place"),
  g(7, 7, "group", "C", "Brazil", "Morocco", "2026-06-13", "21:00", "New York/New Jersey", "MetLife Stadium", "high"),
  g(8, 8, "group", "B", "Qatar", "Switzerland", "2026-06-13", "00:00", "San Francisco", "Levi's Stadium"),

  // June 14
  g(9, 9, "group", "E", "Côte d'Ivoire", "Ecuador", "2026-06-14", "15:00", "Philadelphia", "Lincoln Financial Field"),
  g(10, 10, "group", "E", "Germany", "Curaçao", "2026-06-14", "18:00", "Houston", "NRG Stadium", "high"),
  g(11, 11, "group", "F", "Netherlands", "Japan", "2026-06-14", "21:00", "Dallas", "AT&T Stadium", "high"),
  g(12, 12, "group", "F", "Sweden", "Tunisia", "2026-06-14", "00:00", "Monterrey", "Estadio BBVA"),

  // June 15
  g(13, 13, "group", "H", "Saudi Arabia", "Uruguay", "2026-06-15", "15:00", "Miami", "Hard Rock Stadium", "high"),
  g(14, 14, "group", "H", "Spain", "Cabo Verde", "2026-06-15", "18:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  g(15, 15, "group", "G", "IR Iran", "New Zealand", "2026-06-15", "21:00", "Los Angeles", "SoFi Stadium"),
  g(16, 16, "group", "G", "Belgium", "Egypt", "2026-06-15", "00:00", "Seattle", "Lumen Field", "high"),

  // June 16
  g(17, 17, "group", "I", "France", "Senegal", "2026-06-16", "15:00", "New York/New Jersey", "MetLife Stadium", "high"),
  g(18, 18, "group", "I", "Iraq", "Norway", "2026-06-16", "18:00", "Boston", "Gillette Stadium"),
  g(19, 19, "group", "J", "Argentina", "Algeria", "2026-06-16", "21:00", "Kansas City", "Arrowhead Stadium", "high"),
  g(20, 20, "group", "J", "Austria", "Jordan", "2026-06-16", "00:00", "San Francisco", "Levi's Stadium"),

  // June 17
  g(21, 21, "group", "L", "Ghana", "Panama", "2026-06-17", "15:00", "Toronto", "BMO Field"),
  g(22, 22, "group", "L", "England", "Croatia", "2026-06-17", "18:00", "Dallas", "AT&T Stadium", "high"),
  g(23, 23, "group", "K", "Portugal", "Congo DR", "2026-06-17", "21:00", "Houston", "NRG Stadium", "high"),
  g(24, 24, "group", "K", "Uzbekistan", "Colombia", "2026-06-17", "00:00", "Mexico City", "Estadio Azteca"),

  // === GROUP STAGE — MATCHDAY 2 ===

  // June 18
  g(25, 25, "group", "A", "Czechia", "South Africa", "2026-06-18", "15:00", "Atlanta", "Mercedes-Benz Stadium"),
  g(26, 26, "group", "B", "Switzerland", "Bosnia and Herzegovina", "2026-06-18", "18:00", "Los Angeles", "SoFi Stadium"),
  g(27, 27, "group", "B", "Canada", "Qatar", "2026-06-18", "21:00", "Vancouver", "BC Place"),
  g(28, 28, "group", "A", "Mexico", "Korea Republic", "2026-06-18", "00:00", "Guadalajara", "Estadio Akron", "high"),

  // June 19
  g(29, 29, "group", "C", "Brazil", "Haiti", "2026-06-19", "15:00", "Philadelphia", "Lincoln Financial Field", "high"),
  g(30, 30, "group", "C", "Scotland", "Morocco", "2026-06-19", "18:00", "Boston", "Gillette Stadium"),
  g(31, 31, "group", "D", "Türkiye", "Paraguay", "2026-06-19", "21:00", "San Francisco", "Levi's Stadium"),
  g(32, 32, "group", "D", "USA", "Australia", "2026-06-19", "00:00", "Seattle", "Lumen Field", "must_watch"),

  // June 20
  g(33, 33, "group", "E", "Germany", "Côte d'Ivoire", "2026-06-20", "15:00", "Toronto", "BMO Field", "high"),
  g(34, 34, "group", "E", "Ecuador", "Curaçao", "2026-06-20", "18:00", "Kansas City", "Arrowhead Stadium"),
  g(35, 35, "group", "F", "Netherlands", "Sweden", "2026-06-20", "21:00", "Houston", "NRG Stadium", "high"),
  g(36, 36, "group", "F", "Tunisia", "Japan", "2026-06-20", "00:00", "Monterrey", "Estadio BBVA"),

  // June 21
  g(37, 37, "group", "H", "Uruguay", "Cabo Verde", "2026-06-21", "15:00", "Miami", "Hard Rock Stadium"),
  g(38, 38, "group", "H", "Spain", "Saudi Arabia", "2026-06-21", "18:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  g(39, 39, "group", "G", "Belgium", "IR Iran", "2026-06-21", "21:00", "Los Angeles", "SoFi Stadium", "high"),
  g(40, 40, "group", "G", "New Zealand", "Egypt", "2026-06-21", "00:00", "Vancouver", "BC Place"),

  // June 22
  g(41, 41, "group", "I", "Norway", "Senegal", "2026-06-22", "15:00", "New York/New Jersey", "MetLife Stadium"),
  g(42, 42, "group", "I", "France", "Iraq", "2026-06-22", "18:00", "Philadelphia", "Lincoln Financial Field", "high"),
  g(43, 43, "group", "J", "Argentina", "Austria", "2026-06-22", "21:00", "Dallas", "AT&T Stadium", "high"),
  g(44, 44, "group", "J", "Jordan", "Algeria", "2026-06-22", "00:00", "San Francisco", "Levi's Stadium"),

  // June 23
  g(45, 45, "group", "L", "England", "Ghana", "2026-06-23", "15:00", "Boston", "Gillette Stadium", "high"),
  g(46, 46, "group", "L", "Panama", "Croatia", "2026-06-23", "18:00", "Toronto", "BMO Field"),
  g(47, 47, "group", "K", "Portugal", "Uzbekistan", "2026-06-23", "21:00", "Houston", "NRG Stadium", "high"),
  g(48, 48, "group", "K", "Colombia", "Congo DR", "2026-06-23", "00:00", "Guadalajara", "Estadio Akron"),

  // === GROUP STAGE — MATCHDAY 3 (simultaneous kickoffs per group) ===

  // June 24 — Groups C, B, A
  g(49, 49, "group", "C", "Scotland", "Brazil", "2026-06-24", "15:00", "Miami", "Hard Rock Stadium", "high"),
  g(50, 50, "group", "C", "Morocco", "Haiti", "2026-06-24", "15:00", "Atlanta", "Mercedes-Benz Stadium"),
  g(51, 51, "group", "B", "Switzerland", "Canada", "2026-06-24", "18:00", "Vancouver", "BC Place"),
  g(52, 52, "group", "B", "Bosnia and Herzegovina", "Qatar", "2026-06-24", "18:00", "Seattle", "Lumen Field"),
  g(53, 53, "group", "A", "Czechia", "Mexico", "2026-06-24", "21:00", "Mexico City", "Estadio Azteca", "must_watch"),
  g(54, 54, "group", "A", "South Africa", "Korea Republic", "2026-06-24", "21:00", "Monterrey", "Estadio BBVA"),

  // June 25 — Groups E, F, D
  g(55, 55, "group", "E", "Curaçao", "Côte d'Ivoire", "2026-06-25", "15:00", "Philadelphia", "Lincoln Financial Field"),
  g(56, 56, "group", "E", "Ecuador", "Germany", "2026-06-25", "15:00", "New York/New Jersey", "MetLife Stadium", "high"),
  g(57, 57, "group", "F", "Japan", "Sweden", "2026-06-25", "18:00", "Dallas", "AT&T Stadium"),
  g(58, 58, "group", "F", "Tunisia", "Netherlands", "2026-06-25", "18:00", "Kansas City", "Arrowhead Stadium", "high"),
  g(59, 59, "group", "D", "Türkiye", "USA", "2026-06-25", "21:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  g(60, 60, "group", "D", "Paraguay", "Australia", "2026-06-25", "21:00", "San Francisco", "Levi's Stadium"),

  // June 26 — Groups I, G, H
  g(61, 61, "group", "I", "Norway", "France", "2026-06-26", "15:00", "Boston", "Gillette Stadium", "high"),
  g(62, 62, "group", "I", "Senegal", "Iraq", "2026-06-26", "15:00", "Toronto", "BMO Field"),
  g(63, 63, "group", "G", "Egypt", "IR Iran", "2026-06-26", "18:00", "Seattle", "Lumen Field"),
  g(64, 64, "group", "G", "New Zealand", "Belgium", "2026-06-26", "18:00", "Vancouver", "BC Place", "high"),
  g(65, 65, "group", "H", "Cabo Verde", "Saudi Arabia", "2026-06-26", "21:00", "Houston", "NRG Stadium"),
  g(66, 66, "group", "H", "Uruguay", "Spain", "2026-06-26", "21:00", "Guadalajara", "Estadio Akron", "must_watch"),

  // June 27 — Groups L, J, K
  g(67, 67, "group", "L", "Panama", "England", "2026-06-27", "15:00", "New York/New Jersey", "MetLife Stadium", "high"),
  g(68, 68, "group", "L", "Croatia", "Ghana", "2026-06-27", "15:00", "Philadelphia", "Lincoln Financial Field"),
  g(69, 69, "group", "J", "Algeria", "Austria", "2026-06-27", "18:00", "Kansas City", "Arrowhead Stadium"),
  g(70, 70, "group", "J", "Jordan", "Argentina", "2026-06-27", "18:00", "Dallas", "AT&T Stadium", "high"),
  g(71, 71, "group", "K", "Colombia", "Portugal", "2026-06-27", "21:00", "Miami", "Hard Rock Stadium", "must_watch"),
  g(72, 72, "group", "K", "Congo DR", "Uzbekistan", "2026-06-27", "21:00", "Atlanta", "Mercedes-Benz Stadium"),

  // === ROUND OF 32 ===
  g(73, 73, "round_of_32", null, "2A", "2B", "2026-06-28", "21:00", "Los Angeles", "SoFi Stadium", "high"),

  g(74, 74, "round_of_32", null, "1E", "3A/B/C/D/F", "2026-06-29", "15:00", "Boston", "Gillette Stadium", "high"),
  g(75, 75, "round_of_32", null, "1F", "2C", "2026-06-29", "18:00", "Monterrey", "Estadio BBVA", "high"),
  g(76, 76, "round_of_32", null, "1C", "2F", "2026-06-29", "21:00", "Houston", "NRG Stadium", "high"),

  g(77, 77, "round_of_32", null, "1I", "3C/D/F/G/H", "2026-06-30", "15:00", "New York/New Jersey", "MetLife Stadium", "high"),
  g(78, 78, "round_of_32", null, "2E", "2I", "2026-06-30", "18:00", "Dallas", "AT&T Stadium", "high"),
  g(79, 79, "round_of_32", null, "1A", "3C/E/F/H/I", "2026-06-30", "21:00", "Mexico City", "Estadio Azteca", "high"),

  g(80, 80, "round_of_32", null, "1L", "3E/H/I/J/K", "2026-07-01", "15:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  g(81, 81, "round_of_32", null, "1D", "3B/E/F/I/J", "2026-07-01", "18:00", "San Francisco", "Levi's Stadium", "high"),
  g(82, 82, "round_of_32", null, "1G", "3A/E/H/I/J", "2026-07-01", "21:00", "Seattle", "Lumen Field", "high"),

  g(83, 83, "round_of_32", null, "2K", "2L", "2026-07-02", "15:00", "Toronto", "BMO Field", "high"),
  g(84, 84, "round_of_32", null, "1H", "2J", "2026-07-02", "18:00", "Los Angeles", "SoFi Stadium", "high"),
  g(85, 85, "round_of_32", null, "1B", "3E/F/G/I/J", "2026-07-02", "21:00", "Vancouver", "BC Place", "high"),

  g(86, 86, "round_of_32", null, "1J", "2H", "2026-07-03", "15:00", "Miami", "Hard Rock Stadium", "high"),
  g(87, 87, "round_of_32", null, "1K", "3D/E/I/J/L", "2026-07-03", "18:00", "Kansas City", "Arrowhead Stadium", "high"),
  g(88, 88, "round_of_32", null, "2D", "2G", "2026-07-03", "21:00", "Dallas", "AT&T Stadium", "high"),

  // === ROUND OF 16 ===
  g(89, 89, "round_of_16", null, "W74", "W77", "2026-07-04", "18:00", "Philadelphia", "Lincoln Financial Field", "must_watch"),
  g(90, 90, "round_of_16", null, "W73", "W75", "2026-07-04", "21:00", "Houston", "NRG Stadium", "must_watch"),

  g(91, 91, "round_of_16", null, "W76", "W78", "2026-07-05", "18:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
  g(92, 92, "round_of_16", null, "W79", "W80", "2026-07-05", "21:00", "Mexico City", "Estadio Azteca", "must_watch"),

  g(93, 93, "round_of_16", null, "W83", "W84", "2026-07-06", "18:00", "Dallas", "AT&T Stadium", "must_watch"),
  g(94, 94, "round_of_16", null, "W81", "W82", "2026-07-06", "21:00", "Seattle", "Lumen Field", "must_watch"),

  g(95, 95, "round_of_16", null, "W86", "W88", "2026-07-07", "18:00", "Atlanta", "Mercedes-Benz Stadium", "must_watch"),
  g(96, 96, "round_of_16", null, "W85", "W87", "2026-07-07", "21:00", "Vancouver", "BC Place", "must_watch"),

  // === QUARTER-FINALS ===
  g(97, 97, "quarter_final", null, "W89", "W90", "2026-07-09", "21:00", "Boston", "Gillette Stadium", "must_watch"),
  g(98, 98, "quarter_final", null, "W93", "W94", "2026-07-10", "21:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  g(99, 99, "quarter_final", null, "W91", "W92", "2026-07-11", "18:00", "Miami", "Hard Rock Stadium", "must_watch"),
  g(100, 100, "quarter_final", null, "W95", "W96", "2026-07-11", "21:00", "Kansas City", "Arrowhead Stadium", "must_watch"),

  // === SEMI-FINALS ===
  g(101, 101, "semi_final", null, "W97", "W98", "2026-07-14", "21:00", "Dallas", "AT&T Stadium", "must_watch"),
  g(102, 102, "semi_final", null, "W99", "W100", "2026-07-15", "21:00", "Atlanta", "Mercedes-Benz Stadium", "must_watch"),

  // === THIRD PLACE ===
  g(103, 103, "third_place", null, "L101", "L102", "2026-07-18", "21:00", "Miami", "Hard Rock Stadium", "high"),

  // === FINAL ===
  g(104, 104, "final", null, "W101", "W102", "2026-07-19", "21:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
];
