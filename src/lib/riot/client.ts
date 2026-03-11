const RIOT_API_KEY = process.env.RIOT_API_KEY!;

const REGION_HOSTS: Record<string, string> = {
  euw1: 'https://euw1.api.riotgames.com',
  eun1: 'https://eun1.api.riotgames.com',
  na1: 'https://na1.api.riotgames.com',
  kr: 'https://kr.api.riotgames.com',
};

const CLUSTER_HOSTS: Record<string, string> = {
  euw1: 'https://europe.api.riotgames.com',
  eun1: 'https://europe.api.riotgames.com',
  na1: 'https://americas.api.riotgames.com',
  kr: 'https://asia.api.riotgames.com',
};

async function riotFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { 'X-Riot-Token': RIOT_API_KEY },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Riot API error ${res.status}: ${url}`);
  }

  return res.json() as Promise<T>;
}

export function getRegionHost(region: string) {
  return REGION_HOSTS[region.toLowerCase()] ?? REGION_HOSTS.euw1;
}

export function getClusterHost(region: string) {
  return CLUSTER_HOSTS[region.toLowerCase()] ?? CLUSTER_HOSTS.euw1;
}

export { riotFetch };
