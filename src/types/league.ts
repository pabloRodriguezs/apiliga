export interface Player {
  id: string;
  summoner_name: string;
  puuid: string;
  region: string;
  created_at: string;
}

export interface LeagueMatch {
  id: string;
  match_id: string;
  played_at: string;
  created_at: string;
}

export interface LeagueConfig {
  key: string;
  value: string;
}

export interface PlayerStats {
  player: Player;
  wins: number;
  losses: number;
  winRate: number;
  kda: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  mostPlayedChampion: string;
  position: number;
  previousPosition?: number;
}
