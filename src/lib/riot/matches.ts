import { Match } from '@/types/riot';
import { riotFetch, getClusterHost } from './client';

export async function getMatchIdsByPuuid(
  puuid: string,
  region: string,
  count = 20
): Promise<string[]> {
  const host = getClusterHost(region);
  return riotFetch<string[]>(
    `${host}/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`
  );
}

export async function getMatch(matchId: string, region: string): Promise<Match> {
  const host = getClusterHost(region);
  return riotFetch<Match>(`${host}/lol/match/v5/matches/${matchId}`);
}

export function getDataDragonUrl(version: string, type: 'champion' | 'item' | 'profileicon', id: string | number) {
  const base = `https://ddragon.leagueoflegends.com/cdn/${version}/img`;
  switch (type) {
    case 'champion':
      return `${base}/champion/${id}.png`;
    case 'item':
      return `${base}/item/${id}.png`;
    case 'profileicon':
      return `${base}/profileicon/${id}.png`;
  }
}

export async function getLatestDDragonVersion(): Promise<string> {
  const versions = await fetch(
    'https://ddragon.leagueoflegends.com/api/versions.json',
    { next: { revalidate: 86400 } }
  ).then((r) => r.json() as Promise<string[]>);
  return versions[0];
}
