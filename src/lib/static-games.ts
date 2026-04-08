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
  g(1, 1, "group", "A", "Mexico", "Venezuela", "2026-06-11", "22:00", "Mexico City", "Estadio Azteca", "must_watch"),
  g(2, 2, "group", "A", "Colombia", "Ecuador", "2026-06-12", "00:00", "Guadalajara", "Estadio Akron", "high"),
  g(3, 3, "group", "B", "Canada", "Bahrain", "2026-06-12", "17:00", "Toronto", "BMO Field", "normal"),
  g(4, 4, "group", "B", "Argentina", "Australia", "2026-06-12", "20:00", "Dallas", "AT&T Stadium", "must_watch"),
  g(5, 5, "group", "C", "United States", "New Zealand", "2026-06-12", "23:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  g(6, 6, "group", "C", "Panama", "Bolivia", "2026-06-13", "00:00", "Houston", "NRG Stadium", "normal"),
  g(7, 7, "group", "D", "Brazil", "Playoff TBD", "2026-06-13", "17:00", "Dallas", "AT&T Stadium", "high"),
  g(8, 8, "group", "D", "Italy", "Nigeria", "2026-06-13", "20:00", "New York/New Jersey", "MetLife Stadium", "high"),
  g(9, 9, "group", "E", "France", "Playoff TBD", "2026-06-13", "23:00", "Philadelphia", "Lincoln Financial Field", "high"),
  g(10, 10, "group", "E", "South Korea", "Honduras", "2026-06-14", "00:00", "San Francisco", "Levi's Stadium", "normal"),
  g(11, 11, "group", "F", "England", "Playoff TBD", "2026-06-14", "17:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  g(12, 12, "group", "F", "Senegal", "Chile", "2026-06-14", "20:00", "Miami", "Hard Rock Stadium", "normal"),
  g(13, 13, "group", "G", "Spain", "Playoff TBD", "2026-06-14", "23:00", "Seattle", "Lumen Field", "high"),
  g(14, 14, "group", "G", "Turkey", "China PR", "2026-06-15", "00:00", "Kansas City", "Arrowhead Stadium", "normal"),
  g(15, 15, "group", "H", "Portugal", "Playoff TBD", "2026-06-15", "17:00", "New York/New Jersey", "MetLife Stadium", "high"),
  g(16, 16, "group", "H", "Iran", "Cameroon", "2026-06-15", "20:00", "Houston", "NRG Stadium", "normal"),
  g(17, 17, "group", "I", "Netherlands", "Paraguay", "2026-06-15", "23:00", "Boston", "Gillette Stadium", "normal"),
  g(18, 18, "group", "I", "Japan", "Peru", "2026-06-16", "00:00", "Seattle", "Lumen Field", "normal"),
  g(19, 19, "group", "J", "Belgium", "Saudi Arabia", "2026-06-16", "17:00", "Philadelphia", "Lincoln Financial Field", "normal"),
  g(20, 20, "group", "J", "Poland", "Costa Rica", "2026-06-16", "20:00", "Atlanta", "Mercedes-Benz Stadium", "normal"),
  g(21, 21, "group", "K", "Germany", "Denmark", "2026-06-16", "23:00", "San Francisco", "Levi's Stadium", "high"),
  g(22, 22, "group", "K", "Uruguay", "Serbia", "2026-06-17", "00:00", "Miami", "Hard Rock Stadium", "normal"),
  g(23, 23, "group", "L", "Croatia", "Ghana", "2026-06-17", "17:00", "Vancouver", "BC Place", "normal"),
  g(24, 24, "group", "L", "Morocco", "Scotland", "2026-06-17", "20:00", "Toronto", "BMO Field", "normal"),

  // === GROUP STAGE — MATCHDAY 2 ===
  g(25, 25, "group", "A", "Mexico", "Ecuador", "2026-06-17", "23:00", "Monterrey", "Estadio BBVA", "high"),
  g(26, 26, "group", "A", "Venezuela", "Colombia", "2026-06-18", "00:00", "Mexico City", "Estadio Azteca", "high"),
  g(27, 27, "group", "B", "Canada", "Australia", "2026-06-18", "17:00", "Vancouver", "BC Place", "normal"),
  g(28, 28, "group", "B", "Bahrain", "Argentina", "2026-06-18", "20:00", "Kansas City", "Arrowhead Stadium", "high"),
  g(29, 29, "group", "C", "United States", "Panama", "2026-06-18", "23:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
  g(30, 30, "group", "C", "New Zealand", "Bolivia", "2026-06-19", "00:00", "Boston", "Gillette Stadium", "low"),
  g(31, 31, "group", "D", "Brazil", "Nigeria", "2026-06-19", "17:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  g(32, 32, "group", "D", "Playoff TBD", "Italy", "2026-06-19", "20:00", "Philadelphia", "Lincoln Financial Field", "high"),
  g(33, 33, "group", "E", "France", "Honduras", "2026-06-19", "23:00", "Miami", "Hard Rock Stadium", "high"),
  g(34, 34, "group", "E", "Playoff TBD", "South Korea", "2026-06-20", "00:00", "Dallas", "AT&T Stadium", "normal"),
  g(35, 35, "group", "F", "England", "Chile", "2026-06-20", "17:00", "New York/New Jersey", "MetLife Stadium", "high"),
  g(36, 36, "group", "F", "Playoff TBD", "Senegal", "2026-06-20", "20:00", "Houston", "NRG Stadium", "normal"),
  g(37, 37, "group", "G", "Spain", "China PR", "2026-06-20", "23:00", "Los Angeles", "SoFi Stadium", "high"),
  g(38, 38, "group", "G", "Playoff TBD", "Turkey", "2026-06-21", "00:00", "San Francisco", "Levi's Stadium", "normal"),
  g(39, 39, "group", "H", "Portugal", "Cameroon", "2026-06-21", "17:00", "Boston", "Gillette Stadium", "high"),
  g(40, 40, "group", "H", "Playoff TBD", "Iran", "2026-06-21", "20:00", "Seattle", "Lumen Field", "normal"),
  g(41, 41, "group", "I", "Netherlands", "Peru", "2026-06-21", "23:00", "Kansas City", "Arrowhead Stadium", "normal"),
  g(42, 42, "group", "I", "Paraguay", "Japan", "2026-06-22", "00:00", "Toronto", "BMO Field", "normal"),
  g(43, 43, "group", "J", "Belgium", "Costa Rica", "2026-06-22", "17:00", "Vancouver", "BC Place", "normal"),
  g(44, 44, "group", "J", "Saudi Arabia", "Poland", "2026-06-22", "20:00", "Atlanta", "Mercedes-Benz Stadium", "normal"),
  g(45, 45, "group", "K", "Germany", "Serbia", "2026-06-22", "23:00", "Philadelphia", "Lincoln Financial Field", "high"),
  g(46, 46, "group", "K", "Denmark", "Uruguay", "2026-06-23", "00:00", "Dallas", "AT&T Stadium", "normal"),
  g(47, 47, "group", "L", "Croatia", "Scotland", "2026-06-23", "17:00", "Monterrey", "Estadio BBVA", "normal"),
  g(48, 48, "group", "L", "Ghana", "Morocco", "2026-06-23", "20:00", "Guadalajara", "Estadio Akron", "normal"),

  // === GROUP STAGE — MATCHDAY 3 (simultaneous kickoffs) ===
  g(49, 49, "group", "A", "Ecuador", "Venezuela", "2026-06-23", "23:00", "Guadalajara", "Estadio Akron", "normal"),
  g(50, 50, "group", "A", "Colombia", "Mexico", "2026-06-23", "23:00", "Mexico City", "Estadio Azteca", "must_watch"),
  g(51, 51, "group", "B", "Australia", "Bahrain", "2026-06-24", "17:00", "Kansas City", "Arrowhead Stadium", "low"),
  g(52, 52, "group", "B", "Argentina", "Canada", "2026-06-24", "17:00", "Toronto", "BMO Field", "must_watch"),
  g(53, 53, "group", "C", "Bolivia", "New Zealand", "2026-06-24", "23:00", "Houston", "NRG Stadium", "low"),
  g(54, 54, "group", "C", "Panama", "United States", "2026-06-24", "23:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  g(55, 55, "group", "D", "Nigeria", "Playoff TBD", "2026-06-25", "17:00", "Miami", "Hard Rock Stadium", "normal"),
  g(56, 56, "group", "D", "Italy", "Brazil", "2026-06-25", "17:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
  g(57, 57, "group", "E", "Honduras", "Playoff TBD", "2026-06-25", "23:00", "San Francisco", "Levi's Stadium", "normal"),
  g(58, 58, "group", "E", "South Korea", "France", "2026-06-25", "23:00", "Philadelphia", "Lincoln Financial Field", "high"),
  g(59, 59, "group", "F", "Chile", "Playoff TBD", "2026-06-26", "17:00", "Seattle", "Lumen Field", "normal"),
  g(60, 60, "group", "F", "Senegal", "England", "2026-06-26", "17:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  g(61, 61, "group", "G", "China PR", "Playoff TBD", "2026-06-26", "23:00", "Dallas", "AT&T Stadium", "normal"),
  g(62, 62, "group", "G", "Turkey", "Spain", "2026-06-26", "23:00", "Los Angeles", "SoFi Stadium", "high"),
  g(63, 63, "group", "H", "Cameroon", "Playoff TBD", "2026-06-27", "17:00", "Houston", "NRG Stadium", "normal"),
  g(64, 64, "group", "H", "Iran", "Portugal", "2026-06-27", "17:00", "Boston", "Gillette Stadium", "high"),
  g(65, 65, "group", "I", "Peru", "Paraguay", "2026-06-27", "23:00", "Vancouver", "BC Place", "normal"),
  g(66, 66, "group", "I", "Japan", "Netherlands", "2026-06-27", "23:00", "Seattle", "Lumen Field", "high"),
  g(67, 67, "group", "J", "Costa Rica", "Saudi Arabia", "2026-06-28", "17:00", "Monterrey", "Estadio BBVA", "normal"),
  g(68, 68, "group", "J", "Poland", "Belgium", "2026-06-28", "17:00", "Miami", "Hard Rock Stadium", "normal"),
  g(69, 69, "group", "K", "Serbia", "Denmark", "2026-06-28", "23:00", "Kansas City", "Arrowhead Stadium", "normal"),
  g(70, 70, "group", "K", "Uruguay", "Germany", "2026-06-28", "23:00", "San Francisco", "Levi's Stadium", "high"),
  g(71, 71, "group", "L", "Scotland", "Ghana", "2026-06-29", "17:00", "Guadalajara", "Estadio Akron", "normal"),
  g(72, 72, "group", "L", "Morocco", "Croatia", "2026-06-29", "17:00", "Mexico City", "Estadio Azteca", "high"),

  // === ROUND OF 32 ===
  g(73, 73, "round_of_32", null, "1A", "3C/D/E", "2026-06-30", "17:00", "Mexico City", "Estadio Azteca", "high"),
  g(74, 74, "round_of_32", null, "2B", "2C", "2026-06-30", "20:00", "Dallas", "AT&T Stadium", "high"),
  g(75, 75, "round_of_32", null, "1C", "3A/B/F", "2026-06-30", "23:00", "Los Angeles", "SoFi Stadium", "high"),
  g(76, 76, "round_of_32", null, "2A", "2D", "2026-07-01", "00:00", "New York/New Jersey", "MetLife Stadium", "high"),
  g(77, 77, "round_of_32", null, "1B", "3A/C/D", "2026-07-01", "17:00", "Toronto", "BMO Field", "high"),
  g(78, 78, "round_of_32", null, "1D", "3B/E/F", "2026-07-01", "20:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  g(79, 79, "round_of_32", null, "1E", "3G/H/I", "2026-07-01", "23:00", "Philadelphia", "Lincoln Financial Field", "high"),
  g(80, 80, "round_of_32", null, "2F", "2G", "2026-07-02", "00:00", "Houston", "NRG Stadium", "high"),
  g(81, 81, "round_of_32", null, "1F", "3J/K/L", "2026-07-02", "17:00", "Seattle", "Lumen Field", "high"),
  g(82, 82, "round_of_32", null, "2E", "2H", "2026-07-02", "20:00", "Miami", "Hard Rock Stadium", "high"),
  g(83, 83, "round_of_32", null, "1G", "3H/I/J", "2026-07-02", "23:00", "San Francisco", "Levi's Stadium", "high"),
  g(84, 84, "round_of_32", null, "1H", "3G/J/K", "2026-07-03", "00:00", "Boston", "Gillette Stadium", "high"),
  g(85, 85, "round_of_32", null, "1I", "3K/L/A", "2026-07-03", "17:00", "Kansas City", "Arrowhead Stadium", "high"),
  g(86, 86, "round_of_32", null, "2J", "2K", "2026-07-03", "20:00", "Vancouver", "BC Place", "high"),
  g(87, 87, "round_of_32", null, "1J", "3I/L/A", "2026-07-03", "23:00", "Monterrey", "Estadio BBVA", "high"),
  g(88, 88, "round_of_32", null, "1K", "3B/F/L", "2026-07-04", "00:00", "Guadalajara", "Estadio Akron", "high"),

  // === ROUND OF 16 ===
  g(89, 89, "round_of_16", null, "W73", "W74", "2026-07-05", "17:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
  g(90, 90, "round_of_16", null, "W75", "W76", "2026-07-05", "20:00", "Dallas", "AT&T Stadium", "must_watch"),
  g(91, 91, "round_of_16", null, "W77", "W78", "2026-07-05", "23:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  g(92, 92, "round_of_16", null, "W79", "W80", "2026-07-06", "00:00", "Atlanta", "Mercedes-Benz Stadium", "must_watch"),
  g(93, 93, "round_of_16", null, "W81", "W82", "2026-07-06", "17:00", "Philadelphia", "Lincoln Financial Field", "must_watch"),
  g(94, 94, "round_of_16", null, "W83", "W84", "2026-07-06", "20:00", "Houston", "NRG Stadium", "must_watch"),
  g(95, 95, "round_of_16", null, "W85", "W86", "2026-07-06", "23:00", "Miami", "Hard Rock Stadium", "must_watch"),
  g(96, 96, "round_of_16", null, "W87", "W88", "2026-07-07", "00:00", "San Francisco", "Levi's Stadium", "must_watch"),

  // === QUARTER-FINALS ===
  g(97, 97, "quarter_final", null, "W89", "W90", "2026-07-09", "17:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
  g(98, 98, "quarter_final", null, "W91", "W92", "2026-07-09", "23:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  g(99, 99, "quarter_final", null, "W93", "W94", "2026-07-10", "17:00", "Dallas", "AT&T Stadium", "must_watch"),
  g(100, 100, "quarter_final", null, "W95", "W96", "2026-07-10", "23:00", "Atlanta", "Mercedes-Benz Stadium", "must_watch"),

  // === SEMI-FINALS ===
  g(101, 101, "semi_final", null, "W97", "W98", "2026-07-14", "21:00", "Dallas", "AT&T Stadium", "must_watch"),
  g(102, 102, "semi_final", null, "W99", "W100", "2026-07-15", "21:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),

  // === THIRD PLACE ===
  g(103, 103, "third_place", null, "L101", "L102", "2026-07-18", "21:00", "Miami", "Hard Rock Stadium", "high"),

  // === FINAL ===
  g(104, 104, "final", null, "W101", "W102", "2026-07-19", "21:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
];
