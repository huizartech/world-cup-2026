import { db } from "@/db";
import { games, type NewGame } from "@/db/schema";

// FIFA World Cup 2026 — All 104 matches
// Official schedule from fifa.com
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

// Groups from official FIFA schedule:
// A: Mexico, South Africa, Korea Republic, Czechia
// B: Canada, Bosnia and Herzegovina, Qatar, Switzerland
// C: Haiti, Scotland, Brazil, Morocco
// D: USA, Paraguay, Australia, Türkiye
// E: Côte d'Ivoire, Ecuador, Germany, Curaçao
// F: Netherlands, Japan, Sweden, Tunisia
// G: IR Iran, New Zealand, Belgium, Egypt
// H: Saudi Arabia, Uruguay, Spain, Cabo Verde
// I: France, Senegal, Iraq, Norway
// J: Argentina, Algeria, Austria, Jordan
// K: Portugal, Congo DR, Uzbekistan, Colombia
// L: Ghana, Panama, England, Croatia

const groupStageMatches: NewGame[] = [
  // === MATCHDAY 1 ===

  // June 11
  m(1,  "group", "A", "Mexico", "South Africa", "2026-06-11", "18:00", "Mexico City", "Mexico City Stadium", "must_watch"),
  m(2,  "group", "A", "Korea Republic", "Czechia", "2026-06-11", "21:00", "Guadalajara", "Estadio Guadalajara"),

  // June 12
  m(3,  "group", "B", "Canada", "Bosnia and Herzegovina", "2026-06-12", "18:00", "Toronto", "Toronto Stadium"),
  m(4,  "group", "D", "USA", "Paraguay", "2026-06-12", "21:00", "Los Angeles", "Los Angeles Stadium", "must_watch"),

  // June 13
  m(5,  "group", "C", "Haiti", "Scotland", "2026-06-13", "15:00", "Boston", "Boston Stadium"),
  m(6,  "group", "D", "Australia", "Türkiye", "2026-06-13", "18:00", "Vancouver", "BC Place"),
  m(7,  "group", "C", "Brazil", "Morocco", "2026-06-13", "21:00", "New York/New Jersey", "New York New Jersey Stadium", "high"),
  m(8,  "group", "B", "Qatar", "Switzerland", "2026-06-13", "00:00", "San Francisco", "San Francisco Bay Area Stadium"),

  // June 14
  m(9,  "group", "E", "Côte d'Ivoire", "Ecuador", "2026-06-14", "15:00", "Philadelphia", "Philadelphia Stadium"),
  m(10, "group", "E", "Germany", "Curaçao", "2026-06-14", "18:00", "Houston", "Houston Stadium", "high"),
  m(11, "group", "F", "Netherlands", "Japan", "2026-06-14", "21:00", "Dallas", "Dallas Stadium", "high"),
  m(12, "group", "F", "Sweden", "Tunisia", "2026-06-14", "00:00", "Monterrey", "Estadio Monterrey"),

  // June 15
  m(13, "group", "H", "Saudi Arabia", "Uruguay", "2026-06-15", "15:00", "Miami", "Miami Stadium", "high"),
  m(14, "group", "H", "Spain", "Cabo Verde", "2026-06-15", "18:00", "Atlanta", "Atlanta Stadium", "high"),
  m(15, "group", "G", "IR Iran", "New Zealand", "2026-06-15", "21:00", "Los Angeles", "Los Angeles Stadium"),
  m(16, "group", "G", "Belgium", "Egypt", "2026-06-15", "00:00", "Seattle", "Seattle Stadium", "high"),

  // June 16
  m(17, "group", "I", "France", "Senegal", "2026-06-16", "15:00", "New York/New Jersey", "New York New Jersey Stadium", "high"),
  m(18, "group", "I", "Iraq", "Norway", "2026-06-16", "18:00", "Boston", "Boston Stadium"),
  m(19, "group", "J", "Argentina", "Algeria", "2026-06-16", "21:00", "Kansas City", "Kansas City Stadium", "high"),
  m(20, "group", "J", "Austria", "Jordan", "2026-06-16", "00:00", "San Francisco", "San Francisco Bay Area Stadium"),

  // June 17
  m(21, "group", "L", "Ghana", "Panama", "2026-06-17", "15:00", "Toronto", "Toronto Stadium"),
  m(22, "group", "L", "England", "Croatia", "2026-06-17", "18:00", "Dallas", "Dallas Stadium", "high"),
  m(23, "group", "K", "Portugal", "Congo DR", "2026-06-17", "21:00", "Houston", "Houston Stadium", "high"),
  m(24, "group", "K", "Uzbekistan", "Colombia", "2026-06-17", "00:00", "Mexico City", "Mexico City Stadium"),

  // === MATCHDAY 2 ===

  // June 18
  m(25, "group", "A", "Czechia", "South Africa", "2026-06-18", "15:00", "Atlanta", "Atlanta Stadium"),
  m(26, "group", "B", "Switzerland", "Bosnia and Herzegovina", "2026-06-18", "18:00", "Los Angeles", "Los Angeles Stadium"),
  m(27, "group", "B", "Canada", "Qatar", "2026-06-18", "21:00", "Vancouver", "BC Place"),
  m(28, "group", "A", "Mexico", "Korea Republic", "2026-06-18", "00:00", "Guadalajara", "Estadio Guadalajara", "high"),

  // June 19
  m(29, "group", "C", "Brazil", "Haiti", "2026-06-19", "15:00", "Philadelphia", "Philadelphia Stadium", "high"),
  m(30, "group", "C", "Scotland", "Morocco", "2026-06-19", "18:00", "Boston", "Boston Stadium"),
  m(31, "group", "D", "Türkiye", "Paraguay", "2026-06-19", "21:00", "San Francisco", "San Francisco Bay Area Stadium"),
  m(32, "group", "D", "USA", "Australia", "2026-06-19", "00:00", "Seattle", "Seattle Stadium", "must_watch"),

  // June 20
  m(33, "group", "E", "Germany", "Côte d'Ivoire", "2026-06-20", "15:00", "Toronto", "Toronto Stadium", "high"),
  m(34, "group", "E", "Ecuador", "Curaçao", "2026-06-20", "18:00", "Kansas City", "Kansas City Stadium"),
  m(35, "group", "F", "Netherlands", "Sweden", "2026-06-20", "21:00", "Houston", "Houston Stadium", "high"),
  m(36, "group", "F", "Tunisia", "Japan", "2026-06-20", "00:00", "Monterrey", "Estadio Monterrey"),

  // June 21
  m(37, "group", "H", "Uruguay", "Cabo Verde", "2026-06-21", "15:00", "Miami", "Miami Stadium"),
  m(38, "group", "H", "Spain", "Saudi Arabia", "2026-06-21", "18:00", "Atlanta", "Atlanta Stadium", "high"),
  m(39, "group", "G", "Belgium", "IR Iran", "2026-06-21", "21:00", "Los Angeles", "Los Angeles Stadium", "high"),
  m(40, "group", "G", "New Zealand", "Egypt", "2026-06-21", "00:00", "Vancouver", "BC Place"),

  // June 22
  m(41, "group", "I", "Norway", "Senegal", "2026-06-22", "15:00", "New York/New Jersey", "New York New Jersey Stadium"),
  m(42, "group", "I", "France", "Iraq", "2026-06-22", "18:00", "Philadelphia", "Philadelphia Stadium", "high"),
  m(43, "group", "J", "Argentina", "Austria", "2026-06-22", "21:00", "Dallas", "Dallas Stadium", "high"),
  m(44, "group", "J", "Jordan", "Algeria", "2026-06-22", "00:00", "San Francisco", "San Francisco Bay Area Stadium"),

  // June 23
  m(45, "group", "L", "England", "Ghana", "2026-06-23", "15:00", "Boston", "Boston Stadium", "high"),
  m(46, "group", "L", "Panama", "Croatia", "2026-06-23", "18:00", "Toronto", "Toronto Stadium"),
  m(47, "group", "K", "Portugal", "Uzbekistan", "2026-06-23", "21:00", "Houston", "Houston Stadium", "high"),
  m(48, "group", "K", "Colombia", "Congo DR", "2026-06-23", "00:00", "Guadalajara", "Estadio Guadalajara"),

  // === MATCHDAY 3 (simultaneous kickoffs per group) ===

  // June 24 — Groups C, B, A
  m(49, "group", "C", "Scotland", "Brazil", "2026-06-24", "15:00", "Miami", "Miami Stadium", "high"),
  m(50, "group", "C", "Morocco", "Haiti", "2026-06-24", "15:00", "Atlanta", "Atlanta Stadium"),
  m(51, "group", "B", "Switzerland", "Canada", "2026-06-24", "18:00", "Vancouver", "BC Place"),
  m(52, "group", "B", "Bosnia and Herzegovina", "Qatar", "2026-06-24", "18:00", "Seattle", "Seattle Stadium"),
  m(53, "group", "A", "Czechia", "Mexico", "2026-06-24", "21:00", "Mexico City", "Mexico City Stadium", "must_watch"),
  m(54, "group", "A", "South Africa", "Korea Republic", "2026-06-24", "21:00", "Monterrey", "Estadio Monterrey"),

  // June 25 — Groups E, F, D
  m(55, "group", "E", "Curaçao", "Côte d'Ivoire", "2026-06-25", "15:00", "Philadelphia", "Philadelphia Stadium"),
  m(56, "group", "E", "Ecuador", "Germany", "2026-06-25", "15:00", "New York/New Jersey", "New York New Jersey Stadium", "high"),
  m(57, "group", "F", "Japan", "Sweden", "2026-06-25", "18:00", "Dallas", "Dallas Stadium"),
  m(58, "group", "F", "Tunisia", "Netherlands", "2026-06-25", "18:00", "Kansas City", "Kansas City Stadium", "high"),
  m(59, "group", "D", "Türkiye", "USA", "2026-06-25", "21:00", "Los Angeles", "Los Angeles Stadium", "must_watch"),
  m(60, "group", "D", "Paraguay", "Australia", "2026-06-25", "21:00", "San Francisco", "San Francisco Bay Area Stadium"),

  // June 26 — Groups I, G, H
  m(61, "group", "I", "Norway", "France", "2026-06-26", "15:00", "Boston", "Boston Stadium", "high"),
  m(62, "group", "I", "Senegal", "Iraq", "2026-06-26", "15:00", "Toronto", "Toronto Stadium"),
  m(63, "group", "G", "Egypt", "IR Iran", "2026-06-26", "18:00", "Seattle", "Seattle Stadium"),
  m(64, "group", "G", "New Zealand", "Belgium", "2026-06-26", "18:00", "Vancouver", "BC Place", "high"),
  m(65, "group", "H", "Cabo Verde", "Saudi Arabia", "2026-06-26", "21:00", "Houston", "Houston Stadium"),
  m(66, "group", "H", "Uruguay", "Spain", "2026-06-26", "21:00", "Guadalajara", "Estadio Guadalajara", "must_watch"),

  // June 27 — Groups L, J, K
  m(67, "group", "L", "Panama", "England", "2026-06-27", "15:00", "New York/New Jersey", "New York New Jersey Stadium", "high"),
  m(68, "group", "L", "Croatia", "Ghana", "2026-06-27", "15:00", "Philadelphia", "Philadelphia Stadium"),
  m(69, "group", "J", "Algeria", "Austria", "2026-06-27", "18:00", "Kansas City", "Kansas City Stadium"),
  m(70, "group", "J", "Jordan", "Argentina", "2026-06-27", "18:00", "Dallas", "Dallas Stadium", "high"),
  m(71, "group", "K", "Colombia", "Portugal", "2026-06-27", "21:00", "Miami", "Miami Stadium", "must_watch"),
  m(72, "group", "K", "Congo DR", "Uzbekistan", "2026-06-27", "21:00", "Atlanta", "Atlanta Stadium"),
];

// =============================================
// KNOCKOUT STAGE — 32 matches (June 28 – July 19)
// =============================================

const knockoutMatches: NewGame[] = [
  // Round of 32 (16 matches)
  m(73,  "round_of_32", null, "2A", "2B", "2026-06-28", "21:00", "Los Angeles", "Los Angeles Stadium", "high"),

  m(74,  "round_of_32", null, "1E", "3A/B/C/D/F", "2026-06-29", "15:00", "Boston", "Boston Stadium", "high"),
  m(75,  "round_of_32", null, "1F", "2C", "2026-06-29", "18:00", "Monterrey", "Estadio Monterrey", "high"),
  m(76,  "round_of_32", null, "1C", "2F", "2026-06-29", "21:00", "Houston", "Houston Stadium", "high"),

  m(77,  "round_of_32", null, "1I", "3C/D/F/G/H", "2026-06-30", "15:00", "New York/New Jersey", "New York New Jersey Stadium", "high"),
  m(78,  "round_of_32", null, "2E", "2I", "2026-06-30", "18:00", "Dallas", "Dallas Stadium", "high"),
  m(79,  "round_of_32", null, "1A", "3C/E/F/H/I", "2026-06-30", "21:00", "Mexico City", "Mexico City Stadium", "high"),

  m(80,  "round_of_32", null, "1L", "3E/H/I/J/K", "2026-07-01", "15:00", "Atlanta", "Atlanta Stadium", "high"),
  m(81,  "round_of_32", null, "1D", "3B/E/F/I/J", "2026-07-01", "18:00", "San Francisco", "San Francisco Bay Area Stadium", "high"),
  m(82,  "round_of_32", null, "1G", "3A/E/H/I/J", "2026-07-01", "21:00", "Seattle", "Seattle Stadium", "high"),

  m(83,  "round_of_32", null, "2K", "2L", "2026-07-02", "15:00", "Toronto", "Toronto Stadium", "high"),
  m(84,  "round_of_32", null, "1H", "2J", "2026-07-02", "18:00", "Los Angeles", "Los Angeles Stadium", "high"),
  m(85,  "round_of_32", null, "1B", "3E/F/G/I/J", "2026-07-02", "21:00", "Vancouver", "BC Place", "high"),

  m(86,  "round_of_32", null, "1J", "2H", "2026-07-03", "15:00", "Miami", "Miami Stadium", "high"),
  m(87,  "round_of_32", null, "1K", "3D/E/I/J/L", "2026-07-03", "18:00", "Kansas City", "Kansas City Stadium", "high"),
  m(88,  "round_of_32", null, "2D", "2G", "2026-07-03", "21:00", "Dallas", "Dallas Stadium", "high"),

  // Round of 16 (8 matches)
  m(89,  "round_of_16", null, "W74", "W77", "2026-07-04", "18:00", "Philadelphia", "Philadelphia Stadium", "must_watch"),
  m(90,  "round_of_16", null, "W73", "W75", "2026-07-04", "21:00", "Houston", "Houston Stadium", "must_watch"),

  m(91,  "round_of_16", null, "W76", "W78", "2026-07-05", "18:00", "New York/New Jersey", "New York New Jersey Stadium", "must_watch"),
  m(92,  "round_of_16", null, "W79", "W80", "2026-07-05", "21:00", "Mexico City", "Mexico City Stadium", "must_watch"),

  m(93,  "round_of_16", null, "W83", "W84", "2026-07-06", "18:00", "Dallas", "Dallas Stadium", "must_watch"),
  m(94,  "round_of_16", null, "W81", "W82", "2026-07-06", "21:00", "Seattle", "Seattle Stadium", "must_watch"),

  m(95,  "round_of_16", null, "W86", "W88", "2026-07-07", "18:00", "Atlanta", "Atlanta Stadium", "must_watch"),
  m(96,  "round_of_16", null, "W85", "W87", "2026-07-07", "21:00", "Vancouver", "BC Place", "must_watch"),

  // Quarter-finals (4 matches)
  m(97,  "quarter_final", null, "W89", "W90", "2026-07-09", "21:00", "Boston", "Boston Stadium", "must_watch"),
  m(98,  "quarter_final", null, "W93", "W94", "2026-07-10", "21:00", "Los Angeles", "Los Angeles Stadium", "must_watch"),
  m(99,  "quarter_final", null, "W91", "W92", "2026-07-11", "18:00", "Miami", "Miami Stadium", "must_watch"),
  m(100, "quarter_final", null, "W95", "W96", "2026-07-11", "21:00", "Kansas City", "Kansas City Stadium", "must_watch"),

  // Semi-finals (2 matches)
  m(101, "semi_final", null, "W97", "W98", "2026-07-14", "21:00", "Dallas", "Dallas Stadium", "must_watch"),
  m(102, "semi_final", null, "W99", "W100", "2026-07-15", "21:00", "Atlanta", "Atlanta Stadium", "must_watch"),

  // Third place
  m(103, "third_place", null, "L101", "L102", "2026-07-18", "21:00", "Miami", "Miami Stadium", "high"),

  // FINAL
  m(104, "final", null, "W101", "W102", "2026-07-19", "21:00", "New York/New Jersey", "New York New Jersey Stadium", "must_watch"),
];

export const allMatches: NewGame[] = [...groupStageMatches, ...knockoutMatches];

export async function seedGames() {
  console.log(`Seeding ${allMatches.length} matches...`);
  await db.delete(games);
  await db.insert(games).values(allMatches);
  console.log(`Successfully seeded ${allMatches.length} matches!`);
}
