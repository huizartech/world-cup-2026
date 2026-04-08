import type { StaticGame } from "./static-games";

export interface TeamStanding {
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface GroupStanding {
  group: string;
  teams: TeamStanding[];
}

export function computeGroupStandings(games: StaticGame[]): GroupStanding[] {
  const groupGames = games.filter(
    (g) => g.stage === "group" && g.groupName
  );

  // Group games by groupName
  const byGroup = new Map<string, StaticGame[]>();
  for (const game of groupGames) {
    const key = game.groupName!;
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key)!.push(game);
  }

  const standings: GroupStanding[] = [];

  for (const [group, groupMatches] of byGroup) {
    const teamMap = new Map<string, TeamStanding>();

    const getOrCreate = (name: string): TeamStanding => {
      if (!teamMap.has(name)) {
        teamMap.set(name, {
          team: name,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        });
      }
      return teamMap.get(name)!;
    };

    // Ensure all teams appear even if no finished games
    for (const match of groupMatches) {
      getOrCreate(match.homeTeam);
      getOrCreate(match.awayTeam);
    }

    // Only process finished games for stats
    for (const match of groupMatches) {
      if (match.matchStatus !== "finished" || match.homeScore == null || match.awayScore == null) {
        continue;
      }

      const home = getOrCreate(match.homeTeam);
      const away = getOrCreate(match.awayTeam);

      home.played++;
      away.played++;
      home.goalsFor += match.homeScore;
      home.goalsAgainst += match.awayScore;
      away.goalsFor += match.awayScore;
      away.goalsAgainst += match.homeScore;

      if (match.homeScore > match.awayScore) {
        home.wins++;
        home.points += 3;
        away.losses++;
      } else if (match.homeScore < match.awayScore) {
        away.wins++;
        away.points += 3;
        home.losses++;
      } else {
        home.draws++;
        home.points += 1;
        away.draws++;
        away.points += 1;
      }
    }

    // Finalize GD and sort
    const teams = Array.from(teamMap.values());
    for (const t of teams) {
      t.goalDifference = t.goalsFor - t.goalsAgainst;
    }

    teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    standings.push({ group, teams });
  }

  // Sort groups alphabetically
  standings.sort((a, b) => a.group.localeCompare(b.group));

  return standings;
}
