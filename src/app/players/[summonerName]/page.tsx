import { supabase } from '@/lib/db/supabase';
import { getSummonerByName, getLeagueEntries } from '@/lib/riot/summoner';
import { Player } from '@/types/league';
import RankBadge from '@/components/player/RankBadge';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ summonerName: string }>;
}

export default async function PlayerProfilePage({ params }: Props) {
  const { summonerName } = await params;
  const decodedName = decodeURIComponent(summonerName);

  const { data } = await supabase
    .from('players')
    .select('*')
    .ilike('summoner_name', decodedName)
    .single();

  if (!data) notFound();
  const player = data as Player;

  let summoner = null;
  let leagueEntries = null;

  try {
    summoner = await getSummonerByName(player.summoner_name, player.region);
    leagueEntries = await getLeagueEntries(summoner.id, player.region);
  } catch {
    // API not available
  }

  const soloEntry = leagueEntries?.find((e) => e.queueType === 'RANKED_SOLO_5x5') ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/leaderboard" className="text-slate-400 hover:text-slate-200 text-sm">
          ← Clasificación
        </Link>
      </div>

      <div className="bg-[#111827] border border-[#374151] rounded-xl p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            {summoner ? (
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${summoner.profileIconId}.png`}
                alt={player.summoner_name}
                className="w-20 h-20 rounded-full border-2 border-[#c89b3c]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-[#c89b3c] bg-[#1f2937] flex items-center justify-center text-2xl font-bold text-[#c89b3c]">
                {player.summoner_name[0].toUpperCase()}
              </div>
            )}
            {summoner && (
              <div className="absolute -bottom-1 -right-1 bg-[#c89b3c] text-black text-xs font-bold rounded-full px-1.5 py-0.5">
                {summoner.summonerLevel}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-100">{player.summoner_name}</h1>
            <p className="text-slate-400 text-sm">{player.region.toUpperCase()}</p>
            {soloEntry && (
              <div className="mt-2">
                <RankBadge entry={soloEntry} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-slate-400">Victorias en liga</p>
          <p className="text-3xl font-bold text-green-400 mt-1">—</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Derrotas en liga</p>
          <p className="text-3xl font-bold text-red-400 mt-1">—</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">KDA medio</p>
          <p className="text-3xl font-bold text-[#c89b3c] mt-1">—</p>
        </Card>
      </div>

      <Card title="Partidas en la liga">
        <p className="text-slate-400 text-sm text-center py-6">
          Próximamente — historial de partidas del jugador en la liga.
        </p>
      </Card>
    </div>
  );
}
