'use server';

import { createServiceClient } from '@/lib/db/supabase';
import { getSummonerByName } from '@/lib/riot/summoner';
import { revalidatePath } from 'next/cache';

export async function addPlayer(formData: FormData) {
  const summonerName = formData.get('summonerName') as string;
  const region = formData.get('region') as string;

  if (!summonerName || !region) {
    throw new Error('Nombre y región son obligatorios');
  }

  const summoner = await getSummonerByName(summonerName.trim(), region);

  const db = createServiceClient();
  const { error } = await db.from('players').insert({
    summoner_name: summoner.name,
    puuid: summoner.puuid,
    region: region.toLowerCase(),
  });

  if (error) {
    if (error.code === '23505') {
      throw new Error('El jugador ya está en la liga');
    }
    throw new Error('Error al añadir el jugador');
  }

  revalidatePath('/settings');
  revalidatePath('/dashboard');
  revalidatePath('/leaderboard');
}

export async function removePlayer(playerId: string) {
  const db = createServiceClient();
  const { error } = await db.from('players').delete().eq('id', playerId);
  if (error) throw new Error('Error al eliminar el jugador');

  revalidatePath('/settings');
  revalidatePath('/dashboard');
  revalidatePath('/leaderboard');
}

export async function updateConfig(formData: FormData) {
  const leagueName = formData.get('leagueName') as string;
  const season = formData.get('season') as string;

  const db = createServiceClient();
  await Promise.all([
    db.from('league_config').upsert({ key: 'league_name', value: leagueName }),
    db.from('league_config').upsert({ key: 'season', value: season }),
  ]);

  revalidatePath('/settings');
  revalidatePath('/dashboard');
}
