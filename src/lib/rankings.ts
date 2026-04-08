// FIFA World Rankings for all 48 World Cup 2026 teams
// Based on FIFA rankings as of early 2026 (approximate)
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
  { rank: 1, team: "Argentina", group: "J", points: 1867, confederation: "CONMEBOL" },
  { rank: 2, team: "France", group: "I", points: 1860, confederation: "UEFA" },
  { rank: 3, team: "Spain", group: "H", points: 1813, confederation: "UEFA" },
  { rank: 4, team: "England", group: "L", points: 1797, confederation: "UEFA" },
  { rank: 5, team: "Brazil", group: "C", points: 1784, confederation: "CONMEBOL" },
  { rank: 6, team: "Portugal", group: "K", points: 1756, confederation: "UEFA" },
  { rank: 7, team: "Netherlands", group: "F", points: 1747, confederation: "UEFA" },
  { rank: 8, team: "Belgium", group: "G", points: 1740, confederation: "UEFA" },
  { rank: 9, team: "Germany", group: "E", points: 1727, confederation: "UEFA" },
  { rank: 10, team: "Croatia", group: "L", points: 1715, confederation: "UEFA" },
  { rank: 11, team: "Colombia", group: "K", points: 1694, confederation: "CONMEBOL" },
  { rank: 12, team: "Morocco", group: "C", points: 1688, confederation: "CAF" },
  { rank: 13, team: "Uruguay", group: "H", points: 1685, confederation: "CONMEBOL" },
  { rank: 14, team: "Japan", group: "F", points: 1668, confederation: "AFC" },
  { rank: 15, team: "USA", group: "D", points: 1665, confederation: "CONCACAF" },
  { rank: 16, team: "Mexico", group: "A", points: 1658, confederation: "CONCACAF" },
  { rank: 17, team: "Senegal", group: "I", points: 1637, confederation: "CAF" },
  { rank: 18, team: "Türkiye", group: "D", points: 1630, confederation: "UEFA" },
  { rank: 19, team: "Ecuador", group: "E", points: 1627, confederation: "CONMEBOL" },
  { rank: 20, team: "Switzerland", group: "B", points: 1621, confederation: "UEFA" },
  { rank: 21, team: "Korea Republic", group: "A", points: 1611, confederation: "AFC" },
  { rank: 22, team: "Austria", group: "J", points: 1610, confederation: "UEFA" },
  { rank: 23, team: "IR Iran", group: "G", points: 1571, confederation: "AFC" },
  { rank: 24, team: "Scotland", group: "C", points: 1562, confederation: "UEFA" },
  { rank: 25, team: "Sweden", group: "F", points: 1550, confederation: "UEFA" },
  { rank: 26, team: "Canada", group: "B", points: 1541, confederation: "CONCACAF" },
  { rank: 27, team: "Norway", group: "I", points: 1540, confederation: "UEFA" },
  { rank: 28, team: "Egypt", group: "G", points: 1530, confederation: "CAF" },
  { rank: 29, team: "Panama", group: "L", points: 1505, confederation: "CONCACAF" },
  { rank: 30, team: "Australia", group: "D", points: 1498, confederation: "AFC" },
  { rank: 31, team: "Paraguay", group: "D", points: 1490, confederation: "CONMEBOL" },
  { rank: 32, team: "Côte d'Ivoire", group: "E", points: 1475, confederation: "CAF" },
  { rank: 33, team: "Ghana", group: "L", points: 1478, confederation: "CAF" },
  { rank: 34, team: "Saudi Arabia", group: "H", points: 1470, confederation: "AFC" },
  { rank: 35, team: "Algeria", group: "J", points: 1460, confederation: "CAF" },
  { rank: 36, team: "Tunisia", group: "F", points: 1450, confederation: "CAF" },
  { rank: 37, team: "Qatar", group: "B", points: 1440, confederation: "AFC" },
  { rank: 38, team: "Iraq", group: "I", points: 1420, confederation: "AFC" },
  { rank: 39, team: "South Africa", group: "A", points: 1410, confederation: "CAF" },
  { rank: 40, team: "Jordan", group: "J", points: 1400, confederation: "AFC" },
  { rank: 41, team: "Bosnia and Herzegovina", group: "B", points: 1390, confederation: "UEFA" },
  { rank: 42, team: "Czechia", group: "A", points: 1380, confederation: "UEFA" },
  { rank: 43, team: "New Zealand", group: "G", points: 1370, confederation: "OFC" },
  { rank: 44, team: "Uzbekistan", group: "K", points: 1350, confederation: "AFC" },
  { rank: 45, team: "Congo DR", group: "K", points: 1330, confederation: "CAF" },
  { rank: 46, team: "Haiti", group: "C", points: 1320, confederation: "CONCACAF" },
  { rank: 47, team: "Cabo Verde", group: "H", points: 1300, confederation: "CAF" },
  { rank: 48, team: "Curaçao", group: "E", points: 1250, confederation: "CONCACAF" },
];
