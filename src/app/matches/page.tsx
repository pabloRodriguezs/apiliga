import { supabase } from '@/lib/db/supabase';
import { LeagueMatch } from '@/types/league';
import Link from 'next/link';

export default async function MatchesPage() {
  const { data } = await supabase
    .from('league_matches')
    .select('*')
    .order('played_at', { ascending: false });

  const matches = (data ?? []) as LeagueMatch[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Partidas</h1>
        <p className="text-slate-400 mt-1">Historial de partidas de la liga</p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-[#111827] border border-[#374151] rounded-xl p-12 text-center">
          <p className="text-slate-400">No hay partidas registradas aún.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {matches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.match_id}`}
              className="flex items-center justify-between bg-[#111827] border border-[#374151] rounded-xl px-6 py-4 hover:border-[#c89b3c]/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-[#c89b3c] text-lg">🎮</span>
                <div>
                  <p className="text-sm font-medium text-slate-200 font-mono">{match.match_id}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(match.played_at).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
              <span className="text-slate-400 text-sm">Ver detalles →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
