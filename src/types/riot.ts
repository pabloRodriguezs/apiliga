export interface Summoner {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface LeagueEntry {
  leagueId: string;
  summonerId: string;
  summonerName: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

export interface MatchParticipant {
  puuid: string;
  summonerName: string;
  championName: string;
  championId: number;
  kills: number;
  deaths: number;
  assists: number;
  totalDamageDealtToChampions: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  visionScore: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  win: boolean;
  teamId: number;
  individualPosition: string;
  teamPosition: string;
  goldEarned: number;
}

export interface MatchTeam {
  teamId: number;
  win: boolean;
  objectives: {
    baron: { kills: number };
    dragon: { kills: number };
    tower: { kills: number };
    inhibitor: { kills: number };
    riftHerald: { kills: number };
    champion: { kills: number };
  };
}

export interface MatchInfo {
  gameId: number;
  gameDuration: number;
  gameStartTimestamp: number;
  gameMode: string;
  gameType: string;
  participants: MatchParticipant[];
  teams: MatchTeam[];
}

export interface Match {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: MatchInfo;
}
