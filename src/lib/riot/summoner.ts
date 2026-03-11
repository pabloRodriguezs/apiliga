import { Summoner, LeagueEntry } from '@/types/riot';
import { riotFetch, getRegionHost } from './client';

export async function getSummonerByName(name: string, region: string): Promise<Summoner> {
  const host = getRegionHost(region);
  return riotFetch<Summoner>(
    `${host}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}`
  );
}

export async function getSummonerByPuuid(puuid: string, region: string): Promise<Summoner> {
  const host = getRegionHost(region);
  return riotFetch<Summoner>(
    `${host}/lol/summoner/v4/summoners/by-puuid/${puuid}`
  );
}

export async function getLeagueEntries(summonerId: string, region: string): Promise<LeagueEntry[]> {
  const host = getRegionHost(region);
  return riotFetch<LeagueEntry[]>(
    `${host}/lol/league/v4/entries/by-summoner/${summonerId}`
  );
}
