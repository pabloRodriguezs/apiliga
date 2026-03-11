import { supabase } from '@/lib/db/supabase';
import { Player, LeagueMatch } from '@/types/league';
import Card from '@/components/ui/Card';
import Link from 'next/link';

async function getLeagueData() {
  const [playersRes, matchesRes, configRes] = await Promise.all([
    supabase.from('players').select('*').order('created_at', { ascending: false }),
    supabase.from('league_matches').select('*').order('played_at', { ascending: false }).limit(5),
    supabase.from('league_config').select('*'),
  ]);

  return {
    players: (playersRes.data ?? []) as Player[],
    recentMatches: (matchesRes.data ?? []) as LeagueMatch[],
    config: configRes.data ?? [],
  };
}

export default async function DashboardPage() {
  const { players, recentMatches, config } = await getLeagueData();
  const leagueName = config.find((c) => c.key === 'league_name')?.value ?? 'Apiliga';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#c89b3c]">{leagueName}</h1>
        <p className="text-slate-400 mt-1">Vista general de la liga</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-slate-400">Jugadores</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">{players.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Partidas registradas</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">
            —
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Temporada</p>
          <p className="text-3xl font-bold text-slate-100 mt-1">
            {config.find((c) => c.key === 'season')?.value ?? '2025'}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Jugadores registrados">
          {players.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No hay jugadores aún.</p>
              <Link
                href="/settings"
                className="mt-3 inline-block text-[#c89b3c] text-sm hover:underline"
              >
                Añadir jugadores →
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {players.map((player) => (
                <li key={player.id}>
                  <Link
                    href={`/players/${player.summoner_name}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1f2937] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1f2937] border border-[#374151] flex items-center justify-center text-xs font-bold text-[#c89b3c]">
                      {player.summoner_name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{player.summoner_name}</p>
                      <p className="text-xs text-slate-500">{player.region.toUpperCase()}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Últimas partidas">
          {recentMatches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No hay partidas registradas.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentMatches.map((match) => (
                <li key={match.id}>
                  <Link
                    href={`/matches/${match.match_id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1f2937] transition-colors"
                  >
                    <span className="text-sm text-slate-300 font-mono">{match.match_id}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(match.played_at).toLocaleDateString('es-ES')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
