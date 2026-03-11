import { getMatch, getLatestDDragonVersion } from '@/lib/riot/matches';
import { supabase } from '@/lib/db/supabase';
import { Player } from '@/types/league';
import { MatchParticipant } from '@/types/riot';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Link from 'next/link';

interface Props {
  params: Promise<{ matchId: string }>;
}

function kda(p: MatchParticipant) {
  if (p.deaths === 0) return 'Perfect';
  return ((p.kills + p.assists) / p.deaths).toFixed(2);
}

function cs(p: MatchParticipant) {
  return p.totalMinionsKilled + p.neutralMinionsKilled;
}

export default async function MatchDetailPage({ params }: Props) {
  const { matchId } = await params;

  const { data: playersData } = await supabase.from('players').select('*');
  const leaguePlayers = (playersData ?? []) as Player[];
  const region = leaguePlayers[0]?.region ?? process.env.DEFAULT_REGION ?? 'euw1';

  let match;
  let ddVersion = '14.1.1';
  try {
    [match, ddVersion] = await Promise.all([
      getMatch(matchId, region),
      getLatestDDragonVersion(),
    ]);
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">No se pudo cargar la partida.</p>
        <Link href="/matches" className="mt-4 inline-block text-[#c89b3c] hover:underline">
          ← Volver a partidas
        </Link>
      </div>
    );
  }

  const puuids = new Set(leaguePlayers.map((p) => p.puuid));
  const participants = match.info.participants;
  const leagueParticipants = participants.filter((p) => puuids.has(p.puuid));

  const team1 = participants.filter((p) => p.teamId === 100);
  const team2 = participants.filter((p) => p.teamId === 200);
  const team1Info = match.info.teams.find((t) => t.teamId === 100);
  const team2Info = match.info.teams.find((t) => t.teamId === 200);

  const duration = `${Math.floor(match.info.gameDuration / 60)}m ${match.info.gameDuration % 60}s`;
  const playedAt = new Date(match.info.gameStartTimestamp).toLocaleString('es-ES');

  const items = (p: MatchParticipant) =>
    [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].filter((i) => i > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/matches" className="text-slate-400 hover:text-slate-200 text-sm">
          ← Partidas
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Detalle de partida</h1>
          <p className="text-slate-400 text-sm">{playedAt} · {duration} · {match.info.gameMode}</p>
        </div>
      </div>

      {[
        { team: team1, info: team1Info, players: team1 },
        { team: team2, info: team2Info, players: team2 },
      ].map((side, idx) => (
        <Card key={idx} title={`Equipo ${idx + 1} — ${side.info?.win ? '🏆 Victoria' : 'Derrota'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-[#374151]">
                  <th className="py-2 text-left">Jugador</th>
                  <th className="py-2 text-center">KDA</th>
                  <th className="py-2 text-center">CS</th>
                  <th className="py-2 text-center">Daño</th>
                  <th className="py-2 text-center">Visión</th>
                  <th className="py-2 text-left">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#374151]">
                {side.players.map((p) => {
                  const isLeague = puuids.has(p.puuid);
                  return (
                    <tr key={p.puuid} className={isLeague ? 'bg-[#1f2937]/30' : ''}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://ddragon.leagueoflegends.com/cdn/${ddVersion}/img/champion/${p.championName}.png`}
                            alt={p.championName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className={`font-medium ${isLeague ? 'text-[#c89b3c]' : 'text-slate-300'}`}>
                              {p.summonerName}
                            </p>
                            <p className="text-xs text-slate-500">{p.championName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <span className={p.win ? 'text-green-400' : 'text-red-400'}>
                          {p.kills}/{p.deaths}/{p.assists}
                        </span>
                        <p className="text-xs text-slate-400">{kda(p)}</p>
                      </td>
                      <td className="py-3 text-center text-slate-300">{cs(p)}</td>
                      <td className="py-3 text-center text-slate-300">
                        {(p.totalDamageDealtToChampions / 1000).toFixed(1)}k
                      </td>
                      <td className="py-3 text-center text-slate-300">{p.visionScore}</td>
                      <td className="py-3">
                        <div className="flex gap-1 flex-wrap">
                          {items(p).map((itemId, i) => (
                            <img
                              key={i}
                              src={`https://ddragon.leagueoflegends.com/cdn/${ddVersion}/img/item/${itemId}.png`}
                              alt={`Item ${itemId}`}
                              className="w-6 h-6 rounded"
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex gap-6 text-sm text-slate-400">
            <span>Torres: <strong className="text-slate-200">{side.info?.objectives.tower.kills}</strong></span>
            <span>Dragones: <strong className="text-slate-200">{side.info?.objectives.dragon.kills}</strong></span>
            <span>Barones: <strong className="text-slate-200">{side.info?.objectives.baron.kills}</strong></span>
          </div>
        </Card>
      ))}
    </div>
  );
}
