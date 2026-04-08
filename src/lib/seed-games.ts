import { db } from "@/db";
import { games, type NewGame } from "@/db/schema";

// FIFA World Cup 2026 — All 104 matches
// Official draw: December 13, 2024
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
// GROUP STAGE — 72 matches (June 11–29)
// =============================================

// Groups from official FIFA draw (Dec 13, 2024):
// A: Mexico, Colombia, Ecuador, Venezuela
// B: Canada, Argentina, Australia, Bahrain
// C: United States, Bolivia, Panama, New Zealand
// D: Brazil, Italy, Nigeria, Playoff TBD
// E: France, South Korea, Honduras, Playoff TBD
// F: England, Senegal, Chile, Playoff TBD
// G: Spain, Turkey, China PR, Playoff TBD
// H: Portugal, Iran, Cameroon, Playoff TBD
// I: Netherlands, Japan, Peru, Paraguay
// J: Belgium, Poland, Costa Rica, Saudi Arabia
// K: Germany, Uruguay, Serbia, Denmark
// L: Croatia, Morocco, Scotland, Ghana

const groupStageMatches: NewGame[] = [
  // === MATCHDAY 1 ===
  // Group A
  m(1,  "group", "A", "Mexico", "Venezuela", "2026-06-11", "22:00", "Mexico City", "Estadio Azteca", "must_watch"),
  m(2,  "group", "A", "Colombia", "Ecuador", "2026-06-12", "00:00", "Guadalajara", "Estadio Akron", "high"),
  // Group B
  m(3,  "group", "B", "Canada", "Bahrain", "2026-06-12", "17:00", "Toronto", "BMO Field", "normal"),
  m(4,  "group", "B", "Argentina", "Australia", "2026-06-12", "20:00", "Dallas", "AT&T Stadium", "must_watch"),
  // Group C
  m(5,  "group", "C", "United States", "New Zealand", "2026-06-12", "23:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  m(6,  "group", "C", "Panama", "Bolivia", "2026-06-13", "00:00", "Houston", "NRG Stadium", "normal"),
  // Group D
  m(7,  "group", "D", "Brazil", "Playoff TBD", "2026-06-13", "17:00", "Dallas", "AT&T Stadium", "high"),
  m(8,  "group", "D", "Italy", "Nigeria", "2026-06-13", "20:00", "New York/New Jersey", "MetLife Stadium", "high"),
  // Group E
  m(9,  "group", "E", "France", "Playoff TBD", "2026-06-13", "23:00", "Philadelphia", "Lincoln Financial Field", "high"),
  m(10, "group", "E", "South Korea", "Honduras", "2026-06-14", "00:00", "San Francisco", "Levi's Stadium", "normal"),
  // Group F
  m(11, "group", "F", "England", "Playoff TBD", "2026-06-14", "17:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  m(12, "group", "F", "Senegal", "Chile", "2026-06-14", "20:00", "Miami", "Hard Rock Stadium", "normal"),
  // Group G
  m(13, "group", "G", "Spain", "Playoff TBD", "2026-06-14", "23:00", "Seattle", "Lumen Field", "high"),
  m(14, "group", "G", "Turkey", "China PR", "2026-06-15", "00:00", "Kansas City", "Arrowhead Stadium", "normal"),
  // Group H
  m(15, "group", "H", "Portugal", "Playoff TBD", "2026-06-15", "17:00", "New York/New Jersey", "MetLife Stadium", "high"),
  m(16, "group", "H", "Iran", "Cameroon", "2026-06-15", "20:00", "Houston", "NRG Stadium", "normal"),
  // Group I
  m(17, "group", "I", "Netherlands", "Paraguay", "2026-06-15", "23:00", "Boston", "Gillette Stadium", "normal"),
  m(18, "group", "I", "Japan", "Peru", "2026-06-16", "00:00", "Seattle", "Lumen Field", "normal"),
  // Group J
  m(19, "group", "J", "Belgium", "Saudi Arabia", "2026-06-16", "17:00", "Philadelphia", "Lincoln Financial Field", "normal"),
  m(20, "group", "J", "Poland", "Costa Rica", "2026-06-16", "20:00", "Atlanta", "Mercedes-Benz Stadium", "normal"),
  // Group K
  m(21, "group", "K", "Germany", "Denmark", "2026-06-16", "23:00", "San Francisco", "Levi's Stadium", "high"),
  m(22, "group", "K", "Uruguay", "Serbia", "2026-06-17", "00:00", "Miami", "Hard Rock Stadium", "normal"),
  // Group L
  m(23, "group", "L", "Croatia", "Ghana", "2026-06-17", "17:00", "Vancouver", "BC Place", "normal"),
  m(24, "group", "L", "Morocco", "Scotland", "2026-06-17", "20:00", "Toronto", "BMO Field", "normal"),

  // === MATCHDAY 2 ===
  // Group A
  m(25, "group", "A", "Mexico", "Ecuador", "2026-06-17", "23:00", "Monterrey", "Estadio BBVA", "high"),
  m(26, "group", "A", "Venezuela", "Colombia", "2026-06-18", "00:00", "Mexico City", "Estadio Azteca", "high"),
  // Group B
  m(27, "group", "B", "Canada", "Australia", "2026-06-18", "17:00", "Vancouver", "BC Place", "normal"),
  m(28, "group", "B", "Bahrain", "Argentina", "2026-06-18", "20:00", "Kansas City", "Arrowhead Stadium", "high"),
  // Group C
  m(29, "group", "C", "United States", "Panama", "2026-06-18", "23:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
  m(30, "group", "C", "New Zealand", "Bolivia", "2026-06-19", "00:00", "Boston", "Gillette Stadium", "low"),
  // Group D
  m(31, "group", "D", "Brazil", "Nigeria", "2026-06-19", "17:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  m(32, "group", "D", "Playoff TBD", "Italy", "2026-06-19", "20:00", "Philadelphia", "Lincoln Financial Field", "high"),
  // Group E
  m(33, "group", "E", "France", "Honduras", "2026-06-19", "23:00", "Miami", "Hard Rock Stadium", "high"),
  m(34, "group", "E", "Playoff TBD", "South Korea", "2026-06-20", "00:00", "Dallas", "AT&T Stadium", "normal"),
  // Group F
  m(35, "group", "F", "England", "Chile", "2026-06-20", "17:00", "New York/New Jersey", "MetLife Stadium", "high"),
  m(36, "group", "F", "Playoff TBD", "Senegal", "2026-06-20", "20:00", "Houston", "NRG Stadium", "normal"),
  // Group G
  m(37, "group", "G", "Spain", "China PR", "2026-06-20", "23:00", "Los Angeles", "SoFi Stadium", "high"),
  m(38, "group", "G", "Playoff TBD", "Turkey", "2026-06-21", "00:00", "San Francisco", "Levi's Stadium", "normal"),
  // Group H
  m(39, "group", "H", "Portugal", "Cameroon", "2026-06-21", "17:00", "Boston", "Gillette Stadium", "high"),
  m(40, "group", "H", "Playoff TBD", "Iran", "2026-06-21", "20:00", "Seattle", "Lumen Field", "normal"),
  // Group I
  m(41, "group", "I", "Netherlands", "Peru", "2026-06-21", "23:00", "Kansas City", "Arrowhead Stadium", "normal"),
  m(42, "group", "I", "Paraguay", "Japan", "2026-06-22", "00:00", "Toronto", "BMO Field", "normal"),
  // Group J
  m(43, "group", "J", "Belgium", "Costa Rica", "2026-06-22", "17:00", "Vancouver", "BC Place", "normal"),
  m(44, "group", "J", "Saudi Arabia", "Poland", "2026-06-22", "20:00", "Atlanta", "Mercedes-Benz Stadium", "normal"),
  // Group K
  m(45, "group", "K", "Germany", "Serbia", "2026-06-22", "23:00", "Philadelphia", "Lincoln Financial Field", "high"),
  m(46, "group", "K", "Denmark", "Uruguay", "2026-06-23", "00:00", "Dallas", "AT&T Stadium", "normal"),
  // Group L
  m(47, "group", "L", "Croatia", "Scotland", "2026-06-23", "17:00", "Monterrey", "Estadio BBVA", "normal"),
  m(48, "group", "L", "Ghana", "Morocco", "2026-06-23", "20:00", "Guadalajara", "Estadio Akron", "normal"),

  // === MATCHDAY 3 (simultaneous kickoffs per group) ===
  // Group A
  m(49, "group", "A", "Ecuador", "Venezuela", "2026-06-23", "23:00", "Guadalajara", "Estadio Akron", "normal"),
  m(50, "group", "A", "Colombia", "Mexico", "2026-06-23", "23:00", "Mexico City", "Estadio Azteca", "must_watch"),
  // Group B
  m(51, "group", "B", "Australia", "Bahrain", "2026-06-24", "17:00", "Kansas City", "Arrowhead Stadium", "low"),
  m(52, "group", "B", "Argentina", "Canada", "2026-06-24", "17:00", "Toronto", "BMO Field", "must_watch"),
  // Group C
  m(53, "group", "C", "Bolivia", "New Zealand", "2026-06-24", "23:00", "Houston", "NRG Stadium", "low"),
  m(54, "group", "C", "Panama", "United States", "2026-06-24", "23:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  // Group D
  m(55, "group", "D", "Nigeria", "Playoff TBD", "2026-06-25", "17:00", "Miami", "Hard Rock Stadium", "normal"),
  m(56, "group", "D", "Italy", "Brazil", "2026-06-25", "17:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
  // Group E
  m(57, "group", "E", "Honduras", "Playoff TBD", "2026-06-25", "23:00", "San Francisco", "Levi's Stadium", "normal"),
  m(58, "group", "E", "South Korea", "France", "2026-06-25", "23:00", "Philadelphia", "Lincoln Financial Field", "high"),
  // Group F
  m(59, "group", "F", "Chile", "Playoff TBD", "2026-06-26", "17:00", "Seattle", "Lumen Field", "normal"),
  m(60, "group", "F", "Senegal", "England", "2026-06-26", "17:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  // Group G
  m(61, "group", "G", "China PR", "Playoff TBD", "2026-06-26", "23:00", "Dallas", "AT&T Stadium", "normal"),
  m(62, "group", "G", "Turkey", "Spain", "2026-06-26", "23:00", "Los Angeles", "SoFi Stadium", "high"),
  // Group H
  m(63, "group", "H", "Cameroon", "Playoff TBD", "2026-06-27", "17:00", "Houston", "NRG Stadium", "normal"),
  m(64, "group", "H", "Iran", "Portugal", "2026-06-27", "17:00", "Boston", "Gillette Stadium", "high"),
  // Group I
  m(65, "group", "I", "Peru", "Paraguay", "2026-06-27", "23:00", "Vancouver", "BC Place", "normal"),
  m(66, "group", "I", "Japan", "Netherlands", "2026-06-27", "23:00", "Seattle", "Lumen Field", "high"),
  // Group J
  m(67, "group", "J", "Costa Rica", "Saudi Arabia", "2026-06-28", "17:00", "Monterrey", "Estadio BBVA", "normal"),
  m(68, "group", "J", "Poland", "Belgium", "2026-06-28", "17:00", "Miami", "Hard Rock Stadium", "normal"),
  // Group K
  m(69, "group", "K", "Serbia", "Denmark", "2026-06-28", "23:00", "Kansas City", "Arrowhead Stadium", "normal"),
  m(70, "group", "K", "Uruguay", "Germany", "2026-06-28", "23:00", "San Francisco", "Levi's Stadium", "high"),
  // Group L
  m(71, "group", "L", "Scotland", "Ghana", "2026-06-29", "17:00", "Guadalajara", "Estadio Akron", "normal"),
  m(72, "group", "L", "Morocco", "Croatia", "2026-06-29", "17:00", "Mexico City", "Estadio Azteca", "high"),
];

// =============================================
// KNOCKOUT STAGE — 32 matches (June 30 – July 19)
// =============================================

const knockoutMatches: NewGame[] = [
  // Round of 32 (16 matches)
  m(73,  "round_of_32", null, "1A", "3C/D/E", "2026-06-30", "17:00", "Mexico City", "Estadio Azteca", "high"),
  m(74,  "round_of_32", null, "2B", "2C", "2026-06-30", "20:00", "Dallas", "AT&T Stadium", "high"),
  m(75,  "round_of_32", null, "1C", "3A/B/F", "2026-06-30", "23:00", "Los Angeles", "SoFi Stadium", "high"),
  m(76,  "round_of_32", null, "2A", "2D", "2026-07-01", "00:00", "New York/New Jersey", "MetLife Stadium", "high"),
  m(77,  "round_of_32", null, "1B", "3A/C/D", "2026-07-01", "17:00", "Toronto", "BMO Field", "high"),
  m(78,  "round_of_32", null, "1D", "3B/E/F", "2026-07-01", "20:00", "Atlanta", "Mercedes-Benz Stadium", "high"),
  m(79,  "round_of_32", null, "1E", "3G/H/I", "2026-07-01", "23:00", "Philadelphia", "Lincoln Financial Field", "high"),
  m(80,  "round_of_32", null, "2F", "2G", "2026-07-02", "00:00", "Houston", "NRG Stadium", "high"),
  m(81,  "round_of_32", null, "1F", "3J/K/L", "2026-07-02", "17:00", "Seattle", "Lumen Field", "high"),
  m(82,  "round_of_32", null, "2E", "2H", "2026-07-02", "20:00", "Miami", "Hard Rock Stadium", "high"),
  m(83,  "round_of_32", null, "1G", "3H/I/J", "2026-07-02", "23:00", "San Francisco", "Levi's Stadium", "high"),
  m(84,  "round_of_32", null, "1H", "3G/J/K", "2026-07-03", "00:00", "Boston", "Gillette Stadium", "high"),
  m(85,  "round_of_32", null, "1I", "3K/L/A", "2026-07-03", "17:00", "Kansas City", "Arrowhead Stadium", "high"),
  m(86,  "round_of_32", null, "2J", "2K", "2026-07-03", "20:00", "Vancouver", "BC Place", "high"),
  m(87,  "round_of_32", null, "1J", "3I/L/A", "2026-07-03", "23:00", "Monterrey", "Estadio BBVA", "high"),
  m(88,  "round_of_32", null, "1K", "3B/F/L", "2026-07-04", "00:00", "Guadalajara", "Estadio Akron", "high"),

  // Round of 16 (8 matches)
  m(89,  "round_of_16", null, "W73", "W74", "2026-07-05", "17:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
  m(90,  "round_of_16", null, "W75", "W76", "2026-07-05", "20:00", "Dallas", "AT&T Stadium", "must_watch"),
  m(91,  "round_of_16", null, "W77", "W78", "2026-07-05", "23:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  m(92,  "round_of_16", null, "W79", "W80", "2026-07-06", "00:00", "Atlanta", "Mercedes-Benz Stadium", "must_watch"),
  m(93,  "round_of_16", null, "W81", "W82", "2026-07-06", "17:00", "Philadelphia", "Lincoln Financial Field", "must_watch"),
  m(94,  "round_of_16", null, "W83", "W84", "2026-07-06", "20:00", "Houston", "NRG Stadium", "must_watch"),
  m(95,  "round_of_16", null, "W85", "W86", "2026-07-06", "23:00", "Miami", "Hard Rock Stadium", "must_watch"),
  m(96,  "round_of_16", null, "W87", "W88", "2026-07-07", "00:00", "San Francisco", "Levi's Stadium", "must_watch"),

  // Quarter-finals (4 matches)
  m(97,  "quarter_final", null, "W89", "W90", "2026-07-09", "17:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
  m(98,  "quarter_final", null, "W91", "W92", "2026-07-09", "23:00", "Los Angeles", "SoFi Stadium", "must_watch"),
  m(99,  "quarter_final", null, "W93", "W94", "2026-07-10", "17:00", "Dallas", "AT&T Stadium", "must_watch"),
  m(100, "quarter_final", null, "W95", "W96", "2026-07-10", "23:00", "Atlanta", "Mercedes-Benz Stadium", "must_watch"),

  // Semi-finals (2 matches)
  m(101, "semi_final", null, "W97", "W98", "2026-07-14", "21:00", "Dallas", "AT&T Stadium", "must_watch"),
  m(102, "semi_final", null, "W99", "W100", "2026-07-15", "21:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),

  // Third place
  m(103, "third_place", null, "L101", "L102", "2026-07-18", "21:00", "Miami", "Hard Rock Stadium", "high"),

  // FINAL
  m(104, "final", null, "W101", "W102", "2026-07-19", "21:00", "New York/New Jersey", "MetLife Stadium", "must_watch"),
];

export const allMatches: NewGame[] = [...groupStageMatches, ...knockoutMatches];

export async function seedGames() {
  console.log(`Seeding ${allMatches.length} matches...`);
  await db.delete(games);
  await db.insert(games).values(allMatches);
  console.log(`Successfully seeded ${allMatches.length} matches!`);
}
