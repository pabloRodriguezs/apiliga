import { supabase } from '@/lib/db/supabase';
import { Player } from '@/types/league';
import Link from 'next/link';

export default async function LeaderboardPage() {
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .order('created_at', { ascending: true });

  const playerList = (players ?? []) as Player[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Clasificación</h1>
        <p className="text-slate-400 mt-1">Tabla de posiciones de la liga</p>
      </div>

      {playerList.length === 0 ? (
        <div className="bg-[#111827] border border-[#374151] rounded-xl p-12 text-center">
          <p className="text-slate-400">No hay jugadores en la liga.</p>
          <Link href="/settings" className="mt-3 inline-block text-[#c89b3c] hover:underline">
            Añadir jugadores →
          </Link>
        </div>
      ) : (
        <div className="bg-[#111827] border border-[#374151] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#374151] text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Jugador</th>
                <th className="px-6 py-4 text-center">W</th>
                <th className="px-6 py-4 text-center">L</th>
                <th className="px-6 py-4 text-center">Win Rate</th>
                <th className="px-6 py-4 text-center">KDA</th>
                <th className="px-6 py-4 text-center">Campeón</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {playerList.map((player, index) => (
                <tr
                  key={player.id}
                  className="hover:bg-[#1f2937] transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className={`font-bold text-lg ${index === 0 ? 'text-[#c89b3c]' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-700' : 'text-slate-500'}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/players/${player.summoner_name}`}
                      className="flex items-center gap-3 hover:text-[#c89b3c] transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#1f2937] border border-[#374151] flex items-center justify-center text-sm font-bold text-[#c89b3c]">
                        {player.summoner_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{player.summoner_name}</p>
                        <p className="text-xs text-slate-500">{player.region.toUpperCase()}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center text-green-400 font-medium">—</td>
                  <td className="px-6 py-4 text-center text-red-400 font-medium">—</td>
                  <td className="px-6 py-4 text-center text-slate-300">—</td>
                  <td className="px-6 py-4 text-center text-slate-300">—</td>
                  <td className="px-6 py-4 text-center text-slate-400 text-sm">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
