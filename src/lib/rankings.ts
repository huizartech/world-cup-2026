// FIFA World Rankings for all 48 World Cup 2026 teams
// Based on FIFA rankings as of early 2026
// These serve as default data; can be updated via football-data.org API later

export interface TeamRanking {
  rank: number;
  team: string;
  group: string;
  points: number;
  confederation: string;
}

// Rankings approximate as of early 2026 based on latest available FIFA data
export const teamRankings: TeamRanking[] = [
  // Top seeds / favorites
  { rank: 1, team: "Argentina", group: "B", points: 1867, confederation: "CONMEBOL" },
  { rank: 2, team: "France", group: "E", points: 1860, confederation: "UEFA" },
  { rank: 3, team: "Spain", group: "G", points: 1813, confederation: "UEFA" },
  { rank: 4, team: "England", group: "F", points: 1797, confederation: "UEFA" },
  { rank: 5, team: "Brazil", group: "D", points: 1784, confederation: "CONMEBOL" },
  { rank: 6, team: "Portugal", group: "H", points: 1756, confederation: "UEFA" },
  { rank: 7, team: "Netherlands", group: "I", points: 1747, confederation: "UEFA" },
  { rank: 8, team: "Belgium", group: "J", points: 1740, confederation: "UEFA" },
  { rank: 9, team: "Italy", group: "D", points: 1731, confederation: "UEFA" },
  { rank: 10, team: "Germany", group: "K", points: 1727, confederation: "UEFA" },
  { rank: 11, team: "Croatia", group: "L", points: 1715, confederation: "UEFA" },
  { rank: 12, team: "Colombia", group: "A", points: 1694, confederation: "CONMEBOL" },
  { rank: 13, team: "Morocco", group: "L", points: 1688, confederation: "CAF" },
  { rank: 14, team: "Uruguay", group: "K", points: 1685, confederation: "CONMEBOL" },
  { rank: 15, team: "Japan", group: "I", points: 1668, confederation: "AFC" },
  { rank: 16, team: "United States", group: "C", points: 1665, confederation: "CONCACAF" },
  { rank: 17, team: "Mexico", group: "A", points: 1658, confederation: "CONCACAF" },
  { rank: 18, team: "Senegal", group: "F", points: 1637, confederation: "CAF" },
  { rank: 19, team: "Turkey", group: "G", points: 1630, confederation: "UEFA" },
  { rank: 20, team: "Ecuador", group: "A", points: 1627, confederation: "CONMEBOL" },
  { rank: 21, team: "Denmark", group: "K", points: 1621, confederation: "UEFA" },
  { rank: 22, team: "South Korea", group: "E", points: 1611, confederation: "AFC" },
  { rank: 23, team: "Poland", group: "J", points: 1601, confederation: "UEFA" },
  { rank: 24, team: "Serbia", group: "K", points: 1595, confederation: "UEFA" },
  { rank: 25, team: "Iran", group: "H", points: 1571, confederation: "AFC" },
  { rank: 26, team: "Scotland", group: "L", points: 1562, confederation: "UEFA" },
  { rank: 27, team: "Peru", group: "I", points: 1555, confederation: "CONMEBOL" },
  { rank: 28, team: "Nigeria", group: "D", points: 1546, confederation: "CAF" },
  { rank: 29, team: "Canada", group: "B", points: 1541, confederation: "CONCACAF" },
  { rank: 30, team: "Chile", group: "F", points: 1531, confederation: "CONMEBOL" },
  { rank: 31, team: "Cameroon", group: "H", points: 1521, confederation: "CAF" },
  { rank: 32, team: "Venezuela", group: "A", points: 1510, confederation: "CONMEBOL" },
  { rank: 33, team: "Panama", group: "C", points: 1505, confederation: "CONCACAF" },
  { rank: 34, team: "Australia", group: "B", points: 1498, confederation: "AFC" },
  { rank: 35, team: "Paraguay", group: "I", points: 1490, confederation: "CONMEBOL" },
  { rank: 36, team: "Ghana", group: "L", points: 1478, confederation: "CAF" },
  { rank: 37, team: "Saudi Arabia", group: "J", points: 1470, confederation: "AFC" },
  { rank: 38, team: "Costa Rica", group: "J", points: 1460, confederation: "CONCACAF" },
  { rank: 39, team: "Honduras", group: "E", points: 1440, confederation: "CONCACAF" },
  { rank: 40, team: "Bolivia", group: "C", points: 1418, confederation: "CONMEBOL" },
  { rank: 41, team: "China PR", group: "G", points: 1401, confederation: "AFC" },
  { rank: 42, team: "Bahrain", group: "B", points: 1380, confederation: "AFC" },
  { rank: 43, team: "New Zealand", group: "C", points: 1370, confederation: "OFC" },
  // Playoff spots TBD — placeholders at bottom
  { rank: 44, team: "Playoff TBD (D)", group: "D", points: 0, confederation: "TBD" },
  { rank: 45, team: "Playoff TBD (E)", group: "E", points: 0, confederation: "TBD" },
  { rank: 46, team: "Playoff TBD (F)", group: "F", points: 0, confederation: "TBD" },
  { rank: 47, team: "Playoff TBD (G)", group: "G", points: 0, confederation: "TBD" },
  { rank: 48, team: "Playoff TBD (H)", group: "H", points: 0, confederation: "TBD" },
];
